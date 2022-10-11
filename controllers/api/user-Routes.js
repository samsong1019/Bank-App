const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll({
        attributes: { exclude: ['password'] },
        order: [['name', 'ASC']],
    });

    res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findByPk({
            attributes: { exclude: ['password'] }
        });
        if (!userData) {
            res.status(404).json({ message: 'No user found check ID and search again.' });
            return;
        }

        res.json.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/signup', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.email = userData.email;
            req.session.logged_in = true;
            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({
            where: {email: req.body.email}
        });
        if(!userData) {
            res.status(400).json({ message: 'Login Credentials not found' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Login Credentials not found' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            res.status(200).json(userData);
        });

    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const userData = await User.update(req.body, {
            where: {
                id: req.params.id,
            }
        });
        if (!userData[0]) {
            res.status(404).json({ message: 'No User found check the ID in URL or login status.' });
            return;
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        userData = await User.destroy({
            where: {
                id: req.body.id
            }
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
