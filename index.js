const GithubConfigProvider = require('./github/endpoint/config/GithubConfigProvider');

const config = GithubConfigProvider.readConfig();
console.log(config);