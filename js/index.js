import { fetchReleaseNotes } from './service/github.js';
import { qs, getCurrentTime, $delegate, $on, toggleLoading } from './utils/helper.js';

const converter = new showdown.Converter();

let history = [];
const loadMore = qs('.loadMore');
$on(
    loadMore,
    'click',
    function() {
        renderReleaseList(history);
    },
    false
);

chrome.storage.sync.get(null, function(result) {
    toggleLoading(true);
    Promise.all(
        Object.values(result).map(({ a_fullname }) =>
            fetchReleaseNotes(a_fullname.split('/')[0], a_fullname.split('/')[1])
        )
    ).then(result => {
        // 일단 구현 했는데, 더 빠른 방법이 있을 수도
        result.forEach(rels => {
            history = [...history, ...rels];
        });
        history.sort((a, b) => (a.published_at > b.published_at ? -1 : 1));

        toggleLoading(false);
        renderReleaseList(history);
    });
});

function renderReleaseList(releases) {
    for (let i = 0; i < releases.length; i++) {
        const release = releases[i];
        let body = converter.makeHtml(release.body);
        let repo = release.url.replace(/https:\/\/api.github.com\/repos\/(.*)\/releases\/.*/, '$1');

        const rowEl = document.createElement('article');
        rowEl.classList.add('flex__row--wrap');

        const containerEl = document.createElement('div');
        containerEl.classList.add('release__note--library-name');

        const htmlUrlEl = document.createElement('a');
        htmlUrlEl.setAttribute('target', '_blank');
        htmlUrlEl.setAttribute('href', release.html_url);

        const nameEl = document.createElement('h3');
        nameEl.appendChild(document.createTextNode(repo));
        htmlUrlEl.appendChild(nameEl);

        const tagNameEl = document.createElement('h4');
        tagNameEl.appendChild(document.createTextNode(`version: ${release.tag_name}`));

        const createdEl = document.createElement('p');
        createdEl.appendChild(document.createTextNode(`created: ${getCurrentTime(release.created_at)}`));

        containerEl.appendChild(htmlUrlEl);
        containerEl.appendChild(tagNameEl);
        containerEl.appendChild(createdEl);

        const timelineEl = document.createElement('div');
        timelineEl.classList.add('release__timeline-contents');

        const contentsEl = document.createElement('div');
        contentsEl.classList.add('release__timeline-contents-body');
        contentsEl.innerHTML = body;

        timelineEl.appendChild(contentsEl);

        rowEl.appendChild(containerEl);
        rowEl.appendChild(timelineEl);

        const releaseNote = qs('.release__note');
        releaseNote.appendChild(rowEl);
    }
}
