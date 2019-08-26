import { fetchRepositories } from './service/github';
import { qs, qsa, $on, $delegate, filterObject, numberFormat } from './utils/helper';
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
    const btnSearch = qs('.search__btn button');
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
                                ${numberFormat(repository.starCount)}
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
        plusCard.innerHTML = '<button class="btn__add">+</button>';
        currentRepositories.appendChild(fragment);
        currentRepositories.appendChild(plusCard);
    });
}

function removeSubscribedLibrary(e) {
    const { fullname } = e.target.dataset;
    getStorage('repositories').then(result => {
        const repositories = result.repositories;
        const newRepositories = filterObject(repositories, repo => repo.fullName !== fullname);
        setStorage('repositories', newRepositories, getSubscribedLibraries);
    });
}

function handleSearchClick() {
    const inputSearch = qs('.search__input');
    const query = inputSearch.value;
    if (!query) {
        return;
    }
    fetchRepositories(query).then(response => {
        showResult(
            response.items.map(item => {
                return {
                    id: item.id,
                    fullName: item.full_name,
                    language: item.language,
                    starCount: item.stargazers_count,
                    description: item.description,
                    thumbnail: item.owner.avatar_url,
                    htmlUrl: item.html_url,
                };
            })
        );
    });
}

function showResult(repositories) {
    const searchResult = qs('.search-result ul');
    let innerResult = '';

    for (const repo of repositories) {
        innerResult += `
            <li class="list__item">
                <div class="list__col">
                    <img class="thumbnail" src="${repo.thumbnail}" />
                    <a target="_blank" href=${repo.htmlUrl}>${repo.fullName}</a>
                </div>
                <div class="list__col">${repo.language}</div>
                <div class="list__col">${repo.starCount}</div>
                <div class="list__col">
                    <button class="btn-subscribe"
                        data-fullname="${repo.fullName}"
                        data-language="${repo.language}"
                        data-starcount="${numberFormat(repo.starCount)}"
                        data-description="${repo.description}"
                        data-thumbnail="${repo.thumbnail}"
                    >추가</button>
                </div>
            </li>`;
    }

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
