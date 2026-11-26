import { opening } from '../layout.mjs';

export default {
  key:'nouveau',
  tier:'premium',
  defaults:{
    primary:'#26483D',secondary:'#A78B50',background:'#F3E8D0',
    text:'#263C33',accent:'#613E50',heading:'editorial',body:'serif',radius:1,
  },
  layout:api=>[
    opening(api,'arch','botanical'),
    api.browse({nav:'chapters',type:'bento',numbered:true})
  ].filter(Boolean),
};
