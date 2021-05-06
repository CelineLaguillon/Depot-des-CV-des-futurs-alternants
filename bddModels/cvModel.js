  var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;
 var connection = mongoose.createConnection('mongodb://localhost:27017/apolaBD');


 var schemaCV = new mongoose.Schema({
    auteur: Number,
    id_doc: Number,
    titre: String,
    version: Number
  });
  const CV = mongoose.model('CV', schemaDocuments);
  module.exports = CV;
	const testCV = new CV ({auteur: 5,
    id_doc: 5,
    titre: 'testCV',
    version: 3});
  testCV.save()