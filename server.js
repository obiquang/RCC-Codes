const PORT = 3000
const bwipjs    = require('bwip-js')
const express = require('express')
const main = express()

// ********** Ressource public statique ******************************
//
main.use(express.static("HTML"))


// Définition du moteur d'affichage EJS
main.set('view engine', 'ejs')
main.set('views', 'HTML')


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
let TEXT        = 'BIENVENUE'
let TEXTinclude = 'false'
let scaleSelect = 5



//*********** GENERATION DE CODES ****************
main.get('/', (req, res) => {

    const parametres = req.query // Lecture des query
    //console.log(req.query)
    let monText = parametres.text
    let CodeType = parametres.type

    // Si pa de texte mettre un texte par défaut
    if(parametres.text == undefined){
        monText = TEXT
        TEXTinclude = 'true'
    }else{
        monText = encodeURIComponent(parametres.text)    // encoder pour garder la chaine intacte
    }

    // Si pas de type de code, utiliser le code 128 par défaut
    if(parametres.type == undefined){
        CodeType = 'code128'
        TEXTinclude = 'true'
    }else{

        const CodeTypeClef = Object.keys(CODE_TYPE).find((clef) => clef === parametres.type)
        //console.log('la clé est : ' + CodeTypeClef)
        if(!CodeTypeClef){ res.status(400).send('code non trouvé!') }
        else{ CodeType = CODE_TYPE[CodeTypeClef] }
        //CodeType = parametres.type
        //console.log(CodeType)
    }

    const textSaisi = monText   // text retour pour affichage client

    //console.log(CodeType)
    //console.log(monText)
    bwipjs.toBuffer({
        //bcid:        'datamatrixrectangular',       // Barcode type : datamatrix, code128 ....
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
                res.render('code', {myPng,  textSaisi})

                //res.send(myPng)
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
