const ErrorHandler = require('./ErrorHandler').ErrorHandler;
const ResolveAction = require('../ResolveAction');

class TimeoutErrorHandler extends ErrorHandler {

    static handleError(error, options) {
        TimeoutErrorHandler._error = error; // Ignore warning: unused
        TimeoutErrorHandler._options = options; // Ignore warning: unused
        return {shouldRepeat: true, preventRepeat: false, resolveActions: [ResolveAction.SWITCH_API_TOKEN]}
    }

}

module.exports = TimeoutErrorHandler;