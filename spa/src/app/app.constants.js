
app.constant('APIConfig', {
  url: 'http://localhost:9000/api/',
});


app.constant('URLTemplates', (function() {
  var debug = true;
	if (debug) 
		return '';

	return 'static/';
})());
