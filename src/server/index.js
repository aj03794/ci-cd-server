import Hapi from 'hapi'
import { handleNewCode } from '../handle-new-code'
// const Hapi = require('hapi')
// const url = await ngrok.connect();

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost'
})

const addRoute = route => server.route(route)

export const init = async () => {
    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
    createRoutes().forEach(addRoute)
    return server
}


export const createRoutes = () => {
  return [{
    method: 'POST',
    path: '/payload',
    handler: (request, h) => {
        console.log('---------------------------------')
        const { payload: { ref, repository: { clone_url: urlToClone } } } = request
        // console.log('cloneUrl', urlToClone)
        const branch = ref.split('/')[2]
        // console.log('branch', branch)
        handleNewCode({
          branch,
          urlToClone
        })
        // console.log('---------------------------------')
        // updateCode()
        // downloadCode({  })
        // .then(() => testCode({  }))
        // .then(() => alertListenersToNewCode({  }))
        // return 'hello world'
        return {}
    }
  }]
}
