
Session.setDefault('currentClient', null);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* clients
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

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
	}
});

// Events
Template.admin.events({
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
	}
});