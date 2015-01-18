
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* admin.js
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

Session.setDefault('currentClient', null);
Session.setDefault('currentProduct', null);
Session.setDefault('currentLocation', null);
Session.setDefault('currentService', null);
Session.setDefault('currentTeammate', null);


////////////////////////////////////////////////////////////////
// Helpers
Template.admin.helpers({
	client: function () {
		return Clients.find({}, {sort: {name: 1}}).fetch();
	},
	selectedClient: function () {
		return Session.equals('currentClient', this._id) ? 'selected' : '';
	},
	product: function () {
		return Products.find({}, {sort: {name: 1}}).fetch();
	},
	selectedProduct: function () {
		return Session.equals('currentProduct', this._id) ? 'selected' : '';
	},
	location: function () {
		return Locations.find({}, {sort: {name: 1}}).fetch();
	},
	selectedLocation: function () {
		return Session.equals('currentLocation', this._id) ? 'selected' : '';
	},
	service: function () {
		return Services.find({}, {sort: {name: 1}}).fetch();
	},
	selectedService: function () {
		return Session.equals('currentService', this._id) ? 'selected' : '';
	},
	teammate: function () {
		return Teammates.find({}, {sort: {name: 1}}).fetch();
	},
	selectedTeammate: function () {
		return Session.equals('currentTeammate', this._id) ? 'selected' : '';
	},
});



////////////////////////////////////////////////////////////////
// Events
Template.admin.events({
	////////////////////////////////////////////////////////////
	// Clients
	'click .addClient': function (evt, template) {
		var clientName = template.find('.addClientInput').value;
		if (clientName.length > 0) {
			Clients.insert({name: clientName});
			template.find('.addClientInput').value = '';
		}
	},
	'keypress input.addClientInput': function (evt, template) {
		if (evt.which === 13) {
			var clientName = template.find('.addClientInput').value;
			if (clientName.length > 0) {
				Clients.insert({name: clientName});
				template.find('.addClientInput').value = '';
			}
		}
	},
	'keypress input.editClientInput': function (evt, template) {
		if (evt.which === 13) {
			var clientName = template.find('.editClientInput').value;
			if (clientName.length > 0) {
				Clients.update(this._id, {$set: {name: clientName}});
				Session.set('currentClient', null);
			}
		}
	},
	'click .currentClient': function (evt, template) {
		Session.set('currentClient', this._id);
	},
	'click .deleteClient': function () {
		Clients.remove({_id: this._id});
	},
	////////////////////////////////////////////////////////////
	// Products
	'click .addProduct': function (evt, template) {
		var productName = template.find('.addProductInput').value;
		if (productName.length > 0) {
			Products.insert({name: productName});
			template.find('.addProductInput').value = '';
		}
	},
	'keypress input.addProductInput': function (evt, template) {
		if (evt.which === 13) {
			var productName = template.find('.addProductInput').value;
			if (productName.length > 0) {
				Products.insert({name: productName});
				template.find('.addProductInput').value = '';
			}
		}
	},
	'keypress input.editProductInput': function (evt, template) {
		if (evt.which === 13) {
			var productName = template.find('.editProductInput').value;
			if (productName.length > 0) {
				Products.update(this._id, {$set: {name: productName}});
				Session.set('currentProduct', null);
			}
		}
	},
	'click .currentProduct': function (evt, template) {
		Session.set('currentProduct', this._id);
	},
	'click .deleteProduct': function () {
		Products.remove({_id: this._id});
	},
	////////////////////////////////////////////////////////////
	// Locations
	'click .addLocation': function (evt, template) {
		var locationName = template.find('.addLocationInput').value;
		if (locationName.length > 0) {
			Locations.insert({name: locationName});
			template.find('.addLocationInput').value = '';
		}
	},
	'keypress input.addLocationInput': function (evt, template) {
		if (evt.which === 13) {
			var locationName = template.find('.addLocationInput').value;
			if (locationName.length > 0) {
				Locations.insert({name: locationName});
				template.find('.addLocationInput').value = '';
			}
		}
	},
	'keypress input.editLocationInput': function (evt, template) {
		if (evt.which === 13) {
			var locationName = template.find('.editLocationInput').value;
			if (locationName.length > 0) {
				Locations.update(this._id, {$set: {name: locationName}});
				Session.set('currentLocation', null);
			}
		}
	},
	'click .currentLocation': function (evt, template) {
		Session.set('currentLocation', this._id);
	},
	'click .deleteLocation': function () {
		Locations.remove({_id: this._id});
	},
	////////////////////////////////////////////////////////////
	// Services
	'click .addService': function (evt, template) {
		var serviceName = template.find('.addServiceInput').value;
		if (serviceName.length > 0) {
			Services.insert({name: serviceName});
			template.find('.addServiceInput').value = '';
		}
	},
	'keypress input.addServiceInput': function (evt, template) {
		if (evt.which === 13) {
			var serviceName = template.find('.addServiceInput').value;
			if (serviceName.length > 0) {
				Services.insert({name: serviceName});
				template.find('.addServiceInput').value = '';
			}
		}
	},
	'keypress input.editServiceInput': function (evt, template) {
		if (evt.which === 13) {
			var serviceName = template.find('.editServiceInput').value;
			if (serviceName.length > 0) {
				Services.update(this._id, {$set: {name: serviceName}});
				Session.set('currentService', null);
			}
		}
	},
	'click .currentService': function (evt, template) {
		Session.set('currentService', this._id);
	},
	'click .deleteService': function () {
		Services.remove({_id: this._id});
	},
	////////////////////////////////////////////////////////////
	// Teammates
	'click .addTeammate': function (evt, template) {
		var teammateName = template.find('.addTeammateInput').value;
		if (teammateName.length > 0) {
			Teammates.insert({name: teammateName});
			template.find('.addTeammateInput').value = '';
		}
	},
	'keypress input.addTeammateInput': function (evt, template) {
		if (evt.which === 13) {
			var teammateName = template.find('.addTeammateInput').value;
			if (teammateName.length > 0) {
				Teammates.insert({name: teammateName});
				template.find('.addTeammateInput').value = '';
			}
		}
	},
	'keypress input.editTeammateInput': function (evt, template) {
		if (evt.which === 13) {
			var teammateName = template.find('.editTeammateInput').value;
			if (teammateName.length > 0) {
				Teammates.update(this._id, {$set: {name: teammateName}});
				Session.set('currentTeammate', null);
			}
		}
	},
	'click .currentTeammate': function (evt, template) {
		Session.set('currentTeammate', this._id);
	},
	'click .deleteTeammate': function () {
		Teammates.remove({_id: this._id});
	}		
});