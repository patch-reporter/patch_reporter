/**
 * @param {string} key
 */
export function getStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, result => {
            if (Object.keys(result).length > 0) {
                resolve(result);
            } else {
                reject(new Error(`There is no storage.\nkey name: ${key}`));
            }
        });
    });
}

/**
 * @param {string} key
 * @param {*} value
 * @param {function} callback Optional
 */
export function setStorage(key, value, callback) {
    chrome.storage.sync.set(
        {
            [key]: value,
        },
        function() {
            callback && callback();
        }
    );
}

/**
 * @param {string} key
 * @param {function} callback
 */
export function deleteStorage(key, callback) {
    chrome.storage.sync.remove(key);
    callback && callback();
}
