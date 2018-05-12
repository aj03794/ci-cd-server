import localtunnel from 'localtunnel'

export const exposePort = ({ port }) => new Promise((resolve, reject) => {

	const tunnel = localtunnel(
		port = process.env.PORT || 3000 ,
		// TODO programatically update the github url that it is pushing to when code is
		// updated
		{ subdomain: process.env.SUB_DOMAIN || '3b4495f9-6ff7-4795-a8a5-49d8cd3e74b3' },
		(err, tunnel) => {
			console.log('tunnel', tunnel.url)
			resolve(tunnel)
		}
	)

})
