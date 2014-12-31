
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
	var cal = new CalHeatMap();
	cal.init({
		// itemSelector: "#example-g",
		domain: "month",
		subDomain: "x_day",
		data: {947122579: 2},
		start: new Date(2000, 0, 5),
		cellSize: 20,
		cellPadding: 5,
		domainGutter: 20,
		range: 2,
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
teammates('Singleview');
}

var teammates = function (product) {
	var idTeammates = Teammates.find({product: product}).fetch();
	console.log(idTeammates); 

	_.each(idTeammates, function (index) {
		console.log(index._id);
	})
}