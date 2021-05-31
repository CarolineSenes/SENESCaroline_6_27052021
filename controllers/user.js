////////// contient logique métier pour user //////////

//importations 
const bcrypt = require('bcrypt'); //package de chiffrement bcrypt
const jwt = require('jsonwebtoken'); //package pour créer et vérifier les tokens d'authentification
const User = require('../models/User'); //schéma de User
const maskData = require('maskdata'); //package pour masquer l'email (utilisation du masquage par défaut)

//exporte les fonctions
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: maskData.maskEmail2(req.body.email), 
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: maskData.maskEmail2(req.body.email) }) 
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id }, //données à encoder (=payload)
              'RANDOM_TOKEN_SECRET', //clé secrète pour l'encodage
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};