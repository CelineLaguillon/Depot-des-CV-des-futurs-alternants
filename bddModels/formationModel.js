  var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;
 var connection = mongoose.createConnection('mongodb://localhost:27017/apolaBD');

  
  var schemaFormation = new mongoose.Schema({
    nom: String,
    responsablePedagogique: String
  });
  const Formation = mongoose.model('Formation', schemaFormation);
  module.exports = Formation;
  const testFormation = new Formation ({nom: 'uiouiop 2A',responsablePedagogique:"testResp"});
  testFormation.save()

  