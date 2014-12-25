

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
			location: template.find('#location').value,
		});
		template.find('#name').value = '';
		template.find('#client').value = '';
		template.find('#location').value = '';
	},
	'click .icon-trash': function (evt, template) {
		Projects.remove({_id: this._id});
	}
});