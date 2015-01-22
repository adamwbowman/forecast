
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* request.js
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

Session.setDefault('currentId', null);
Session.setDefault('currentBooking', null);
Session.setDefault('toggleEditRequest', false);
Session.setDefault('calenderProduct', null);
Session.setDefault('isHidden', true);
Session.setDefault('calenderType', 'booking');
Session.setDefault('bookingsFilter', {});
Session.setDefault('requestsFilter', {bookingId: {$exists: false}});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */ 
Template.requests.helpers({
	request: function () {
		return Requests.find(Session.get('requestsFilter'), {sort: {'date': 1}}).fetch();
	},
	booking: function () {
		return Bookings.find(Session.get('bookingsFilter'), {sort: {'date': -1}}).fetch();
	},
	teammates: function () {
		var teammateColl = Teammates.find({}).fetch();
		var namePluck = _.chain(teammateColl).pluck('name').value();
		return JSON.stringify(namePluck);
	},
	selectedId: function () {
		return Session.equals('currentId', this._id) ? 'selected' : '';
	},
	isHidden: function () {
		if (Session.get('isHidden')) {
			return 'hidden'
		}
		return ''
	},
	editRequest: function () {
		return Requests.find({_id: Session.get('currentId')}).fetch();
	},
	toggleEditRequest: function () {
		return Session.get('toggleEditRequest');
	},
	selectedBooking: function () {
		return Session.equals('currentBooking', this._id) ? 'selected' : '';
	},
	history: function () {
		return Histories.find({requestId: Session.get('currentId')}, {sort: {'date': -1}}).fetch();
	}
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Events
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.requests.events({

// Requests
	'click .requestsAll': function (evt) {
		Session.set('requestsFilter', {bookingId: {$exists: false}, });
	},
	'click .requestsSV': function (evt) {
		Session.set('requestsFilter', {bookingId: {$exists: false}, product: 'SV'});
	},
	'click .requestsTSM': function (evt) {
		Session.set('requestsFilter', {bookingId: {$exists: false}, product: 'TSM'});
	},
	'click .requestsWBMS': function (evt) {
		Session.set('requestsFilter', {bookingId: {$exists: false}, product: 'WBMS'});
	},	


// Bookings
	'click .bookingsAll': function (evt) {
		Session.set('bookingsFilter', {});
	},
	'click .bookingsSV': function (evt) {
		Session.set('bookingsFilter', {product: 'SV'});
	},
	'click .bookingsTSM': function (evt) {
		Session.set('bookingsFilter', {product: 'TSM'});
	},
	'click .bookingsWBMS': function (evt) {
		Session.set('bookingsFilter', {product: 'WBMS'});
	},	


// Calendar
	'click .calendarBooking': function (evt) {
		Session.set('calenderType', 'booking');
	},
	'click .calendarRequest': function (evt) {
		Session.set('calenderType', 'request');
	},
	'click .calendarAll': function (evt) {
		Session.set('calenderProduct', '');
	},
	'click .calendarSV': function (evt) {
		Session.set('calenderProduct', 'SV');
	},
	'click .calendarTSM': function (evt) {
		Session.set('calenderProduct', 'TSM');
	},
	'click .calendarWBMS': function (evt) {
		Session.set('calenderProduct', 'WBMS');
	},
	'click .bookRequest': function (evt, template) {
		fillCalendar('booking', this.startDate, this.endDate, this.product);
		var BookingId = Bookings.insert({
			requestId: this._id,
			service: this.service,
			client: this.client,
			product: this.product,
			startDate: this.startDate,
			endDate: this.endDate,
			totalWorkDays: calcWorkingDays(this.startDate, this.endDate),
			description: this.description,
			teammate: this.teammate,
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
			totalWorkDays: calcWorkingDays(this.startDate, this.endDate),
			description: this.description,
			teammate: this.teammate,
			bookedBy: Meteor.userId(),
			bookedByEmail: getUserEmail(),
			date: new Date
		}}); 
		template.find('#teammate').value = '';
		Session.set('isHidden', true);
	},
	'click .review': function () {
		console.log('review ' + this._id);
	},
	'click .card': function (evt, template) {
		Session.set('showRequestDialog', true);
		Session.set('toggleEditRequest', true);
		Session.set('currentId', this._id);
	},
	'click .book': function (evt, template) {
		Session.set('currentBooking', this._id);
		Session.set('isHidden', false);
	},
	'click .cancel': function () {
		Session.set('currentBooking', null);
		Session.set('isHidden', true);
	},
	'click .deleteBooking': function () {
		removeCalendar(this.startDate, this.endDate, this.product);
		Bookings.remove({_id: this._id});
	}
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Rendered
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.requests.rendered = function() {

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


// Load Calendar
	var cal = new CalHeatMap();	
	cal.init({
		itemSelector: "#main-cal",
		domain: "month",
		subDomain: "x_day",
		start: new Date(2015, 0, 5),
		cellSize: 11,
		cellPadding: 1,
		domainGutter: 14,
		range: 12,
		verticalOrientation: false,
		domainDynamicDimension: false,
		displayLegend: false,
		domainLabelFormat: function(date) {
			moment.lang("en");
			return moment(date).format("MMMM").toUpperCase();
		},
		subDomainTextFormat: "%d",
		legend: [1, 3, 5, 7, 9]
	});

	var cal2 = new CalHeatMap();	
	cal2.init({
		itemSelector: "#second-cal",
		domain: "month",
		subDomain: "x_day",
		start: new Date(2015, 0, 5),
		cellSize: 11,
		cellPadding: 1,
		domainGutter: 14,
		range: 12,
		verticalOrientation: false,
		domainDynamicDimension: false,
		displayLegend: false,
		domainLabelFormat: '',
		legend: [1, 3, 5, 7, 9]
	});


// Track Map Data Changes
	var calData = Meteor.autorun( function () {
		var product = Session.get('calenderProduct');
		var type = Session.get('calenderType');
		if (type == 'booking') {
			var calendarColl = BookingCalendar.find().fetch();			
		}
		if (type == 'request') {
			var calendarColl = RequestCalendar.find().fetch();
 		}
 		var formattedColl = {};
		_.each(calendarColl, function (item) {
			if (product == 'SV') {
				formattedColl[item.date] = item.SV;	
			} else if (product == 'TSM') {
				formattedColl[item.date] = item.TSM;	
			} else if (product == 'WBMS') {
				formattedColl[item.date] = item.WBMS;	
			} else {
				formattedColl[item.date] = item.score;
			}
		});
		cal.update(formattedColl);
	});
// createCalendar('booking', dateToUnix('01/01/2015'), dateToUnix('01/31/2015'));
// createCalendar('request', dateToUnix('01/01/2015'), dateToUnix('01/31/2015'));
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Handlebar Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Handlebars.registerHelper("formatDate", function(date) {
	return moment.unix(date).format("MM/DD/YYYY");
});


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

var createCalendar = function (calendarType, startDate, endDate) {
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
			if (calendarType == 'booking') {
				BookingCalendar.insert({date: xxx});
			}
			if (calendarType == 'request') {
				RequestCalendar.insert({date: xxx});
			}
		}
		days -= 1;
		firstDate = firstDate.add(1, 'days');
	}
	if (calendarType == 'booking') {
		console.log('Booking Calendar created ' + BookingCalendar.find().count() + ' days.');
	}
	if (calendarType == 'request') {
		console.log('Request Calendar created ' + RequestCalendar.find().count() + ' days.');
	}
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

var removeCalendar = function (startDate, endDate, product) {
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
			var xxx = BookingCalendar.find({date: unixdate}).fetch();
			console.log(xxx[0]._id);
			console.log(xxx[0].score);
			console.log(xxx[0].score == 1);
			if (xxx[0].score == 1) {
				BookingCalendar.update(xxx[0]._id, {$unset: {score: ''}});				
			} else {
				BookingCalendar.update(xxx[0]._id, {$set: {score: -1}});				
			}
			if (product == 'SV') {
				if (xxx[0].SV == 1) {
					BookingCalendar.update(xxx[0]._id, {$unset: {SV: ''}});				
				} else {
					BookingCalendar.update(xxx[0]._id, {$set: {SV: -1}});				
				}	
			}
			if (product == 'TSM') {
				if (xxx[0].TSM == 1) {
					BookingCalendar.update(xxx[0]._id, {$unset: {TSM: ''}});				
				} else {
					BookingCalendar.update(xxx[0]._id, {$set: {TSM: -1}});				
				}	
			}
			if (product == 'WBMS') {
				if (xxx[0].WBMS == 1) {
					BookingCalendar.update(xxx[0]._id, {$unset: {WBMS: ''}});				
				} else {
					BookingCalendar.update(xxx[0]._id, {$set: {WBMS: -1}});				
				}	
			}
		}
		days -= 1;
		firstDate = firstDate.add(1, 'days');
	}
	console.log('count: ' + BookingCalendar.find().count() );
}