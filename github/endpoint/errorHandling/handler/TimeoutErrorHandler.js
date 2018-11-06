class TimeoutErrorHandler {

    static handleError(error, options) {
        TimeoutErrorHandler._error = error; // Ignore warning: unused
        TimeoutErrorHandler._options = options; // Ignore warning: unused
        return {shouldRepeat: true, preventRepeat: false}
    }

}

module.exports = TimeoutErrorHandler;