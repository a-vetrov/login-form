import express from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import crypto from 'crypto'
import {getUserByEmail, getUserById} from "../db.js";
import {sendError} from "../handlers/error.js";
import {ensureLoggedIn} from "../handlers/ensure-logged-in.js";

const checkPassword = (userInfo, password) => {
  const key = crypto.pbkdf2Sync(password, userInfo.salt, 100000, 64, 'sha512');
  return crypto.timingSafeEqual(userInfo.password, key)
}

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async function verify(email, password, cb) {
  const userInfo = await getUserByEmail(email)
  if (!userInfo || !checkPassword(userInfo, password)) {
    return cb(null, false, {message: 'Incorrect username or password.'})
  }
  return cb(null, userInfo)
}));

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser((id, done) => {
  getUserById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null))
})

export const authRouter = express.Router();

authRouter.post('/api/login', passport.authenticate('local', {
  failureMessage: true,
  successMessage: 'Success message',
}), function(req, res) {
  let data
  if(req.user) {
    const {name, email, role} = res.req.user
    data = {userInfo: {name, email, role}}
  }
  res.status(200).send({ success: true, data });
});

/* POST /logout
 *
 * This route logs the user out.
 */
authRouter.post('/api/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


/* POST /user-info
 *
 * This route returns user info if logged in.
 */
authRouter.get('/api/user-info', ensureLoggedIn, (req, res) => {
  if(req.user) {
    const {name, email, role} = res.req.user
    const data = {userInfo: {name, email, role}}
    res.status(200).send({ success: true, data });
  } else {
    sendError(res, 403, 'Ошибка', 'Неожиданная ошибка')
  }

})


/* POST /signup
 *
 * This route creates a new user account.
 *
 * A desired username and password are submitted to this route via an HTML form,
 * which was rendered by the `GET /signup` route.  The password is hashed and
 * then a new user record is inserted into the database.  If the record is
 * successfully created, the user is logged in.
 */

/*
router.post('/signup', function(req, res, next) {
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    if (err) { return next(err); }
    db.run('INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
      req.body.username,
      hashedPassword,
      salt
    ], function(err) {
      if (err) { return next(err); }
      var user = {
        id: this.lastID,
        username: req.body.username
      };
      req.login(user, function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    });
  });
});

 */


