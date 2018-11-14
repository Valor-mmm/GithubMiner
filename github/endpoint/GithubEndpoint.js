const {GraphQLClient} = require('graphql-request');

const tokenSwitch = {};

class GithubEndpoint {

    static async callEndpoint(apiConfig, options, query, switchApiToken) {
        const client = GithubEndpoint.createGraphQLClient(apiConfig, options, switchApiToken);
        return await client.request(query);
    }

    static createGraphQLClient(apiConfig, options, switchApiToken) {
        if (!apiConfig || !apiConfig.endpointUrl) {
            logger.error('API config with url needed but not specified correctly.');
            return null;
        }

        const mergedOptions = GithubEndpoint.mixOptions(apiConfig, options, switchApiToken);
        return new GraphQLClient(apiConfig.endpointUrl, mergedOptions);
    }

    static mixOptions(apiConfig, options, switchApiToken) {
        if (!apiConfig) {
            logger.warn('No api config or apiToken given. Nothing there to mix in.');
            if (!options) {
                return {};
            }
            return options;
        }

        let authorizationHeader = {};
        const apiToken = this.getTokenFromConfig(apiConfig, switchApiToken);
        if (apiToken) {
            authorizationHeader = {Authorization: `Bearer ${apiToken}`};
        }

        if (options && options.headers && options.headers.authorization) {
            logger.warn('Authorization header would have been overwritten. Skipping merge!');
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

    static getTokenFromConfig(apiConfig, switchApiToken) {
        if (!apiConfig || !apiConfig.apiToken) {
            logger.error('Can not retrieve apiToken form apiConfig: ' + apiConfig);
            return null;
        }

        if (typeof apiConfig.apiToken === 'string') {
            return apiConfig.apiToken;
        }

        if (!Array.isArray(apiConfig.apiToken) || apiConfig.apiToken.length < 1) {
            logger.error('ApiToken has to be a non empty list of tokens or a token as string! But was: ', apiConfig.apiToken);
            return null;
        }

        if (!apiConfig.tokenSwitchId) {
            return apiConfig.apiToken[0];
        }

        if (tokenSwitch.hasOwnProperty(apiConfig.tokenSwitchId)) {
            if (!switchApiToken) {
                return apiConfig.apiToken[tokenSwitch[apiConfig.tokenSwitchId]]
            }
            const newIndex = (tokenSwitch[apiConfig.tokenSwitchId] + 1) % apiConfig.apiToken.length;
            logger.log('Switching to new api token with index: ' + newIndex);
            tokenSwitch[apiConfig.tokenSwitchId] = newIndex;
            return apiConfig.apiToken[newIndex];
        } else {
            logger.log('Saving new tokenSwitchId');
            tokenSwitch[apiConfig.tokenSwitchId] = 0;
            return apiConfig.apiToken[0];
        }
    }
}

exports.GithubEndpoint = GithubEndpoint;

const logger = require('../../LoggerProvider').getLogger(GithubEndpoint);