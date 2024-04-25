
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging
    
    // Create a detailed error response
    const errorResponse = {
      status: 'error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : '🔒',
    };
  
    res.status(err.statusCode || 500).json(errorResponse);
  });
  