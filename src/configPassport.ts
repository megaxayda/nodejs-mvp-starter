import passportJwt from "passport-jwt";
import passport from "passport";
import mongodb from "mongodb";
import isEmpty from "lodash/isEmpty.js";
import { Express } from "express";
import User from "model/user";

const initPassport = (app: Express) => {
  app.use(passport.initialize());

  const options = {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET,
  };

  passport.use(
    new passportJwt.Strategy(options, async function (jwtPayload, done) {
      try {
        const user = await User.findById(jwtPayload.id).exec();

        if (isEmpty(user)) {
          throw new Error();
        }

        return done(null, jwtPayload);
      } catch (err) {
        return done(null, false);
      }
    })
  );
};

export default initPassport;
