
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* clients
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.admin.helpers({
	client: function () {
		return Clients.find({}, {sort: {name: 1}}).fetch();
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
	'click .currentClient': function () {
		Session.set('currentClient', this._id);
	},
	'click .deleteClient': function () {
		Clients.remove({_id: this._id});
	}
});