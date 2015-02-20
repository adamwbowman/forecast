
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* client.js
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Server Methods
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Meteor.call('getJenkins', function (err, results) {
	Session.set('jobs', results.jobs)
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */ 
Template.client.helpers({
	monitored: function () {
		return Session.get('jobs');
	},
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
		var clientsColl = Clients.find({_id: this._id}).fetch();
		var followers = _.chain(clientsColl).pluck('followers').flatten().value();
		return followers.length;
	},
	views: function () {
		var clientsColl = Clients.find({_id: this._id}).fetch();
		return _.chain(clientsColl).pluck('views').flatten().value();
	},
});



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Events
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */ 
Template.client.events({
	'click .environmentcard': function () {
		console.log(this);
	},
	'click .addenvironmentcard': function () {
		console.log(this);
	},
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
Handlebars.registerHelper("formatName", function(name) {
	var arrName = name.split('_');
	return arrName[0]+'_'+arrName[1];
});