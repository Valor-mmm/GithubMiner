# Github Miner
Simple miner for the GitHub v4 API.
This is a student project for the [OTH-Regensburg](https://www.oth-regensburg.de/), with the goal to execute a query for a list of repositories.

## Usage
### GitHub API
You have to provide your own GitHub API token in order to execute queries.
1. Clone the repository
2. Write a custom api-config containing your token (see ./github/endpoint/config/github_config.yaml)
3. Add the path to the RepoListQueryCaller configuration

### Repository list
The expected format for a list of repositories is als follows:
```JSON
[
  {"repoName": "${nameWithOwner}"},
  {"repoName": "${nameWithOwner1}"}
]
```

> You can set a custom attribute name via the config
>> config = {propertyName: 'repo_name'}

### Execution
To execute a query, simply call the following code:
```javascript
const config = {}
const endpointPromise = RepoListQueryCaller.execute(new QueryTypeInstance(), 'RepositoryLisLocation', config);
endpointPromise.then(console.timeEnd('ExecutionTimer'))
               .catch(err => console.error('Error during execution start. ' + err));
```

### Configuration
Possible configuration possibilities:

- `apiConfigLocation`: Location of the api config containing the github api_token and endpoint 
- `propertyName`: Name of the property form the repository names input list
- `separationSize`: Number where the array is separated
- `outputDirPath`: Path to the directory where the output files should be written
- `commitThreshold`: Number of commits which can be kept in memory without saving to files

### QueryTypes
Defined query types can be used to be executed.
New query can be created used classes, which extend the class QueryType and overwrite its methods.