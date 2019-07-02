import {fetchReleaseNote} from './service/github.js'
import {qs} from './utils/helper.js'

const converter = new showdown.Converter()

/*
fetchReleaseNote('facebook', 'react').then(datas => {
	console.log(datas)
	for(let data of datas) {
		const date = new Date(data.published_at)
		const milliseconds = date.getTime()
		const html = converter.makeHtml(data.body)
		const $rendeder = qs('.release')
		$rendeder.innerHTML += html
	}
})

fetchReleaseNote('ant-design', 'ant-design').then(datas => {
	for(let data of datas) {
		const date = new Date(data.published_at)
		const milliseconds = date.getTime()
		const html = converter.makeHtml(data.body)
		const $rendeder = qs('.release')
		$rendeder.innerHTML += html
	}
});
*/

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
		inner += '<br>----------------------------------<br>'
		inner += converter.makeHtml(release.body)
	}

	qs('.release').innerHTML = inner
}