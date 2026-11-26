import { opening, spotlight } from '../layout.mjs';
import { reality } from '../enhance.mjs';

export default {
  key:'reality',
  tier:'premium',
  cover:false,
  cutout:true,
  enhance:reality,
  defaults:{
    primary:'#84EAC7',secondary:'#345D59',background:'#101F25',
    text:'#E7F8F4',accent:'#84EAC7',heading:'mono',body:'sans',radius:4,
  },
  layout:api=>[
    opening(api,'instrument','graph'),
    spotlight(api,'instrument'),
    api.browse({nav:'console',type:'instrument',numbered:true})
  ].filter(Boolean),
};
