define(['gmaps', 'jquery', 'backbone', 'underscore', 'trello'],
  function(gmaps, $, Backbone, _, Trello ){

  var customMapType = new google.maps.StyledMapType([{
    stylers: [
      { hue: '#ff5252' },
      { visibility: 'simplified' },
      { saturation: -75 },
      { weight: 0.4 }
    ]
  }], {name: 'Trello'});
  

  var mapOptions = {
    center: { lat: -34.397, lng: 150.644},
    zoom: 8,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'trello']
    },
    mapTypeId: 'trello',
    mapTypeControl: false
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  map.mapTypes.set('trello', customMapType);
  map.setMapTypeId('trello');

  return {
    'map': map
  }
})