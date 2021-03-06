
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* home.js
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

Session.setDefault('homeCalendarType', 'booking');



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.home.helpers({
	trend: function () {
		return Clients.find({}, {limit: 3, sort:{'views': -1}}).fetch();
	},
	recent: function () {
		return Clients.find({}, {limit: 3, sort:{'date': -1}}).fetch();
	},
	bookings: function () {
		return Bookings.find({client: this.name}).count();
	},
	requests: function () {
		return Requests.find({client: this.name, bookingId: {$exists: false} }).count();
	},
	daysBooked: function () {
		var bookingColl = Bookings.find({client: this.name}).fetch();
		var workDaysColl = _.chain(bookingColl).pluck('totalWorkDays').value();
		var days = 0;
		_.each(workDaysColl, function (item) {
			days += item;
		});
		return days;
	},
	daysRequested: function () {
		var requestColl = Requests.find({client: this.name}).fetch();
		var workDaysColl = _.chain(requestColl).pluck('totalWorkDays').value();
		var days = 0;
		_.each(workDaysColl, function (item) {
			days += item;
		});
		return days;
	},
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Events
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.home.events({
	'click .bookingCalendar': function () {
		Session.set('homeCalendarType', 'booking');
	},
	'click .requestCalendar': function () {
		Session.set('homeCalendarType', 'request');
	}	
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Rendered
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Template.home.rendered = function () {

// Load Map
	// initMap();


// Load Calendar
	var homeCal = new CalHeatMap();	
	homeCal.init({
		itemSelector: "#home-cal",
		domain: "month",
		subDomain: "x_day",
		start: new Date(2015, 0, 5),
		cellSize: 20,
		cellPadding: 2,
		domainGutter: 0,
		range: 3,
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


// Track Map Data Changes
	var homeCalData = Meteor.autorun( function () {
		var homeType = Session.get('homeCalendarType');
		if (homeType == 'booking') {
			console.log('home - booking');
			var calendarColl = BookingCalendar.find().fetch();
		}
		if (homeType == 'request') {
			console.log('home - request');
			var calendarColl = RequestCalendar.find().fetch();
 		}
 		var formattedColl = {};
		_.each(calendarColl, function (item) {
			formattedColl[item.date] = item.score;
		});
		homeCal.update(formattedColl);
	});
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Functions
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function initMap() {

// Set up map
	map = new L.Map('map');


// Create the tile layer
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 16, attribution: osmAttrib});		


// Start the map in South-East England
	map.setView(new L.LatLng(51.3, 0.7),9);
	map.addLayer(osm);
}