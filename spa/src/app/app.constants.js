
app.constant('APIConfig', {
  url: 'http://127.0.0.1:9000/api/',
});


app.constant('URLTemplates', (function() {
  var debug = true;
	if (debug) 
		return '';

	return 'static/';
})());
