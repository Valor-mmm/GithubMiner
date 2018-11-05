const FileReader = require('../../../FileReader');

class GithubConfigProvider {

    static readConfig(relativePath='./github/endpoint/config/github_config.yaml') {
        return FileReader.readYamlFile(relativePath);
    }
}

module.exports = GithubConfigProvider;