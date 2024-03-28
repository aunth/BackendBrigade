import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
    clientID: '1043258018742-2enpn02iakd7h45p3jhn8gvi7ck1gk69.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
	console.log('Google authentication successful');
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('Profile:', profile);

    const displayName = profile.displayName || (profile.name && profile.name.givenName);

    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';

    return done(null, { email, displayName });
}));

passport.serializeUser<any, any>((user: any, done: any) => {
    // This function is called when Passport needs to save the user's information to the session
    // You need to extract the unique identifier (e.g., user ID) from the user object
    // and pass it to the done callback
    done(null, user.displayName);
});

passport.deserializeUser<any, any>((name: any, done: any) => {
    // This function is called when Passport needs to retrieve the user's information from the session
    // You need to fetch the user object from your database using the provided identifier (id)
    // and pass it to the done callback
    // Example: User.findById(id, (err, user) => done(err, user));
    // Here, User is your database model
    done(null, { name }); // Example: Returning a dummy user object with id
});

export default passport;
