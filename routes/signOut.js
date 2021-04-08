const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    delete req.session.username;
    delete req.user;
    res.json({
        success: true,
        msg: 'Signed Out',
        session: req.session
    })
});

module.exports = router;