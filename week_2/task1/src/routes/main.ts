
import express, {Response, Request} from 'express';


const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.render('main');
});


router.post('/request-action', (req, res) => {
  const { employeeId, action } = req.body;
  switch (action) {
      case 'create':
          res.redirect(`/add-request?employeeId=${encodeURIComponent(employeeId)}`);
          return;
      case 'update':
          res.redirect(`/update-request?employeeId=${encodeURIComponent(employeeId)}`);
          return;
      case 'delete':
          // Logic to delete a request
          return;
      default:
          res.status(400).send('Unknown action');
          return;
  }

});

export default router;