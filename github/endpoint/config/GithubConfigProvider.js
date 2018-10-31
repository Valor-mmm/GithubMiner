const yaml = require('js-yaml');
const fs   = require('fs');
const resolve = require('path').resolve;

class GithubConfigProvider {

    static readConfig(relativePath="./github/endpoint/config/github_config_local.yaml") {
        try {
            const absolutePath = resolve(relativePath);
            console.log(absolutePath);
            return yaml.safeLoad(fs.readFileSync(absolutePath, 'utf8'));
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

module.exports = GithubConfigProvider;