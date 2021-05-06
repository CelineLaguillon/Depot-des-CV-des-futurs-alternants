var mongoose = require('mongoose'), 
Schema = mongoose.Schema, 
autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection('mongodb://localhost:27017/apolaBD');
autoIncrement.initialize(connection);

const schemaUtilisateur = new mongoose.Schema({    
    role: String,
    prenom: String,
    nom: String,
    email: String,
    motDePasse: String,
    indiceDpt: String,
    formations: [{indiceFormation: String}]
  });

const Utilisateur = mongoose.model('Utilisateur', schemaUtilisateur);

module.exports = Utilisateur 