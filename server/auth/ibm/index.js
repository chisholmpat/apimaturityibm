'use strict'

import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';

var router = express.Router();

router.get('/', passport.authenticate('openidconnect', {
	failureRedirect: '/signup'
}))
.get('/callback', passport.authenticate('openidconnect', {
	successRedirect: '/main',
    failureRedirect: '/signup',
    session: false
}), setTokenCookie);

export default router;