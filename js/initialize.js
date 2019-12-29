$(document).ready(function () {
  $('#fullpage').fullpage({
    navigation: true,
    fadingEffect: true,
    responsive: true,
    resize: true,
    menu: '#menu',
    anchors: ['why', 'how', 'what'],
    paddingTop: '70px'
  });
});