
Session.setDefault('showRequestDialog', false);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* navbar
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Events
Template.navbar.events({
	'click .requestButton': function (evt) {
		// Router.go('/requests');
		Session.set('showRequestDialog', true);
	}
});

//////////////////////////////////////////////////////////////////////////////////
// Modals...
// Add Quesiton
Template.modals.helpers({
	showRequestDialog: function () {
		return Session.get('showRequestDialog');
	}
});

Template.add_request.events({
	'click .cancel': function (evt) {
		Session.set('showRequestDialog', false);
	}
});