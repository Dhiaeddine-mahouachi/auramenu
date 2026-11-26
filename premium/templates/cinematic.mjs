import { opening, spotlight } from '../layout.mjs';

export default {
  key:'cinematic',
  tier:'premium',
  defaults:{
    primary:'#DD945A',secondary:'#593923',background:'#16120F',
    text:'#F7E7D7',accent:'#ECB281',heading:'condensed',body:'sans',radius:1,
  },
  layout:api=>[
    opening(api,'cinema'),
    spotlight(api,'film'),
    api.browse({nav:'reels',type:'film'})
  ].filter(Boolean),
};
