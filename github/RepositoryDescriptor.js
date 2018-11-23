const displayOwnerRegex = /(?:^\d+|\W)/g;
const displayNameRegex = /\W/g;

class RepositoryDescriptor {

    constructor(owner, name) {
        if (!owner || ! name) {
            throw new InvalidConstructorArgsException('This class needs an owner and name!');
        }
        this.owner = owner;
        this.name = name;
        this.displayOwner = owner.replace(displayOwnerRegex, '');
        this.displayName = name.replace(displayNameRegex, '');
    }

    static separateNameWithOwner(nameWithOwner) {
        if (!nameWithOwner) {
            throw new InvalidConstructorArgsException('This class needs a nameWithOwner!');
        }

        const separatedDescriptor = nameWithOwner.split('/');
        if (separatedDescriptor.length !== 2) {
            logger.error(`Splitting error! nameWithOwner: "${nameWithOwner}" result: ${separatedDescriptor}`);
            throw new InvalidConstructorArgsException('Invalid formatted nameWithOwner parameter!');
        }
        return separatedDescriptor;
    }

    getDisplayValue() {
        return `${this.displayOwner}_${this.displayName}`
    }

    getNameWithOwner() {
        return `${this.name}/${this.owner}`;
    }

    static getRepoDescrByNameWithOwner(nameWithOwner) {
        if (!nameWithOwner || !(typeof nameWithOwner === 'string')) {
            logger.error('Mandatory parameter nameWithOwner has to be a defined string.');
            return null;
        }

        const separation = RepositoryDescriptor.separateNameWithOwner(nameWithOwner);

        return new RepositoryDescriptor(separation[0], separation[1]);
    }
}

class InvalidConstructorArgsException extends TypeError {
    constructor(message) {
        super();
        this.message = message;
    }

}

exports.RepositoryDescriptor = RepositoryDescriptor;

const logger = require('../LoggerProvider').getLogger(RepositoryDescriptor);
