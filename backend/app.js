const express = require('express');
//Plugin pour lutter contre les attaques de force brute
const rateLimit = require('express-rate-limit');
//plugin pour securiser les en-tetes des requetes
const helmet = require('helmet');
const mongoose = require('mongoose');

require('dotenv').config();

const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//plugin express-rate-limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limite chaque adresse IP a 100 requete par fenetre
});

const app = express();
app.use(helmet());
app.use(limiter);

let connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hp1qc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

//Connexion a la base de donnees MongoDB
mongoose.connect(connectionString,
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));
mongoose.set('useCreateIndex', true);

// middleware pour eviter les erreurs CORS 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
 });


app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;