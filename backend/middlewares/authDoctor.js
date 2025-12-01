import jwt from 'jsonwebtoken';

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.dtoken;

        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'Authorization token missing' });
        }

        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'doctor') {
            return res.status(403).json({ success: false, message: 'Not Authorized. Doctor only.' });
        }

        req.doctor = decoded; // attach doctor info
        next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authDoctor;
