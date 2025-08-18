// import {
//   Body,
//   Button,
//   Container,
//   Head,
//   Hr,
//   Html,
//   Img,
//   Preview,
//   Section,
//   Text,
//   Row,
//   Column,
// } from '@react-email/components';
// import {
//   Body,
//   Button,
//   Container,
//   Head,
//   Hr,
//   Html,
//   Img,
//   Preview,
//   Section,
//   Text,
//   Row,
//   Column,
// } from '@react-email/components';
import * as React from 'react';
import { Beat } from '../../types/beat';

interface EnrichedCartItem {
  beat: Beat;
  license: string;
  downloadUrl: string | null;
}

interface OrderConfirmationEmailProps {
  customerName: string;
  items: EnrichedCartItem[];
  orderId: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const OrderConfirmationEmail = ({
  customerName,
  items,
  orderId,
}: OrderConfirmationEmailProps) => {
  // Email rendering is disabled due to missing @react-email/components
  return null;
};

const main = { backgroundColor: '#0a0a0a', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif', color: '#fafafa' };
const container = { margin: '0 auto', padding: '20px 0 48px', width: '580px' };
const logo = { margin: '0 auto' };
const paragraph = { fontSize: '16px', lineHeight: '26px' };
const box = { padding: '20px', backgroundColor: '#171717', borderRadius: '5px', border: '1px solid #262626' };
const itemRow = { padding: '10px 0', borderBottom: '1px solid #262626' };
const itemTitle = { fontSize: '16px', fontWeight: 'bold', margin: 0 };
const itemSubtitle = { fontSize: '12px', color: '#a3a3a3', margin: '4px 0 0 0' };
const button = { backgroundColor: '#fca311', borderRadius: '5px', color: '#000', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'inline-block', padding: '12px 20px' };
const errorText = { color: '#ef4444', fontSize: '12px' };
const hr = { borderColor: '#262626', margin: '20px 0' };
const footer = { color: '#a3a3a3', fontSize: '12px', lineHeight: '24px' };

export default OrderConfirmationEmail;