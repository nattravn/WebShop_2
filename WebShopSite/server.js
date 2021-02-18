const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('mockRecords.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/Record/username/:user', (req, res) => {
    console.log("res", req.params.user);

    console.log("res", res.);
    router.get

    //console.log("router: ", router.get('/Record'));
    // server.get('/Record/1', (req, res) => {

    //     res.jsonp(req.query);
    // });
    //console.log("query", req.query);
    //console.log("router", router.get('Record'));
    res.jsonp({"User": "testUser3"});

})
server.get('/Shoe/username/:user', (req, res) => {
    console.log("res", req.params.user);
    //console.log("query", req.query);
    //console.log("router", router.get('Record'));
    res.jsonp({"User": "testUser3"});
})
server.get('/Clothing/username/:user', (req, res) => {
    console.log("res", req.params.user);
    //console.log("query", req.query);
    //console.log("router", router.get('Record'));
    res.jsonp({"User": "testUser3"});
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

// Use default router
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})
