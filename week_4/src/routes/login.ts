import express, { Response, Request } from 'express';
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs';
import passport  from 'passport';
import { dbHandler } from '../database_integration/DataBaseWorker';
import { handle2FACodeRequest } from '../utils/utils';
import { getEmployeeId } from '../utils/utils';
import * as bcrypt from 'bcryptjs';

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

  try {
    const employee = await dbHandler.getEmployeeByEmail(email);
    console.log(employee?.password);
    console.log('Employee' + employee);
    console.log(employee?.email);
    if (!(employee?.email)) {
      return res.redirect(`/?error=User with this email doesn't exist!`);
    }


    if (!(await bcrypt.compare(password, employee.password))) {
      return res.redirect(`/?error=Password does not match!`);
    }

    console.log("employee.two_fa_code", employee.two_fa_code);
    console.log("!employee.two_fa_code", !employee.two_fa_code);


    const twoFaCode = (await handle2FACodeRequest(employee.email));

    if (employee.two_fa_code){
      return res.redirect(`/verify-2fa?employeeId=${encodeURIComponent(employee.employee_id.toString())}`);
    }

    console.log(twoFaCode.status);
    console.log(twoFaCode.message);
    if (twoFaCode.status) {

      return res.redirect(`/verify-2fa?employeeId=${encodeURIComponent(employee.employee_id.toString())}`);

    } else {
      return res.redirect(`/?error=${twoFaCode.message}`);
    }
    } catch (error) {
      console.error("Login error: ", error);
      res.status(500).json({ message: "Server error during login" });
    }
});

router.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');

  res.redirect('/');
});

export default router;