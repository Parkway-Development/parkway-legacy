const mongoose = require('mongoose');

const createDeposit = async (req, res) => {
    try {
        const { amount, date, profileId } = req.body;
        if(!amount || !date || !profileId){ throw new Error('Missing required fields.'); }

        const deposit = new Deposit({ amount, date, profileId });
        await deposit.save();

        return res.status(201).json(deposit);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

module.exports = { createDeposit };