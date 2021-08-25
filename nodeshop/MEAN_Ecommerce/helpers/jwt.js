const expressJwt = require("express-jwt");
const secret = process.env.SECRET;
const authJwt = () => {
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      "/api/v1/users/login",
      "/api/v1/users/register",
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
    ],
  });
};
const isRevoked = async (req, payload, done) => {

  if (!payload.isAdmin) {
    return await done(null, true);
  }
  return await done();
};
module.exports = authJwt;
