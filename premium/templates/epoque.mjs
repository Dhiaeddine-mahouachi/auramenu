import { opening } from '../layout.mjs';
import { premiumCopy } from '../copy.mjs';

export default {
  key:'epoque',
  tier:'premium',
  cover:false,
  defaults:{
    primary:'#792B32',secondary:'#9B8560',background:'#EDE0C5',
    text:'#29271F',accent:'#792B32',heading:'editorial',body:'serif',radius:0,
  },
  layout:api=>[
    opening(api,'book','engraving'),
    api.browse({nav:'book',type:'ledger',chapters:premiumCopy(api.menu.lang)})
  ].filter(Boolean),
};
