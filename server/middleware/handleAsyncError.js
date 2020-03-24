// Catch any errors and pass to last middleware in the chain
const handleAsyncError = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
         .catch(next);
};

module.exports = handleAsyncError;