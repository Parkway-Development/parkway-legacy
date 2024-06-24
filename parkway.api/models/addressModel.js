const mongoose = require('mongoose');

const coordinatesSchema = new mongoose.Schema({
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
});

const addressSchema = new mongoose.Schema({
    location: { 
        type: String, 
        enum: ['Point'], 
        required: true 
    },
    coordinates: coordinatesSchema,
    formattedAddress: { 
        type: String, 
        required: true 
    },
    street: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    state: { 
        type: String, 
        required: true 
    },
    zipcode: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true 
    }
});

addressSchema.index({ coordinates: '2dsphere' });

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
