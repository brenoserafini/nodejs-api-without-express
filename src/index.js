const http = require('http');

// para query params
// const url = require('url');

const { URL } = require('url');

const bodyParser = require('./helpers/bodyParser');

// const UserControler = require('./controllers/UserController')
const routes = require('./routes');

// criar o servidor
const server = http.createServer((request, response) => {
  // const parsedUrl = url.parse(request.url);
  // console.log(parsedUrl);
  // const parsedUrl = url.parse(request.url, true);
  // console.log(parsedUrl);
  // substituir request.url por parsedUrl.pathname
  const parsedUrl = new URL(`http://localhost:3300${request.url}`);

  // console.log(parsedUrl);
  // console.log(Object.fromEntries(parsedUrl.searchParams));

  console.log(`Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`);

  // para receber parâmetros na url
  let { pathname } = parsedUrl;
  let id = null;
  const splitEndpoint = pathname.split('/').filter(Boolean);
  console.log(splitEndpoint);
  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  const route = routes.find((routeObj) => (
    routeObj.endpoint === pathname  && routeObj.method === request.method
  ));

  if (route) {
    request.query = Object.fromEntries(parsedUrl.searchParams);
    request.params = { id };

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, {'Content-Type': 'application/json'});
      response.end(JSON.stringify(body));
    };

    // if (request.method === "POST" || request.method === "PUT") {
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      bodyParser(request, () => route.handler(request, response));
    } else {
      route.handler(request, response);
    }
  } else {
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
  }

  // if (request.url === '/users' && request.method === 'GET') {
  //   UserControler.listUsers(request, response)
  // } else {
  //   response.writeHead(404, {'Content-Type': 'text/html'});
  //   response.end(`Cannot ${request.method} ${request.url}`);
  // }
});

// erguer o servidor => precisamos fazer ele ficar escutando alguma porta
server.listen(3300, () => console.log('🔥 Server started at http://localhost:3300'));
