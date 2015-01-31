
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
	},
	editRequest: function () {
		return Requests.find({_id: Session.get('currentId')}).fetch();
	},
	toggleEditRequest: function () {
		return Session.get('toggleEditRequest');
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


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Events
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.add_request.events({
	'click .createRequest': function (evt, template) {
		var startDate = template.find('#startDate').value;
		var endDate = template.find('#endDate').value;
		var product = $('.btn-group .active').val();
		fillCalendar('request', dateToUnix(startDate), dateToUnix(endDate), product);
		var RequestId = Requests.insert({
			service: template.find('#service').value,
			client: template.find('#client').value,
			product: product,
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
	'click .editRequest': function (evt, template) {
		var startDate = template.find('#startDate').value;
		var endDate = template.find('#endDate').value;
		var product = $('.btn-group .active').val();
		Requests.update(this._id, {
			service: template.find('#service').value,
			client: template.find('#client').value,
			product: product,
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
		Session.set('showRequestDialog', false);
		Session.set('toggleEditRequest', false);
		Session.set('currentId', null);
	},
	'click .cancel': function (evt) {
		Session.set('showRequestDialog', false);
		Session.set('toggleEditRequest', false);
		Session.set('currentId', null);
	},
	'click .deleteRequest': function (evt, template) {
		Requests.remove({_id: this._id});
		Session.set('currentId', null);
		Session.set('showRequestDialog', false);
	},
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Rendered
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.add_request.rendered = function () {

// Date Picker
	// $('#startDate').datepicker({
	// 	autoclose: true,
	//     todayHighlight: true,
	//     daysOfWeekDisabled: "0,6"
	// });
	// $('#endDate').datepicker({
	// 	autoclose: true,
	//     todayHighlight: true,
	//     daysOfWeekDisabled: "0,6"
	// });
	$('.input-daterange').datepicker({
		autoclose: true,
		daysOfWeekDisabled: "0,6",
		beforeShowDay: function (date){
		if (date.getMonth() == (new Date()).getMonth())
			switch (date.getDate()){
				case 4:
					return {
						tooltip: 'Example tooltip',
						classes: 'active'
					};
				case 8:
					return false;
				case 12:
					return "green";
			}
		}
	});
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