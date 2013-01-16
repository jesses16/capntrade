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

Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'services': 1, 'createdAt': 1}});
});