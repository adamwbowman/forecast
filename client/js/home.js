
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

Template.home.rendered = function () {
	var cal = new CalHeatMap();	
	cal.init({
		itemSelector: "#example-g",
		domain: "month",
		subDomain: "x_day",
		// data: calData(),
		start: new Date(2015, 0, 5),
		cellSize: 20,
		cellPadding: 2,
		domainGutter: 0,
		range: 2,
		verticalOrientation: true,
		domainDynamicDimension: false,
		label: {
			position: "left",
			width: 25,
			rotate: "left"
		},
		domainLabelFormat: function(date) {
			moment.lang("en");
			return moment(date).format("MMMM").toUpperCase();
		},
		legendVerticalPosition: "top",
		legendMargin: [0,0,25,0],
		subDomainTextFormat: "%d",
		legend: [1, 3, 5, 7, 9]
	});

	var calData = Meteor.autorun( function () {
		var calendarColl = BookingCalendar.find().fetch();
 		var formattedColl = {};
		_.each(calendarColl, function (item) {
			formattedColl[item.date] = item.score;
		});
		cal.update(formattedColl);
	});
}