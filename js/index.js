import {fetchReleaseNote} from './service/github.js'
import {qs} from './utils/helper.js'

const converter = new showdown.Converter()

chrome.storage.sync.get({repositories: {}}, function({repositories}) {
	console.log(repositories)

	Promise.all(
			Object.values(repositories).map(({fullname}) => fetchReleaseNote(fullname.split('/')[0], fullname.split('/')[1]))
	).then((result) => {
		// 일단 구현 했는데, 더 빠른 방법이 있을 수도
		let history = []
		result.forEach((rels) => {
			history = [...history, ...rels]
		})
		history.sort((a, b) => a.published_at > b.published_at ? -1 : 1)

		renderReleaseList(history)
	})
})

function renderReleaseList(releases) {
	let inner = ''
	for(let release of releases) {
		let body = converter.makeHtml(release.body)
		let repo = release.url.replace(/https:\/\/api.github.com\/repos\/(.*)\/releases\/.*/, '$1')
		inner += `
			<div class="release-body">
				<div class="label">${repo}</div>
				<div class="label">${release.created_at}</div>
				${body}
			</div>
		`
	}

	qs('.release').innerHTML = inner
}