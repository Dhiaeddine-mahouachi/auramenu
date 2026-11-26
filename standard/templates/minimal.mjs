export default {
  key:'minimal',
  defaults:{
    primary:'#53462f', secondary:'#c8b798', background:'#fbf7ed',
    text:'#322a21', accent:'#927043', heading:'editorial', body:'sans', radius:2,
  },
  layout:({header,browse}) => [header('masthead'),browse({nav:'index',type:'ledger',action:'inline'})],
};
