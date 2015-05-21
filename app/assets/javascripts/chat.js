var pubnub = null;
var user_id = null;
var uuids = [];
var users = [];

$(document).ready(function () {
  promptForName();

  pubnub = PUBNUB.init({
      publish_key: 'pub-c-1b7921b2-907e-4b5a-9382-18df62d7b87f',
      subscribe_key: 'sub-c-1b737b8a-ebf3-11e4-bff8-02ee2ddab7fe',
      uuid: $("#user_id").val()
  });

  $("#send").click(function(){
    sendMessage();
  });

  $('#form').submit(function(){
    sendMessage();
    return false;
  });

});

function sendMessage(){
  message = $('#message').val();
  channel_name = "channel_" + $("#user_id").val();
  $('#message').val("");
  $('#send').text("Sending...");
  $('#send').addClass("disabled");

  pubnub.publish({
    channel: channel_name,
    message: {message: message, user_name: $("#user_name").val(), type: "Message", user_id: $("#user_id").val()},
    callback: function(m){
      //reset message
      $('#send').text("Send message");
      $('#send').removeClass("disabled");

    },
    error: function(){
      console.log("Something went wrong!");
    }
  });
}

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

function hereNow(channels){
  $.each(channels, function( i, channel ) {
    asyncHereNow(channel, i);
  });
}

function asyncHereNow(channel, i){
  pubnub.here_now({
      channel : channel,
      callback : function(m){
        uuids = uuids.concat(m.uuids);
        //if last channels
        if(channels.length == (++i)){
          populateMapWithUsers(uuids);
        }
      }
  });
}

function populateMapWithUsers(uuids){
  active_users = $.grep(users, function(e){ return $.unique(uuids).indexOf(e.id.toString()) != -1; })
  $.map(active_users, function(user, i){
    addAvatar(user.id, user.name, user.lat, user.lng)
  });
}

function subscribeToChannels(channels){
  this.channels = channels;

  pubnub.subscribe({
    channel: channels,
    message: function(message){
      if(message.type == "Message"){
        chatCallback(message)
      }else if((message.id != $("#user_id").val()) && message.type == "Ping"){
        addAvatar(message.id, message.name, message.lat, message.lng); //check to see that user isn't already on the map
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
      hereNow(channels);
    }
  });
}


function chatCallback(message){
  if(message.message != null){
    $("#chat_messsages").prepend("<li>" + message.user_name + " : " + message.message + "</li>")
  }
}

function pingAllChannels(lat, lng){
  $("#ping_message").text(channels);

  $.each(channels, function( index, channel ) {
    pubnub.publish({
      channel: channel,
      message: {id: $("#user_id").val(), name: $("#user_name").val(), type: "Ping", lat: lat, lng: lng}
    });
  });
}

function fetchUserChannels(lat, lng){
  var channels = [];
  $.ajax({
    url: "api/users.json",
    data: {coordinates: {lat: lat, lng: lng}},
    success: function(data){
      users = data.users;
      $.map(data.users, function(user, i){
        channels.push("channel_" + user.id);
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