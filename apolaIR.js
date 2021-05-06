const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')
const handlers = require('./lib/handlers')


const port = process.env.PORT || 3000

const app = express()


// Les variables de session
const session = require('express-session')
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'ssshhhhh',
  // create new redis store. port 6360 ou 6379 à verifier
  store: new redisStore({ host: 'localhost', port: 6360, client: client,ttl : 260}),
   
}))

 
// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main',
  helpers: {
    section: function(name, options) {
      if(!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    },
  },
}))
app.set('view engine', 'handlebars')

// IR  pour les images mais ne semble pas nécessaire
//app.use(express.static(__dirname + '/public'))

// IR : test CSS
app.use('/css',express.static(__dirname +'/views/layouts/css'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



app.use(express.static(__dirname + '/public'))

app.get('/', handlers.home)

// handlers for fetch/JSON form connexion
app.get('/inscription', handlers.inscription)

app.post('/api/inscription', handlers.api.inscription)

app.post('/api/connexion', handlers.api.connexion)

app.get ('/accueilFormations', handlers.accueilFormations)

app.get('/accueilDepartements', handlers.accueilDepartements)

app.get('/departementGEII', handlers.departementGEII)
app.get ('/download', handlers.download)


app.get('/departementInformatique', handlers.departementInformatique)

app.post('/api/depot', (req, res) => {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    if (err)
       return handlers.api.depot (req, res, err.message)
    handlers.api.depot(req, res, fields, files)
  })
})

app.get('/departementMMI', handlers.departementMMI)

app.get('/departementRT', handlers.departementRT)

app.use(handlers.notFound)
app.use(handlers.serverError)

if(require.main === module) {
  app.listen(port, () => {
    console.log( 'Express started on http://localhost:${port}' +
      '; press Ctrl-C to terminate.' )
  })
} else {
  module.exports = app
}
