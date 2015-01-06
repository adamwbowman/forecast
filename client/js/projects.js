
Session.setDefault('create', true);
Session.setDefault('edit', false);
Session.setDefault('currentProject', null);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* projects
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.projects.helpers({
	project: function () {
		return Projects.find({}, {sort: {'date': -1}}).fetch();
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
	service: function () {
		return Services.find({projectId: Session.get('currentProject')}).fetch();
	},
	editProject: function () {
		return Projects.find({_id: Session.get('currentProject')}).fetch();
	},
	selectedProject: function () {
		return Session.equals('currentProject', this._id) ? 'selected' : '';
	},
	isSV: function () {
		var thisProject = Projects.find({_id: this._id}).fetch();
		var project = _.chain(thisProject).pluck('product').value();
		if (project == 'Singleview') {
			return true;
		};
	},
	isWBMS: function () {
		var thisProject = Projects.find({_id: this._id}).fetch();
		var project = _.chain(thisProject).pluck('product').value();
		if (project == 'WBMS') {
			return true;
		};
	},
	isTSM: function () {
		var thisProject = Projects.find({_id: this._id}).fetch();
		var project = _.chain(thisProject).pluck('product').value();
		if (project == 'TSM') {
			return true;
		};
	},
	pageCreateState: function () {
		return Session.get('create');
	},
	pageEditState: function () {
		return Session.get('edit');
	},
	history: function () {
		return Histories.find({projectId: Session.get('currentProject')}, {sort: {'date': -1}}).fetch();
	}
});

// Events
Template.projects.events({
	'click .createProject': function (evt, template) {
		Projects.insert({
			name: template.find('#name').value,
			client: template.find('#client').value,
			EMEA: $('#EMEA').prop('checked'),
			APAC: $('#APAC').prop('checked'),
			Americas: $('#Americas').prop('checked'),
			location: template.find('#location').value,
			product: template.find('#product').value,
			description: template.find('#description').value,
			detail: template.find('#detail').value,
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
	'click .editProject': function (evt, template) {
		Projects.update(this._id, {
			name: template.find('#name').value,
			client: template.find('#client').value,
			EMEA: $('#EMEA').prop('checked'),
			APAC: $('#APAC').prop('checked'),
			Americas: $('#Americas').prop('checked'),
			location: template.find('#location').value,
			product: template.find('#product').value,
			description: template.find('#description').value,
			detail: template.find('#detail').value,
			createdBy: Meteor.userId(),
			createdByEmail: getUserEmail(),
			date: new Date,
		});
		Histories.insert({
			projectId: this._id,
			name: this.name,
			client: this.client,
			EMEA: this.EMEA,
			APAC: this.APAC,
			Americas: this.Americas,
			location: this.location,
			product: this.product,
			description: this.description,
			detail: this.detail,
			createdBy: this.createdBy,
			createdByEmail: this.createdByEmail,
			date: this.date,			
		}); 
	}, 
	'click .card': function (evt, template) {
		Session.set('currentProject', this._id);
		Session.set('create', false);
		Session.set('edit', true);
	},
	'click .deleteProject': function () {
		Projects.remove({_id: this._id});
		Session.set('create', true);
		Session.set('edit', false);
	}
});

Template.projects.rendered = function() {
	$('#startDate').datepicker({
		autoclose: true,
	    todayHighlight: true,
	    daysOfWeekDisabled: "0,6"
	});
	$('#endDate').datepicker({
		autoclose: true,
	    todayHighlight: true,
	    daysOfWeekDisabled: "0,6"
	});
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Functions
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Handlebars.registerHelper("formatStandardDate", function(date) {
	return moment(date).format("MM/DD/YYYY");
});

Handlebars.registerHelper("listHistory", function(id) {
	return Histories.find({projectId: id}, {sort: {date: -1}}).fetch();
});

Handlebars.registerHelper("listService", function(id) {
	return Services.find({projectId: id}, {sort: {date: -1}}).fetch();
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