function unless(middleware, ...excludedPaths) {
    return function(req, res, next) {
      const pathCheck = excludedPaths.some(path => req.path.startsWith(path));
      // Proceed without middleware if path matches, otherwise use middleware
      if (pathCheck) {
        return next();
      } else {
        return middleware(req, res, next);
      }
    };
  }
  
  module.exports = { unless };