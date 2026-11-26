export default {
  key:'float',
  defaults:{
    primary:'#46466b', secondary:'#c1b7df', background:'#f5f3fc',
    text:'#2a2841', accent:'#775caa', heading:'sans', body:'sans', radius:23,
  },
  layout:({header,browse,featured}) => [header('simple'),featured('float'),browse({nav:'ribbon',type:'compact',behavior:'filter'})],
};
