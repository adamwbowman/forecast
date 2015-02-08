
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* clients.js
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

Session.setDefault('create', true);
Session.setDefault('edit', false);
Session.setDefault('currentClient', null);


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */ 
Template.clients.helpers({
	client: function () {
		return Clients.find({}, {sort: {'name': 1}}).fetch();
	},
	locations: function () {
		var locationColl = Locations.find({}).fetch();
		var namePluck = _.chain(locationColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	teammates: function () {
		var teammateColl = Teammates.find({}).fetch();
		var namePluck = _.chain(teammateColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	editClient: function () {
		return Clients.find({_id: Session.get('currentClient')}).fetch();
	},
	selectedProject: function () {
		return Session.equals('currentClient', this._id) ? 'selected' : '';
	},
	isSV: function () {
		if (_.contains(this.products, 'SV')) {
			return 'active' 
		}
	},
	isWBMS: function () {
		if (_.contains(this.products, 'WBMS')) {
			return 'active' 
		}
	},
	isTSM: function () {
		if (_.contains(this.products, 'TSM')) {
			return 'active' 
		}
	},
	pageCreateState: function () {
		return Session.get('create');
	},
	pageEditState: function () {
		return Session.get('edit');
	},
	history: function () {
		return Histories.find({projectId: Session.get('currentClient')}, {sort: {'date': -1}}).fetch();
	}
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Events
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.clients.events({
	'click .createClient': function (evt, template) {
		var coll = $('.btn-group .active');
		var products = [];
		_.each(coll, function (item) {
			products.push(item.value);
		});
		Clients.insert({
			name: template.find('#name').value,
			location: template.find('#location').value,
			products: products,
			// region: $('.btn-group .active').value,
			lead: template.find('#lead').value,
			description: template.find('#description').value,
			development: [],
			followers: [],
			createdBy: Meteor.userId(),
			createdByEmail: getUserEmail(),
			date: new Date,
		});
		template.find('#name').value = '';
		template.find('#location').value = '';
		template.find('#lead').value = '';
		template.find('#description').value = '';
	},
	'click .editClient': function (evt, template) {
		var coll = $('.btn-group .active');
		var products = [];
		_.each(coll, function (item) {
			products.push(item.value);
		});
		Clients.update(this._id, {
			name: template.find('#name').value,
			location: template.find('#location').value,
			products: products,
			lead: template.find('#lead').value,
			description: template.find('#description').value,
			createdBy: Meteor.userId(),
			createdByEmail: getUserEmail(),
			date: new Date,
		});
		Histories.insert({
			clientId: this._id,
			name: this.name,
			location: this.location,
			products: this.products,
			lead: this.lead,
			description: this.description,
			createdBy: this.createdBy,
			createdByEmail: this.createdByEmail,
			date: this.date,			
		}); 
		template.find('#name').value = '';
		template.find('#location').value = '';
		template.find('#lead').value = '';
		template.find('#description').value = '';
		Session.set('create', true);
		Session.set('edit', false);
	}, 
	'click .card': function (evt, template) {
		Session.set('currentClient', this._id);
		Session.set('create', false);
		Session.set('edit', true);
	},
	'click .deleteClient': function () {
		Clients.remove({_id: this._id});
		Session.set('create', true);
		Session.set('edit', false);
	}
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Rendered
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.clients.rendered = function() {
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


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Handlebar Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Handlebars.registerHelper("formatStandardDate", function(date) {
	return moment(date).format("MM/DD/YYYY");
});

Handlebars.registerHelper("listHistory", function(id) {
	return Histories.find({projectId: id}, {sort: {date: -1}}).fetch();
});

Handlebars.registerHelper("listService", function(id) {
	return Services.find({projectId: id}, {sort: {date: -1}}).fetch();
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Functions
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// Using their Meteor userId, find their email address
var getUserEmail = function (item) {
	if (Meteor.user()) {
		var user = Meteor.user();
		return user.emails[0].address;
	} else {
		return 'anon'
	}
};