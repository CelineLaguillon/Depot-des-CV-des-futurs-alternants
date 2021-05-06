var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/apolaBD'); //,{useMongoClient: true });


const Departement = require('./BDDmodels/departementModel.js');

const deptInfo = new Departement ({
		"indice":"1",
		"nom": "Informatique", 
		"responsable":[ {
			"responsable": "Emmanuelle Barbot",  
		}],
		"formations": [ {
			 "nom": "DUT Informatique 2A",  
			"ouverte" : true,
			},
			{
			 "nom": "LP SISW",  
			"ouverte" : true,
			}]
	}) ;
	
deptInfo.save()

const deptMMI = new Departement ({
		"indice": "2",
		"nom": "MMI", 
		"responsable":[ {
			"responsable": "Edwige Lelièvre",  
		}],
		"formations": [ {
			 "nom": "LP METWEB",  
			"ouverte" : true,
			}]
	}) ;
	
deptMMI.save()


const deptRT = new Departement ( {
		"indice": "3",
		"nom": "Réseaux et Télécommunications", 
		"responsable":[ {
			"responsable": "Willy Guillemin",  
			}],
		"formations": [ {
			 "nom": "DUT RT 1A", 
			 
			"ouverte" : true,
			},
			 {
			 "nom": "DUT RT 2A", 
			 
			"ouverte" : true,
			},
			{
			 "nom": "LP ASUR",  
			"ouverte" : true,
			},{
			 "nom": "LP RTHD ", 
			 
			"ouverte" : true,
			}]
	}) ;
	
deptRT.save()

const deptGEII = new Departement ({
		"indice": "0",
		"nom": "Génie Electronique et Informatique Industrielle", 
		"responsable":[ {
			"responsable": "Florent Basset",  
			}],
		"formations": [ {
			"nom": "DUT GEII 2A",  
			"ouverte" : true,
			},
			{
			 "nom": "LP Systèmes embarqués",  
			"ouverte" : true,
			}]
	}) ;
	
deptGEII.save()
