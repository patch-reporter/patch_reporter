import showdown from 'showdown';
import { fetchReleaseNotes } from './service/github';
import { qs, getCurrentDate, $on, loadElements, toggleLoading } from './utils/helper';
import './styles/index.css';
import settingIcon from './assets/icons/setting.svg';
import { getStorage } from './utils/storage';

const converter = new showdown.Converter();

let history = [];

$on(window, 'load', function() {
    chrome.storage.sync.get('defaultnewtab', function(storage) {
        if (storage.defaultnewtab) {
            // chrome.storage.sync.remove('defaultnewtab');
            chrome.tabs.update({ url: 'chrome-search://local-ntp/local-ntp.html' });
        }
    });

    const iconWrap = qs('.icon__wrap');

    const optionUrl = chrome.runtime.getURL('option.html');
    console.log(optionUrl);
    loadElements(
        iconWrap,
        `
    <a target="_blank" href=${optionUrl}>
        <img src="${settingIcon}" width="30" />
    </a>`
    );

    getStorage('repositories').then(result => {
        const repositories = result.repositories;
        toggleLoading(true);
        Promise.all(
            Object.values(repositories).map(({ fullName }) =>
                fetchReleaseNotes(fullName.split('/')[0], fullName.split('/')[1])
            )
        ).then(releases => {
            // 일단 구현 했는데, 더 빠른 방법이 있을 수도
            releases.forEach(rels => {
                history = [...history, ...rels];
            });
            history.sort((a, b) => (a.published_at > b.published_at ? -1 : 1));
            toggleLoading(false);

            renderReleaseList(history, repositories);
        });
    });
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

function renderReleaseList(releases, data) {
    let inner = '';
    console.log(data);
    console.log(releases);
    for (let release of releases) {
        let body = converter.makeHtml(release.body);
        let repoName = release.url.replace(/https:\/\/api.github.com\/repos\/(.*)\/releases\/.*/, '$1');
        inner += `
			<div class="releases__item">
				<div class="releases__item__date">
					<div class="releases__item__date-inner">${getCurrentDate(release.created_at)}</div>
				</div>
				<div class="releases__item__timeline">
					<div class="releases__item__timeline__line"></div>
					<div class="releases__item__timeline__thumb">
						<img src="${data[repoName].thumbnail}" />
					</div>
				</div>
				<div class="releases__item__contents">
					<div class="releases__item__contents-inner">
						<div class="releases__item__contents__name">${release.name || release.tag_name}</div>
						<div class="releases__item__contents__repo-name">${repoName}</div>
						<div class="releases__item__contents__body">${body}</div>
					</div>
				</div>
			</div>
		`;
    }

    qs('.releases').innerHTML = inner;
}
