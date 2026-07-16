import { Router } from 'express';
import { resolveScan } from '../db.js';
import { isValidId } from '../utils/id.js';
import { expiredPage } from '../views/expired.js';

const router = Router();

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const destination = isValidId(id) ? resolveScan(id) : null;
  if (destination) {
    return res.redirect(302, destination);
  }
  res.status(410).type('html').send(expiredPage());
});

export default router;
