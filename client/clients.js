
// Session.setDefault('currentClient', null);
// Session.setDefault('currentClientName', null);
// Session.setDefault('currentProject', null);
// Session.setDefault('currentProjectName', null);
// Session.setDefault('currentForecast', null);

// /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// /* clients
// /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// // Helpers 
// Template.clients.helpers({
// 	client: function () {
// 		return Clients.find({}, {sort:{name: 1}}).fetch();
// 	},
// 	currentClient: function () {
// 		return Session.get('currentClientName');
// 	},
// 	selectedClient: function () {
// 		return Session.equals('currentClient', this._id) ? 'selected' : '';
// 	},
// 	project: function () {
// 		return Projects.find({client: Session.get('currentClient')}).fetch(); 
// 	},
// 	currentProject: function () {
// 		return Session.get('currentProjectName');
// 	},
// 	selectedProject: function () {
// 		return Session.equals('currentProject', this._id) ? 'selected' : '';
// 	},
// 	forecast: function () {
// 		return Forecast.find({project: Session.get('currentProject')}).fetch(); 
// 	},
// 	selectedForecast: function () {
// 		return Session.equals('currentForecast', this._id) ? 'selected' : '';
// 	},
// 	selectedPercentage: function (value) {
// 		console.log(this._id);
// 		if (parseInt(value) === 100) {
// 			console.log('matched: 100')
// 			return 'selected';
// 		}
// 		if (parseInt(value) === 50) {
// 			console.log('matched: 50')
// 			return 'selected';
// 		}
// 	}
// });

// // Events
// Template.clients.events({
// 	'click .addClient': function (evt) {
// 		var clientName = $('.addClientInput').val();
// 		if (clientName.length > 0) {
// 			Clients.insert({name: clientName});
// 			$('.addClientInput').val('');
// 		}
// 	},
// 	'click .currentClient': function () {
// 		Session.set('currentClient', this._id);
// 		Session.set('currentClientName', this.name);
// 	},
// 	'click .deleteClient': function () {
// 		Clients.remove({_id: this._id});
// 	},
// 	'click .addProject': function (evt) {
// 		var clientId = Session.get('currentClient');
// 		var projectName = $('.addProjectInput').val();
// 		if (projectName.length > 0) {
// 			Projects.insert({name: projectName, client: clientId});
// 			$('.addProjectInput').val('');
// 		}
// 	},
// 	'click .currentProject': function () {
// 		Session.set('currentProject', this._id);
// 		Session.set('currentProjectName', this.name);
// 	},
// 	'click .deleteProject': function () {
// 		Projects.remove({_id: this._id});
// 	},
// 	'click .addForecast': function (evt) {
// 		var clientId = Session.get('currentClient');
// 		var projectId = Session.get('currentProject');
// 		var startDate = $('#startDate').val();
// 		var endDate =  $('#endDate').val();
// 		if ((startDate.length > 0) & (endDate.length > 0)) {
// 			Forecast.insert({
// 				client: clientId, 
// 				project: projectId, 
// 				startDate: dateToUnix(startDate),
// 				endDate: dateToUnix(endDate),
// 				totalWorkDays: calcWorkingDays(dateToUnix(startDate), dateToUnix(endDate)),
// 				percentage: 100,
// 				date: moment()
// 			});
// 			$('#startDate').val('');
// 			$('#endDate').val('');
// 		}
// 	},
// 	'click .currentForecast': function () {
// 		Session.set('currentForecast', this._id);
// 		$('#startDate').val(dateFromUnix(this.startDate));
// 		$('#endDate').val(dateFromUnix(this.endDate));
// 	},
// 	'click .deleteForecast': function () {
// 		Forecast.remove({_id: this._id});
// 	},
// 	'change .percentage': function () {
// 		Forecast.update(this._id, 
// 			{$set: {percentage: parseInt($('.percentage').val()) }}
// 		);
// 	}
// });

// Template.clients.rendered = function() {
// 	$('#startDate').datepicker({
// 		autoclose: true,
// 	    todayHighlight: true,
// 	    daysOfWeekDisabled: "0,6"
// 	});
// 	$('#endDate').datepicker({
// 		autoclose: true,
// 	    todayHighlight: true,
// 	    daysOfWeekDisabled: "0,6"
// 	});
// }


// /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// /* Functions
// /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// Handlebars.registerHelper("formatDate", function(date) {
// 	return moment.unix(date).format("MM/DD/YYYY");
// });

// Handlebars.registerHelper("selected", function(key, value) {
//   	return key == value ? {selected:'selected'} : '';
// });

// /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// /* Functions
// /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// var dateToUnix = function (date) {
// 	if (date != '') {
// 		return moment(date).unix();
// 	}
// }
// var dateFromUnix = function (date) {
// 	if (date != '') {
// 		return moment.unix(date).format("MM/DD/YYYY");
// 	}
// }
// var calcWorkingDays = function (startDate, endDate) {
// 	var startDate = moment.unix(startDate);
// 	var endDate = moment.unix(endDate);
// 	var dateDiff = moment(endDate).diff(moment(startDate));
// 	var duration = moment.duration(dateDiff);
// 	var days = duration.asDays();
// 	days = (parseInt(days)+1);
// 	var firstDate = moment(startDate);
// 	var workDays = 0;
// 	while (days > 0) {
// 		if (firstDate.isoWeekday() !== 5 && firstDate.isoWeekday() !== 6) {
// 			workDays += 1;
// 		}
// 		days -= 1;
// 		firstDate = firstDate.add(1, 'days');
// 	}
// 	return workDays;
// }