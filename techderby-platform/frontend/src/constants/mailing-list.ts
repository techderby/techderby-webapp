export const MAILING_LIST_CATEGORIES = [
  'Startup Founder',
  'Employee (Tech Professional/Enthusiast)',
  'Students',
  'Government Agencies/Stakeholders',
  'None',
] as const;

export type MailingListCategory = (typeof MAILING_LIST_CATEGORIES)[number];

export type MailingListSegment = {
  id: number;
  name: string;
  description: string;
  includeAll: boolean;
  categories: MailingListCategory[];
  subscriberCount: number;
};
