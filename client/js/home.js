
Session.setDefault('calenderType', 'booking');

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* home
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.home.helpers({
	trend: function () {
		return Projects.find({}, {limit: 3}).fetch();
	},
	recent: function () {
		return Projects.find({}, {limit: 3, sort:{'date': -1}}).fetch();
	},
	largest: function () {
		return Projects.find({}, {limit: 3, sort:{'location': 1}}).fetch();
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

Template.home.events({
	'click .bookingCalendar': function () {
		Session.set('calenderType', 'booking');
	},
	'click .requestCalendar': function () {
		Session.set('calenderType', 'request');
	}	
});

Template.home.rendered = function () {
    // var map = L.map('map-canvas').setView([32.07593833337078, 34.799848388671875], 16);

    // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    //                  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    //     maxZoom: 16
    // }).addTo(map);

initMap();

// var width = 960,
//     height = 500;

// var projection = d3.geo.mercator()
//     .center([0, 5 ])
//     .scale(900)
//     .rotate([-180,0]);

// var svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height);

// var path = d3.geo.path()
//     .projection(projection);

// var g = svg.append("g");

// // load and display the World
// d3.json("json/world-110m2.json", function(error, topology) {
//     g.selectAll("path")
//       .data(topojson.object(topology, topology.objects.countries)
//           .geometries)
//     .enter()
//       .append("path")
//       .attr("d", path)
// });

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
		range: 6,
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
		var type = Session.get('calenderType');
		if (type == 'booking') {
			var calendarColl = BookingCalendar.find().fetch();
		}
		if (type == 'request') {
			var calendarColl = RequestCalendar.find().fetch();
 		}
 		var formattedColl = {};
		_.each(calendarColl, function (item) {
			formattedColl[item.date] = item.score;
		});
		cal.update(formattedColl);
	});
}


function initMap() {
	// set up the map
	map = new L.Map('map');

	// create the tile layer with correct attribution
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 16, attribution: osmAttrib});		

	// start the map in South-East England
	map.setView(new L.LatLng(51.3, 0.7),9);
	map.addLayer(osm);
}