
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* client.js
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */ 
Template.client.helpers({
	areThereRequests: function () {
		var RequestsCount = Requests.find({client: this.name, bookingId: {$exists: false} }).count();	
		return (RequestsCount == 0) ? false : true;
	},
	currentRequest: function () {
		return Requests.find({client: this.name, bookingId: {$exists: false} }).fetch();
	},
	areThereBookings: function () {
		var BookingsCount = Bookings.find({client: this.name}).count();	
		return (BookingsCount == 0) ? false : true;
	},	
	currentBooking: function () {
		return Bookings.find({client: this.name}).fetch();
	},
	isSV: function () {
		return _.contains(this.products, 'SV');
	},
	isTSM: function () {
		return _.contains(this.products, 'TSM');
	},
	isWBMS: function () {
		return _.contains(this.products, 'WBMS');
	},
});



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Events
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */ 
Template.client.events({
	'click .teammate': function () {
		Router.go('/teammate/'+this.teammateId);
	},
});



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Handlebar Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Handlebars.registerHelper("formatDate", function(date) {
	return moment.unix(date).format("MM/DD/YYYY");
});
Handlebars.registerHelper("formatImgName", function(lead) {
	var xxx = lead.replace(' ', '');
	return xxx;
});
Handlebars.registerHelper("formatTotalDays", function(days) {
	return (days > 1) ? (days+' days') : (days+' day');
});