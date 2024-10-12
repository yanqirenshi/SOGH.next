import * as recoil from 'recoil';

import sogh from '../manegers/sogh.js';

export const getOrganaization = recoil.selectorFamily({
    key: 'VIWER',
    get: login => async () => {
        return await sogh.asyncFetchOrganaizationByLogin(login);
    },
});
