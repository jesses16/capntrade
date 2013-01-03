// Goals -- {name: String,
//			 description: String,
//           points: Number,
//           owner: oid,
//			 coaches: [oid],
//           timestamp: Date}
Goals = new Meteor.Collection("goals");

// Comments -- {name: String,
//			 description: String,
//           points: Number,
//           user_id: Number,
//           timestamp: Date}
Goals = new Meteor.Collection("comments");

// Publish all items for requested list_id.
Meteor.publish('goals', function () {
  return Todos.find();
});

