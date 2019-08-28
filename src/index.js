import showdown from 'showdown';
import { fetchReleaseNotes } from './service/github';
import { qs, qsa, getCurrentDate, $on, loadElements, toggleLoading, $delegate, filterObject } from './utils/helper';
import './styles/index.css';
import settingIcon from './assets/icons/setting.svg';
import arrowIcon from './assets/icons/arrow-right.svg';
import { getStorage } from './utils/storage';

const converter = new showdown.Converter();

let history = [];

chrome.storage.sync.get('defaultnewtab', function(storage) {
    if (storage.defaultnewtab) {
        chrome.tabs.update({ url: 'chrome-search://local-ntp/local-ntp.html' });
    }
});

$on(window, 'load', function() {
    const settingBtnWrap = qs('.setting-btn-wrapper');
    const optionUrl = chrome.runtime.getURL('option.html');
    let repositories;

    loadElements(settingBtnWrap, `<a target="_blank" href=${optionUrl}><img src="${settingIcon}" width="30" /></a>`);

    toggleLoading(true);
    getStorage('repositories')
        .then(result => {
            repositories = result.repositories;

            if (Object.keys(repositories).length === 0) {
                throw new Error('no storage');
            }
        })
        .then(() => {
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
                renderRepoFilter();
            });
        })
        .catch(e => {
            console.error(e);
            if (e.message.includes('no storage')) {
                showNoData();
            } else {
                alert('Something is wrong!');
            }
        });

    function renderReleaseList(releases, repos) {
        let inner = '';

        for (let release of releases) {
            let body = converter.makeHtml(release.body);
            let repoName = release.url.replace(/https:\/\/api.github.com\/repos\/(.*)\/releases\/.*/, '$1');

            if (!repos.hasOwnProperty(repoName)) {
                continue;
            }
            inner += `
				<div class="releases__item release-${release.id} ${repoName.replace(/[\/.]/gi, '__')}">
					<div class="releases__item__date">
						<div class="releases__item__date-inner">${getCurrentDate(release.created_at)}</div>
					</div>
					<div class="releases__item__timeline">
						<div class="releases__item__timeline__line"></div>
						<div class="releases__item__timeline__thumb">
							<img src="${repos[repoName].thumbnail}" />
						</div>
					</div>
					<div class="releases__item__contents">
						<div class="releases__item__contents-inner">
							<div class="releases__item__contents__name">${release.name || release.tag_name}</div>
							<div class="releases__item__contents__repo-name">${repoName}</div>
							<div class="releases__item__contents__body">${body}</div>
							<div class="releases__item__contents__more-btn" data-id="${release.id}">
								<img src="${arrowIcon}" />
							</div>
						</div>
					</div>
				</div>
			`;
        }

        qs('.releases').innerHTML = inner;

        $delegate(qs('.releases'), '.releases__item__contents__more-btn', 'click', toggleBody);
    }

    function renderRepoFilter() {
        let innerFilter = '';
        let repos = Object.values(repositories);
        for (let repo of repos) {
            innerFilter += `
				<li>
					<label class="sidebar__filter">
						<span class="sidebar__filter__checkbox-wrapper">
							<input type="checkbox" class="sidebar__filter__input" data-name="${repo.fullName}" />
							<span class="sidebar__filter__checkbox"></span>
						</span>
						<span class="sidebar__filter__text">${repo.fullName}</span>
					</label>
				</li>
			`;
        }

        qs('.sidebar__filters').innerHTML = innerFilter;

        $delegate(qs('.sidebar__filters'), '.sidebar__filter__input', 'change', () => {
            let checkedRepos = Array.prototype.slice
                .call(qsa('.sidebar__filter__input'))
                .filter(el => el.checked)
                .map(el => el.dataset.name.replace(/[\/.]/gi, '__'));
            console.log(checkedRepos);
            if (!checkedRepos.length) {
                checkedRepos = repos.map(repo => repo.fullName.replace(/[\/.]/gi, '__'));
            }

            qsa('.releases__item').forEach(el => (el.style.display = 'none'));
            qsa('.' + checkedRepos.join(', .')).forEach(el => (el.style.display = 'flex'));
        });
    }
});

function toggleBody(e) {
    const { id } = e.target.dataset;
    const $item = qs('.release-' + id);
    const $itemBody = qs('.release-' + id + ' .releases__item__contents__body');

    if ($item.classList.contains('opened')) {
        $item.classList.remove('opened');
        $itemBody.style.maxHeight = '90px';
    } else {
        $item.classList.add('opened');
        $itemBody.style.maxHeight = $itemBody.scrollHeight + 'px';
    }
}

function showNoData() {
    const NO_DATA = `<h2 style="text-align:center;">No Data</h2>`;
    qs('.releases').innerHTML = NO_DATA;
    qs('.sidebar__filters').innerHTML = NO_DATA;
}
