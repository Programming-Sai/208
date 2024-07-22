const http = require('https');

const options = {
	method: 'GET',
	hostname: 'barcodes-lookup.p.rapidapi.com',
	port: null,
	path: '/?query=9780439625593',
	headers: {
		'x-rapidapi-key': 'ee6b4943bcmsh514f1e849b5f265p127446jsnf0114804cfbf',
		'x-rapidapi-host': 'barcodes-lookup.p.rapidapi.com'
	}
};

const req = http.request(options, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});

req.end();