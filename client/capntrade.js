// Client-side JavaScript, bundled and sent to client.

// Define Minimongo collections to match server/publish.js.
Goals = new Meteor.Collection("goals");
Services = new Meteor.Collection("services");

Meteor.autosubscribe(function () {
  Meteor.subscribe("userData");
});

if (Meteor.isClient) {

  Template.goals.myGoals = function() {
	if (Meteor.user()) {
    	return Goals.find({owner: Meteor.userId()});
	}
  };

  Template.coachedGoals.coachedGoalSet = function() {
	if (Meteor.user()) {
    	return Goals.find({ coaches: { $in:  [Meteor.userId()] }});
	}
  };

  Template.newGoal.pointOptions = function() {
    return [{pointValue:1},{pointValue:2},{pointValue:3},{pointValue:5},{pointValue:8}];
  };

  Template.myGoals.events({
    'click #newGoalButton' : function () {
      $('#newGoalForm').toggle();
      if (typeof FB != 'undefined') {
		var fb_oauth_token = Meteor.user().services.facebook.accessToken
		FB.api('/me/friends?access_token=' + fb_oauth_token + '&fields=name,id,picture', function(response) {
			var facebook_content = Template.friendList(response);
			$('#friendListModal').html(facebook_content);
		});
	  };
    },

	'click #FBFriendListButton' : function() {
		FB.ui({method: 'apprequests',
		    message: 'Will you be my coach?',
			title: 'Select a Coach',
			max_recipients: 1
		}, function(FB_response) {
			console.log("facebook response!!!");
			console.log(FB_response);
		});
	},

    'click #creategoal' : function () {
      d = new Date();
      Goals.insert({
        name: $('#newGoalForm #name').val(),
		description: $('#newGoalForm #description').val(),
		owner: Meteor.userId(),
        startDate: d,
        points: $('#newGoalForm #points').val()
      });

      $('#newGoalForm').toggle();
    },

    'click #cancelgoal' : function () {
      $('#newGoalForm').toggle();
    }
  });
};
