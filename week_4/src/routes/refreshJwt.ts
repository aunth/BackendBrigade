import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import express from 'express';
import { dbHandler } from '../database_integration/DataBaseWorker';


const router = express.Router();


router.get('/', async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, async (err: any, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: 'Token is invalid or has expired' });
        }

        const employeeId = decoded.id;
        const employeeEmail = decoded.email;

        try {
            const employee = await dbHandler.getEmployeeById(employeeId);
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            const newToken = jwt.sign(
                { id: employeeId, email: employeeEmail },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );

            res.cookie('token', newToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 3600000,
            });
            console.log('Token refreshed successfully');
            return res.redirect('/main')

        } catch (error) {
            console.error("Error refreshing token: ", error);
            return res.status(500).json({ message: "Server error" });
        }
    });
});


export default router;