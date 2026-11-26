import { opening, spotlight } from '../layout.mjs';

export default {
  key:'exhibition',
  tier:'premium',
  cutout:true,
  defaults:{
    primary:'#6C4E36',secondary:'#B18B60',background:'#E9E2D5',
    text:'#30281F',accent:'#6C4E36',heading:'editorial',body:'serif',radius:2,
  },
  layout:api=>[
    opening(api,'atrium','plinth'),
    spotlight(api,'pedestal'),
    api.browse({nav:'plates',type:'pedestal'})
  ].filter(Boolean),
};
