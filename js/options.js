import {searchRepository} from './service/github.js'

const btnSearch = document.querySelector('#btn-search')
const inputSearch = document.querySelector('#input-search')
const searchResult = document.querySelector('#search-result')

btnSearch.addEventListener('click', function(event) {
	const query = inputSearch.value;
	if(!query) {
		return
	}
	searchRepository(query)
			.then((response) => {
				console.log(response)
				showResult(response.items.map((item) => {
					return {
						id: item.id,
						fullName: item.full_name,
						language: item.language,
						starCount: item.stargazers_count,
						description: item.description
					}
				}))
			})
}, false)

function subscribeRepo(e) {
	console.log(e.currentTarget.dataset)
}



function showResult(repositorys) {
	let innerResult = ''

	for(const repo of repositorys) {
		innerResult += `
			<div style="border-bottom:1px solid #aaa;">
				${repo.fullName} / ${repo.language} / ${repo.starCount} / ${repo.description} 
				<button class="btn-subscribe"
					data-fullName="${repo.fullName}"
					data-language="${repo.language}"
					data-starCount="${repo.starCount}"
					data-description="${repo.description}"
				>추가</button>
			</div>
		`
	}
	searchResult.innerHTML = innerResult

	document.querySelectorAll('.btn-subscribe').forEach(el => {
		el.addEventListener('click', subscribeRepo, false)
	})
}