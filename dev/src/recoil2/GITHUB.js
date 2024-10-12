import * as recoil from 'recoil';

// import sogh from '../manegers/sogh.js';

export const GITHUB_AUTH = recoil.atom({
    key: "GITHUB_AUTH",
    default: null,
});

export const UPDATE_SOGH = recoil.atom({
    key: "GITHUB_UPDATE_SOGH",
    default: null,
});
