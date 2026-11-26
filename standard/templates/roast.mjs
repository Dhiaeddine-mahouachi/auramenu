export default {
  key:'roast',
  defaults:{
    primary:'#5d3a2c', secondary:'#d1a57c', background:'#f7ecdc',
    text:'#38271d', accent:'#9a4f2e', heading:'editorial', body:'sans', radius:11,
  },
  layout:({header,browse,featured}) => [header('split'),featured('gallery'),browse({nav:'index',type:'compact'})],
};
