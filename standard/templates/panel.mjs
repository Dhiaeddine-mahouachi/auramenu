export default {
  key:'panel',
  defaults:{
    primary:'#1e4d45', secondary:'#a7c5bc', background:'#f4f8f6',
    text:'#1d322e', accent:'#9b5b41', heading:'sans', body:'sans', radius:9,
  },
  layout:({header,browse}) => [header('simple'),browse({nav:'side',type:'rail',behavior:'filter',search:true})],
};
