
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* viewAll
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.viewAll.helpers({
	request: function () {
		return Bookings.find({projectId: this._id}).fetch();
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