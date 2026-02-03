
import { Category, PhoneEntry } from './types';

export const MOCK_REGISTRY: PhoneEntry[] = [
  // Safe Numbers (Friends)
  { phoneNumber: '5550101', category: Category.SAFE, callerName: 'Alice Johnson' },
  { phoneNumber: '5550102', category: Category.SAFE, callerName: 'Bob Smith' },
  { phoneNumber: '5550103', category: Category.SAFE, callerName: 'Charlie Brown' },
  { phoneNumber: '5550104', category: Category.SAFE, callerName: 'Diana Prince' },
  { phoneNumber: '5550105', category: Category.SAFE, callerName: 'Edward Norton' },
  
  // Spam Numbers
  { phoneNumber: '8889001', category: Category.SPAM, callerName: 'Likely Spam: Insurance' },
  { phoneNumber: '8889002', category: Category.SPAM, callerName: 'Suspicious: IRS Scam' },
  { phoneNumber: '8889003', category: Category.SPAM, callerName: 'Spam: Solar Panels' },
  { phoneNumber: '8889004', category: Category.SPAM, callerName: 'Fraud: Credit Dept' },
  { phoneNumber: '8889005', category: Category.SPAM, callerName: 'Robocall: Warranty' }
];

export const KEYPAD_LAYOUT = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  '*', '0', '#'
];

export const COLORS = {
  PRIMARY: '#007BFF',
  SECONDARY: '#FFFFFF',
  BACKGROUND: '#F8F9FA',
  SAFE: '#28A745',
  SPAM: '#DC3545',
  UNKNOWN: '#FFFFFF'
};
