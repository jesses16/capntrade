// Client-side JavaScript, bundled and sent to client.

// Define Minimongo collections to match server/publish.js.
Goals = new Meteor.Collection("goals");

if (Meteor.isClient) {
  Template.home.subtitle = function () {
    return "Create or modify your goals below.";
  };

  Template.home.greeting = function() {
    return "Welcome to CapNTrade!";
  };

  Template.goals.myGoals = function() {
    return Goals.find();
  };

  Template.newGoal.pointOptions = function() {
    return [{pointValue:1},{pointValue:2},{pointValue:3},{pointValue:5},{pointValue:8}];
  };


  Template.newGoal.events({
    'click #shownewgoal' : function () {
      // template data, if any, is available in 'this'
      $('#newGoalDetails').toggle();
      $('#shownewgoal').toggle();
    },

    'click #creategoal' : function () {
      d = new Date();
      Goals.insert({
        name: $('#newGoalName').val(),
        startDate: d,
        points: $('input:radio[name=points]:checked').val()
      });

      $('#newGoalDetails').toggle();
      $('#shownewgoal').toggle();
    },

    'click #cancelgoal' : function () {
      $('#newGoalDetails').toggle();
      $('#shownewgoal').toggle();
    }
  });
}
