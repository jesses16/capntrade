// Goals -- {name: String,
//           points: Number,
//           user_id: Number,
//           timestamp: Date}
Goals = new Meteor.Collection("goals");

// Publish all items for requested list_id.
Meteor.publish('goals', function () {
  return Todos.find();
});

