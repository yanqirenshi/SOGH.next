export function timestamp () {
    return new Date().toISOString();
}

export function applyCallback (payload, type, args=[]) {
    if (!payload
        || !payload.callbacks
        || !payload.callbacks[type])
        return;

    payload.callbacks[type].apply(args);
}

export function errorDefaultProcess (e) {
    console.error(e);

    return {
        data: null,
        error: e,
    };
}

export function nodes2ids (nodes, make) {
    const id_list = [];

    for (const node of nodes)
        id_list.push(node.id);

    return {
        data: id_list,
    };
}

export function node2id (node, make) {
    return {
        data: node.id,
    };
}
