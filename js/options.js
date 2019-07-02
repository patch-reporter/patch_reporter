import { searchRepository } from './service/github.js';
import { qs } from './utils/helper.js';

searchRepository('facebook/react');

const checkbox = qs('.toggle-default-tab');

// checkbox.addEventListener('click', function() {
//     chrome.storage.sync.set({ defaultnewtab: checkbox.checked });
// });

console.log(chrome.storage);
// chrome.storage.sync.get('defaultnewtab', function(storage) {
// 	if(storage.defaultnewtab) {
// 		chrome.tabs.update({url: 'chrome-search://local-ntp/local-ntp.html'})
// 	}
// })

const btnSearch = document.querySelector('#btn-search');
const inputSearch = document.querySelector('#input-search');
const searchResult = document.querySelector('#search-result');

btnSearch.addEventListener(
    'click',
    function(event) {
        const query = inputSearch.value;
        if (!query) {
            return;
        }
        searchRepository(query).then(response => {
            console.log(response);
            showResult(
                response.items.map(item => {
                    return {
                        id: item.id,
                        fullName: item.full_name,
                        language: item.language,
                        starCount: item.stargazers_count,
                        description: item.description,
                    };
                })
            );
        });
    },
    false
);

function subscribeRepo(e) {
	const { fullname, language, starcount, description} = e.currentTarget.dataset;
	chrome.storage.sync.get({repositories: {}}, function(result){
		const repositories = result.repositories;

		if(repositories[fullname]) {
			return
		}

		const newItem = {
			fullname: fullname,
			language: language,
			starcount: starcount,
			description: description
		};

		repositories[fullname] = newItem

		chrome.storage.sync.set({
			repositories: repositories
		}, function(){})
	})
}

function showResult(repositorys) {
    let innerResult = '';

    for (const repo of repositorys) {
        innerResult += `
			<div style="border-bottom:1px solid #aaa;">
				${repo.fullName} / ${repo.language} / ${repo.starCount} / ${repo.description} 
				<button class="btn-subscribe"
					data-fullname="${repo.fullName}"
					data-language="${repo.language}"
					data-starcount="${repo.starCount}"
					data-description="${repo.description}"
				>추가</button>
			</div>
		`;
    }
    searchResult.innerHTML = innerResult;

    document.querySelectorAll('.btn-subscribe').forEach(el => {
        el.addEventListener('click', subscribeRepo, false);
    });
}
