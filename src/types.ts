/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ThemeStyle {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontHeading: 'font-serif' | 'font-sans' | 'font-display';
  bgPattern: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  price: number;
  views: number;
  imageUrl: string;
  category: 'Modern' | 'Rustic' | 'Elegant' | 'Traditional' | 'Minimalist';
  style: ThemeStyle;
  features: string[];
}

export type OrderStatus = 'pending' | 'success' | 'expired';

export interface Order {
  id: string;
  themeId: string;
  themeName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string; // WhatsApp
  groomName: string;
  groomNickname: string;
  brideName: string;
  brideNickname: string;
  weddingDate: string;
  weddingTime: string;
  weddingLocation: string;
  mapsUrl?: string;
  status: OrderStatus;
  createdAt: string; // ISO String
  expiresAt: string; // ISO String (5 minutes later for checkout drafts)
  uniqueCode: string; // Authentication / tracking token
  musicChoice: string; // Name of track
  customMessage?: string;
}

export interface RSVP {
  id: string;
  orderId: string;
  name: string;
  guests: number;
  attendance: 'yes' | 'no';
  message: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'email' | 'whatsapp';
  to: string;
  subject?: string;
  message: string;
  timestamp: string;
  uniqueCode: string;
}
