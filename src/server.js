const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, callback) => {
  console.log('entering server.js > parseBody()');
  const body = [];

  // handle error
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // whenever a piece of data is recieved
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // when last chunk has been recieved
  request.on('end', () => {
    console.log(body);

    const bodyString = Buffer.concat(body).toString();
    console.log(bodyString);

    const bodyParams = query.parse(bodyString);
    console.log(bodyParams);

    callback(request, response, bodyParams);
  });
};

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUserCollection': jsonHandler.getUserCollection,
  },
  HEAD: {
    '/getUserCollection': jsonHandler.getUserCollection,
  },
  POST: {
    '/addAlbum': (request, response) => { parseBody(request, response, jsonHandler.addAlbum); },
  },
};

const onRequest = (request, response) => {
  console.log('entering server.js > onRequest()');

  // first we have to parse information from the url
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  console.log(`method: ${request.method}, pathname:${parsedUrl.pathname} ${request.method === 'GET' ? params.userNameGet : ''}`);

  if (urlStruct[request.method][parsedUrl.pathname]) {
    if (request.method === 'GET' || request.method === 'HEAD') {
      return urlStruct[request.method][parsedUrl.pathname](request, response, request.method, params);
    }

    return urlStruct[request.method][parsedUrl.pathname](request, response, request.method, params);
  }

  return urlStruct[request.method]['/'];
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
