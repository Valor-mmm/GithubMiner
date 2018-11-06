class DefaultErrorHandler {

    static handleError(err, options) {
        DefaultErrorHandler._options = options; // Ignore warning: unused
        const message = `Error could not be handled properly! Aborting! Error: "${err}"`;
        console.error(message);
        throw new Error(message);
    }

}

module.exports = DefaultErrorHandler;