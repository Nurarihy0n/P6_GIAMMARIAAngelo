const mongoose = require('mongoose');
//plugin pour securiser l'app des injection NoSQL dans la base de donnees MongoDb
const sanitizerPlugin = require('mongoose-sanitizer');


//schema pour la creation des sauces
const modelsSauce = mongoose.Schema({
    userId: { type: String, required: true},
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: true},
    heat: { type: Number, required: true},
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0},
    usersLiked: { type: [String.userId], default: []},
    usersDisliked: { type: [String.userId], default: []}
});

modelsSauce.plugin(sanitizerPlugin);

module.exports = mongoose.model('ModelsSauce', modelsSauce);