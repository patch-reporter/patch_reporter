import { fetchReleaseNote } from './service/github.js';
import { qs } from './utils/helper.js';
const converter = new showdown.Converter();

fetchReleaseNote('facebook', 'react').then(datas => {
    console.log(datas);
    for (let data of datas) {
        const html = converter.makeHtml(data.body);
        const $rendeder = qs('.release');
        $rendeder.innerHTML += html;
    }
});
