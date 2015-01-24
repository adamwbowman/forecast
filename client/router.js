
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* router.js
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Router.map(function() {
	this.route('home', {
		path: '/'
	});
	this.route('admin', {
		path: '/admin'
	});
	this.route('clients', {
		path: '/clients'
	});	
	this.route('projects', {
		path: '/projects',
        onBeforeAction: function (pause) {
        	Session.set('currentProject', null);
        	this.render('projects');
        }
	});	
	this.route('requests', {
		path: '/requests',
        onBeforeAction: function (pause) {
        	Session.set('currentId', null);
        	this.render('requests');
        }
	});	
	this.route('teammates', {
		path: '/teammates'
	});	
	this.route('viewAll', {
		path: '/viewAll/:id',
		data: function () {
			return Clients.findOne({_id: this.params.id});
		}
	});	
});