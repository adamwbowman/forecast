
Session.setDefault('create', true);
Session.setDefault('book', false);
Session.setDefault('edit', false);
Session.setDefault('currentId', null);
Session.setDefault('calenderProduct', null);
Session.setDefault('bookingsFilter', {});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* requests
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.requests.helpers({
	request: function () {
		return Requests.find({bookingId: {$exists: false}}, {sort: {'date': 1}}).fetch();
	},
	booking: function () {
		return Bookings.find(Session.get('bookingsFilter'), {sort: {'date': -1}}).fetch();
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
	},
	isSV: function () {
		if (this.product == 'SV') {
			return 'active' 
		}
	},
	isTSM: function () {
		if (this.product == 'TSM') {
			return 'active' 
		}
	},
	isWBMS: function () {
		if (this.product == 'WBMS') {
			return 'active' 
		}
	}
});

// Events
Template.requests.events({
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
	'click .createRequest': function (evt, template) {
		var startDate = template.find('#startDate').value;
		var endDate = template.find('#endDate').value;
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
	},
	'click .editRequest': function (evt, template) {
		var startDate = template.find('#startDate').value;
		var endDate = template.find('#endDate').value;
		Requests.update(this._id, {
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
		});
		Histories.insert({
			requestId: this._id,
			service: this.service,
			client: this.client,
			product: this.product,
			startDate: this.startDates,
			endDate: this.endDate,
			totalWorkDays: calcWorkingDays(dateToUnix(this.startDate), dateToUnix(this.endDate)), 
			description: this.description,
			createdBy: this.createdBy,
			createdByEmail: this.createdByEmail,
			date: this.date,			
		}); 
	},
	'click .bookRequest': function (evt, template) {
		var startDate = template.find('#startDate').value;
		var endDate = template.find('#endDate').value;
		var product = template.find('#product').value;
		fillCalendar(dateToUnix(startDate), dateToUnix(endDate), product);
		var projectColl = Projects.find({'name': template.find('#project').value }).fetch();
		var projectId = _.chain(projectColl).pluck('_id').flatten().value();
		var BookingId = Bookings.insert({
			requestId: this._id,
			service: template.find('#service').value,
			client: template.find('#client').value,
			product: product,
			startDate: dateToUnix(startDate),
			endDate: dateToUnix(endDate),
			totalWorkDays: calcWorkingDays(dateToUnix(startDate), dateToUnix(endDate)),
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
			description: this.description,
			project: template.find('#project').value,
			teammate: template.find('#teammate').value,
			bookedBy: Meteor.userId(),
			bookedByEmail: getUserEmail(),
			date: new Date
		}}); 
		template.find('#service').value = '';
		template.find('#client').value = '';
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
		removeCalendar(this.startDate, this.endDate, this.product);
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
	var cal = new CalHeatMap();	
	cal.init({
		itemSelector: "#example-g",
		domain: "month",
		subDomain: "x_day",
		start: new Date(2015, 0, 5),
		cellSize: 12,
		cellPadding: 1,
		domainGutter: 12,
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

	var calData = Meteor.autorun( function () {
		var product = Session.get('calenderProduct');
		var calendarColl = BookingCalendar.find().fetch();
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
// createCalendar(dateToUnix('01/01/2015'), dateToUnix('01/31/2015'));
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
	var calendarColl = BookingCalendar.find();
	_.each(calendarColl, function (item) {
		console.log(item._id);
		BookingCalendar.remove({_id: item._id});
	});
	console.log('Booking Calendar deleted, now has ' + BookingCalendar.find().count() + 'days.');
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
			BookingCalendar.insert({date: xxx});
		}
		days -= 1;
		firstDate = firstDate.add(1, 'days');
	}
	console.log('Booking Calendar created ' + BookingCalendar.find().count() + 'days.');
}

var fillCalendar = function (startDate, endDate, product) {
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
		days -= 1;
		firstDate = firstDate.add(1, 'days');
	}
	console.log('count: ' + BookingCalendar.find().count() );
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