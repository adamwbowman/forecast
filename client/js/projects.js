

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* projects
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.projects.helpers({
	project: function () {
		return Projects.find({}).fetch();
	},
	clients: function () {
		var xxx = Clients.find({}).fetch();
		var zzz = _.chain(xxx).pluck('name').value();
		return JSON.stringify(zzz);
	},
	locations: function () {
		var xxx = Locations.find({}).fetch();
		var zzz = _.chain(xxx).pluck('name').value();
		return JSON.stringify(zzz);
	},
});

// Events
Template.projects.events({
	'click .submit': function (evt, template) {
		Projects.insert({
			name: template.find('#name').value,
		});
		template.find('#name').value = '';
	},
	'click .icon-trash': function (evt, template) {
		Projects.remove({_id: this._id});
	}
});