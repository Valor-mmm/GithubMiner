const logplease = require('logplease');
const logger = logplease.create('Logger');

const getLogger = function getLogger(className) {
  return logger;
};

exports.getLogger = getLogger;

