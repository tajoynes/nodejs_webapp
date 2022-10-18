const passport = require("passport");
require("./strategies/local.strategy")();

module.exports = function passportConfig(app) {
  //  initialize passport on the app
  app.use(passport.initialize());
  app.use(passport.session());
  // Serialized user into a session
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  // Deserialized user when request are made
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
