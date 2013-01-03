// Client-side JavaScript, bundled and sent to client.

// Define Minimongo collections to match server/publish.js.
Goals = new Meteor.Collection("goals");

if (Meteor.isClient) {

  Template.goals.myGoals = function() {
    return Goals.find({owner: Meteor.user()._id});
  };

  Template.coachedGoals.coachedGoalSet = function() {
    return Goals.find({ coaches: { $in:  [Meteor.user()._id] }});
  };

  Template.newGoal.pointOptions = function() {
    return [{pointValue:1},{pointValue:2},{pointValue:3},{pointValue:5},{pointValue:8}];
  };
	// 
	//   Template.newGoal.friendSet = function() {
	// console.log("getting friend list!");
	// if (typeof FB != 'undefined') {
	// 	console.log("2");
	// 	FB.api('/me', function(response) {
	// 		alert('Your name is ' + response.name);
	// 	});
	// };
	//   };

  Template.myGoals.events({
    'click #newGoalButton' : function () {
      // template data, if any, is available in 'this'
      $('#newGoalForm').toggle();
      if (typeof FB != 'undefined') {
		FB.api('/me', function(response) {
			// Template.friendSet({friends: [{name: response.name}] });
			//Meteor.render( Template.friendSet({friends: [{name: response.name}] }) );
//			console.log(Template.friendList({friends: [{name: response.name}] }));
//		    $('#FBFriendList').val(Template.friendList({friends: [{name: response.name}] }) );
			// 			  console.log("sadfasdf - " +  Template.friendSet({friends: [{name: response.name}] }) );
			// 			  return Template.alert({friends: [{name: response.name}] });
			// 			});
		});
	  };
    },

    'click #creategoal' : function () {
      d = new Date();
      Goals.insert({
        name: $('#newGoalForm #name').val(),
		description: $('#newGoalForm #description').val(),
		owner: Meteor.user()._id,
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
