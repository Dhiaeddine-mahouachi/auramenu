export default {
  key:'pop',
  defaults:{
    primary:'#8d271a', secondary:'#e5ab4e', background:'#fff5df',
    text:'#302116', accent:'#bb3d24', heading:'condensed', body:'sans', radius:4,
  },
  layout:({header,browse}) => [header('split'),browse({nav:'ribbon',type:'gallery'})],
};
