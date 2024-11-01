// authMiddleware.js
const jwt = require('jsonwebtoken');

const isAuthen = async (req, res, next) => {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1]; // Bearer token example "Bearer tsdsdfsdf9svdf"
            const decoded = await jwt.verify(token, process.env.SECRET_KEY);

            if (decoded) {
                next();
            } else {
                return res.status(401).send({ error: 'Unauthorized' });
            }
        } catch (e) {
            return res.status(401).send({ error: e.message });
        }
    } else {
        return res.status(401).send({ error: 'Unauthorized' });
    }
};

module.exports = isAuthen;
