import { opening } from '../layout.mjs';

export default {
  key:'liquid',
  tier:'premium',
  defaults:{
    primary:'#22426A',secondary:'#8CAAEC',background:'#EDF2FF',
    text:'#1D2D46',accent:'#405EAC',heading:'sans',body:'sans',radius:24,
  },
  layout:api=>[
    opening(api,'glass'),
    api.browse({nav:'float',type:'glass'})
  ].filter(Boolean),
};
