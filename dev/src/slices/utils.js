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

    for (const node of nodes) {
        const obj = make(node);

        id_list.push(node.id);
    }

    return {
        data: id_list,
    };
}

export function node2id (node, make) {
    const id_list = [];

    const obj = make(node);

    return {
        data: node.id,
    };
}
