const mongoose = require('mongoose')

//const departementSchema = mongoose.Schema({
// name: String,

 const departementSchema = new mongoose.Schema({
    indice: String,
    nom:  String,  
    responsable: [ {
		responsable: String
	}], 
    formations: [ {
      nom: String,   
      ouverte: Boolean
    }]
  });
  
const Departement = mongoose.model('Departement', departementSchema)

module.exports = Departement
