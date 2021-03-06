
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* teammates.js
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

Session.setDefault('currentTeammate', null);


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */ 
Template.teammates.helpers({
	teammate: function () {
		return Teammates.find({}, {sort: {name: 1}}).fetch();
	},
	selectedTeammate: function () {
		return Session.equals('currentTeammate', this._id) ? 'selected' : '';
	},
	currentTeammate: function () {
		var currentTeammate = Session.get('currentTeammate');
		return Teammates.findOne({_id: currentTeammate}).fetch();
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
	unavailable: function () {
		var currentTeammate = Session.get('currentTeammate');
		var xxx = Teammates.find({_id: currentTeammate}).fetch(); 
		var xxx = _.chain(xxx).pluck('unavailable').flatten(true).value();
		var unavails = [];
		_.each(xxx, function (index) {
			unavails.push(_.first(index) + ' - ' + _.last(index));
		});
		return unavails;
	},
	selectedUnavailable: function () {
		return Session.equals('currentTeammate', this._id) ? 'selected' : '';
	},
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Events
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */ 
Template.teammates.events({
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
		cal.update(formatForChart());
	},
	'click .addUnavailable': function () {
		var startDate = $('#startDate').val();
		var endDate =  $('#endDate').val();
		if ((startDate.length > 0) & (endDate.length > 0)) {
			var currentTeammate = Session.get('currentTeammate');
			var days = convertToDays(dateToUnix(startDate), dateToUnix(endDate));
			Teammates.update(currentTeammate, {$push: {
				unavailable: days,
			}});
			$('#startDate').val('');
			$('#endDate').val('');
		}
		cal.update(formatForChart());
	},
	'click .currentUnavailable': function () {
		$('#startDate').val(dateFromUnix(this.startDate));
		$('#endDate').val(dateFromUnix(this.endDate));
	},
	'click .deleteUnavailable': function () {
		console.log('I need to do this')
	},	
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Rendered
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */ 
Template.teammates.rendered = function() {

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
		domain: "month",
		subDomain: "day",
		data: formatForChart(),
		start: new Date(2015, 0, 5),
		cellSize: 20,
		cellPadding: 5,
		domainGutter: 20,
		range: 3,
		domainDynamicDimension: false,
		domainLabelFormat: function(date) {
			moment.lang("en");
			return moment(date).format("MMMM").toUpperCase();
		},
		subDomainTextFormat: "%d",
		legend: [1, 4, 7, 10]
	});
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Handlebar Helper
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Handlebars.registerHelper("formatDate", function(date) {
	return moment.unix(date).format("MM/DD/YYYY");
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Functions
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
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

var formatForChart = function () {
	var currentTeammate = Session.get('currentTeammate');
	var teammatesColl = Teammates.find({_id: currentTeammate}).fetch(); 
	var flattenedColl = _.chain(teammatesColl).pluck('unavailable').flatten().value();
	var formattedColl = {};
	_.each(flattenedColl, function (item) {
		formattedColl[dateToUnix(item)] = 15;
	});
	return formattedColl;
}