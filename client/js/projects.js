
Session.setDefault('currentProject', null);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* projects
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.projects.helpers({
	project: function () {
		return Projects.find({}).fetch();
	},
	clients: function () {
		var clientColl = Clients.find({}).fetch();
		var namePluck = _.chain(clientColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	locations: function () {
		var locationColl = Locations.find({}).fetch();
		var namePluck = _.chain(locationColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	products: function () {
		var productColl = Products.find({}).fetch();
		var namePluck = _.chain(productColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	editProject: function () {
		return Projects.find({_id: Session.get('currentProject')}).fetch();
	},
	selectedProject: function () {
		return Session.equals('currentProject', this._id) ? 'selected' : '';
	}
});

// Events
Template.projects.events({
	'click .submit': function (evt, template) {
		var projectId = Projects.insert({
			name: template.find('#name').value,
			client: template.find('#client').value,
			EMEA: $('#EMEA').prop('checked'),
			APAC: $('#APAC').prop('checked'),
			Americas: $('#Americas').prop('checked'),
			location: template.find('#location').value,
			product: template.find('#product').value,
			createdBy: Meteor.userId(),
			createdByEmail: getUserEmail(),
			date: new Date,
		}, projectId);
		Histories.insert({
			projectId: projectId,
			name: template.find('#name').value,
			client: template.find('#client').value,
			EMEA: $('#EMEA').prop('checked'),
			APAC: $('#APAC').prop('checked'),
			Americas: $('#Americas').prop('checked'),
			location: template.find('#location').value,
			product: template.find('#product').value,
			createdBy: Meteor.userId(),
			createdByEmail: getUserEmail(),
			date: new Date,			
		}); 
		template.find('#name').value = '';
		template.find('#client').value = '';
		$('#EMEA').removeAttr('checked');
		$('#APAC').removeAttr('checked');
		$('#Americas').removeAttr('checked');
		template.find('#location').value = '';
		template.find('#product').value = '';
	},
	'click .save': function (evt, template) {
		var projectId = Projects.update(this._id, {
			name: template.find('#edname').value,
			client: template.find('#edclient').value,
			EMEA: $('#edEMEA').prop('checked'),
			APAC: $('#edAPAC').prop('checked'),
			Americas: $('#edAmericas').prop('checked'),
			location: template.find('#edlocation').value,
			product: template.find('#edproduct').value,
			createdBy: Meteor.userId(),
			createdByEmail: getUserEmail(),
			date: new Date,
		}, projectId);
		Histories.insert({
			projectId: this._id,
			name: this.name,
			client: this.client,
			EMEA: this.EMEA,
			APAC: this.APAC,
			Americas: this.Americas,
			location: this.location,
			product: this.product,
			createdBy: this.createdBy,
			createdByEmail: this.createdByEmail,
			date: this.date,			
		}); 
		template.find('#edname').value = '';
		template.find('#edclient').value = '';
		$('#edEMEA').removeAttr('checked');
		$('#edAPAC').removeAttr('checked');
		$('#edAmericas').removeAttr('checked');
		template.find('#edlocation').value = '';
		template.find('#edproduct').value = '';
	}, 
	'click .icon-trash': function (evt, template) {
		Projects.remove({_id: this._id});
	},
	'click .currentProject': function (evt, template) {
		Session.set('currentProject', this._id);
	}
});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Functions
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Handlebars.registerHelper("formatStandardDate", function(date) {
	return moment(date).format("MM/DD/YYYY");
});

Handlebars.registerHelper("listHistory", function(id) {
	return Histories.find({projectId: id}, {sort: {date: -1}}).fetch();
});


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