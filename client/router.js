
//////////////////////////////////////////////////////////////////////////////////
// Router
Router.map(function() {
	this.route('homepage', {
		path: '/'
	});
	this.route('admin', {
		path: '/admin'
	});
	this.route('clients', {
		path: '/clients'
	});	
	this.route('home', {
		path: '/home'
	});	
	this.route('projects', {
		path: '/projects'
	});	
	this.route('requests', {
		path: '/requests'
	});	
	this.route('teammates', {
		path: '/teammates'
	});	
	//this.route('answers', { 
	//	path: '/question/:questionId',
	//	data: function() {
	//		Meteor.call('tallyViewQuestion', this.params.questionId);
	//		Session.set('questionId', this.params.questionId); 
	//	}
	//});
});