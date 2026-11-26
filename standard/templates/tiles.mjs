export default {
  key:'tiles',
  defaults:{
    primary:'#575238', secondary:'#c8b27a', background:'#fffbef',
    text:'#343320', accent:'#a56b43', heading:'sans', body:'sans', radius:13,
  },
  layout:({header,tiles}) => [header('simple'),tiles()],
};
