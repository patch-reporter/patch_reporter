const sendApi = ({method, url, callback = () => {}, data, type = 'JSON'}) => {

	return new Promise(function(resolve, reject) {
		let xhr = new XMLHttpRequest()
		let newData

		if(!xhr) {
			return false
		}

		// xhr.onreadystatechange = () => {successApiCall(xhr, callback, type)}
		xhr.open(method, url)

		if(type === 'JSON') {
			xhr.setRequestHeader('Content-Type', 'application/json')
			newData = JSON.stringify(data)
		}

		xhr.onload = function() {
			if(xhr.readyState === XMLHttpRequest.DONE) {
				if(xhr.status === 200) {
					let data = type === 'JSON' ? JSON.parse(xhr.responseText) : xhr.responseText
					callback(data)
					resolve(data)
				} else {
					reject(Error(xhr.statusText))
				}
			}
		}

		xhr.onerror = function() {
			reject(Error('Something went wrong ... '))
		}

		xhr.send(newData)
	})
}
