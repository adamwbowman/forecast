
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* modal.js
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */




/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */ 
Template.add_request.helpers({
	services: function () {
		var serviceColl = Services.find({}).fetch();
		var namePluck = _.chain(serviceColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	clients: function () {
		var clientColl = Clients.find({}).fetch();
		var namePluck = _.chain(clientColl).pluck('name').value();
		return JSON.stringify(namePluck);
	}
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Events
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.add_request.events({
	'click .createRequest': function (evt, template) {
		var startDate = template.find('#startDate').value;
		var endDate = template.find('#endDate').value;
		fillCalendar('request', dateToUnix(startDate), dateToUnix(endDate), product);
		var RequestId = Requests.insert({
			service: template.find('#service').value,
			client: template.find('#client').value,
			product: $('.btn-group .active').val(),
			startDate: dateToUnix(startDate),
			endDate: dateToUnix(endDate),
			totalWorkDays: calcWorkingDays(dateToUnix(startDate), dateToUnix(endDate)),
			description: template.find('#description').value,
			createdBy: Meteor.userId(),
			createdByEmail: getUserEmail(),
			date: new Date,
		}, RequestId);
		template.find('#service').value = '';
		template.find('#client').value = '';
		template.find('#startDate').value = '';
		template.find('#endDate').value = '';
		template.find('#description').value = '';
		Session.set('showRequestDialog', false);
	},
	'click .cancel': function (evt) {
		Session.set('showRequestDialog', false);
	}
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Rendered
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.add_request.rendered = function() {

// Date Picker
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
var getUserEmail = function (item) {
	if (Meteor.user()) {
		var user = Meteor.user();
		return user.emails[0].address;
	} else {
		return 'anon'
	}
}

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


var fillCalendar = function (calendarType, startDate, endDate, product) {
	var startDate = moment.unix(startDate);
	var endDate = moment.unix(endDate);
	var dateDiff = moment(endDate).diff(moment(startDate));
	var duration = moment.duration(dateDiff);
	var days = duration.asDays();
	days = (parseInt(days)+1);
	var firstDate = moment(startDate);
	while (days > 0) {
		if (firstDate.isoWeekday() !== 5 && firstDate.isoWeekday() !== 6) {
			var unixdate = moment(firstDate).unix();
			if (calendarType == 'booking') {
				var xxx = BookingCalendar.find({date: unixdate}).fetch();
				BookingCalendar.update(xxx[0]._id, {$inc: {score: 1}});
				if (product == 'SV') {
					BookingCalendar.update(xxx[0]._id, {$set: {SV: 1}});
				}
				if (product == 'TSM') {
					BookingCalendar.update(xxx[0]._id, {$set: {TSM: 1}});
				}
				if (product == 'WBMS') {
					BookingCalendar.update(xxx[0]._id, {$set: {WBMS: 1}});
				}
			}
			if (calendarType == 'request') {
				var xxx = RequestCalendar.find({date: unixdate}).fetch();
				RequestCalendar.update(xxx[0]._id, {$inc: {score: 1}});
				if (product == 'SV') {
					RequestCalendar.update(xxx[0]._id, {$set: {SV: 1}});
				}
				if (product == 'TSM') {
					RequestCalendar.update(xxx[0]._id, {$set: {TSM: 1}});
				}
				if (product == 'WBMS') {
					RequestCalendar.update(xxx[0]._id, {$set: {WBMS: 1}});
				}
			}
		}
		days -= 1;
		firstDate = firstDate.add(1, 'days');
	}
}