////////// contient de l'application //////////

//importations
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user'); //importation du routeur user
const sauceRoutes = require('./routes/sauce'); //importation du routeur sauce

//création de notre application express
const app = express();

//connexion à bdd MongoDB via mongoose
mongoose.connect('mongodb+srv://caroline:test@cluster0.vtyck.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//rend le corps des requêtes json (de tt types) => en objet JS utilisable -- anciennement body-parser
app.use(express.json());

//enregistre les routeurs dans l'application
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);


//exporte l'application
module.exports = app;