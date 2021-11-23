/* login with facebook */
// app.get('/login/facebook', passport.authenticate('facebook'));
// /* login with google */
// app.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }));

// app.get(
//     '/auth/facebook',
//     passport.authenticate('facebook', { failureRedirect: '/login' }),
//     (req, res) => {
//         const { user } = req;
//         res.send(user);
//     }
// );

// /* callback login with facebook */
// app.get(
//     '/auth/google',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {
//         res.redirect('/');
//     }
// );
