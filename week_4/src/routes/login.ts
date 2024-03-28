import express, { Response, Request } from 'express';
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs';
import passport  from 'passport';
import { dbHandler } from '../database_integration/DataBaseWorker';
import { handle2FACodeRequest } from '../utils/utils';
import { getEmployeeId } from '../utils/utils';

import dotenv from 'dotenv';
dotenv.config();



const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const error = req.query.error;
  res.render('login', {error: error});
});


router.post('/login', async (req, res) => {
  const { email, password} = req.body;
  const { token } = req.cookies;

  console.log(email);

  //jwt.verify(token, process.env.JWT_SECRET as string, async (err: any, decoded: any) => {
  //  if (err) {
  //      return res.redirect('/');
  //  } else {
  //    return res.redirect('/main');
  //  }
  //});
  
  try {
    const employee = await dbHandler.getEmployeeByEmail(email);
    console.log(employee);
    console.log(employee?.email);
    if (!(employee?.email)) {
      return res.redirect(`/?error=User with this email doesn't exist!`);
      //return res.status(400).json({ message: "Email does not match!" });
    }

    //const isMatch = await bcryptjs.compare(password, employee.password);
    //if (!isMatch) {
    //  return res.status(400).json({ message: "Password does not match!" });
    //}

    if (!(password == employee.password)) {
      return res.redirect(`/?error=Password does not match!`);
      //return res.status(400).json({ message: "Password does not match!" });
    }

    console.log("employee.two_fa_code", employee.two_fa_code);
    console.log("!employee.two_fa_code", !employee.two_fa_code);


    if (employee.two_fa_code){
      return res.redirect(`/verify-2fa?employeeId=${encodeURIComponent(employee.employee_id.toString())}`);
    }

    const twoFaCode = (await handle2FACodeRequest(employee.email));

    if (twoFaCode.status) {

      return res.redirect(`/verify-2fa?employeeId=${encodeURIComponent(employee.employee_id.toString())}`);

    } else {
      return res.redirect(`/?error=${twoFaCode.message}`);
      //return res.status(400).json({ message: "2FA code didn't send!" });
    }

      //const jwtToken = jwt.sign(
      //  { id: employee.employee_id, email: employee.email },
      //  process.env.JWT_SECRET as string,
      //  { expiresIn: '1h' }
      //);
//
      //res.cookie('token', jwtToken, {
      //  httpOnly: true,
      //  secure: false,  //process.env.NODE_ENV !== 'development',
      //  sameSite: 'strict',
      //  maxAge: 3600000,
      //});
//
      //return res.json({ message: "Login successful", token: jwtToken });
    } catch (error) {
      console.error("Login error: ", error);
      res.status(500).json({ message: "Server error during login" });
    }
});


export default router;