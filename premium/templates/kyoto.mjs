import { opening } from '../layout.mjs';

export default {
  key:'kyoto',
  tier:'premium',
  defaults:{
    primary:'#454C39',secondary:'#727D63',background:'#DDD5C6',
    text:'#262923',accent:'#7C5539',heading:'serif',body:'sans',radius:0,
  },
  layout:api=>[
    opening(api,'asymmetric'),
    api.browse({nav:'index',type:'quiet',numbered:true})
  ].filter(Boolean),
};
