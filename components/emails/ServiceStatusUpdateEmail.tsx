import * as React from 'react';

interface ServiceStatusUpdateEmailProps {
  customerName: string;
  serviceType: string;
  orderId: string;
  newStatus: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';
}

const STATUS_DESCRIPTIONS: Record<ServiceStatusUpdateEmailProps['newStatus'], string> = {
  pending: 'Your request has been received and is pending review.',
  in_progress: 'We have started working on your project and will notify you when the first version is ready for review.',
  review: 'A new version is ready for your review. Please check your dashboard for details.',
  completed: 'Your project is complete! Thank you for working with us.',
  cancelled: 'Your request has been cancelled. If this is unexpected, please contact support.',
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const ServiceStatusUpdateEmail: React.FC<ServiceStatusUpdateEmailProps> = ({
  customerName,
  serviceType,
  orderId,
  newStatus,
}) => {
  return (
    <html>
      <body style={styles.main as React.CSSProperties}>
        <div style={styles.container as React.CSSProperties}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={styles.logo as React.CSSProperties}>🎵 AudioService</div>
          </div>
          <h1 style={{ margin: '0 0 8px 0' }}>Update on your service request</h1>
          <p style={styles.paragraph as React.CSSProperties}>Hi {customerName},</p>
          <div style={styles.box as React.CSSProperties}>
            <div style={styles.paragraph as React.CSSProperties}><strong>Service:</strong> {serviceType}</div>
            <div style={styles.paragraph as React.CSSProperties}><strong>Request ID:</strong> {orderId}</div>
            <div style={{ ...(styles.paragraph as React.CSSProperties), ...(styles.statusText as React.CSSProperties) }}>
              Status: <span style={styles.statusHighlight as React.CSSProperties}>{newStatus.replace('_', ' ')}</span>
            </div>
            <p style={styles.paragraph as React.CSSProperties}>{STATUS_DESCRIPTIONS[newStatus]}</p>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <a
                href={`${baseUrl}/orders`}
                style={styles.button as React.CSSProperties}
              >
                View your request
              </a>
            </div>
          </div>
          <hr style={styles.hr as React.CSSProperties} />
          <p style={styles.footer as React.CSSProperties}>
            © {new Date().getFullYear()} AudioService. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  );
};

const styles = {
  main: { backgroundColor: '#0a0a0a', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif', color: '#fafafa', padding: '24px' },
  container: { margin: '0 auto', padding: '20px 0 24px', width: '580px' },
  logo: { margin: '0 auto', fontWeight: 'bold', color: '#fca311' },
  paragraph: { fontSize: '16px', lineHeight: '26px', margin: '8px 0' },
  box: { padding: '20px', backgroundColor: '#171717', borderRadius: '8px', border: '1px solid #262626' },
  statusText: { fontSize: '18px', fontWeight: 'bold' },
  statusHighlight: { color: '#fca311' },
  button: { backgroundColor: '#fca311', borderRadius: '6px', color: '#000', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'inline-block', padding: '12px 20px' },
  hr: { borderColor: '#262626', margin: '20px 0' },
  footer: { color: '#a3a3a3', fontSize: '12px', lineHeight: '24px' },
};

export default ServiceStatusUpdateEmail;