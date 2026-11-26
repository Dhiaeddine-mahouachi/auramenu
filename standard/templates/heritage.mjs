export default {
  key:'heritage',
  defaults:{
    primary:'#57382d', secondary:'#be9870', background:'#f7efe1',
    text:'#37291f', accent:'#8f472f', heading:'serif', body:'sans', radius:1,
  },
  layout:({header,browse,featured}) => [header('masthead'),featured('feature'),browse({nav:'index',type:'ledger'})],
};
