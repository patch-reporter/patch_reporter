import { fetchReleaseNotes } from './service/github.js';
import { qs, getCurrentTime } from './utils/helper.js';

const converter = new showdown.Converter();

chrome.storage.sync.get(null, function(result) {
    Promise.all(
        Object.values(result).map(({ a_fullname }) =>
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

        inner += `
			<div class="flex__row--wrap">
				<div class="release__note--library-name">
					<h3>${repo}</h3>
					<p>created: ${getCurrentTime(release.created_at)}</p>
				</div>
				<div class="release__timeline-contents">
					<div class="release__timeline-contents-body">
						${body}
					</div>
				</div>
			</div>
		`;
    }

    const releaseNote = qs('.release__note');
    releaseNote.innerHTML = inner;
}
