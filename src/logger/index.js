export const loggerCreator = ({
    publish
}) => {

    const levels = {
        any: 0,
        debug: 1,
        info: 2,
        warning: 3,
        error: 4,
        critical: 5
    }

    const logger = Object.keys(levels).map(level => {
        return level
    })
    .reduce((obj, currentValue) => {
        return { 
            ...obj,
            [currentValue]: log => {
                console.log('log', log)
                console.log('currentValue', currentValue)
                publish({
                    channel: 'logging',
                    data: {
                        level: currentValue,
                        log
                    }
                })
            }
        }
    }, {})

    return logger

}