const mongoose = require('mongoose')

 const documentSchema = new mongoose.Schema({
    id_auteur: String,
	id_departement: String,
    id_formation: String,
	nom_document: String
  });
  
const Document = mongoose.model('Document', documentSchema)

module.exports = Document
