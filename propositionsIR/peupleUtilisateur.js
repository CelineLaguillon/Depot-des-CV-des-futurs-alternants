var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/BD'); //,{useMongoClient: true });


const Utilisateur = require('./modeles/utilisateur.js');
  
/**
  * 	admin
*/
 new Utilisateur ( { 
	"role": "admin",        
    "email": "isabelle.robba@uvsq.fr",
    "motDePasse": "aA*1",     
	}).save() ;
	
/**
  * 	chef de département GEII
*/
new Utilisateur ( {
	"role": "RD",    
    "prenom": "Florent",
	"nom": "Basset",
    "email": "isabelle.robba@uvsq.fr",
    "motDePasse": "fB*1",
    "indiceDpt" : "0", 
	}).save() ;
/**
  * 	responsable formation
*/	
new Utilisateur ( {
	"role": "RF",    
    "prenom": "Françoise",
	"nom": "Coural",
    "email": "isabelle.robba@uvsq.fr",
    "motDePasse": "fC*1",
    "formations": [{"indiceFormation": "0_0"}]
	}).save() ;	

new Utilisateur ( {
	"role": "RF",    
    "prenom": "Luc",
	"nom": "Chassagne",
    "email": "isabelle.robba@uvsq.fr",
    "motDePasse": "lC*1",
    "formations": [{"indiceFormation": "0_1"}]
	}).save() ;	
/**
  * 	chef de département Informatique
*/
new Utilisateur ( {
	"role": "RD",    
    "prenom": "Emmanuelle",
	"nom": "Barbot",
    "email": "isabelle.robba@uvsq.fr",
    "motDePasse": "eB*1",
    "indiceDpt" : "1", 
	}).save() ;
	
/**
  * 	responsable formation
*/
new Utilisateur ( {
	"role": "RF",    
    "prenom": "Yann",
	"nom": "Loyer",
    "email": "isabelle.robba@uvsq.fr",
    "motDePasse": "yL*1",
    "formations": [{"indiceFormation": "1_1"}]
	}).save() ;

new Utilisateur ( {
	"role": "RF",    
    "prenom": "Sébastien",
	"nom": "Barreau",
    "email": "isabelle.robba@uvsq.fr",
    "motDePasse": "sB*1",
    "formations": [{"indiceFormation": "1_0"}]
	}).save() ;

/**
  * 	membre du pôle alternance
*/	
 new Utilisateur ( {
	"role": "MPA",    
    "prenom": "Liliana",
	"nom": "Galvez",
    "email": "isabelle.robba@uvsq.fr",
    "motDePasse": "lG*1",     
	}).save() ;
	
/**
  * 	chef de département MMI
*/
new Utilisateur ( {
	"role": "RD",    
    "prenom": "Edwige",
	"nom": "Lelièvre",
    "email": "isabelle.robba@uvsq.fr",
    "motDePasse": "eL*1",
    "indiceDpt" : "2", 
	}).save() ;
	
/**
  * 	responsable formation
*/
new Utilisateur ( {
	"role": "RF",    
    "prenom": "Cédric",
	"nom": "Fournerie",
    "email": "isabelle.robba@uvsq.fr",
    "motDePasse": "cF*1",
    "formations": [{"indiceFormation": "2_0"}]
	}).save() ;
	
/**
  * 	chef de département RT
*/
new Utilisateur ( {
	"role": "RD",    
    "prenom": "Willy",
	"nom": "Guillemin",
    "email": "isabelle.robba@uvsq.fr",
    "motDePasse": "wG*1",
    "indiceDpt" : "3", 
	}).save() ;
	
/**
  * 	responsable formation
*/
new Utilisateur ( {
	"role": "RF",    
    "prenom": "Sébastien",
	"nom": "Lemoël",
    "email": "isabelle.robba@uvsq.fr",
    "motDePasse": "sL*1",
    "formations": [{"indiceFormation": "3_0"}, {"indiceFormation": "3_1"}]
	}).save() ;
	
/**
  * 	responsable formation
*/
new Utilisateur ( {
	"role": "RF",    
    "prenom": "Stephan",
	"nom": "Soulayrol",
    "email": "isabelle.robba@uvsq.fr",
    "motDePasse": "sS*1",
    "formations": [{"indiceFormation": "3_2"},{"indiceFormation": "3_3"}]
	}).save() ;
	
 