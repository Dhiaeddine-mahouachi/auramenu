import { opening } from '../layout.mjs';
import { exploded } from '../enhance.mjs';

export default {
  key:'layers',
  tier:'premium',
  cover:false,
  cutout:true,
  enhance:exploded,
  defaults:{
    primary:'#23485F',secondary:'#7899A8',background:'#EAF2F2',
    text:'#182D3B',accent:'#29556C',heading:'mono',body:'sans',radius:2,
  },
  layout:api=>[
    opening(api,'schematic','graph'),
    api.browse({nav:'technical',type:'specimen',numbered:true})
  ].filter(Boolean),
};
