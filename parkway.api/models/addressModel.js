const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    location: { 
        type: String, 
        enum:['Point'], 
        required: true, 
    },
    coordinates: { 
        type: [Number], 
        required: true 
    },
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

addressSchema.index({ location: '2dsphere' });

const Address = mongoose.model('Address', addressSchema);