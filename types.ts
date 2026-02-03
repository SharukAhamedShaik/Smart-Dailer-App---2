
export enum Category {
  SAFE = 'Safe',
  SPAM = 'Spam',
  UNKNOWN = 'Unknown'
}

export interface PhoneEntry {
  phoneNumber: string;
  category: Category;
  callerName: string;
  note?: string;
}

export interface LookupResult {
  match: PhoneEntry | null;
  aiRiskScore?: number;
  aiRecommendation?: string;
}
