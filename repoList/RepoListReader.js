const FileReader = require('../FileHandler');
const RepositoryDescriptor = require('../github/RepositoryDescriptor');

class RepoListReader {

    static readRepoListPath(relativePath='./repoList/repoList.json') {
        return FileReader.readJSONFile(relativePath);
    }

    static getRepoList(filePath, propertyName='repoName') {
        const repoNameList = filePath ? RepoListReader.readRepoListPath(filePath) : RepoListReader.readRepoListPath();
        return repoNameList.map(elem => RepositoryDescriptor.separateNameWithOwner(elem[propertyName]))
            .map(elem => new RepositoryDescriptor(elem[0], elem[1]));
    }

}

module.exports = RepoListReader;