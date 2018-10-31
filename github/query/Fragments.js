const Fragment = require('./Fragment');

class FragmentGenerator {

    static getRepoFragment(content) {
        const fragmentName = 'repository';
        if (!content) {
            content = '';
        }

        const fragmentContent =
            `fragment ${fragmentName} on Repository {
                    nameWithOwner
                    createdAt
                    updatedAt
                    isFork
                    ${content}
            }`;

        return new Fragment(fragmentName, fragmentContent)
    }

}

module.exports = FragmentGenerator;