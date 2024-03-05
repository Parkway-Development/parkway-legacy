const mongoose = require('mongoose')
const chordChart = require('../models/chordChartModel')

//Add a chord chart
const addChordChart = async (req, res) => {
    try {
        const newChordChart = new chordChart(req.body)
        await newChordChart.save()
        res.status(201).json(newChordChart)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Get all chord charts
const getAllChordCharts = async (req, res) => {
    try {
        const chordCharts = await chordChart.find()
        res.json(chordCharts)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Get chord chart by id
const getChordChartById = async (req, res) => {
    try {
        const chordChart = await chordChart.findById(req.params.id)
        res.json(chordChart)
    } catch (error) {
        res.status(404).json({ message: 'Chord chart not found' })
    }
}

//Get chord chart by key
const getChordChartByKey = async (req, res) => {
    try {
        const chordChart = await chordChart.find({ key: req.params.key })
        res.json(chordChart)
    } catch (error) {
        res.status(404).json({ message: 'Chord chart not found' })
    }
}

//Get chord chart by title
const getChordChartByTitle = async (req, res) => {
    try {
        const chordChart = await chordChart.find({ title: req.params.title })
        res.json(chordChart)
    } catch (error) {
        res.status(404).json({ message: 'Chord chart not found' })
    }
}

//Get chord chart by vocalist
const getChordChartByVocalist = async (req, res) => {
    try {
        const chordChart = await chordChart.find({ vocalist: req.params.vocalist })
        res.json(chordChart)
    } catch (error) {
        res.status(404).json({ message: 'Chord chart not found' })
    }
}

//Get chord chart by type
const getChordChartByType = async (req, res) => {
    try {
        const chordChart = await chordChart.find({ type: req.params.type })
        res.json(chordChart)
    } catch (error) {
        res.status(404).json({ message: 'Chord chart not found' })
    }
}

//Get chord chart by keywords
const getChordChartByKeywords = async (req, res) => {
    try {
        const chordChart = await chordChart.find({ keywords: req.params.keywords })
        res.json(chordChart)
    } catch (error) {
        res.status(404).json({ message: 'Chord chart not found' })
    }
}

//Update chord chart by id
const updateChordChartById = async (req, res) => {
    try {
        const chordChart = await chordChart.findByIdAndUpdate(req.params.id)
        res.json(chordChart)
    } catch (error) {
        res.status(404).json({ message: 'Chord chart not found' })
    }
}

//Delete chord chart by id
const deleteChordChartById = async (req, res) => {
    try {
        await chordChart.findByIdAndDelete(req.params.id)
        res.json({ message: 'Chord chart deleted' })
    } catch (error) {
        res.status(404).json({ message: 'Chord chart not found' })
    }
}

module.exports = { 
    addChordChart, 
    getAllChordCharts, 
    getChordChartById, 
    getChordChartByKey,
    getChordChartByTitle,
    getChordChartByVocalist,
    getChordChartByType,
    getChordChartByKeywords,
    updateChordChartById,
    deleteChordChartById
}
