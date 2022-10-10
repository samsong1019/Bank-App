const router = require('express').Router();
const { User, Account } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth,  async (req, res) => {
    try {
        const userData = await Account.findByPk(req.session.user_id, {
         attributes: { exclude: ['pin'] },
        });

        const users = userData.map((account) => account.get({ plain: true }));
        
        res.render('homepage', {
            users,

            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if(req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
})
module.exports = router;
