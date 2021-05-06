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
// Utilisation de la base de données
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/BD',{useUnifiedTopology: true, useNewUrlParser: true });


const Departement = require('./modeles/departement.js');
const Utilisateur = require('./modeles/utilisateur.js');
const Document = require('./modeles/document.js');
 
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

// IR les pages des départements
// route et expressions régulières
app.get ('/departement_:dptId([0-7])', (req,res) => {
	
		
	req.session.dpt = req.params.dptId; 
	res.render('departement', {session: req.session})
  }
)
 // IR les pages des formations
// route et expressions régulières
app.get ('/formation_:dptId([0-7])_:formId([0-8])', (req,res) => {
	var tabDepot = [];
	var tabPrenom = [];
	var tabNom = [];
	 Document.find({id_departement: req.session.dpt, id_formation: req.session.formation}, 
		function (err, docs) {
			if (err) //throw err;
				return handleError(err); 
		
			if ( docs.length === 0)
				res.render('formation', {session: req.session, depots : JSON.stringify(tabDepot), prenoms : JSON.stringify(tabPrenom), noms:JSON.stringify(tabNom) })
		
			console.log(docs.length);
			docs.forEach(function( doc , indiceI) {				
					tabDepot.push(doc);
					console.log("1- dans apolair, " + doc.id_auteur)
					
					Utilisateur.find({email: doc.id_auteur},  function (err, candidats) {
							tabPrenom.push(candidats[0].prenom)
							tabNom.push(candidats[0].nom)
							console.log(" 2- apolair toujours le prnom " + candidats[0].prenom);
							if (tabPrenom.length ===docs.length)
								res.render('formation', {session: req.session, depots : JSON.stringify(tabDepot), prenoms : JSON.stringify(tabPrenom), noms:JSON.stringify(tabNom) })
		
						}							
					)					
			})
			
		}
	) 
	 
	})


// IR les pages de dépôt 
// route et expressions régulières
// /depot_3_2
app.get ('/depot_:dptId([0-7])_:formId([0-8])', (req,res) => {
	req.session.dpt = req.params.dptId;
	req.session.formation = req.params.formId;
	res.render('depot', {session: req.session})
  }
)



app.get ('/download', handlers.download)
 

// Thomas
app.get('/accueilDepartementsAdmin', handlers.accueilDepartementsAdmin)


app.post('/api/depot', (req, res) => {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    if (err)
       return handlers.api.depot (req, res, err.message)
    handlers.api.depot(req, res, fields, files)
  })
})


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
