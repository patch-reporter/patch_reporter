const GET = 'GET'

const GITHUB_API = 'https://api.github.com'

import {sendApi} from '../api/api.js'

export function fetchReleaseNote(owner, repo) {

	sendApi({
		method: GET,
		url: `${GITHUB_API}/repos/${owner}/${repo}/releases`
	})
			.then((result) => {
				console.log('then', result)
			})
}

export function searchRepository(query) {
	sendApi({
		method: GET,
		url: `${GITHUB_API}/search/repositories?q=${query}&sort=stars&order=desc`
	})
			.then((result) => {
				console.log('then', result)
			})
}

