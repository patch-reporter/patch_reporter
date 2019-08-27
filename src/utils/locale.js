import en from './locales/en';
import ko from './locales/ko';
import { qsa } from './helper';
import { getStorage } from './storage';

function setLocales(locale) {
    for (const keys in locale) {
        const elems = qsa(`.${keys}`);
        if (elems.length === 0) {
            return;
        }
        if (elems.length === 1) {
            elems[0].innerText = locale[keys];
        } else {
            for (const elem of elems) {
                elem.innerText = locale[keys];
            }
        }
    }
}

export function initLocalization() {
    getStorage(null).then(result => {
        const { localeLanguage } = result;
        const locatedInKorea = localeLanguage === 'ko';
        if (locatedInKorea) {
            setLocales(ko);
        } else {
            setLocales(en);
        }
    });
}
