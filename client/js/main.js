
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* main.js
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

Session.setDefault('showRequestDialog', false);


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Events
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Navbar
Template.navbar.events({
	'click .requestButton': function (evt) {
		// Router.go('/requests');
		Session.set('showRequestDialog', true);
	}
});


// Modals
Template.modals.helpers({
	showRequestDialog: function () {
		return Session.get('showRequestDialog');
	}
});