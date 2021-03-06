/**
 * querySelector wrapper
 *
 * @param {string} selector Selector to query
 * @param {Element} [scope] Optional scope element for the selector
 */
export function qs(selector, scope) {
    return (scope || document).querySelector(selector);
}

/**
 * querySelectorAll wrapper
 *
 * @param {string} selector Selector to query
 * @param {Element} [scope] Optional scope element for the selector
 */
export function qsa(selector, scope) {
    return (scope || document).querySelectorAll(selector);
}

/**
 * addEventListener wrapper
 *
 * @param {Element|Window} target Target Element
 * @param {string} type Event name to bind to
 * @param {Function} callback Event callback
 * @param {boolean} [capture] Capture the event
 */
export function $on(target, type, callback, useCapture) {
    target.addEventListener(type, callback, !!useCapture);
}

/**
 * Attach a handler to an event for all elements matching a selector.
 *
 * @param {Element} target Element which the event must bubble to
 * @param {string} selector Selector to match
 * @param {string} type Event name
 * @param {Function} handler Function called when the event bubbles to target
 *                           from an element matching selector
 * @param {boolean} [capture] Capture the event
 */
export function $delegate(target, selector, type, handler) {
    function dispatchEvent(event) {
        const targetElement = event.target;
        const potentialElements = qsa(selector, target);
        const hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

        if (hasMatch) {
            handler.call(targetElement, event);
        }
    }

    // https://developer.mozilla.org/en-US/docs/Web/Events/blur
    var useCapture = type === 'blur' || type === 'focus';

    $on(target, type, dispatchEvent, useCapture);
}

/**
 * compare Schedule's period in Array
 * @param {*} a
 * @param {*} b
 */
export function compareToSort(a, b) {
    if (a.period < b.period) {
        return 1;
    }
    if (a.period > b.period) {
        return -1;
    }

    return 0;
}

/**
 * generate Random hex
 * @return {string} example: #ffffff
 */
export function generateRandomColor() {
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // 백그라운드에 사용할 랜덤 컬러

    if (color.length < 7) {
        color = generateRandomColor();
    }

    return color;
}

/**
 * escape html
 * @param {string} s plain html
 */
export function htmlEscape(s) {
    return (s + '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#039;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br />')
        .replace(/ /g, '&nbsp');
}

export function getCurrentTime(t) {
    const date = new Date(t);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const fixedSeconds = seconds === 0 ? seconds + '0' : seconds;

    return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes + ':' + fixedSeconds;
}

export function getCurrentDate(t) {
    const date = new Date(t);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}/${('0' + month).substr(('0' + month).length - 2, 2)}/${('0' + day).substr(
        ('0' + day).length - 2,
        2
    )}`;
}

/**
 * Toggle loading bounce
 * @param {boolean} loading
 */
export function toggleLoading(loading) {
    const loader = qs('.loading');
    if (loading) {
        loader.classList.remove('hide');
    } else {
        loader.classList.add('hide');
    }
}

export function loadElements(target, contents) {
    target.innerHTML = contents;
}

/**
 * Filter object
 * @param {object} obj
 * @param {function} callbackfn
 */
export function filterObject(obj, callbackfn) {
    let filteredKey = Object.keys(obj).filter(key => callbackfn(obj[key]));
    let result = {};
    filteredKey.forEach(key => {
        // Todo. DeepCopy 필요
        result[key] = obj[key];
    });
    return result;
}
/**
 * @param {number} value
 * @return {number | string}
 */
export function numberFormat(value) {
    if (value >= 1000) {
        let _value = value / 1000;
        return parseFloat(_value).toFixed(1) + 'k';
    } else {
        return value;
    }
}

export function replaceImageToSvg() {
    document.querySelectorAll('img.svg').forEach(img => {
        const imgID = img.id;
        const imgClass = img.className;
        const imgDataset = img.dataset;
        const imgURL = img.src;

        fetch(imgURL)
            .then(response => {
                return response.text();
            })
            .then(text => {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(text, 'text/xml');

                // Get the SVG tag, ignore the rest
                var svg = xmlDoc.getElementsByTagName('svg')[0];

                // Add replaced image's ID to the new SVG
                if (typeof imgID !== 'undefined') {
                    svg.setAttribute('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if (typeof imgClass !== 'undefined') {
                    svg.setAttribute('class', imgClass + ' replaced-svg');
                }

                if (typeof imgDataset !== 'undefined') {
                    svg.dataset.fullname = imgDataset.fullname;
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                svg.removeAttribute('xmlns:a');

                // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
                if (!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
                    svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('height') + ' ' + svg.getAttribute('width'));
                }

                // Replace image with new SVG
                img.parentNode.replaceChild(svg, img);
            });
    });
}
