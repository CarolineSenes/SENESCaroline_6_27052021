////////// contient de l'application //////////

//importations
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); //donne accès au chemin de notre système de fichier
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const userRoutes = require('./routes/user'); //importation du routeur user
const sauceRoutes = require('./routes/sauce'); //importation du routeur sauce

//création de notre application express
const app = express();

//connexion à bdd MongoDB via mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtyck.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
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

//Limite à 100, le nombre de requêtes par IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

//définit divers en-têtes HTTP sécurisées
app.use(helmet());

//limiteur de requêtes s'applique seuelement aux requêtes commençant par API (=ne concerne pas les express.static)
app.use('/api', apiLimiter); 

//rend le corps des requêtes json (de tt types) => en objet JS utilisable -- anciennement body-parser
app.use(express.json());

//enregistre les routeurs dans l'application
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);


//exporte l'application
module.exports = app;