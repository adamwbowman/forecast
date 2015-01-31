
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
	doesFollow: function () {
		var currentUser = Meteor.userId();
		var clientsColl = Clients.find({_id: this._id}).fetch();
		var followers = _.chain(clientsColl).pluck('followers').flatten().value();
		return ( _.contains(followers, currentUser) ) ? '' : '-empty';
	},
	followers: function () {
		return Clients.find({_id: this._id}).count();
	},
});



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Events
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */ 
Template.client.events({
	'click .teammate': function () {
		Router.go('/teammate/'+this.teammateId);
	},
	'click .follow': function () {
		var currentUser = Meteor.userId();
		var clientsColl = Clients.find({_id: this._id}).fetch();
		var followers = _.chain(clientsColl).pluck('followers').flatten().value();
		if (_.contains(followers, currentUser)) {
			Clients.update(this._id, {$pull: {followers: currentUser}});
		} else {
			Clients.update(this._id, {$push: {followers: currentUser}});
		}
	}
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
Handlebars.registerHelper("formatFollowers", function(followers) {
	return (followers > 1) ? ('followers') : ('follower');
});