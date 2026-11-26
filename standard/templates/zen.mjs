export default {
  key:'zen',
  defaults:{
    primary:'#333e37', secondary:'#c7c9be', background:'#f7f8f4',
    text:'#212720', accent:'#747654', heading:'sans', body:'sans', radius:3,
  },
  layout:({header,browse}) => [header('simple'),browse({nav:'index',type:'ledger',action:'inline',search:true})],
};
