////////// contient logique métier pour user //////////

//importations 
const bcrypt = require('bcrypt'); //package de chiffrement bcrypt
const jwt = require('jsonwebtoken'); //package pour créer et vérifier les tokens d'authentification
const User = require('../models/User'); //schéma de User
const MaskData = require('maskdata'); //package pour masquer l'email (utilisation du masquage par défaut)


///// exports des fonctions /////

//inscription utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // hash avec bcrypt avec une boucle de 10
    .then(hash => {
      const user = new User({
        email: MaskData.maskEmail2(req.body.email), //masque l'email
        password: hash //assigne le hash obtenu à password
      });
      user.save() //sauvegarde dans MongoDB
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


// connexion utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: MaskData.maskEmail2(req.body.email) }) //compare l'email masqué avec req.body.email
    .then(user => { //recherche l'utilisateur correspondant
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) //compare avec bcrypt le password de la requête et celui dans MongoDB
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id, //renvoie _ID généré par MongoDB,
            token: jwt.sign( //et TOKEN d'authentification
              { userId: user._id }, //données à encoder (=payload)
              'RANDOM_TOKEN_SECRET', //clé secrète pour l'encodage
              { expiresIn: '24h' } //durée de validité du TOKEN
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};