const logger = require('node-file-logger');
const moment = require('moment');

const options = {
    timeZone: moment.tz.guess(),
    folderPath: './logs/',
    dateBasedFileNaming: true,
    fileNamePrefix: 'ErrorLogs_',
    fileNameExtension: '.log',
    dateFormat: 'YYYY_MM_D',
    timeFormat: 'h:mm:ss A',
}

logger.SetUserOptions(options);

function error(data) {
    logger.Error( new Date().toUTCString())
    logger.Error(data.code, data.message, '\n' + data.meta + '\n', '==========================================================');
}

function info(message) {
    logger.Info(message + '\n', null, null, '==========================================================');
}

module.exports = {
    error,
    info
}
