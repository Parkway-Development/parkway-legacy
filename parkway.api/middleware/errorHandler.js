
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
      status: 'error',
      statusCode,
      message: err.message,
      errorCode: err.errorCode
  });
};

module.exports = errorHandler;

// app.use((err, req, res, next) => {
//     console.error(err.stack); // Log error stack for debugging
    
//     // Create a detailed error response
//     const errorResponse = {
//       status: 'error',
//       statusCode,
//       message: err.message,
//       errorCode: err.errorCode,
//       stack: process.env.NODE_ENV === 'development' ? err.stack : '🔒',
//     };
  
//     res.status(err.statusCode || 500).json(errorResponse);
//   });
  