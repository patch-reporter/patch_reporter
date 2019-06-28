const GET = 'GET'

const GITHUB_API = 'https://api.github.com'

import {sendApi} from '../api/api.js'

export function fetchReleaseNote(owner, repo) {
	return sendApi({
		method: GET,
		url: `${GITHUB_API}/repos/${owner}/${repo}/releases`
	})
}

export function searchRepository(query) {
	return sendApi({
		method: GET,
		url: `${GITHUB_API}/search/repositories?q=${query}&sort=&order=desc`
	})
}

