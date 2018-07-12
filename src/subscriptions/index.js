export const initalizeGithubListener = ({
    filterGcpMsgs
}) => {
    createSubscriptions({
        filterGcpMsgs
    })
    // .then(({
    //     gcpSubscription
    // }) => {
    //     gcpSubscription.subscribe(msg => {
    //         enqueue(takePhoto({ photoType: 'manual' }))
    //     })
    // })
}

const createSubscriptions = ({
    filterGcpMsgs
}) => new Promise((resolve, reject) => {

        const gcpSubscription = filterGcpMsgs(msg => {
            logger.info(msg)
        })
        return resolve({
            gcpSubscription
        })

})