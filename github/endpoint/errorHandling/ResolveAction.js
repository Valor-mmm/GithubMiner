const enumValue = (name, order) => Object.freeze({toString: () => name, order: order});

const ResolveAction = Object.freeze({
    PERSIST_ERROR: enumValue('ResolveAction.PERSIST_ERROR', 1),
    ABORT: enumValue('ResolveAction.ABORT', 2),
    SWITCH_API_TOKEN: enumValue('ResolveAction.SWITCH_API_TOKEN', 3),
    REPEAT: enumValue("ResolveAction.REPEAT", 4),
    RESOLVE: enumValue('ResolveAction.RESOLVE', 5),
    IGNORE: enumValue('ResolveAction.IGNORE', 6),

});

module.exports = ResolveAction;