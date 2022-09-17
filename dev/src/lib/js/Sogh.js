import Loader from './Loader.js';

import Pooler from './Pooler.js';

export default class Sogh extends Pooler {
    constructor () {
        super();
    }
    href (obj, to, data) {
        const x = {
            'project-next': '/projects-next/:id'
        };

        const base = x[to];
        const keys = Object.keys(data);

        return keys.reduce((str, key)=> {
            let out = str;

            if (key==='id') out = str.replaceAll(':id', obj.id());

            return out;
        }, base);
    }
}
