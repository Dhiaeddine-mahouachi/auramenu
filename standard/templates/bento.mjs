export default {
  key:'bento',
  defaults:{
    primary:'#244637', secondary:'#bdc9a2', background:'#f2f5e9',
    text:'#1b2b25', accent:'#aa412c', heading:'sans', body:'sans', radius:16,
  },
  layout:({header,browse}) => [header('split'),browse({nav:'ribbon',type:'bento'})],
};
