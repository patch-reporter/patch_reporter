import { fetchRepositories } from './service/github';
import { qs, qsa, $on, $delegate, filterObject, numberFormat, replaceImageToSvg } from './utils/helper';
import { setStorage, getStorage, deleteStorage } from './utils/storage';
import { initLocalization } from './utils/locale';
import starIcon from './assets/icons/star.svg';
import externalLinkIcon from './assets/icons/external-link.svg';
import trashIcon from './assets/icons/trash.svg';
import './styles/reset.css';
import './styles/option.css';

$on(window, 'load', function() {
    const currentRepositories = qs('.current-repositories');
    const btnSearch = qs('.search__btn button');
    const overlay = qs('.modal__overlay');

    getSubscribedLibraries();
    setLanguageOptions();
    setNewTabOptions();
    initLocalization();

    $on(btnSearch, 'click', handleSearchClick, false);
    $on(overlay, 'click', closeModal, false);
    $delegate(currentRepositories, '.btn__add', 'click', openModal);
    $delegate(currentRepositories, '.btn__delete', 'click', removeSubscribedLibrary);
    $delegate(currentRepositories, '.btn__delete svg', 'click', removeSubscribedLibrary);
});

function setNewTabOptions() {
    const defaultTab = qs('.default__tab');
    const patchTab = qs('.patch-reporter__tab');
    getStorage(null)
        .then(result => {
            const { defaultnewtab } = result;
            if (defaultnewtab) {
                defaultTab.checked = true;
                patchTab.checked = false;
            } else {
                defaultTab.checked = false;
                patchTab.checked = true;
            }
        })
        .catch(err => {
            if (err) {
                defaultTab.checked = false;
                patchTab.checked = true;
            }
        });

    $on(
        defaultTab,
        'click',
        function() {
            setStorage('defaultnewtab', true);
        },
        false
    );

    $on(
        patchTab,
        'click',
        function() {
            deleteStorage('defaultnewtab');
        },
        false
    );
}

function setLanguageOptions() {
    const langKo = qs('.lan-ko');
    const langEn = qs('.lan-en');
    getStorage(null)
        .then(result => {
            const { localeLanguage } = result;
            if (localeLanguage === 'en') {
                langKo.checked = false;
                langEn.checked = true;
            } else {
                langKo.checked = true;
                langEn.checked = false;
            }
        })
        .catch(err => {
            if (err) {
                langKo.checked = true;
                langEn.checked = false;
            }
        });

    $on(
        langKo,
        'click',
        function() {
            setStorage('localeLanguage', 'ko');
            initLocalization();
        },
        false
    );

    $on(
        langEn,
        'click',
        function() {
            setStorage('localeLanguage', 'en');
            initLocalization();
        },
        false
    );
}

function openModal() {
    const modal = qs('.modal');
    modal.classList.add('modal__visible');
}

function closeModal() {
    const modal = qs('.modal');
    modal.classList.remove('modal__visible');
}

function getSubscribedLibraries() {
    const currentRepositories = qs('.current-repositories');
    currentRepositories.innerHTML = '';
    const fragment = document.createDocumentFragment();
    getStorage('repositories')
        .then(result => {
            const repositories = result.repositories;
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
								<span class="btn__delete" data-fullname="${repository.fullName}">
									<img class="svg" src="${trashIcon}" data-fullname="${repository.fullName}"/>
								</span>
							</li>
						</ul>
					</div>
				`;
                fragment.appendChild(grid);
            }
        })
        .catch(e => {
            console.log('error', e);
        })
        .finally(() => {
            const plusCard = document.createElement('li');
            plusCard.className = 'grid-list';
            plusCard.innerHTML = '<button class="btn__add">+</button>';
            currentRepositories.appendChild(fragment);
            currentRepositories.appendChild(plusCard);
            replaceImageToSvg();
        });
}
/*

<<<<<<< HEAD
	})
		.catch((e) => {console.log('error', e)})
		.finally(() => {
			const plusCard = document.createElement('li')
			plusCard.className = 'grid-list'
			plusCard.innerHTML = '<button class="btn__add">추가하기</button>'
			currentRepositories.appendChild(fragment)
			currentRepositories.appendChild(plusCard)
		});
=======
 */

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
                    <button class="btn-subscribe add"
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
    initLocalization();
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
