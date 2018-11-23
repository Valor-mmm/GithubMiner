const QueryExecutor = require('./QueryExecutor').QueryExecutor;
const PaginationQueryType = require('../../github/query/pagination/PaginationQueryType').PaginationQueryType;
const WithPaginationResultWriter = require('../../WithPaginationResultWriter').WithPaginationResultWriter;
const PaginationRelation = require('../../github/query/pagination/PaginationRelation').PaginationRelation;
const RepoQueryGenerator = require('../../github/query/RepoQueryGenerator').RepoQueryGenerator;
const SimpleQueryExecutor = require('./SimpleQueryExecutor').SimpleQueryExecutor;
const ConfigMerger = require('../ConfigMerger');

const defaultOptions = {
    paginationSize: 100
};

class PaginationQueryExecutor extends QueryExecutor {

    static async execute(query, data, resultWriter, options) {
        const withPaginationResultWriter = new WithPaginationResultWriter(resultWriter, query, data);
        const mergedConfig = ConfigMerger.mergeConfig(options, defaultOptions);

        const initialQueryString = PaginationQueryExecutor.getInitialQueryString(query, data, mergedConfig.paginationSize);
        await SimpleQueryExecutor.execute(initialQueryString, data, withPaginationResultWriter, mergedConfig);

        while(withPaginationResultWriter.paginationDescriptor.hasNextPage()) {
            const repoList = withPaginationResultWriter.paginationDescriptor.composeRepositoryList();
            const paginationList = PaginationRelation.fromPaginationDescriptor(withPaginationResultWriter.paginationDescriptor);
            const queryString = PaginationQueryExecutor.createQuery(query, repoList, paginationList);
            await SimpleQueryExecutor.execute(queryString, repoList, withPaginationResultWriter, mergedConfig);
        }
    }

    static getInitialQueryString(query, repoList, paginationSize) {
        if (!query || !(query instanceof PaginationQueryType)) {
            logger.error('Mandatory parameter query has to be defined and instance of PaginationQueryType.', query);
            return null;
        }

        if (!Array.isArray(repoList)) {
            logger.error('Mandatory parameter repoList has to be an array of RepositoryDescriptors.', repoList);
            return null;
        }

        const initialEnums = query.getInitialEnums();

        if (!Array.isArray(initialEnums)) {
            logger.error('Initial enums are expected to be an array.', initialEnums);
            return null;
        }

        let initialPaginationRelationList = [];
        for (const initialEnum of initialEnums) {
            initialPaginationRelationList = initialPaginationRelationList.concat(PaginationRelation.fromRepoList(repoList, initialEnum, paginationSize));
        }
        return PaginationQueryExecutor.createQuery(query, repoList, initialPaginationRelationList);
    }

    static createQuery(query, repoList, paginationRelationList) {
        const queryTemplate = PaginationQueryExecutor.composeQuery(query, repoList);
        return PaginationQueryType.replacePagination(queryTemplate, paginationRelationList);
    }

    static composeQuery(query, repoList) {
        if (!(query instanceof PaginationQueryType)) {
            logger.error('query has to be either a string or an instance of QueryType');
            return null;
        }

        if (!Array.isArray(repoList) || repoList.length < 1) {
            logger.error('An array of repository descriptors(repoList) is needed to create a query.');
            return null;
        }

        return RepoQueryGenerator.createQuery(query, repoList);
    }

    static composePaginationValue(paginationDescription) {
        if (!paginationDescription || !(typeof paginationDescription === 'object')) {
            logger.error('Mandatory parameter paginationDescription has to be defined and an object.', paginationDescription);
            return null;
        }

        const paginationInfo = paginationDescription.paginationInfo;
        const repoDescriptor = paginationDescription.repositoryDescriptor;

        if (!paginationInfo || ! repoDescriptor) {
            logger.error('Parameter paginationDescription does not contain mandatory keys.', paginationInfo, repoDescriptor);
            return null;
        }



        return new PaginationRelation();
    }
}

exports.PaginationQueryExecutor = PaginationQueryExecutor;

const logger = require('../../LoggerProvider').getLogger(PaginationQueryExecutor);