// Client-side JavaScript, bundled and sent to client.

// Define Minimongo collections to match server/publish.js.
Goals = new Meteor.Collection("goals");
Services = new Meteor.Collection("services");
FBData = new Meteor.Collection("fbdata");

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

  Template.FBPictureProfile.fb_data_image = function (coach_fb_id) {
	return FBData.findOne({ fb_id: coach_fb_id}).image_url;
  };

  Template.FBPictureProfile.fb_data_name = function (coach_fb_id) {
	return FBData.findOne({ fb_id: coach_fb_id}).full_name;
  };

  Template.myGoals.events({
    'click #newGoalButton' : function () {
      $('#newGoalForm').toggle();
    },

    'click #creategoal' : function () {
      d = new Date();
      

      $('#newGoalForm').toggle();

	  FB.ui({method: 'apprequests',
	  	message: 'Will you be my coach?',
	    title: 'Select a Coach',
		max_recipients: 1
	  }, function(FB_response) {
		console.log(FB_response);
	  	Goals.insert({
	        name: $('#newGoalForm #name').val(),
			description: $('#newGoalForm #description').val(),
			owner: Meteor.userId(),
	        startDate: d,
	        points: $('#newGoalForm #points').val(),
			coach_fb_id: FB_response && FB_response.to[0],
			coach_fb_request_id: FB_response && FB_response.request
	     });
	
		if (FB_response) {
			var fb_oauth_token = Meteor.user().services.facebook.accessToken
			FB.api('/' + FB_response.to[0] + '?access_token=' + fb_oauth_token + '&fields=name,id,picture', function(response) {
				fb_object = {
					fb_id: FB_response.to[0],
					image_url: response.picture.data.url,
					full_name: response.name
					};
				FBData.insert(fb_object);
			});
		}
	  });
    },

    'click #cancelgoal' : function () {
      $('#newGoalForm').toggle();
    }
  });
};
