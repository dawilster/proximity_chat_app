var pubnub = null;
var user_id = null;

$(document).ready(function () {
  promptForName();

  pubnub = PUBNUB.init({
      publish_key: 'pub-c-1b7921b2-907e-4b5a-9382-18df62d7b87f',
      subscribe_key: 'sub-c-1b737b8a-ebf3-11e4-bff8-02ee2ddab7fe'
  });

  $("#send").click(function(){
    message = $('#message').val();
    channel_name = "channel_" + $("#user_id").val();

    pubnub.publish({
      channel: channel_name,
      message: {message: message, user_name: $("#user_name").val(), type: "Message", user_id: $("#user_id").val()},
      callback: function(m){
        //reset message
        $('#message').val("");
      },
      error: function(){
        console.log("Something went wrong!");
      }
    });
  });

});

function promptForName(){
  if($("#user_name").val() === ""){
    while(person == null){
      var person = prompt("Please enter your name", "");
    }
    $("#name").text(person);
    $("#user_name").val(person);
  }

  getLocation();
}

function createUser(coords){

  $("#lat").text(coords.latitude);
  $("#lng").text(coords.longitude);

  $.ajax({
    url: "api/users/" + $("#user_id").val() + ".json",
    data: {user: {name: $("#user_name").val(), lat: coords.latitude, lng: coords. longitude}},
    method: "PUT",
    success: function(data){
      console.log("Updated user!");
    },
    fail: function(){

    }
  });
}

function subscribeToChannels(channels){
  this.channels = channels;

  pubnub.subscribe({
    channel: channels,
    message: function(message){
      if(message.type === "Message"){
        chatCallback(message)
      }else if(message.id != $("#user_id").val()){
        addAvatar(message.lat, message.lng);

        pubnub.subscribe({
          channel: "channel_" + message.id,
          callback: function(message){
            chatCallback(message);
          }
        })

        console.log("Someone else joined");
      }
    },
    error: function (error) {
      // Handle error here
      console.log(JSON.stringify(error));
    },
    connect: function(){
      $("#send").removeClass("disabled");
      $("#send").text("Send message");
    }
  });
}


function chatCallback(message){
  $("#chat_messsages").append("<li>" + message.user_name + " : " + message.message + "</li>")
}

function pingAllChannels(lat, lng){
  $("#ping_message").text(channels);

  $.each(channels, function( index, channel ) {
    pubnub.publish({
      channel: channel,
      message: {id: $("#user_id").val(), type: "Ping", lat: lat, lng: lng}
    });
  });
}

function fetchUserChannels(lat, lng){
  var channels = [];
  $.ajax({
    url: "api/users.json",
    data: {coordinates: {lat: lat, lng: lng}},
    success: function(data){
      $.map(data.users, function(user, i){
        channels.push("channel_" + user.id);
        addAvatar(user.lat, user.lng)
      });
      subscribeToChannels(channels);
      pingAllChannels(lat, lng); //Pings all other users subscribed to your channel
    },
    fail: function(){
      console.log("Couldn't fetch users");
    },
    complete: function(){

    }
  });
}