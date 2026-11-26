export default {
  key:'grid',
  defaults:{
    primary:'#243a2c', secondary:'#c1b397', background:'#fcf9f1',
    text:'#252b23', accent:'#b75e3a', heading:'sans', body:'sans', radius:14,
  },
  layout:({header,browse}) => [header('band'),browse({type:'gallery'})],
};
