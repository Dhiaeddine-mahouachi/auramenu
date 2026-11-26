import { opening } from '../layout.mjs';

export default {
  key:'retro-3d',
  tier:'premium',
  cover:false,
  cutout:true,
  defaults:{
    primary:'#EAD77D',secondary:'#783255',background:'#28172B',
    text:'#FFF0CF',accent:'#FFBD99',heading:'mono',body:'mono',radius:0,
  },
  layout:api=>[
    opening(api,'marquee','pixels'),
    api.browse({nav:'arcade',type:'arcade'})
  ].filter(Boolean),
};
