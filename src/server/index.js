import Hapi from 'hapi'
import { continuousIntegration } from '../continuous-integration'
import { address } from 'ip'


const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: address()
})

const addRoute = route => server.route(route)

export const init = async ({ publish, slackCreator }) => {
    
    const slack = slackCreator({ publish })
    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
    createRoutes({ publish, slack }).forEach(addRoute)
    return server
}


export const createRoutes = ({ publish, slack }) => {
  return [{
    method: 'POST',
    path: '/payload',
    handler: (request, h) => {
      console.log('---------------------------------')
        if (request.payload && request.payload.pull_request && request.payload.pull_request.merged) {
          console.log('REQUEST PAYLOAD', request.payload)
          console.log(request.payload.repository)
          const {
            payload: {
              repository: {
                owner: {
                  login: githubUser
                },
                name: repoName,
                ssh_url: urlToClone
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
          slack({
            slackMsg: `STARTING NEW BUILD FOR: ${repoName}`
          })
          continuousIntegration({
            branch,
            urlToClone,
            repoName,
            publish,
            githubUser,
            slack
          })
        }
        return {}
    }
  }]
}
