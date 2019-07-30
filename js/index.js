import { fetchReleaseNotes } from './service/github.js';
import { qs, getCurrentTime } from './utils/helper.js';

const converter = new showdown.Converter();

chrome.storage.sync.get({ repositories: {} }, function({ repositories }) {
    console.log(repositories);

    Promise.all(
        Object.values(repositories).map(({ a_fullname }) =>
            fetchReleaseNotes(a_fullname.split('/')[0], a_fullname.split('/')[1])
        )
    ).then(result => {
        // 일단 구현 했는데, 더 빠른 방법이 있을 수도
        let history = [];
        result.forEach(rels => {
            history = [...history, ...rels];
        });
        history.sort((a, b) => (a.published_at > b.published_at ? -1 : 1));

        renderReleaseList(history);
    });
});

function renderReleaseList(releases) {
    let inner = '';
    for (let release of releases) {
        let body = converter.makeHtml(release.body);
        let repo = release.url.replace(/https:\/\/api.github.com\/repos\/(.*)\/releases\/.*/, '$1');
        console.log(release);
        inner += `
			<div class="flex-row-wrap">
				<div class="library-name">
					<h3>${repo}</h3>
					<p>created: ${getCurrentTime(release.created_at)}</p>
				</div>
				<div class="release">
					<div class="release-body">
						${body}
					</div>
				</div>
			</div>
		`;
    }

    qs('.release-note').innerHTML = inner;
}
