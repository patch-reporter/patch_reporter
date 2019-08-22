import { fetchRepositories } from './service/github';
import { qs, qsa, $on, $delegate, filterObject } from './utils/helper';
import { setStorage, getStorage } from './utils/storage';
import starIcon from './assets/icons/star.svg';
import externalLinkIcon from './assets/icons/external-link.svg';
import trashIcon from './assets/icons/trash.svg';
import './styles/reset.css';
import './styles/index.css';
import './styles/option.css';

const defaultTheme = qs('.default__theme');
const patchTmeme = qs('.patch-reporter__theme');
$on(
    defaultTheme,
    'click',
    function() {
        chrome.storage.sync.get(null, function(result) {
            console.log(result);
        });
        chrome.storage.sync.set({ defaultnewtab: true });
    },
    false
);

chrome.storage.sync.get(null, function(result) {
    console.log(result);
});

$on(
    patchTmeme,
    'click',
    function() {
        chrome.storage.sync.remove('defaultnewtab');
    },
    false
);

chrome.storage.sync.get('defaultnewtab', function(storage) {
    if (storage.defaultnewtab) {
        // chrome.tabs.update({ url: 'chrome-extension://laookkfknpbbblfpciffpaejjkokdgca/dashboard.html' });
    }
});

$on(window, 'load', function() {
    const currentRepositories = qs('.current-repositories');
    const btnSearch = qs('.btn-search');
    const overlay = qs('.modal__overlay');

    getSubscribedLibraries();

    $on(btnSearch, 'click', handleSearchClick, false);
    $on(overlay, 'click', closeModal, false);
    $delegate(currentRepositories, '.btn__add', 'click', openModal);
    $delegate(currentRepositories, '.btn__delete img', 'click', removeSubscribedLibrary);
});

function openModal() {
    const modal = qs('.modal');
    modal.classList.add('modal__visible');
}

function closeModal() {
    const modal = qs('.modal');
    modal.classList.remove('modal__visible');
}

function getSubscribedLibraries() {
    getStorage('repositories').then(result => {
        const repositories = result.repositories;
        const currentRepositories = qs('.current-repositories');
        currentRepositories.innerHTML = '';
        const fragment = document.createDocumentFragment();
        for (const repoName in repositories) {
            const repository = repositories[repoName];
            const grid = document.createElement('li');
            grid.className = 'grid-list';
            grid.innerHTML = `
                <div class="card">
                    <div class="card__head">
                        <div class="card__head--thumb">
                            <img src="${repository.thumbnail}" alt="thumbnail" />
                        </div>
                        <div class="card__title--wrap">
                            <div class="card__title">${repository.fullName}</div>
                            <div class="card__sub-title">${repository.language}</div>
                        </div>
                    </div>
                    <div class="card__body">
                        <div class="card__body--contents">${repository.description}</div>
                    </div>
                    <ul class="card__actions">
                        <li class="card__actions-btn star">
                            <span>
                                <img src=${starIcon} />
                                ${repository.starCount}
                            </span>
                        </li>
                        <li class="card__actions-btn github">
                            <span>
                                <img src="${externalLinkIcon}"/>
                            </span>
                        </li>
                        <li class="card__actions-btn delete">
                            <span class="btn__delete">
                                <img src="${trashIcon}" data-fullname="${repository.fullName}"/>
                            </span>
                        </li>
                    </ul>
                </div>
            `;

            fragment.appendChild(grid);
        }
        const plusCard = document.createElement('li');
        plusCard.className = 'grid-list';
        plusCard.innerHTML = '<button class="btn__add">추가하기</button>';
        currentRepositories.appendChild(fragment);
        currentRepositories.appendChild(plusCard);
    });
}

function removeSubscribedLibrary(e) {
    console.log(e);
    const { fullname } = e.target.dataset;
    getStorage('repositories').then(result => {
        const repositories = result.repositories;
        console.log(repositories);
        const newRepositories = filterObject(repositories, repo => repo.fullName !== fullname);
        setStorage('repositories', newRepositories, getSubscribedLibraries);
    });
}

function handleSearchClick() {
    const inputSearch = qs('.input-search');
    const query = inputSearch.value;
    if (!query) {
        return;
    }
    fetchRepositories(query).then(response => {
        console.log(response);
        showResult(
            response.items.map(item => {
                return {
                    id: item.id,
                    fullName: item.full_name,
                    language: item.language,
                    starCount: item.stargazers_count,
                    description: item.description,
                    thumbnail: item.owner.avatar_url,
                };
            })
        );
    });
}

function showResult(repositories) {
    const searchResult = qs('.search-result');
    let innerResult = '<ul>';

    for (const repo of repositories) {
        innerResult += `
            <li class="list">
                <div>
                    <a target="_blank" href=${repo.html_url}>${repo.fullName}</a> / ${repo.language} / ${repo.starCount}
                    <button class="btn-subscribe"
                        data-fullname="${repo.fullName}"
                        data-language="${repo.language}"
                        data-starcount="${repo.starCount}"
                        data-description="${repo.description}"
                        data-thumbnail="${repo.thumbnail}"
                    >추가</button>
                </div>
            </li>`;
    }

    innerResult += '</ul>';

    searchResult.innerHTML = innerResult;

    const subscribeBtns = qsa('.btn-subscribe');

    subscribeBtns.forEach(el => {
        $on(el, 'click', subscribeRepo, false);
    });
}

function subscribeRepo(e) {
    const { fullname, language, starcount, description, thumbnail } = e.currentTarget.dataset;
    getStorage('repositories')
        .then(result => {
            console.log(result);
            const repositories = result.repositories;
            if (repositories[fullname]) {
                alert('이미 추가된 라이브러리입니다.');
                return;
            }

            const repository = {
                fullName: fullname,
                language,
                starCount: starcount,
                description,
                thumbnail,
            };

            const newRepositories = {
                ...repositories,
                [fullname]: repository,
            };

            setStorage('repositories', newRepositories, getSubscribedLibraries);
        })
        .catch(() => {
            const params = {
                [fullname]: {
                    fullName: fullname,
                    language,
                    starCount: starcount,
                    description,
                    thumbnail,
                },
            };

            setStorage('repositories', params, getSubscribedLibraries);
        });
}
