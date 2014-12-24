
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
	this.route('projects', {
		path: '/projects'
	});	
	//this.route('answers', { 
	//	path: '/question/:questionId',
	//	data: function() {
	//		Meteor.call('tallyViewQuestion', this.params.questionId);
	//		Session.set('questionId', this.params.questionId); 
	//	}
	//});
});