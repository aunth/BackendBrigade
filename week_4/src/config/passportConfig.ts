import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import { EmployeeCredentials } from '../types/types';
import { dbHandler } from '../database_integration/DataBaseWorker';

dotenv.config();

passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: (req) => {
            if (req && req.cookies) {
              return req.cookies['token'];
            }
            return null;
          },
        secretOrKey: process.env.JWT_SECRET as string,
      },
      async function (jwtPayload, done) {
        return await dbHandler.getEmployeeByJwtPayLoad(jwtPayload)
          .then((user) => {
            console.log(user);
            return done(null, user);
          })
          .catch((err) => {
            return done(err);
            //return
          });
      }
    )
  );

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user:any, info:any) => {
      if (err || !user) {
        return res.redirect('/');
      }
      req.user = user;
      return next();
    })(req, res, next);
  };

//passport.use(
//  new JwtStrategy(
//    {
//      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//      secretOrKey: process.env.JWT_SECRET as string,
//    },
//    async function (jwtPayload, done) {
//      return await dbHandler.getEmployeeByJwtPayLoad(jwtPayload)
//        .then((user) => {
//          console.log(user);
//          return done(null, user);
//        })
//        .catch((err) => {
//            return done(err);
//        });
//    }
//  )
//);

//export const requireAuth = passport.authenticate('jwt', { session: false });

export default passport;