const axios = require('axios');

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

async function getGeocoordinates(address) {
    try {
        const response = await axios.get(NOMINATIM_URL, {
            params: {
                q: address,
                format: 'json',
                addressdetails: 1,
            },
        });

        if (response.data.length > 0) {
            const location = response.data[0];
            return {
                lat: location.lat,
                lng: location.lon,
            };
        } else {
            throw new Error('No results found');
        }
    } catch (error) {
        console.error('Error fetching geocoordinates:', error);
        throw error;
    }
}

module.exports = getGeocoordinates;
