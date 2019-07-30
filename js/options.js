import { fetchRepositories } from './service/github.js';
import { qs, qsa, $on } from './utils/helper.js';

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
        chrome.tabs.update({ url: 'chrome-extension://laookkfknpbbblfpciffpaejjkokdgca/dashboard.html' });
    }
});

$on(window, 'load', function() {
    const btnSearch = qs('.btn-search');
    const btnAdd = qs('.btn__add');
    const overlay = qs('.modal__overlay');

    getSubscribedLibraries();

    $on(btnSearch, 'click', handleSearchClick, false);
    $on(btnAdd, 'click', openModal, false);
    $on(overlay, 'click', closeModal, false);
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
    chrome.storage.sync.get(null, function(result) {
        const currentRepositories = qs('.current-repositories');
        currentRepositories.innerHTML = '';
        currentRepositories.innerHTML += `
            <li class="list">
                <div class="list__item--title"><span>Name</span></div>
                <div class="list__item--title"><span>Language</span></div>
                <div class="list__item--title"><span>Starred</span></div>
                <div class="list__item--title"><span>Description</span></div>
                <div class="list__item--title"><span>Actions</span></div>
            </li>
        `;
        const fragment = document.createDocumentFragment();

        for (const repo in result) {
            const repository = result[repo];
            const skeletonRepository = {
                ...repository,
                e_actions: '삭제',
            };
            const list = document.createElement('li');

            list.className = 'list';
            list.dataset.id = repo;

            for (const property in skeletonRepository) {
                const listItem = document.createElement('div');
                const span = document.createElement('span');
                const text = document.createTextNode(skeletonRepository[property]);

                if (property === 'e_actions') {
                    $on(
                        span,
                        'click',
                        function() {
                            removeSubscribedLibrary(skeletonRepository.a_fullname);
                        },
                        false
                    );
                }

                listItem.className = 'list__item';
                span.appendChild(text);
                listItem.appendChild(span);
                list.appendChild(listItem);
            }
            fragment.appendChild(list);
        }

        currentRepositories.appendChild(fragment);
    });
}

function removeSubscribedLibrary(libraryName) {
    chrome.storage.sync.remove(libraryName);
    getSubscribedLibraries();
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
                    a_fullName: item.full_name,
                    b_language: item.language,
                    c_starCount: item.stargazers_count,
                    d_description: item.description,
                };
            })
        );
    });
}

function showResult(repositories) {
    const searchResult = qs('.search-result');
    let innerResult = '';

    for (const repo of repositories) {
        innerResult += `
			<div style="border-bottom:1px solid #aaa;">
				${repo.a_fullName} / ${repo.b_language} / ${repo.c_starCount} / ${repo.d_description}
				<button class="btn-subscribe"
					data-fullname="${repo.a_fullName}"
					data-language="${repo.b_language}"
					data-starcount="${repo.c_starCount}"
					data-description="${repo.d_description}"
				>추가</button>
			</div>
		`;
    }

    searchResult.innerHTML = innerResult;

    const subscribeBtns = qsa('.btn-subscribe');

    subscribeBtns.forEach(el => {
        $on(el, 'click', subscribeRepo, false);
    });
}

function subscribeRepo(e) {
    const { fullname, language, starcount, description } = e.currentTarget.dataset;
    chrome.storage.sync.get(null, function(result) {
        if (result[fullname]) {
            alert('이미 추가된 라이브러리입니다.');
            return;
        }

        const library = {
            a_fullname: fullname,
            b_language: language,
            c_starcount: starcount,
            d_description: description,
        };

        chrome.storage.sync.set(
            {
                [fullname]: library,
            },
            function() {
                getSubscribedLibraries();
            }
        );
    });
}
