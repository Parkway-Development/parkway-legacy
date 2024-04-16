function removeSensitiveData(obj, seen = new WeakSet()) {
  if (Array.isArray(obj)) {
    return obj.map(item => removeSensitiveData(item, seen));
  } else if (obj && typeof obj === 'object') {
    if (seen.has(obj)) {
      // If we've seen this object before, avoid processing it again to prevent infinite recursion
      return obj;
    }
    seen.add(obj); // Mark this object as seen

    Object.keys(obj).forEach(key => {
      if (key.toLowerCase() === 'password' || key.toLowerCase() === 'secret' || key.toLowerCase() === 'applicationsecret') {
        delete obj[key]; // Remove sensitive properties
      } else if (typeof obj[key] === 'object') {
        // Recurse into nested objects
        removeSensitiveData(obj[key], seen);
      }
    });
  }
  return obj;
}

module.exports = removeSensitiveData;
