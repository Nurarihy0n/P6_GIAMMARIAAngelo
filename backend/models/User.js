const mongoose = require('mongoose');
//plugins pour valider que chaque nouvelle adresse est unique 
const uniqueValidator = require('mongoose-unique-validator');
//plugin pour securiser l'app des injection NoSQL dans la base de donnees MongoDb
const sanitizerPlugin = require('mongoose-sanitizer');

//schema pour l'inscription ou la connexion d'un utilisateurs
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model('User', userSchema);