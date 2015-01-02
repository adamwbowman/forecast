
var cal = new CalHeatMap();

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* home
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.home.helpers({
	project: function () {
		return Projects.find({}, {limit: 3}).fetch();
	}
});

// Events
// Template.home.events({
// 	'click .addAnswer': function (evt) {
// 	}
// });

Template.home.rendered = function () {
	cal.init({
		// itemSelector: "#example-g",
		domain: "month",
		subDomain: "x_day",
		data: formatForChart(),
		start: new Date(2015, 0, 5),
		cellSize: 20,
		cellPadding: 5,
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
// teammates('Singleview');
formatForChart();
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

var teammates = function (product) {
	var idTeammates = Teammates.find({product: product}).fetch();
	console.log(idTeammates); 

	_.each(idTeammates, function (index) {
		console.log(index._id);
	})
}

var formatForChart = function () {
	var teammatesColl = Teammates.find().fetch(); 
	var flattenedColl = _.chain(teammatesColl).pluck('unavailable').uniq().flatten().value();
	var formattedColl = {};
	_.each(flattenedColl, function (item) {
		formattedColl[dateToUnix(item)] = 15;
	});
	return formattedColl;
}