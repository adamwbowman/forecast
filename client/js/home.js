
var cal = new CalHeatMap();

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* home
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.home.helpers({
	trend: function () {
		return Projects.find({}, {limit: 4, sort:{'date': -1}}).fetch();
	},
	recent: function () {
		return Projects.find({}, {limit: 4, sort:{'date': -1}}).fetch();
	},
	isEMEA: function () {
		return Projects.find({_id: this._id, 'EMEA': true}).fetch();
	},
	isAPAC: function () {
		return Projects.find({_id: this._id, 'APAC': true}).fetch();
	},
	isAmericas: function () {
		return Projects.find({_id: this._id, 'Americas': true}).fetch();
	},
	bookingDate: function () {
		return Bookings.find().fetch();
		// var bookingColl = Bookings.find().fetch();
		// var xxx = _.chain(bookingColl).pluck('dayList').flatten(true).value();
		// return JSON.stringify(xxx)
	},
	updateChart: function () {
		var bookingColl = Bookings.find().fetch(); 
		var flattenedColl = _.chain(bookingColl).pluck('dayList').uniq().flatten(true).value();
		var formattedColl = {};
		_.each(flattenedColl, function (item) {
			formattedColl[dateToUnix(item)] = 15;
		});
		console.log(formattedColl);
		cal.update(formattedColl);
	},
	// TEAMMATES CHART
	// updateChart: function () {
	// 	var teammatesColl = Teammates.find().fetch(); 
	// 	var flattenedColl = _.chain(teammatesColl).pluck('unavailable').uniq().flatten().value();
	// 	var formattedColl = {};
	// 	_.each(flattenedColl, function (item) {
	// 		formattedColl[dateToUnix(item)] = 15;
	// 	});
	// 	cal.update(formattedColl);
	// }
});

// Events
Template.home.events({
	'click .requestButton': function (evt) {
		Router.go('/requests');
	}
});

Template.home.rendered = function () {
	cal.init({
		itemSelector: "#example-g",
		domain: "month",
		// subDomain: "day",
		subDomain: "x_day",
		data: {},
		start: new Date(2015, 0, 5),
		cellSize: 20,
		cellPadding: 2,
		domainGutter: 20,
		range: 6,
		domainDynamicDimension: false,
		previousSelector: "#example-g-PreviousDomain-selector",
		nextSelector: "#example-g-NextDomain-selector",
		domainLabelFormat: function(date) {
			moment.lang("en");
			return moment(date).format("MMMM").toUpperCase();
		},
		subDomainTextFormat: "%d",
		legend: [1, 4, 7, 10]
	});
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