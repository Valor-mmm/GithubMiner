const GithubConfigProvider = require('./github/endpoint/config/GithubConfigProvider');
const GithubEndpoint = require('./github/endpoint/GithubEndpoint');
const ContributorQuery = require('./github/ContributorQuery');

const config = GithubConfigProvider.readConfig();
const generatedQuery = (ContributorQuery.createQuery({facebook: 'react', 'Valor-mmm': 'Payinator'}));
GithubEndpoint.callEndpoint(config, null, generatedQuery).then(res => console.log(res)).catch(err => console.error(err));
