
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* clients
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.admin.helpers({
	client: function () {
		return Clients.find({}).fetch();
	}
});

// Events
Template.admin.events({
	'click .addClient': function (evt) {
		var clientName = $('.addClientInput').val();
		if (clientName.length > 0) {
			Clients.insert({name: clientName});
			$('.addClientInput').val('');
		}
	},
	'click .currentClient': function () {
		Session.set('currentClient', this._id);
		Session.set('currentClientName', this.name);
	},
	'click .deleteClient': function () {
		Clients.remove({_id: this._id});
	}
});