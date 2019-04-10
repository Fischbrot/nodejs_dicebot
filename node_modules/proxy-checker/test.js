var proxyChecker = require('./index.js');

var showProxyCheckResult = function(host, port, ok, statusCode, err) {
	console.log(host + ':' + port + ' => ' + ok + ' (status: ' + statusCode + ', err: ' + err + ')');
};

var options = {
	url: 'http://www.yelp.fr',
	regex: /content\=\"Yelp\"/
};

proxyChecker.checkProxiesFromFile(
	'/Users/sebastien/Documents/workspace/sitimmo/ressources/proxys.txt',
	options,
	showProxyCheckResult
);
