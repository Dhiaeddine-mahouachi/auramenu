import { opening } from '../layout.mjs';

export default {
  key:'gatsby',
  tier:'premium',
  cover:false,
  defaults:{
    primary:'#C4A064',secondary:'#203B35',background:'#111111',
    text:'#F1E8D5',accent:'#C4A064',heading:'condensed',body:'sans',radius:0,
  },
  layout:api=>[
    opening(api,'monument','deco'),
    api.browse({nav:'directory',type:'ledger',numbered:true})
  ].filter(Boolean),
};
