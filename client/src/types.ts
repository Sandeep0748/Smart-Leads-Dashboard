export type UserRole = 'admin' | 'sales';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
}

export interface PaginatedLeads {
  leads: Lead[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}
