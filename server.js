const PORT = 8080
const express = require('express')
const main = express()

// ********** Ressource public statique ******************************
//
main.use(express.static("HTML"))


//*********** Redirection vers la page CODES ****************
main.get('/', (req, res) => {
    res.status(300).redirect('/codes')
})

// CODES ---------------------------------------------------------
const codegenerator = require('./codegenerator')
main.use('/codes', codegenerator)



// Page erreur à afficher si aucune route n'est trouvée
// mettre à la fin sinon les autres main.xxx ne seront pas lu par le programme
main.use( (req, res) => {

    res.status(404).send('Erreur 404')
})

// ********** PORT D'ECOUTE ********************************
main.listen(PORT, () => console.log(` Serveur est démarré sur le port ${PORT}`) )
