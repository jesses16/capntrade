// Goals -- {name: String,
//			 description: String,
//           owner: oid,
//			 startDate: date,
//           points: Number,
//			 coach_fb_id: Number,
//			 coach_fb_name: String,
//			 coach_fb_request_id: Number}
Goals = new Meteor.Collection("goals");

// Comments -- {name: String,
//			 description: String,
//           points: Number,
//           user_id: Number,
//           timestamp: Date}
Comments = new Meteor.Collection("comments");

Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'services': 1, 'createdAt': 1}});
});