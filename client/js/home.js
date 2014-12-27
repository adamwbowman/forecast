
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* home
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.home.helpers({
	project: function () {
		return Projects.find({}, {limit: 3}).fetch();
	}
});

// Events
// Template.home.events({
// 	'click .addAnswer': function (evt) {
// 	}
// });