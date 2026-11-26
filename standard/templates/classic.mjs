export default {
  key:'classic',
  defaults:{
    primary:'#174c3b', secondary:'#b5d1bd', background:'#f7f8f2',
    text:'#18251e', accent:'#aa6635', heading:'sans', body:'sans', radius:9,
  },
  layout:({header,browse}) => [header('simple'),browse({type:'row',action:'inline'})],
};
