const axios = require('axios');

async function testRestaurantEndpoint() {
  try {
    const response = await axios.get('http://localhost:5000/api/restaurants/SAMPLE_RESTAURANT_ID', {
      headers: {
        Authorization: `Bearer YOUR_TEST_TOKEN`
      }
    });
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  }
}

testRestaurantEndpoint();