// Client-side JavaScript, bundled and sent to client.

// Define Minimongo collections to match server/publish.js.
Goals = new Meteor.Collection("goals");
Services = new Meteor.Collection("services");

Meteor.autosubscribe(function () {
  Meteor.subscribe("userData");
});

if (Meteor.isClient) {

	Meteor.callOnceOnClientLoad = function() {
		if (Session.get('activeFBRequestId')){
			return;
		};
		$(window).load(function(){
			var request_id = (RegExp('request_ids' + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
			if (request_id) {
				Session.set('activeFBRequestId', request_id);
				window.setTimeout( function() { $('#facebookRequestRedirectModal').modal(); }, 1000);
			}
		});
	}();
	
	Template.facebookRequestRedirectTemplate.requestInfo = function() {
		var requestResponse = []
		var FBRequestId = Session.get('activeFBRequestId');
		var request_goal = Goals.findOne({coach_fb_request_id: FBRequestId});
		if (request_goal) {
			var all_request_goals = Goals.find({coach_fb_id: request_goal.coach_fb_id})

			all_request_goals.forEach(function(goal) {
				user = Meteor.users.findOne({_id: goal.owner}).profile.name
				requestResponse.push( {
					playerName: user,
					goalName: goal.name
				});
			});
		}
		return requestResponse;
	  }
		
  Template.facebookRequestModalTemplate.requestInfo = function() {
	var requestResponse = []
	if (Meteor.user() && Meteor.user().services) {
		var userFacebookId = Meteor.user().services.facebook.id;
		var all_request_goals = Goals.find({coach_fb_id: userFacebookId})

		all_request_goals.forEach(function(goal) {
			user = Meteor.users.findOne({_id: goal.owner}).profile.name
			requestResponse.push( {
				playerName: user,
				goalName: goal.name
			});
		});
	}
	return requestResponse;
  }
	
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
	return 'http://graph.facebook.com/' + coach_fb_id + '/picture?type=square';
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
			
			if (FB_response) {
				var coach_name;
				var fb_oauth_token = Meteor.user().services.facebook.accessToken
				FB.api('/' + FB_response.to[0] + '?access_token=' + fb_oauth_token + '&fields=name,id,picture', function(response) {
					coach_name = response.name;
					
					Goals.insert({
				        name: $('#newGoalForm #name').val(),
						description: $('#newGoalForm #description').val(),
						owner: Meteor.userId(),
				        startDate: d,
				        points: $('#newGoalForm #points').val(),
						coach_fb_id: FB_response && FB_response.to[0],
						coach_fb_name: coach_name,
						coach_fb_request_id: FB_response && FB_response.request
				    });
				});
			}
	  });
    },

    'click #cancelgoal' : function () {
      $('#newGoalForm').toggle();
    }
  });
};
