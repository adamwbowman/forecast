
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* viewAll
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.viewAll.helpers({
	request: function () {
		return Bookings.find({projectId: this._id}).fetch();
	},
	related: function () {
		console.log(this.client)
		return Projects.find({client: this.client, _id: {$not: this._id} }).fetch();
	}
});

// Events
// Template.viewAll.events({
// 	'click .addAnswer': function (evt) {
// 	}
// });

// Rendered
// Template.viewAll.rendered = function() {
// 	console.log('viewAll rendered');
// }; 