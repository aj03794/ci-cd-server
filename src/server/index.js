import Hapi from 'hapi'
import { handleNewCode } from '../handle-new-code'
// const Hapi = require('hapi')
// const url = await ngrok.connect();

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost'
})

const addRoute = route => server.route(route)

export const init = async ({ redis }) => {
    const { publish } = redis()
    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
    createRoutes({ publish }).forEach(addRoute)
    return server
}


export const createRoutes = ({ publish }) => {
  return [{
    method: 'POST',
    path: '/payload',
    handler: (request, h) => {
      console.log('---------------------------------')
      // console.log('request.payload', request.payload)
        if (request.payload && request.payload.pull_request && request.payload.pull_request.merged) {
          console.log('REQUEST PAYLOAD', request.payload)
          console.log(request.payload.repository)
          // console.log(request.payload.repository.name)
        //   console.log('CODE WAS MERGED')
        //   // console.log('====>', request.payload.pull_request.base)
          const {
            payload: {
              repository: {
                owner: {
                  login: githubUser
                },
                name: repoName,
                clone_url: urlToClone
              },
              pull_request: {
                base: {
                  ref: branch
                }
              }
            }
          } = request
          console.log('branch', branch)
          console.log('repoName', repoName)
          console.log('urlToClone', urlToClone)
          console.log('githubUser', githubUser)
          handleNewCode({
            branch,
            urlToClone,
            repoName,
            publish,
            githubUser
          })
        }
        return {}
    }
  }]
}
