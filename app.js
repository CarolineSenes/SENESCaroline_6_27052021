////////// contient de l'application //////////

//importations
require('dotenv').config(); //charge les variables d'environnement
const express = require('express'); //framework node.js
const mongoose = require('mongoose'); //facilite interactions avec DB MongoDB
const path = require('path'); //donne accès au chemin de notre système de fichier
const rateLimit = require('express-rate-limit'); //limite les requêtes par IP
const helmet = require('helmet'); //définit divers en-têtes HTTP sécurisées
const mongoSanitize = require('express-mongo-sanitize'); //protège des attaques par injection NoSQL(MongoDB)

//100 requêtes toutes les 15min par IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

//création de notre application express
const app = express();

//limiteur de requêtes s'applique seulement aux requêtes commençant par API (=ne concerne pas les express.static)
app.use('/api', apiLimiter); 

app.use(helmet());

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

//rend le corps des requêtes json (de tt types) => en objet JS utilisable -- anciennement body-parser
app.use(express.json());

app.use(mongoSanitize());

//gestion des fichiers images
app.use('/images', express.static(path.join(__dirname, 'images')));

//importe les routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//enregistre les routeurs dans l'application
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

//exporte l'application
module.exports = app;