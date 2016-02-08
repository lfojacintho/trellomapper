define(['jquery', 'backbone', 'underscore', 'trello', 'views', ],
  function($, Backbone, _, Trello, View ){

  var trello = function(){

    var logout = function() {
      Trello.deauthorize();
      //updateLoggedIn();
    };

    var setLoginStatus = function(resp){
      console.log('setLoginStatus')
      Trello.members.get("me", {boards: 'all', board_fields: 'name'}, function(member){
        console.log(member)

        var user = new View.Member(member)
        var memberView = new View.MemberView({model: user})

      },
      function(e){ //Error
        console.error(e.responseText)
        Trello.deauthorize();
      })
    }

    var isLoggedIn = function(){
      if (Trello.authorized()) {
        setLoginStatus()
      } else {
        //
        $('.modal-overlay').show()
        Trello.authorize({
          interactive:false,
          success: setLoginStatus,
          error: function(){
            console.log('fail')
          }
        });
      }
    }

    var init = function(){   
      isLoggedIn()
    }

    $('.button--connect').on('click', function(){
      Trello.authorize({
        type: "popup",
        success: setLoginStatus,
        expiration: '1day'
      })
    })

    $('#disconnect').on('click', function(){
      console.log('deauthorize')
      Trello.deauthorize()
      isLoggedIn()
    })

    return {
      'init': init,
      'setLoginStatus': setLoginStatus,
    }
  }()

  trello.init()

  $(window).on('keydown', function(e){
    console.log(e);
    if (e.keyCode == 32) {
      //$('.card-list').toggleClass('small')
    }

  })
})