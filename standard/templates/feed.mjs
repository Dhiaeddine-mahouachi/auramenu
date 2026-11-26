export default {
  key:'feed',
  defaults:{
    primary:'#4a5531', secondary:'#bcad88', background:'#fcf9ef',
    text:'#2d3023', accent:'#95603f', heading:'sans', body:'sans', radius:14,
  },
  layout:({header,browse}) => [header('simple'),browse({type:'feed',action:'inline'})],
};
