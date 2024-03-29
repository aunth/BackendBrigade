import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: 'http://localhost:3000/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {

    const displayName = profile.displayName || (profile.name && profile.name.givenName);

    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';

    return done(null, { email, displayName });
}));

passport.serializeUser<any, any>((user: any, done: any) => {
    done(null, user.displayName);
});

passport.deserializeUser<any, any>((name: any, done: any) => {
    done(null, { name });
});

export default passport;
