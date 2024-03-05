const express = require('express');
const { requireAuthorization} = require("../auth");
const router = express.Router();
requireAuthorization(router);

//Add a chord chart
router.post('/', addChordChart)

//Get all chord charts
router.get('/', getAllChordCharts)

//Get chord chart by id
router.get('/:id', getChordChartById)

//Get chord chart by key
router.get('/key/:key', getChordChartByKey)

//Get chord chart by title
router.get('/title/:title', getChordChartByTitle)

//Get chord chart by vocalist
router.get('/vocalist/:vocalist', getChordChartByVocalist)

//Get chord chart by type
router.get('/type/:type', getChordChartByType)

//Get chord chart by keywords
router.get('/keywords/:keywords', getChordChartByKeywords)

//Update chord chart by id
router.put('/:id', updateChordChartById)

//Delete chord chart by id
router.delete('/:id', deleteChordChartById)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;