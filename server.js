const PORT      = process.env.PORT || 3000
const bwipjs    = require('bwip-js')
const express   = require('express')
const main      = express()


// Codes prise en charge par bwip-js
const CODE_TYPE = {
    'CODE128'   : 'code128',
    '128'       : 'code128',
    'QRCODE'    : 'qrcode',
    'QR'        : 'qrcode',
    'DM'        : 'datamatrix',
    'DMR'       : 'datamatrixrectangular'
}


// init variable par défaut
let CodeType    = 'code128'
let monText     = 'BIENVENUE'
let TEXTinclude = 'false'
let scaleSelect = 5



//*********** GENERATION DE CODES ****************
main.get('/', (req, res) => {

    // Lecture des querys
    const parametres = req.query 

    // Si pas de texte mettre un texte par défaut
    if(parametres.text == undefined){ monText = 'BIENVENUE' }
    else{ monText = encodeURIComponent(parametres.text) }   // encoder pour garder la chaine intacte 

    // Si pas de type de code, utiliser le code 128 par défaut
    if(parametres.type == undefined){ CodeType = 'code128' }
    else{
        // Chercher la clé
        const CodeTypeClef = Object.keys(CODE_TYPE).find((clef) => clef === parametres.type)
        //console.log('la clé est : ' + CodeTypeClef)
        if(!CodeTypeClef){ res.status(400).send('Type de code non trouvé!') }
        else{ CodeType = CODE_TYPE[CodeTypeClef] }
    }

    // Si pas de textInclus, on met true par defaut
    if(parametres.txtInc == undefined){ TEXTinclude = 'true' }
    else{ TEXTinclude = parametres.txtInc }

    // Si pas de scale, on definit par defaut à 1
    if(parametres.echelle == undefined){ scaleSelect = 1 }
    else{ scaleSelect = parametres.echelle }

    //const textSaisi = monText   // text retour pour eventuellement affichage client

    // GENERATION DE L'IMAGE
    bwipjs.toBuffer({
        bcid        : CodeType,         // Barcode type : datamatrix, code128 ....
        text        : monText,          // Text to encode
        scale       : scaleSelect,      // 3x scaling factor
        //height      : 10,               // Bar height, in millimeters
        includetext : TEXTinclude,      // Show human-readable text
        //textxalign:  'center',        // Always good to set this
    }, function (err, png) {
            if (err) {
                // `err` may be a string or Error object
                res.render('erreur', err)
            } else {
                // `png` is a Buffer
                // png.length           : PNG file length
                // png.readUInt32BE(16) : PNG image width
                // png.readUInt32BE(20) : PNG image height
                const myPng = 'data:image/png;base64,' + png.toString('base64')
                res.send('<img src="' + myPng + '"/>')
            }
        }
    )

})




// Page erreur à afficher si aucune route n'est trouvée
// mettre à la fin sinon les autres main.xxx ne seront pas lu par le programme
main.use( (req, res) => {
    res.status(404).send('Erreur 404')
})

// ********** PORT D'ECOUTE ********************************
main.listen(PORT, () => console.log(` Serveur est démarré sur le port ${PORT}`) )
