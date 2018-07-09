export const loggerCreator = ({
    publish,
    loggingLevel = 'info'
}) => {

    // Mimic GCP levels in stackdriver
    const levels = {
        any: 0,
        debug: 1,
        info: 2,
        warning: 3,
        error: 4,
        critical: 5
    }

    return Object.keys(levels)
            .reduce((obj, level) => {
                return { 
                    ...obj,
                    [level]: log => {
                        console.log(level, log)
                        if (levels[level] >= levels[loggingLevel]) {
                            return publish({
                                channel: 'logging',
                                data: {
                                    level,
                                    log
                                }
                            }) 
                        }
                    }
                }
            }, {})

}