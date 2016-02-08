requirejs.config({
  'baseUrl': '/',
  'paths': {
    'app': 'app',
    // define vendor paths
    'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min',
    'backbone': 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
    'underscore': 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min',
    'trello': 'https://api.trello.com/1/client.js?key={{trello}}',
  },
  shim: {
  	trello: {
  		exports: 'Trello',
      deps: ['jquery']
  	}
  },
  urlArgs: "bust=" +  (new Date()).getTime()
});

// convert Google Maps into an AMD module
define('gmaps', ['async!https://maps.googleapis.com/maps/api/js?v=3.exp&key={{gmaps}}&sensor=false'],
function(){
    // return the gmaps namespace for brevity
    return window.google.maps;
});

requirejs(['app'])