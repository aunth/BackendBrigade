
import express from 'express';
import passport from './../passport-config';

interface User {
    displayName: string;
    email: string;
}

const router = express.Router();

router.get('/',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        console.log(req.user);
        if (req.user) {
            const user = req.user as User
            const name = user.displayName;
            const email = user.email;
            console.log(name);
            console.log(email);
            res.redirect(`/registration?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
        }
    }
);


export default router;
