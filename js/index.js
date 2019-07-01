import { fetchReleaseNote } from './service/github.js';
import { qs } from './utils/helper.js';
const converter = new showdown.Converter();

fetchReleaseNote('facebook', 'react').then(datas => {
    console.log(datas);
    for (let data of datas) {
        const date = new Date(data.published_at);
        console.log(date);
        const milliseconds = date.getTime();
        console.log(milliseconds);
        const html = converter.makeHtml(data.body);
        const $rendeder = qs('.release');
        $rendeder.innerHTML += html;
    }
});

fetchReleaseNote('ant-design', 'ant-design').then(datas => {
    for (let data of datas) {
        const date = new Date(data.published_at);
        console.log(data);
        const milliseconds = date.getTime();
        console.log(milliseconds);
        const html = converter.makeHtml(data.body);
        const $rendeder = qs('.release');
        $rendeder.innerHTML += html;
    }
});
