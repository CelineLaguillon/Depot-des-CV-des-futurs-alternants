

exports.api = {}

exports.home = (req, res) => res.render('home')

const controleConnexion = require('./controleConnexion');
//const requeteConnexion = require('./requeteConnexion');
const fs = require ('fs');

//var sess; // global session, NOT recommended

// Utilisation de la base de données
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/BD',{useUnifiedTopology: true, useNewUrlParser: true });


const Departement = require('../modeles/departement.js');
const Utilisateur = require('../modeles/utilisateur.js');
const Document = require('../modeles/document.js');


exports.inscription = (req, res) => {   
  res.render('inscription')
}

exports.api.inscription = (req, res) => {
	//console.log('handlers  ok',req.body.mdpConfirmation , ' ' , req.body.tel);	
	//sess = req.session;
	if (controleConnexion.testAdresseMail (req.body.ident)) 
		if (controleConnexion.testMotDePasse (req.body.mdp)) 
			if(controleConnexion.testConfirmationMotDePasse( req.body.mdp , req.body.mdpConfirmation)) { 
				const candidat = new Utilisateur ({
					role: "Candidat",
					prenom: req.body.prenom, 
					nom: req.body.nom, 					
					email: req.body.ident, 
					motDePasse: req.body.mdp				
				});
				candidat.save()
				console.log ("api.insciption candidat enregistré " + req.body.prenom + " " + req.body.nom + " " +req.body.ident);
				req.session.ident = req.body.ident;					
					//req.session.mdp = req.body.mdp;
				req.session.prenom = req.body.prenom;					
				req.session.nom = req.body.nom;
				res.send({ result: 'success' }) 			  
			}		
			else res.send({result: 'error' , message : 'Les mots de passe ne sont pas identiques'}) 
		else res.send({ result: 'error' , message :'Mot de passe incorrect' }) 		
	else res.send({result: 'error' , message : 'Adresse mail non valide'}) 
}


exports.api.connexion = (req, res) => {	 
	if (controleConnexion.testAdresseMail (req.body.ident)) 
		if (controleConnexion.testMotDePasse (req.body.mdp)) {
 //todo test also ident/email
			Utilisateur.find ({"motDePasse" : req.body.mdp}, {'_id':0}, function(err, utilisateur) {	
 	
				if (err)  		 		 
					res.send({ result: 'error' , message :'Problème de connexion à la base de données' })
				else  { 
					if ( typeof utilisateur[0] == 'undefined')
						res.send({ result: 'error' , message :'Identifiant ou mot de passe  non enregistré' })
					else {
						req.session.ident = req.body.ident;
						//req.session.mdp = req.body.mdp;
						req.session.role = utilisateur[0].role
						req.session.prenom = utilisateur[0].prenom
						req.session.nom = utilisateur[0].nom
						
						// L'administrateur se connecte
						if (req.session.role === "admin"   ) {
							res.send({ result: 'success' , session: req.session }) 	
						}
						
						// Un membre du pôle alternance  
						if (req.session.role === "MPA"   ) {
							res.send({ result: 'success' , session: req.session }) 	
						}
						
						// Un responsable de département
						if (req.session.role === "RD"   ) {
							req.session.dpt = utilisateur[0].indiceDpt;
							Departement.find ({"indice" : req.session.dpt}, {'_id':0}, 
							  function(err, departement) {	
								if (err) 
									res.send({ result: 'error' , message :'Problème de connexion à la base de données' })
								else {req.session.nomDpt = departement[0].nom ;
									res.send({ result: 'success' , session: req.session })
								}
							});
						}
						
						// Un responsable de formation
						if (req.session.role === "RF"   ) {
							indiceDpt_Form = utilisateur[0].formations[0].indiceFormation.split('_');
							// to do mais pas urgent le responsable est respondable de plusieurs formations						     
							//console.log("cas du RF" +indiceDpt_Form[0] +"___"+ indiceDpt_Form[1]+"___");
							req.session.dpt =   indiceDpt_Form[0];
							req.session.formation = indiceDpt_Form[1];
							Departement.find ({"indice" : req.session.dpt}, {'_id':0}, 
							  function(err, departement) {	
								if (err) 
									res.send({ result: 'error' , message :'Problème de connexion à la base de données' })
								else {
									req.session.nomDpt = departement[0].nom ;
								    tabFormations = departement[0].formations;
									req.session.nomFormation = tabFormations [req.session.formation].nom;								      
									res.send({ result: 'success' , session: req.session })
								}
							});
						}
						
						// Un candidat 
						if (req.session.role === "Candidat"   ) {
							// a compléter avec les formations pour lesquelles il a déposé un CV ??
							res.send({ result: 'success' , session: req.session })
						}
						
					}
				}   
			})
		}
		else res.send({ result: 'error' , message :'Mot de passe incorrect' }) 		
	else res.send({result: 'error' , message : 'Adresse mail non valide'}) 
	
}

// Page d'accueil de toutes les formations 
exports.accueilFormations = (req,res) => {  
   
    // dans cette version les formations sont dans le modèle Departement
 
	Departement.find({}, function(err, dpts) {  
    if (err) //throw err;
		return handleError(err); 
	 
	var tabDpt = [];  var tabTabF = [];
	dpts.forEach(function( dpt , indiceI) {
		tabDpt.push(dpt.nom);
		var tabF = [];
		dpt.formations.forEach( function( formation , indiceJ) {				 
				tabF.push(formation.nom)
		}) ;
			 
		tabTabF.push (tabF);
        }); 
		
	res.render('accueilFormations', {session: req.session, departements:  JSON.stringify(tabDpt), formations : JSON.stringify(tabTabF)});	
		
	}).sort({'nom':1});  // les dpts sont triés par ordre alphabétique	 
  
}
 
exports.accueilDepartementsAdmin = (req, res) => {
	//Departement.find({},{'_id':false}, function(err, result) {
	//var queryDpt = Departement.find ({});
    Departement.find({},{'_id':false}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      console.log("accueilDptAdmin "+ req.session.ident + " " + result ) ;  
	 
	  
	  res.render('accueilDepartementsAdmin', {session: req.session}) 
	  }
  }).select('formations.nom');
   
}


exports.accueilDepartements = (req,res) => {  
  res.render('accueilDepartements', {session: req.session})
}

 


exports.download = (req, res) => {
  const file= `DEPOT/GEII/destination.pdf`
  res.download(file);
}
 

exports.api.depot = (req, res, fields, files) => {
  //console.log('field data: ', fields )
  //console.log('files: ', files)
  
  nouveauNom = req.session.prenom+'_'+req.session.nom+"_"+files.file[0].originalFilename   
  depot = "DEPOT/"+req.session.dpt+"/"
  fs.copyFile(files.file[0].path, depot+nouveauNom, (err) => {
    if (err) throw err;
  });
  const doc = new Document ({
		id_auteur: req.session.ident,
		id_departement: req.session.dpt,
    	id_formation:  req.session.formation,
		nom_document: nouveauNom
	});
	doc.save()
  res.send({ result: 'success' })
}

 




exports.notFound = (req, res) => res.render('404')

// Express recognizes the error handler by way of its four
// arguments, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500')
/* eslint-enable no-unused-vars */
