const express = require('express');
const { requireAuthorization} = require("../auth");
const router = express.Router();
requireAuthorization(router);

//Upload a CSV File
router.post('/upload/subsplash', upload.single('file'), (req, res) => {

    try{
    const results = [];
    fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log(results);
        res.json({results: results});
    });
    res.json({file: req.file});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error});
    }
});

// const{
//     addClient,
//     getAllClients,
//     getClientById,
//     getClientByName,
//     getClientByAccountNumber,
//     getClientByBusinessPhone,
//     getClientByBusinessEmail,
//     updateClient,
//     deleteClient
// } = require('../controllers/clientController')