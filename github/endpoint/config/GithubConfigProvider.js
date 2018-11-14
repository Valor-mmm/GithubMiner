const FileReader = require('../../../FileHandler').FileHander;

class GithubConfigProvider {

    static readConfig(relativePath='./github/endpoint/config/github_config.yaml') {
        return FileReader.readYamlFile(relativePath);
    }
}

module.exports = GithubConfigProvider;