const GithubConfigProvider = require('./github/endpoint/config/GithubConfigProvider');
const GithubEndpoint = require('./github/endpoint/GithubEndpoint');
const ContributorQuery = require('./github/ContributorQuery');
const RepositoryDescriptor = require('./github/RepositoryDescriptor');

const config = GithubConfigProvider.readConfig();
const repoList = [new RepositoryDescriptor('facebook', 'react')];
repoList.push(new RepositoryDescriptor('Valor-mmm', 'Payinator'));
const generatedQuery = (ContributorQuery.createQuery(repoList));
GithubEndpoint.callEndpoint(config, null, generatedQuery).then(res => console.log(res)).catch(err => console.error(err));
