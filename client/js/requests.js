
Session.setDefault('create', true);
Session.setDefault('book', false);
Session.setDefault('edit', false);
Session.setDefault('currentId', null);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* requests
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.requests.helpers({
	request: function () {
		return Requests.find({bookingId: {$exists: false}}, {sort: {'date': 1}}).fetch();
	},
	booking: function () {
		return Bookings.find({}, {sort: {'date': -1}}).fetch();
	},
	services: function () {
		var serviceColl = Services.find({}).fetch();
		var namePluck = _.chain(serviceColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	clients: function () {
		var clientColl = Clients.find({}).fetch();
		var namePluck = _.chain(clientColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	products: function () {
		var productColl = Products.find({}).fetch();
		var namePluck = _.chain(productColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	projects: function () {
		var projectColl = Projects.find({}).fetch();
		var namePluck = _.chain(projectColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	teammates: function () {
		var teammateColl = Teammates.find({}).fetch();
		var namePluck = _.chain(teammateColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	pageCreateState: function () {
		return Session.get('create');
	},
	pageBookState: function () {
		return Session.get('book');
	},
	pageEditState: function () {
		return Session.get('edit');
	},
	selectedId: function () {
		return Session.equals('currentId', this._id) ? 'selected' : '';
	},
	editRequest: function () {
		return Requests.find({_id: Session.get('currentId')}).fetch();
	},
	history: function () {
		return Histories.find({requestId: Session.get('currentId')}, {sort: {'date': -1}}).fetch();
	}
});

// Events
Template.requests.events({
	'click .createRequest': function (evt, template) {
		var startDate = template.find('#startDate').value;
		var endDate = template.find('#endDate').value;
		var RequestId = Requests.insert({
			service: template.find('#service').value,
			client: template.find('#client').value,
			product: template.find('#product').value,
			startDate: dateToUnix(startDate),
			endDate: dateToUnix(endDate),
			totalWorkDays: calcWorkingDays(dateToUnix(startDate), dateToUnix(endDate)),
			dayList: convertToDays(dateToUnix(startDate), dateToUnix(endDate)),
			description: template.find('#description').value,
			createdBy: Meteor.userId(),
			createdByEmail: getUserEmail(),
			date: new Date,
		}, RequestId);
		template.find('#service').value = '';
		template.find('#client').value = '';
		template.find('#product').value = '';
		template.find('#startDate').value = '';
		template.find('#endDate').value = '';
		template.find('#description').value = '';
	},
	'click .editRequest': function (evt, template) {
		var startDate = template.find('#startDate').value;
		var endDate = template.find('#endDate').value;
		Requests.update(this._id, {
			service: template.find('#service').value,
			client: template.find('#client').value,
			product: template.find('#product').value,
			startDate: dateToUnix(startDate),
			endDate: dateToUnix(endDate),
			totalWorkDays: calcWorkingDays(dateToUnix(startDate), dateToUnix(endDate)),
			dayList: convertToDays(dateToUnix(startDate), dateToUnix(endDate)),
			description: template.find('#description').value,
			createdBy: Meteor.userId(),
			createdByEmail: getUserEmail(),
			date: new Date,
		});
		Histories.insert({
			requestId: this._id,
			service: this.service,
			client: this.client,
			product: this.product,
			startDate: this.startDates,
			endDate: this.endDate,
			totalWorkDays: calcWorkingDays(dateToUnix(this.startDate), dateToUnix(this.endDate)), 
			dayList: convertToDays(dateToUnix(this.startDate), dateToUnix(this.endDate)),                  	
			description: this.description,
			createdBy: this.createdBy,
			createdByEmail: this.createdByEmail,
			date: this.date,			
		}); 
	},
	'click .bookRequest': function (evt, template) {
		var startDate = template.find('#startDate').value;
		var endDate = template.find('#endDate').value;	
		fillCalendar(dateToUnix(startDate), dateToUnix(endDate));
		var projectColl = Projects.find({'name': template.find('#project').value }).fetch();
		var projectId = _.chain(projectColl).pluck('_id').flatten().value();
		var BookingId = Bookings.insert({
			requestId: this._id,
			service: template.find('#service').value,
			client: template.find('#client').value,
			product: template.find('#product').value,
			startDate: dateToUnix(startDate),
			endDate: dateToUnix(endDate),
			totalWorkDays: calcWorkingDays(dateToUnix(startDate), dateToUnix(endDate)),
			dayList: convertToDays(dateToUnix(startDate), dateToUnix(endDate)),
			description: template.find('#description').value,
			projectId: projectId[0],
			project: template.find('#project').value,
			teammate: template.find('#teammate').value,
			bookedBy: Meteor.userId(),
			bookedByEmail: getUserEmail(),
			date: new Date,
		}, BookingId);
		Requests.update(this._id, {$set: {
			bookingId: BookingId,
			service: this.service,
			client: this.client,
			product: this.product,
			startDate: this.startDate,
			endDate: this.endDate,
			totalWorkDays: calcWorkingDays(dateToUnix(startDate), dateToUnix(endDate)),
			dayList: convertToDays(dateToUnix(startDate), dateToUnix(endDate)),
			description: this.description,
			project: template.find('#project').value,
			teammate: template.find('#teammate').value,
			bookedBy: Meteor.userId(),
			bookedByEmail: getUserEmail(),
			date: new Date
		}}); 
		template.find('#service').value = '';
		template.find('#client').value = '';
		template.find('#product').value = '';
		template.find('#startDate').value = '';
		template.find('#endDate').value = '';
		template.find('#description').value = '';
		template.find('#project').value = '';
		template.find('#teammate').value = '';
		Session.set('create', true);
		Session.set('book', false);
		Session.set('edit', false);
	},
	'click .card': function (evt, template) {
		Session.set('currentId', this._id);
		Session.set('create', false);
		Session.set('book', false);
		Session.set('edit', true);
	},
	'click .book': function (evt, template) {
		Session.set('currentId', this._id);
		Session.set('create', false);
		Session.set('book', true);
		Session.set('edit', false);
	},
	'click .deleteRequest': function (evt, template) {
		Requests.remove({_id: this._id});
		Session.set('create', true);
		Session.set('book', false);
		Session.set('edit', false);
	},
	'click .deleteBooking': function () {
		Bookings.remove({_id: this._id});
	}
});

Template.requests.rendered = function() {
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
// deleteCalendar();
// createCalendar(dateToUnix('01/01/2015'), dateToUnix('05/01/2015'));
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Functions
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Handlebars.registerHelper("formatDate", function(date) {
	return moment.unix(date).format("MM/DD/YYYY");
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
var dateToUnix = function (date) {
	if (date != '') {
		return moment(date).unix();
	}
}
var dateFromUnix = function (date) {
	if (date != '') {
		return moment.unix(date).format("MM/DD/YYYY");
	}
}
var calcWorkingDays = function (startDate, endDate) {
	var startDate = moment.unix(startDate);
	var endDate = moment.unix(endDate);
	var dateDiff = moment(endDate).diff(moment(startDate));
	var duration = moment.duration(dateDiff);
	var days = duration.asDays();
	days = (parseInt(days)+1);
	var firstDate = moment(startDate);
	var workDays = 0;
	while (days > 0) {
		if (firstDate.isoWeekday() !== 5 && firstDate.isoWeekday() !== 6) {
			workDays += 1;
		}
		days -= 1;
		firstDate = firstDate.add(1, 'days');
	}
	return workDays;
}
var convertToDays = function (startDate, endDate) {
	var startDate = moment.unix(startDate);
	var endDate = moment.unix(endDate);
	var dateDiff = moment(endDate).diff(moment(startDate));
	var duration = moment.duration(dateDiff);
	var days = duration.asDays();
	days = (parseInt(days)+1);
	var firstDate = moment(startDate);
	var workDays = [];
	while (days > 0) {
		if (firstDate.isoWeekday() !== 5 && firstDate.isoWeekday() !== 6) {
			workDays.push(moment(firstDate).format("MM/DD/YYYY"));
		}
		days -= 1;
		firstDate = firstDate.add(1, 'days');
	}
	return workDays;
}



var deleteCalendar = function () {
	var calendarColl = Calendar.find().fetch();
	_.each(calendarColl, function (item) {
		console.log(item._id);
		Calendar.remove({_id: item._id});
	});
	console.log('Calendar deleted, now has ' + Calendar.find().count() + 'days.');
}

var createCalendar = function (startDate, endDate) {
	var startDate = moment.unix(startDate);
	var endDate = moment.unix(endDate);
	var dateDiff = moment(endDate).diff(moment(startDate));
	var duration = moment.duration(dateDiff);
	var days = duration.asDays();
	days = (parseInt(days)+1);
	var firstDate = moment(startDate);
	var workDays = [];

	while (days > 0) {
		if (firstDate.isoWeekday() !== 5 && firstDate.isoWeekday() !== 6) {
			var xxx = moment(firstDate).unix();
			Calendar.insert({date: xxx});
		}
		days -= 1;
		firstDate = firstDate.add(1, 'days');
	}
	console.log('Calendar created ' + Calendar.find().count() + 'days.');
}


var fillCalendar = function (startDate, endDate) {
	var startDate = moment.unix(startDate);
	var endDate = moment.unix(endDate);
	var dateDiff = moment(endDate).diff(moment(startDate));
	var duration = moment.duration(dateDiff);
	var days = duration.asDays();
	days = (parseInt(days)+1);
	var firstDate = moment(startDate);
	while (days > 0) {
		if (firstDate.isoWeekday() !== 5 && firstDate.isoWeekday() !== 6) {
			var unixdate = moment(firstDate).unix()
			var xxx = Calendar.find({date: unixdate}).fetch();
			Calendar.update(xxx[0]._id, {$inc: {score: 1}});
		}
		days -= 1;
		firstDate = firstDate.add(1, 'days');
	}
}