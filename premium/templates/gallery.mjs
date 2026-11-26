import { opening, galleryBrowse } from '../layout.mjs';

export default {
  key:'gallery',
  tier:'premium',
  defaults:{
    primary:'#514637',secondary:'#AA9E86',background:'#FAF7F0',
    text:'#272623',accent:'#514637',heading:'editorial',body:'sans',radius:0,
  },
  layout:api=>[
    opening(api,'plaque'),
    api.featured('portrait',item=>item.featured),
    galleryBrowse(api)
  ].filter(Boolean),
};
