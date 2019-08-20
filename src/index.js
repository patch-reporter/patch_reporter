import showdown from 'showdown';
import { fetchReleaseNotes } from './service/github';
import { qs, getCurrentTime, $on, loadElements, toggleLoading } from './utils/helper';
import './styles/index.css';
import settingIcon from './assets/icons/setting.svg';

const converter = new showdown.Converter();

let history = [];
$on(window, 'load', function() {
    const iconWrap = qs('.icon__wrap');

    const optionUrl = chrome.runtime.getURL('option.html');
    console.log(optionUrl);
    loadElements(
        iconWrap,
        `
    <a target="_blank" href=${optionUrl}>
        <img src=${settingIcon} width="30" />
    </a>`
    );
});
const loadMore = qs('.loadMore');
$on(
    loadMore,
    'click',
    function() {
        renderReleaseList(history);
    },
    false
);

chrome.storage.sync.get(null, function(result) {
    toggleLoading(true);
    Promise.all(
        Object.values(result).map(({ a_fullname }) =>
            fetchReleaseNotes(a_fullname.split('/')[0], a_fullname.split('/')[1])
        )
    ).then(result => {
        // 일단 구현 했는데, 더 빠른 방법이 있을 수도
        result.forEach(rels => {
            history = [...history, ...rels];
        });
        history.sort((a, b) => (a.published_at > b.published_at ? -1 : 1));

        toggleLoading(false);
        renderReleaseList(history);
    });
});

function renderReleaseList(releases) {
    let inner = '';
    console.log(releases);
    for (let release of releases) {
        let body = converter.makeHtml(release.body);
        let repo = release.url.replace(/https:\/\/api.github.com\/repos\/(.*)\/releases\/.*/, '$1');

        inner += `
			<div class="releases__item-wrapper">
				<div>${getCurrentTime(release.created_at)}</div>
				<div class="releases__item">
					<div class="releases__item__title">
						<div style="display:flex">
							<div>
								<div class="releases__item__title__version">
									<img src="assets/icons/tag.svg" width="12" />${release.tag_name}
								</div>
								<div class="releases__item__title__name">
									<a target="_blank" href=${release.html_url}>${repo}</a>
								</div>
							</div>
						</div>
					</div>
					<div class="releases__item__contents">
						${body}
					</div>
				</div>
			</div>
		`;
    }

    qs('.releases').innerHTML = inner;
}
