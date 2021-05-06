var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/apolaBD',{useUnifiedTopology: true, useNewUrlParser: true });

const Departement = require('./bddModels/departement.js');
var query = Departement.findOne({});

// selecting the `name` and `occupation` fields
//query.select('nom responsable');
// execute the query at a later time
query.exec(function (err, dpt) {
  if (err) {console.log( "**************************PB connexion mongo*******************") ;
		return handleError(err); 
		}
 // console.log(JSON.stringify (dpt));
 // console.log( dpt.nom, " " , JSON.stringify(dpt.formations));
});


//var queryDpt = Departement.find ({"nom":"MMI"} );
var queryDpt = Departement.find ({} );
  queryDpt.exec (function(err, dpts) {
    if (err) //throw err;
	return handleError(err);

    dpts.forEach(function( dpt , indice) {
            
            console.log( indice + " " + JSON.stringify(dpt)  );
        });
  });