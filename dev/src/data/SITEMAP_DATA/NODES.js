import iHub from './NODES/iHub.js';
import SOGHNext_Github from './NODES/SOGHNext_Github.js';
import SOGHNext_Scrum from './NODES/SOGHNext_Scrum.js';

const SITEMAP_DATA_NODES = [
    ...iHub,
    ...SOGHNext_Github,
    ...SOGHNext_Scrum,
].reduce((ht,d)=> {
    ht[d.id] = d;
    return ht;
}, {});

export default SITEMAP_DATA_NODES;
