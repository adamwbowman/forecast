
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
		// data: calData,
		start: new Date(2015, 0, 5),
		cellSize: 20,
		cellPadding: 2,
		domainGutter: 0,
		range: 4,
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

	var calendarColl = Calendar.find().fetch();
console.log(calendarColl);

	// var formattedColl = {};
	// _.each(calendarColl, function (item) {
	// 	formattedColl[item.date] = item.score;
	// });
	// console.log(formattedColl);
	// cal.update(formattedColl);

console.log('rendered');

	// Calendar.find().observe({
	//   changed: function () {
	// 		var calendarColl = Calendar.find().fetch();
	// 		var formattedColl = {};
	// 		_.each(calendarColl, function (item) {
	// 			formattedColl[item.date] = item.score;
	// 		});
	// 		cal.update(formattedColl);
	//   }
	// });

}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* functions
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