import localtunnel from 'localtunnel'

export const exposePort = ({ port }) => new Promise((resolve, reject) => {

	const tunnel = localtunnel(
		port = process.env.PORT || 3000 ,
		{ subdomain: process.env.SUB_DOMAIN || 'raspberry-pi' },
		(err, tunnel) => {
			console.log('tunnel', tunnel.url)
			resolve(tunnel)
	})

})
