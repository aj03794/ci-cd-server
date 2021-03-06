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