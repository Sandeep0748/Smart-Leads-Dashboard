import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Lead from '../models/Lead';

const ITEMS_PER_PAGE = 10;

export async function createLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { name, email, status, source } = req.body as { name: string; email: string; status: string; source: string };
    const ownerId = req.user?.id;
    if (!ownerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const lead = await Lead.create({ name, email, status, source, owner: ownerId });
    res.status(201).json({ lead });
  } catch (error) {
    next(error as Error);
  }
}

export async function getLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
    const status = req.query.status as string | undefined;
    const source = req.query.source as string | undefined;
    const search = req.query.search as string | undefined;
    const sort = req.query.sort === 'oldest' ? { createdAt: 1 as const } : { createdAt: -1 as const };

    const baseFilter: Record<string, unknown> = {};
    if (req.user?.role === 'sales') {
      baseFilter.owner = req.user.id;
    }
    if (status) {
      baseFilter.status = status;
    }
    if (source) {
      baseFilter.source = source;
    }
    if (search) {
      baseFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Lead.countDocuments(baseFilter);
    const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
    const leads = await Lead.find(baseFilter)
      .sort(sort)
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .lean();

    res.status(200).json({
      leads,
      page,
      totalPages,
      total,
      limit: ITEMS_PER_PAGE,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages
    });
  } catch (error) {
    next(error as Error);
  }
}

export async function getLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const lead = await Lead.findById(req.params.id).lean();
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    if (req.user?.role === 'sales' && lead.owner.toString() !== req.user.id) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    res.status(200).json({ lead });
  } catch (error) {
    next(error as Error);
  }
}

export async function updateLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    if (req.user?.role === 'sales' && lead.owner.toString() !== req.user.id) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    lead.name = req.body.name;
    lead.email = req.body.email;
    lead.status = req.body.status;
    lead.source = req.body.source;
    await lead.save();

    res.status(200).json({ lead });
  } catch (error) {
    next(error as Error);
  }
}

export async function deleteLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    if (req.user?.role === 'sales' && lead.owner.toString() !== req.user.id) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    await lead.deleteOne();
    res.status(200).json({ message: 'Lead removed' });
  } catch (error) {
    next(error as Error);
  }
}
