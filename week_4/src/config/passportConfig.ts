import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
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
            return done(null, user);
          })
          .catch((err) => {
            return done(err);
          });
      }
    )
  );

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user:any, info:any) => {
      if (err || !user) {
        res.clearCookie('token');
        return res.redirect('/')
      }
      req.user = user;
      if (user.role !== 'admin') {
        req.body.name = user.name;
      } else {
        req.body.name = undefined;
      }
      return next();
    })(req, res, next);
  };


export default passport;