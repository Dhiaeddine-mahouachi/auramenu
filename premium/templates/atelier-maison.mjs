import { opening } from '../layout.mjs';

export default {
  key:'atelier-maison',
  tier:'premium',
  defaults:{
    primary:'#3B5143',secondary:'#AA9275',background:'#F2EFE7',
    text:'#20201E',accent:'#3B5143',heading:'editorial',body:'sans',radius:0,
  },
  layout:api=>[
    opening(api,'masthead'),
    api.browse({nav:'rail',type:'spread'})
  ].filter(Boolean),
};
