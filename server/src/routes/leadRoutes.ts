import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { createLead, deleteLead, getLead, getLeads, updateLead } from '../controllers/leadController';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
    query('source').optional().isIn(['Website', 'Instagram', 'Referral']),
    query('sort').optional().isIn(['latest', 'oldest'])
  ],
  getLeads
);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('status').isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Status is required'),
    body('source').isIn(['Website', 'Instagram', 'Referral']).withMessage('Source is required')
  ],
  createLead
);

router.get('/:id', [param('id').isMongoId().withMessage('Valid lead id required')], getLead);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Valid lead id required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('status').isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Status is required'),
    body('source').isIn(['Website', 'Instagram', 'Referral']).withMessage('Source is required')
  ],
  updateLead
);

router.delete('/:id', [param('id').isMongoId().withMessage('Valid lead id required')], deleteLead);

export default router;
