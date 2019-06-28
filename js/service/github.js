export const GET = 'GET'

const GITHUB_API = 'https://api.github.com'

function fetchReleaseNote(owner, repo) {

	sendApi({
		method: GET,
		url: `${GITHUB_API}/repos/${owner}/${repo}/release`
	})
			.then((result) => {
				console.log('then', result)
			})
}