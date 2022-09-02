const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  const { message } = err;
  const stack = process.env.NODE_ENV === "production" ? "🥞" : err.stack;
  res.json({ message, stack });
};

module.exports = { notFound, errorHandler };
