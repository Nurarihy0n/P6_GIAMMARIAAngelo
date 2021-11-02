const Sauce = require('../models/modelsSauce');
const fs = require('fs');
const User = require('../models/User');
const { STATUS_CODES } = require('http');

//Creation du nouvelle sauce 
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce saved !' }))
        .catch(error => res.status(400).json({ error }));
};
//Recuperation de la sauce d'un utilisateur
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => { res.status(200).json(sauce) })
        .catch(error => res.status(404).json({ error }));
};
//Modification des renseignement d'une sauce par son utilisateur 
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce updated successfully !' }))
        .catch(error => res.status(400).json({ error: "Probleme avec la modification" }));
};
//Suppression de la sauce par son utilisateur
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Deleted !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};
//Recuperation de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json( sauces ))
        .catch(error => res.status(400).json({ error, message: 'Sauce non trouve' }));
};

//Ajout du like/disliked de la sauce
exports.likedSauce = (req, res, next) => {
    let userId = req.body.userId;
    let like = req.body.like;

    let sauce = Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (like == 1) {
                Sauce.updateOne({ _id: req.params.id },
                    { $push: { usersLiked: userId }, $inc: { likes: 1 } })
                    .then(() => res.status(200).json({ message: 'Sauce liked !' }))
                    .catch(err => res.status(400).json({ err }));
            }
            else if (like == -1) {
                Sauce.updateOne({ _id: req.params.id },
                    { $push: { usersDisliked: userId }, $inc: { likes: -1 } })
                    .then(() => res.status(200).json({ message: "Sauce disliked !" }))
                    .catch(err => res.status(400).json({ err }));
            }
            else {
                Sauce.updateOne({ _id: req.params.id },
                    { $pull: { usersLiked: userId, usersDisliked: userId }, $inc: { likes: 0 } })
                    .then(() => res.status(200).json({ message: "Like Updated" }))
                    .catch(err => res.status(400).json({ err }));
            }
        })
        .catch(err => res.status(400).json({ err }))
};