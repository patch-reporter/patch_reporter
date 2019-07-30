import { fetchRepositories } from './service/github.js';
import { qs, qsa, $on } from './utils/helper.js';

// checkbox.addEventListener('click', function() {
//     chrome.storage.sync.set({ defaultnewtab: checkbox.checked });
// });

console.log(chrome.storage);
// chrome.storage.sync.get('defaultnewtab', function(storage) {
// 	if(storage.defaultnewtab) {
// 		chrome.tabs.update({url: 'chrome-search://local-ntp/local-ntp.html'})
// 	}
// })

$on(window, 'load', function() {
    chrome.storage.sync.get({ repositories: {} }, function(result) {
        console.log(result);
        const repositories = result.repositories;
        const currentRepositories = qs('.current-repositories');
        const fragment = document.createDocumentFragment();

        for (const repo in repositories) {
            const row = document.createElement('div');
            const repository = repositories[repo];
            row.className = 'row';
            for (const property in repository) {
                const col = document.createElement('div');
                const text = document.createTextNode(repository[property]);
                col.className = 'col';
                col.appendChild(text);
                row.appendChild(col);
            }
            fragment.appendChild(row);
        }
        currentRepositories.appendChild(fragment);
    });
});

const btnSearch = qs('#btn-search');
const inputSearch = qs('#input-search');
const searchResult = qs('#search-result');

$on(
    btnSearch,
    'click',
    function() {
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
    },
    false
);

function showResult(repositories) {
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
    chrome.storage.sync.get({ repositories: {} }, function(result) {
        console.log(result);
        const repositories = result.repositories;

        console.log(repositories);
        if (repositories[fullname]) {
            return;
        }

        repositories[fullname] = {
            a_fullname: fullname,
            b_language: language,
            c_starcount: starcount,
            d_description: description,
        };

        chrome.storage.sync.set(
            {
                repositories: repositories,
            },
            function() {}
        );
    });
}
