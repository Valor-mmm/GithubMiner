const PaginationQueryType = require('../../pagination/PaginationQueryType').PaginationQueryType;
const RepoFragmentGenerator = require('../../RepoFragmentGenerator');
const RepoPaginationFragmentGenerator = require('../../pagination/RepoPaginationFragmentGenerator').RepoPaginationFragmentGenerator;
const QueryType = require('../../QueryType').QueryType;
const _ = require('lodash');
const RepositoryDescriptor = require('../../../RepositoryDescriptor').RepositoryDescriptor;
const PaginationDescriptor = require('../../pagination/PaginationDescriptor').PaginationDescriptor;

class PaginationContributorQueryType extends PaginationQueryType {

    constructor() {
        super();
        this.fragmentList = PaginationContributorQueryType.getFragmentList();
        this.paginatinFragmentsList = PaginationContributorQueryType.getPaginatingFragmentList();
    }

    composeFragments() {
        return this.fragmentList.map(elem => elem.content)
            .join('\n');
    }

    composeRepositoryQuery(repo) {
        const fragmentContent = this.fragmentList.map(fragment => `...${fragment.name}`)
            .join('\n');
        const paginatingFragmentContent = this.paginatinFragmentsList.map(fragment => fragment.extractFragmentBody())
            .join('\n');
        return QueryType.fillRepoQueryTemplate(repo, fragmentContent + '\n' + paginatingFragmentContent);
    }

    getInitialEnums() {
        return [PaginationPlaceholder.CONTRIBUTOR_COMMIT_PAGINATION];
    }

    static getFragmentList() {
        const result = [];
        result.push(RepoFragmentGenerator.getNameWithOwnerFragment());
        return result;
    }

    static getPaginatingFragmentList() {
        const result = [];
        result.push(RepoPaginationFragmentGenerator.getContributorsFragment(PaginationPlaceholder.CONTRIBUTOR_COMMIT_PAGINATION));
        return result;
    }

    extractPaginationInfo(data, repoList, paginationSize) {
        if (!data || !(typeof data === 'object')) {
            logger.error('The mandatory parameter data has to be a defined object.', data);
            return null;
        }

        if (!Array.isArray(repoList)) {
            logger.error('The mandatory parameter repoList has to be an Array of RepositoryDescriptors.');
            return null;
        }

        const paginationDescriptor = new PaginationDescriptor(paginationSize);
        for (const repo in data) {
            if (data.hasOwnProperty(repo)) {
                if (!data[repo]) {
                    logger.info(`Data for ${repo} is null.`, data[repo]);
                    continue;
                }
                const paginationInfo = _.get(data[repo], 'defaultBranchRef.target.history.pageInfo', null);
                const nameWithOwner = _.get(data[repo], 'nameWithOwner', null);
                const repositoryDescriptor = RepositoryDescriptor.getRepoDescrByNameWithOwner(nameWithOwner);
                if (!paginationInfo || !repositoryDescriptor) {
                    logger.error('PaginationInfo or repositoryDescriptor could not be determined.');
                    continue;
                }
                paginationDescriptor.addPaginationValue(PaginationPlaceholder.CONTRIBUTOR_COMMIT_PAGINATION, paginationInfo, repositoryDescriptor);
            }
        }

        return paginationDescriptor;
    }
}

const enumValue = (name) => Object.freeze({toString: () => name});

const PaginationPlaceholder = Object.freeze({
    CONTRIBUTOR_COMMIT_PAGINATION: enumValue('PaginationPlaceholder.CONTRIBUTOR_COMMIT_PAGINATION')
});

exports.PaginationPlaceholder = PaginationPlaceholder;
exports.PaginationContributorQueryType = PaginationContributorQueryType;

const logger = require('../../../../LoggerProvider').getLogger(PaginationContributorQueryType);