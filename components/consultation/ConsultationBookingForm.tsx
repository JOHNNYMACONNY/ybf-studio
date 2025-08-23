import React from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (consultation: unknown) => void;
  onError: (error: string) => void;
};

const ConsultationBookingForm: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0 as unknown as number, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: 24, borderRadius: 8, maxWidth: 480, width: '90%' }}>
        <h2 style={{ marginBottom: 12 }}>Consultation Booking (Stub)</h2>
        <p style={{ marginBottom: 16 }}>This is a temporary placeholder for the booking form.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 12px', background: '#e5e7eb', borderRadius: 6 }}>Close</button>
          <button onClick={() => { onSuccess({ id: 'stub', status: 'scheduled' }); onClose(); }} style={{ padding: '8px 12px', background: '#10b981', color: 'white', borderRadius: 6 }}>Mock Book</button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationBookingForm;
