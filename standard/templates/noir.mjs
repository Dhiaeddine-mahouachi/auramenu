export default {
  key:'noir',
  defaults:{
    primary:'#d5ad70', secondary:'#4d4740', background:'#201f1d',
    text:'#fff1df', accent:'#dfba81', heading:'serif', body:'sans', radius:7,
  },
  layout:({header,browse}) => [header('cover'),browse({nav:'ribbon',type:'row'})],
};
