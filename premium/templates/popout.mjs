import { opening, spotlight } from '../layout.mjs';

export default {
  key:'popout',
  tier:'premium',
  cover:false,
  cutout:true,
  defaults:{
    primary:'#451B11',secondary:'#F19158',background:'#FAE6CB',
    text:'#351B15',accent:'#8B251A',heading:'condensed',body:'sans',radius:4,
  },
  layout:api=>[
    opening(api,'impact','shape'),
    spotlight(api,'popout'),
    api.browse({nav:'blocks',type:'popout'})
  ].filter(Boolean),
};
