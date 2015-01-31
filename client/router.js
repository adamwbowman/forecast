
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
	this.route('teammate', {
		path: '/teammate/:id',
		data: function () {
			return Teammates.findOne({_id: this.params.id});
		}		
	});		
	this.route('teammates', {
		path: '/teammates'
	});	
	this.route('client', {
		path: '/client/:id',
		data: function () {
			Clients.update(this.params.id, {$inc: {views: 1}});
			return Clients.findOne({_id: this.params.id});
		}
	});	
});