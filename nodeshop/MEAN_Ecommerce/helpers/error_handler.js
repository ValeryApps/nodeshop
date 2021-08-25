const errorHandler = (err, req, res, next) => {
  if (err?.name === "UnauthorizedError") {
    return res.status(401).send({ message: "You are not authorized" });
  }
  if (err?.name === "ValidationError") {
    return res?.status(400).send(err);
  }
  return res?.status(500).send(err);
};
module.exports = errorHandler;
