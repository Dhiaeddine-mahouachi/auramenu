export default {
  key:'royal',
  defaults:{
    primary:'#245340', secondary:'#b9a071', background:'#f9f3e4',
    text:'#26382b', accent:'#9b7144', heading:'editorial', body:'sans', radius:7,
  },
  layout:({header,browse}) => [header('arch'),browse({nav:'ribbon',type:'portrait',behavior:'filter'})],
};
