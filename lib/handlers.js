exports.api = {}
exports.home = (req, res) => res.render('home')

const controleConnexion = require('./controleConnexion');
const fs = require ('fs');
var sess; // global session, NOT recommended


// const Document = require('../bddModels/documentModel.js');
const Utilisateur = require('../bddModels/utilisateurModel');
const Departement = require('../bddModels/departementModel');
const Formation = require('../bddModels/formationModel');

exports.inscription = (req, res) => {   
  res.render('inscription')
}

exports.api.inscription = (req, res) => {
	sess = req.session;

	if (controleConnexion.testAdresseMail (req.body.ident)) 
		if (controleConnexion.testMotDePasse (req.body.mdp)) 
			if(controleConnexion.testConfirmationMotDePasse( req.body.mdp , req.body.mdpConfirmation))// si les mots de passe sont identiques
				{
				//insertion dans bdd
				const candidat = new Utilisateur ({
					nom: req.body.nom, 
					prenom: req.body.prenom, 
					email: req.body.ident, 
					motDePasse: req.body.mdp,
					role: "Candidat"
				});
				candidat.save()
				
				req.session.ident = req.body.ident;					
				// req.session.mdp = req.body.mdp;
				req.session.prenom = req.body.prenom;					
				req.session.nom = req.body.nom;		
				res.send({ result: 'success' }) 			 
				}
			else res.send({ result: 'error' , message : 'Les mots de passe ne sont pas identiques' }) 	
		else res.send({ result: 'error' , message :'Mot de passe incorrect' }) 		
	else res.send({result: 'error' , message : 'Adresse mail non valide'}) 

}
exports.getNomDepartement = function (dpt) {
	Departement.find({"indice": dpt}, function(err, departement) {
		if(!err){
			console.log(departement[0].nom)

			return departement[0].nom
		}
	})
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
						
						else if (req.session.role === "RF"   ) {
							indiceDpt_Form = utilisateur[0].formations[0].indiceFormation.split('_');
							// to do mais pas urgent le responsable est respondable de plusieurs formations
						     
							console.log("cas du RF" +indiceDpt_Form[0] +"___"+ indiceDpt_Form[1]+"___");
							req.session.dpt =   indiceDpt_Form[0];
							req.session.formation = indiceDpt_Form[1];
							Departement.find ({"indice" : req.session.dpt}, {'_id':0}, 
							  function(err, departement) {	
								if (err) 
									res.send({ result: 'error' , message :'Problème de connexion à la base de données' })
								else {
									req.session.nomDpt = departement[0].nom ;
								    tabFormations = departement[0].formations;
									console.log("nb form " + tabFormations.length + "indice " + req.session.formation);
									req.session.nomFormation = tabFormations [req.session.formation].nom;								      
									res.send({ result: 'success' , session: req.session })
								}
							});
						}

						else if (req.session.role === "admin"){
							console.log("admin");

							res.send({ result: 'success' , session: req.session })
						}
					}
				}   
			})
		}
		else res.send({ result: 'error' , message :'Mot de passe incorrect' }) 		
	else res.send({result: 'error' , message : 'Adresse mail non valide'}) 
	
}

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
  var queryDpt = Departement.find({})
  queryDpt.exec (function(err, dpts) {
    if (err) //throw err;
		return handleError(err);

	var chaineD = new String ();
	
	dpts.forEach(function( dpt , indiceI) {
            chaineD +=  dpt.nom +"#" ; // '#' symbole séparant chaque département
        }); 
    res.render('accueilDepartementsAdmin', {ident: req.session.ident, departements:  chaineD});	 
  });
}


exports.api.supprimeDepartement = (req, res) => {
	Departement.deleteOne({nom: req.body.nomDpt }, function (err) {  //supprime département le nom de département
		if (err) res.send({ result: 'error' , message : 'Bug query mongoose' });
		else res.send({ result: 'success' }) 			
	});
}


exports.api.nouveauDepartement = (req, res) => {
	const departement = new Departement({
		nom: req.body.nouveauDpt
	});
	departement.save(function(err){
        if(err){
          res.send({ result: 'error' , message : 'Bug query mongoose' });
        }
		else res.send({ result: 'success' });
     })
}


exports.api.idDuDpt = (req, res) => {
	var queryDpt = Departement.find({nom: req.body.nomDpt});
	queryDpt.exec (function(err, departements) {
		if (err) //throw err;
			return handleError(err);	
		var idDpt = new String ();
		departements.forEach(function(dpt , i) {     
			idDpt = dpt.id;
		});
		res.send({ result: 'success' , idDpt: idDpt })
	});
}



	/*  Page de gestion des départements + ses fonctions */
exports.ajoutResponsableDepartement = (req, res) => {   
	
	// les responsables de département que l'on peut ajouter au département
	var queryUsers = Utilisateur.find ({});
	queryUsers.exec (function(err, responsables) {
    if (err) //throw err;
		return handleError(err);	
	var chaineResp = new String ();
	responsables.forEach(function( resp , indiceI) {
            if(resp.role=="responsableDepartement") // si responsable de formation
			chaineResp +=  resp.prenom + " " + resp.nom + "#" ; // '#' symbole séparant chaque responsable
        });
		
    res.render('ajoutResponsableDepartement', {ident: req.session.ident, departement: req.body.nomDpt, respDepartement:  chaineResp});	 
  });
}


exports.api.ajoutRespDepartement = (req, res) => {
	Departement.update({_id: req.body.departement}, 
		{ $push: {responsable: req.body.responsable } }, function (err) {  //supprime département le nom de département
			if (err) res.send({ result: 'error' , message : 'Bug query mongoose' });
			else res.send({ result: 'success' }) 			
	});
}


exports.api.nouveauRespDepartement = (req, res) => {
	if (controleConnexion.testAdresseMail (req.body.ident)) 
		if (controleConnexion.testMotDePasse (req.body.mdp)) 
			if(controleConnexion.testConfirmationMotDePasse( req.body.mdp , req.body.mdpConfirmation))// si les mots de passe sont identiques
				{
				//inscription d'utilisateur en tant que responsable de département
				const respDepartement = new Utilisateur ({
					nom: req.body.nom, 
					prenom: req.body.prenom, 
					email: req.body.ident, 
					motDePasse: req.body.mdp,
					role: "responsableDepartement"
				});
				respDepartement.save()
				

				var responsable = req.body.prenom + " " + req.body.nom;
				//ajout du nouveau responsable au département
				Departement.update({_id: req.body.departement}, 
					{$push: {responsable: responsable} }, function (err) {  //supprime département le nom de département
						if (err) res.send({ result: 'error' , message : 'Bug query mongoose' });		
				});
				
				
				res.send({ result: 'success' }) 			 
				}
			else res.send({ result: 'error' , message : 'Les mots de passe ne sont pas identiques' }) 	
		else res.send({ result: 'error' , message :'Mot de passe incorrect' }) 		
	else res.send({result: 'error' , message : 'Adresse mail non valide'}) 

}



	/*  Page de gestion des formations + ses fonctions */
exports.formationsAdmin = (req, res) => {   
    res.render('formationsAdmin');
}


exports.api.afficheFormations = (req, res) => {	
	var queryDpt = Departement.find({_id: req.body.idDpt});
	queryDpt.exec (function(err, departements) {
		if (err) //throw err;
			return handleError(err);	
		var chaineFormations = new String ();
		departements.forEach(function( dpt , i=0) {     
			while(dpt.formations[i]){
				chaineFormations += dpt.formations[i].nom + "#" ;
				i++;
			}
		});			
		res.send({ result: 'success' , formations: chaineFormations })
	});
}


exports.api.supprimeFormation = (req, res) => {
	Formation.deleteOne({nom: req.body.formation }, function (err) {  //supprime la formation dans la collection formation
		if (err) res.send({ result: 'error' , message : 'Bug query mongoose' });
		else{
			Departement.update( {_id: req.body.idDpt}, {$pull: {formations: {nom: req.body.formation} }}, function (err) {  //supprime la formation dans la collection dpt
				if (err) res.send({ result: 'error' , message : 'Bug query mongoose' });
				else res.send({ result: 'success' }); 			
			});	
		}		
	});
}


exports.api.nouvelleFormation = (req, res) => {
	const formation = new Formation({
		nom: req.body.formation
	});
	formation.save(function(err){
        if(err) res.send({ result: 'error' , message : 'Bug query mongoose' });
		else{	
			Departement.update( {_id: req.body.idDpt}, {$push: {formations: {nom: req.body.formation} }}, function (err) {  //supprime la formation dans la collection dpt
				if (err) res.send({ result: 'error' , message : 'Bug query mongoose' });
				else res.send({ result: 'success' }); 			
			});
		}
	});
}

exports.api.idFormation = (req, res) => {
	var queryFormation = Formation.find({nom: req.body.formation});
	queryFormation.exec (function(err, formations) {
		if (err) //throw err;
			return handleError(err);	
		var idFormation = new String ();
		formations.forEach(function(fmt , i) {     
			idFormation = fmt.id;
		});
		res.send({ result: 'success' , idFormation: idFormation })
	});
}



	/*  Page de gestion des formations + ses fonctions */
exports.gestionFormation = (req, res) => {   
	var queryUsers = Utilisateur.find ({});
	queryUsers.exec (function(err, responsables) {
    if (err) //throw err;
		return handleError(err);	
	var chaineResp = new String ();
	responsables.forEach(function( resp , indiceI) {
        if(resp.role=="responsableDepartement") // si responsable de formation
			chaineResp +=  resp.prenom + " " + resp.nom + "#" ; // '#' symbole séparant chaque responsable
        });
		
    res.render('gestionFormation', {ident: req.session.ident, respFormation: chaineResp});	 
  });
}


exports.api.changementRespFormation = (req, res) => {	
	Formation.update({_id: req.body.formation}, 
		{responsablePedagogique: req.body.responsable}, function (err) {  //supprime département le nom de département
			if (err) res.send({ result: 'error' , message : 'Bug query mongoose' });
			else res.send({ result: 'success' }) 			
	});
}


// IR ajouts accueil departements, et departements
exports.accueilDepartements = (req,res) => {  
  res.render('accueilDepartements', {ident: sess.ident})
}
exports.departementGEII = (req,res) => {  
  res.render('departementGEII')
}

exports.download = (req, res) => {
  const file= `DEPOT/GEII/destination.pdf`
  res.download(file);
}

exports.departementInformatique = (req,res) => {  
  res.render('departementInformatique', {ident: sess.nom})
}

exports.api.depot = (req, res, fields, files) => {
  console.log('field data: ', fields )
  console.log('files: ', files)
  
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
// argumetns, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500')
/* eslint-enable no-unused-vars */