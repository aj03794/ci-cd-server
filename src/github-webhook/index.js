import request from 'request'

export const githubWebhook = ({

}) => new Promise((resolve, reject) => {
	updateGithubWebhookUrl({})
})


const updateGithubWebhookUrl = ({

}) => new Promise((resolve, reject) => {

	const options = {
		url: 'https://api.github.com/repos/users/aj03794',
		method: 'GET',
		json: true,
		headers: {
			'Authorization': process.env.GITHUB_OAUTH_TOKEN,
			'User-Agent': 'request'
	 },
	 // body: {
		//  config: {
		// 	 url: 'https://3b4495fasdfasdf1234rq32rfdfw.localtunnel.me/payload'
		//  }
	 // }
	}

	const callback = (err, httpResponse, body) => {
		if(err) {
			console.log('ERROR', err)
		}
		// console.log('httpResponse', httpResponse)
		console.log('body', body)
	}

	request(options, callback)

	// request
	// 	.patch('https://api.github.com/repos/aj03794/raspberry-pi-camera/hooks/29109481', headers: {
	// 		'User-Agent': 'aj03794'
	// 	},
	// 	{
	// 		config: {
	// 			url: 'https://3b4495fasdfasdf1234rq32rfdfw.localtunnel.me/payload'
	// 		}
	// 	},
	// 	(err, httpResponse, body) => {
  //
	// 	})
		// .on('response', response => console.log('RESPONSE', response))
		// .on('error', err => console.log('ERROR OCCURRED', err))
})
