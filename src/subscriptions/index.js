export const initalizeGithubListener = ({
    filterGcpMsgs,
    logger
}) => {
    createSubscriptions({
        filterGcpMsgs,
        logger
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
    filterGcpMsgs,
    logger
}) => new Promise((resolve, reject) => {

        const gcpSubscription = filterGcpMsgs(msg => {
            logger.info(msg)
        })
        return resolve({
            gcpSubscription
        })

})