
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* requests
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.requests.helpers({
	request: function () {
		return Requests.find().fetch();
	},
	services: function () {
		var serviceColl = Services.find({}).fetch();
		var namePluck = _.chain(serviceColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	clients: function () {
		var clientColl = Clients.find({}).fetch();
		var namePluck = _.chain(clientColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	products: function () {
		var productColl = Products.find({}).fetch();
		var namePluck = _.chain(productColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
});

// Events
Template.requests.events({
	'click .createRequest': function (evt, template) {
		var RequestId = Requests.insert({
			service: template.find('#service').value(),
			client: template.find('#client').value,
			product: template.find('#product').value,
			startDate: template.find('#startDate').value,
			endDate: template.find('#endDate').value,
			createdBy: Meteor.userId(),
			createdByEmail: getUserEmail(),
			date: new Date,
		}, RequestId);
		template.find('#client').value = '';
		template.find('#product').value = '';
		template.find('#startDate').value = '';
		template.find('#endDate').value = '';
	},
	'click .deleteRequest': function (evt, template) {
		Requests.remove({_id: this._id});
	}
});

Template.requests.rendered = function() {
	$('#startDate').datepicker({
		autoclose: true,
	    todayHighlight: true,
	    daysOfWeekDisabled: "0,6"
	});
	$('#endDate').datepicker({
		autoclose: true,
	    todayHighlight: true,
	    daysOfWeekDisabled: "0,6"
	});
}


//////////////////////////////////////////////////////////////////////////////////
// Methods...

// Using their Meteor userId, find their email address
var getUserEmail = function (item) {
	if (Meteor.user()) {
		var user = Meteor.user();
		return user.emails[0].address;
	} else {
		return 'anon'
	}
};