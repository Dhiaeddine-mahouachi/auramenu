export default {
  key:'dolce',
  defaults:{
    primary:'#843d59', secondary:'#e6b8c3', background:'#fff5f6',
    text:'#492f3b', accent:'#a5506b', heading:'editorial', body:'sans', radius:24,
  },
  layout:({header,browse,featured}) => [header('simple'),featured('portrait', item => item.seasonal || item.featured),browse({nav:'index',type:'gallery'})],
};
