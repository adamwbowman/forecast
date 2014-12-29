
Session.setDefault('currentTeammate', null);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* admin
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.teammates.helpers({
	teammate: function () {
		return Teammates.find({}, {sort: {name: 1}}).fetch();
	},
	selectedTeammate: function () {
		return Session.equals('currentTeammate', this._id) ? 'selected' : '';
	},
	currentTeammate: function () {
		var currentTeammate = Session.get('currentTeammate');
		return Teammates.find({_id: currentTeammate}).fetch();
	},
	products: function () {
		var productColl = Products.find({}).fetch();
		var namePluck = _.chain(productColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	locations: function () {
		var locationColl = Locations.find({}).fetch();
		var namePluck = _.chain(locationColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
});

// Events
Template.teammates.events({
	////////////////////////////////////////////////////////////////
	// Teammates
	// 'click .addTeammate': function (evt, template) {
	// 	var teammateName = template.find('.addTeammateInput').value;
	// 	if (teammateName.length > 0) {
	// 		Teammates.insert({name: teammateName});
	// 		template.find('.addTeammateInput').value = '';
	// 	}
	// 
	'click .save': function (evt, template) {
		var currentTeammate = Session.get('currentTeammate');
		Teammates.update(currentTeammate, {$set: {
			product: template.find('#product').value,
			location: template.find('#location').value,
		}});
		Session.set('currentTeammate', null);
		template.find('#product').value = '';
		template.find('#location').value = '';
	},
	'click .currentTeammate': function (evt, template) {
		Session.set('currentTeammate', this._id);
	},
	'click .deleteTeammate': function () {
		Teammates.remove({_id: this._id});
	}		
});