const {GraphQLClient} = require('graphql-request');

class GithubEndpoint {

    static async callEndpoint(apiConfig, options, query) {
        const client = GithubEndpoint.createGraphQLClient(apiConfig, options);
        return await client.request(query);
    }

    static createGraphQLClient(apiConfig, options) {
        if (!apiConfig || !apiConfig.endpointUrl) {
            console.error('API config with url needed but not specified correctly.');
            return null;
        }

        const mergedOptions = GithubEndpoint.mixOptions(apiConfig, options);

        return new GraphQLClient(apiConfig.endpointUrl, mergedOptions);
    }

    static mixOptions(apiConfig, options) {
        if (!apiConfig) {
            console.warn('No api config or apiToken given. Nothing there to mix in.');
            if (!options) {
                return {};
            }
            return options;
        }

        let authorizationHeader = {};
        if (apiConfig.apiToken) {
            authorizationHeader = { Authorization: `Bearer ${apiConfig.apiToken}` };
        }

        if (options && options.headers && options.headers.authorization) {
            console.warn('Authorization header would have been overwritten. Skipping merge!');
            return options;
        }

        if (!options) {
            return {headers: authorizationHeader};
        }

        if (options.headers) {
            options.headers = {...options.headers, ...authorizationHeader};
            return options;
        }

        if (Object.keys(authorizationHeader).length === 0 && authorizationHeader.constructor === Object) {
            return options;
        }

        return {...options, ...{headers: authorizationHeader}};
    }
}

module.exports = GithubEndpoint;