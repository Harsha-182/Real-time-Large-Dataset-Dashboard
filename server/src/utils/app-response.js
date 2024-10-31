const logger = require('./logger');

class ResponseError {
    constructor(error) {
        if(typeof error === 'string') {
            this.message = error;
            this.code = '';
            this.meta = null;
        } else{
            this.message = error.message;
            this.code = error.code || '';
            this.meta = error.meta || null;
        }
    }
}

module.exports = class AppResponse {
    constructor(data = null, returnCode = 2, error) {
        this.data = data;
        this.returnCode = returnCode;
        this.error = this.getErrorInstance(error);

        if(this.error && !this.error.message && this.error.code == 'SYSTEM_ERROR') {
            this.error.message = 'System Error occurred while processing your request, please try again later!';
        }

        else if(this.error === null) {
            delete this.error;
        }

        if(this.data === null) {
            delete this.data;
        }

        if (this.error && this.error.meta) {
            logger.error(this.error);
        }
    }

    getErrorInstance(error) {
        let errorObj = null;

        if(error instanceof ResponseError) {
            errorObj = error;
        } else if(error = this.clearNullData(error)) {
            errorObj = new ResponseError(error);
        }

        return errorObj;
    }

    clearNullData(obj) {
        for (var propName in obj) {
            if (!obj[propName]) {
                delete obj[propName];
            }
        }

        return Object.keys(obj).length === 0 ? null : obj;
    }

    static createResponse(details){
        details = details || {};
        return new AppResponse(details.data, details.returnCode, details.error);
    }
}

/**
 * returnCode details:
 * 0 - success
 * 1 - data error to show proper message to user, like - DUPLICATE_USERNAME while register etc.
 * 2 - server side error while doing some operation
 * 3 - no internet connection
 * 4 - 404 not found error
 * 5 - 500,... server error
 */
