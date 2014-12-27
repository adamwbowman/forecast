

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
	'click .icon-trash': function (evt, template) {
		Projects.remove({_id: this._id});
	}
});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Functions
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Handlebars.registerHelper("formatStandardDate", function(date) {
	return moment(date).format("MM/DD/YYYY");
});

Handlebars.registerHelper("listHistory", function(id) {
	console.log(id);
	return Histories.find({projectId: id}).fetch();
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