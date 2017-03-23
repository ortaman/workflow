
app.constant('APIConfig', {
  url: 'http://localhost:9000/api/',
  baseUrl: 'http://localhost:9000/',
});


app.constant('URLTemplates', (function() {
  var debug = true;
	if (debug) 
		return '';

	return 'static/';
})());
