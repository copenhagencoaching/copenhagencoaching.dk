$(document).ready(function () {
    $('#fullpage').fullpage({
      navigation: true,
      fadingEffect: true,
      responsive: true,
      resize: true,
      menu: '#menu',
		  anchors: ['home', 'why', 'how', 'what','contact'],
    });
  });