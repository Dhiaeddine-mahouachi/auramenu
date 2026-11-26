import { opening, studioNavigation } from '../layout.mjs';

export default {
  key:'studio',
  tier:'premium',
  cover:false,
  defaults:{
    primary:'#173CCE',secondary:'#5B71D6',background:'#F8F8F4',
    text:'#11141E',accent:'#173CCE',heading:'sans',body:'sans',radius:0,
  },
  layout:api=>[
    studioNavigation(api),
    opening(api,'grid','rules'),
    api.browse({nav:'matrix',type:'studio',numbered:true})
  ].filter(Boolean),
};
