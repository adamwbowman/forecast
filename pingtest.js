
Meteor.methods({
  'getJenkins': function () {
    var result = HTTP.call('GET', 'http://wdclxd35:7156/jenkins/api/json');
    // var result = HTTP.call('GET', 'https://hudson.eclipse.org/hudson/api/json');
    if(result.statusCode==200) {
      var respJson = JSON.parse(result.content);
      return respJson;
    }
  }
});