class RepositoryDescriptor {

    constructor(owner, name) {
        if (!owner || ! name) {
            throw new InvalidConstructorArgsException('This class needs an owner and name!');
        }
        this.owner = owner;
        this.name = name;
        this.displayOwner = owner.replace(/\W/g, '').replace(/^\d+/, '');
        this.displayName = name.replace(/\W/g, '');
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
}

class InvalidConstructorArgsException extends TypeError {
    constructor(message) {
        super();
        this.message = message;
    }

}

exports.RepositoryDescriptor = RepositoryDescriptor;

const logger = require('../LoggerProvider').getLogger(RepositoryDescriptor);
