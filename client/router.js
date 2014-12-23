
//////////////////////////////////////////////////////////////////////////////////
// Router
Router.map(function() {
	this.route('homepage', {
		path: '/'
	});
	this.route('clients', {
		path: '/clients'
	});	
	this.route('admin', {
		path: '/admin'
	});
	//this.route('answers', { 
	//	path: '/question/:questionId',
	//	data: function() {
	//		Meteor.call('tallyViewQuestion', this.params.questionId);
	//		Session.set('questionId', this.params.questionId); 
	//	}
	//});
});