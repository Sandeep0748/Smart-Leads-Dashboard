import { Schema, model, Document, Types } from 'mongoose';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  owner: Types.ObjectId;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    status: { type: String, required: true, enum: ['New', 'Contacted', 'Qualified', 'Lost'], default: 'New' },
    source: { type: String, required: true, enum: ['Website', 'Instagram', 'Referral'] },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Lead = model<ILead>('Lead', leadSchema);
export default Lead;
