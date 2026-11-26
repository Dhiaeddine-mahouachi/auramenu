import { opening, orbit } from '../layout.mjs';

export default {
  key:'atelier-orbit',
  tier:'premium',
  cover:false,
  defaults:{
    primary:'#BFE8A0',secondary:'#28433D',background:'#122520',
    text:'#EEFAE7',accent:'#BFE8A0',heading:'sans',body:'sans',radius:14,
  },
  layout:api=>[
    opening(api,'signal','rings'),
    orbit(api),
    api.browse({nav:'ribbon',type:'compact'})
  ].filter(Boolean),
};
