var express = require('express');
var app = express();

app.use('/', express.static(__dirname));

app.listen(1234, function () {
	console.log('Android web logger at port 1234');
});