define(['gmaps', 'jquery', 'backbone', 'underscore', 'mapcontrol'],
  function(gmaps, $, Backbone, _, MapControl){
  var listPosSort = function(a, b) {
    if (a.get('list').pos == b.get('list').pos)
     return 0; 
    else if (a.get('list').pos < b.get('list').pos)
     return -1;
    else 
      return 1;
  }

  var Card = Backbone.Model.extend({
    initialize: function(){
      //console.log(this.attributes)
      if (typeof this.attributes.attachments[0] != 'undefined' 
              && typeof this.attributes.attachments[0].previews != 'undefined'
              && this.attributes.attachments[0].name.search(/(png|jpg)$/) > -1) {
        this.set({
          'thumbnail': this.attributes.attachments[0].previews[3].url,
          'aspectRatio': this.attributes.attachments[0].previews[3].width / this.attributes.attachments[0].previews[3].height
        })

      console.log(this.attributes.attachments[0].previews[3].width / this.attributes.attachments[0].previews[3].height)
      }
      else this.set('thumbnail', '')
    }
  })

  var CardList = Backbone.Collection.extend({
    model: Card,
    comparator: listPosSort
  })

  var CardView = Backbone.View.extend({
    tagName: 'div',
    className: 'card',
    template: _.template($('#card-tmpl').html()),
    events: {
      // 'click .list': 'filterBy',
      // 'click .label': 'filterBy'
    },
    initialize: function(){
      var self = this
      var marker = this.model.get('marker')

      google.maps.event.addListener(marker, 'mouseover', function() {
        self.$el.addClass('hover')
        self.el.style['transition-delay'] = 0
      });

      google.maps.event.addListener(marker, 'mouseout', function() {
        
        self.$el.removeClass('hover')
      });
    },
    render: function(){

      this.$el.html(this.template({card: this.model.attributes}));

      return this
    }
  })

  var CardListView = Backbone.View.extend({
    el: '#card-list-container',
    initialize: function(){
      this.render()
    },
    events: {
      'click .label': 'filterBy',
      'click .list': 'filterBy',
      'click .reset': 'reset'
    },
    reset: function(){
      if (typeof this.filtered != 'undefined') {
        this.filtered.remove()
        this.render()
      }
      this.$el.removeClass('filtered')

      var bounds = new google.maps.LatLngBounds();
      
      this.collection.forEach(function(card) {
        bounds.extend(card.get('marker').getPosition());
      });
      MapControl.map.fitBounds(bounds);
    },
    filterBy: function(e){

      var sameArray = function(arr1, arr2){
        var diff1 = _.difference(arr1, arr2 )
        var diff2 = _.difference(arr2, arr1)
        
        var is_same = (diff1.length == diff2.length) && diff1.every(function(element, index) {
            return element === diff2[index]; 
        });
        return is_same
      }

      filtered = []

      if (typeof e.type != 'undefined' && e.type == 'click') {
        var $target = $(e.target)

        if ($target.hasClass('label')) {
          
          _label = $target.data('label-color')
          filtered = this.collection.filter(function(card){
            
            if (card.get('labels').length) {
              return card.get('labels').some(function(label){
                if (label.color == _label){
                  return true
                }
              })
            }
          })
        }
        else if ($target.hasClass('list')) {
          _list = $target.data('list-id')
          var filtered = this.collection.filter(function(card){
            return card.get('idList') == _list
          })
          if (filtered.length > 1 && filtered.length < 8) {
            var directionsRequest = {}
            var origin, dest
            var waypoints = []
            filtered.forEach(function(card, i) {
               if (i == 0) {
                origin = filtered[i].get('marker').getPosition()
              } else if (i == filtered.length - 1) {
                dest = filtered[i].get('marker').getPosition()
              } else {
                waypoints.push({location: filtered[i].get('marker').getPosition()})
              }
            })
            directionsRequest = {
              origin: origin,
              waypoints: waypoints,
              destination: dest,
              optimizeWaypoints: true,
              travelMode: google.maps.TravelMode.WALKING
            }
            console.log(directionsRequest)
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var directionsService = new google.maps.DirectionsService();
            directionsDisplay.setMap(MapControl.map);

            directionsService.route(directionsRequest, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                //directionsDisplay.setDirections(response);
                console.log(response)
              }
            });

          }
        }
        else 
          return false
      }
      else {

        filtered = this.collection.filter(function(card){
          return e.bounds.contains(card.get('marker').getPosition())
        })
        var is_same = false

        if (typeof this.filtered != 'undefined') {
          is_same = sameArray(this.filtered.collection.toArray(), filtered)

          if (!is_same) {
            this.filtered.$el.empty()
          } else {
            return false
          }
        }

        filtered = new CardList(filtered)
        this.filtered = new CardFilterView({collection: filtered})
        return true
      }

      filtered = new CardList(filtered)

      this.filtered = new CardFilterView({collection: filtered})
      this.$el.addClass('filtered')        

      var bounds = new google.maps.LatLngBounds();
      this.filtered.collection.forEach(function(card) {
        var marker = card.get('marker')
        bounds.extend(marker.getPosition())
      })
      MapControl.map.fitBounds(bounds);   

    },
    render: function(){
      
      var self = this
      var output = this.$el.append('<div class="card-list"/>').find('.card-list')
      
      output.empty()

      CardRenderer(this.collection, output)

    }
  })

  var CardFilterView = Backbone.View.extend({
    el: '.card-list',
    initialize: function(){
      this.render()
    },
    render: function(){
      
      var self = this
      var output = this.$el

      output.empty()

      CardRenderer(this.collection, output)

    }
  })

  var CardRenderer = function(collection, output){
    collection.forEach(function(card, i){
      var cardview = new CardView({model: card})
      cardview.render()
      cardview.el.style['transition-delay'] = (i*.05)+ 's'
      output.append(cardview.$el)
      cardview.el.style.margin = '0'
      cardview.el.style.opacity = '.5'
      window.getComputedStyle(cardview.el).margin;
      cardview.el.style.margin = '0 0 8px 0'
      cardview.el.style.opacity = '1'
    })

  }


  var Member = Backbone.Model.extend()

  var MemberView = Backbone.View.extend({
    template: _.template($('#member-tmpl').html()),
    el: '.modal-content',
    events: {
      'click .board': 'selectBoard'
    },
    selectBoard: function(e){
      console.log(e)
      $('.modal-overlay').hide()
      // $("#output").empty();
      var board_id = $(e.target).data('board-id')

      Trello.get('boards/' + board_id + '/', {card_attachments: 'cover', cards:'all', lists: 'all', list_fields: ['id','pos','name']}, function(board) {
        var cards = new CardList()
        
        
        board.cards.forEach(function(card,i){

          var matches = card.desc.match(/geo:(-?[\d\.]+),(-?[\d\.]+)/i)

          if (matches == null || matches.length < 1 || card.closed == true)
            return false

          var myLatlng = new google.maps.LatLng(matches[1],matches[2]);

          var icon = ''

          if (typeof card.attachments[0] != 'undefined' 
              && typeof card.attachments[0].previews != 'undefined'
              && card.attachments[0].name.search(/(png|jpg)$/) > -1) {
            icon = {
              url: card.attachments[0].previews[3].url,
              size: new google.maps.Size(32, 32),
              scaledSize: new google.maps.Size(32, 32)}
          } else 
            icon = {path: google.maps.SymbolPath['CIRCLE'], scale: 10, strokeWeight: 0, fillColor: '#ff5252', fillOpacity: .8}

          var marker = new google.maps.Marker({
            position: myLatlng,
            map: MapControl.map,
            title: card.name,
            icon: icon
          });

          // MapControl.map.setCenter(myLatlng)

          var labels = ''
          if (card.labels && card.labels.length > 0) {
            card.labels.forEach(function(label){
              labels += label.name
            })
          }
          var card = new Card(card)
          card.set('marker', marker)

          board.lists.forEach(function(list){
            if (list.id == card.get('idList')) {
              card.set('list', list)             
            }
          })

          cards.add(card)

        })

        console.log(cards)

        var points = []
        cards.forEach(function(card){
          var marker = card.get('marker')
          points.push(marker.getPosition())
        })

        var bounds = new google.maps.LatLngBounds();
        points.forEach(function(latLng) {
          bounds.extend(latLng);
        });
        MapControl.map.fitBounds(bounds);   

        cardlist = new CardListView({collection: cards})
        console.log(cardlist)
        var _buffer

        var filter = function(e){
          clearTimeout(_buffer)
          _buffer = setTimeout(function(){
            cardlist.filterBy({bounds: MapControl.map.getBounds()})
          }, 400)
        }

        google.maps.event.addListener(MapControl.map, 'dragend', filter)
        google.maps.event.addListener(MapControl.map, 'dblclick', filter);

      })

    },
    initialize: function(){
      this.render()
    },
    render: function(){
      console.log(this.model)
      this.$el.html((this.template({member: this.model.attributes})))

      var boards = new BoardList(this.model.attributes.boards)
      var boardsView = new BoardListView({collection: boards})
      this.$el.append(boardsView.el)      
    }
  })

  var Board = Backbone.Model.extend()

  var BoardList = Backbone.Collection.extend({
    model: Board
  })

  var BoardListView = Backbone.View.extend({
    template: _.template($('#boards-tmpl').html()),
    initialize: function(){
      this.render()
    },
    render: function(){
      console.log(this.collection)
      this.$el.html(this.template({boards: this.collection.models}))
      return this
    }
  })

  return {
    'CardList': CardList,
    'Card': Card,
    'CardView': CardView,
    'CardListView': CardListView,

    'Member': Member,
    'MemberView': MemberView,

    'Board': Board,
    'BoardList': BoardList,
    'BoardListView': BoardListView
  }
})