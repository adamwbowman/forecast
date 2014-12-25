

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
		Projects.insert({
			name: template.find('#name').value,
			client: template.find('#client').value,
			EMEA: $('#EMEA').prop('checked'),
			APAC: $('#APAC').prop('checked'),
			Americas: $('#Americas').prop('checked'),
			location: template.find('#location').value,
			product: template.find('#product').value,
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