// TODO This I can make this better by not make the second function 
// take in objects as params
export const slack = ({
    publish,
    channel = 'slack',
}) => ({
    slackMsg,
    slackChannel='ci'
}) => new Promise((resolve, reject) => {
    publish({
        channel,
        data: {
            slackData: {
                channel: slackChannel,
                msg: slackMsg
            }
        }
    })
    resolve()
})