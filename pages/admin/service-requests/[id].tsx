import React from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';
import AdminLayout from '../../../components/AdminLayout';

type ServiceRequest = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  project_name?: string | null;
  project_description?: string | null;
  special_instructions?: string | null;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  price_paid: number | string | null;
  created_at: string;
  updated_at: string;
  services?: { name?: string | null } | null;
  admin_notes?: string | null;
};

interface PageProps {
  request: ServiceRequest | null;
}

const DetailPage: React.FC<PageProps> = ({ request }) => {
  const [status, setStatus] = React.useState<ServiceRequest['status']>(request?.status || 'pending');
  const [payment, setPayment] = React.useState<ServiceRequest['payment_status']>(request?.payment_status || 'pending');
  const [notes, setNotes] = React.useState<string>(request?.admin_notes || '');
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  if (!request) {
    return (
      <AdminLayout>
        <div className="p-6">Request not found.</div>
      </AdminLayout>
    );
  }

  const save = async (): Promise<void> => {
    setSaving(true);
    setMessage(null);
    try {
      const resp = await fetch(`/api/admin/service-requests?id=${request.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, payment_status: payment, admin_notes: notes })
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json?.error || 'Failed to update');
      setMessage('Saved');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save';
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Service Request</h1>
          <div className="text-neutral-400">ID: {request.id}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="rounded-xl ring-1 ring-neutral-700/60 p-4">
              <h2 className="font-semibold mb-3">Customer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span className="text-neutral-400">Name:</span> {request.customer_name}</div>
                <div><span className="text-neutral-400">Email:</span> {request.customer_email}</div>
                <div><span className="text-neutral-400">Phone:</span> {request.customer_phone || '-'}</div>
              </div>
            </div>

            <div className="rounded-xl ring-1 ring-neutral-700/60 p-4">
              <h2 className="font-semibold mb-3">Project</h2>
              <div className="text-sm space-y-2">
                <div><span className="text-neutral-400">Service:</span> {request.services?.name || '-'}</div>
                <div><span className="text-neutral-400">Project:</span> {request.project_name || '-'}</div>
                <div><span className="text-neutral-400">Description:</span> {request.project_description || '-'}</div>
                <div><span className="text-neutral-400">Special Instructions:</span> {request.special_instructions || '-'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl ring-1 ring-neutral-700/60 p-4 text-sm space-y-3">
              <div className="flex justify-between"><span className="text-neutral-400">Created:</span><span>{new Date(request.created_at).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-neutral-400">Updated:</span><span>{new Date(request.updated_at).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-neutral-400">Price:</span><span>${Number(request.price_paid || 0).toFixed(2)}</span></div>
            </div>
            <div className="rounded-xl ring-1 ring-neutral-700/60 p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-neutral-300">Status</label>
                <select
                  className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100 w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ServiceRequest['status'])}
                >
                  <option value="pending">pending</option>
                  <option value="in_progress">in_progress</option>
                  <option value="review">review</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-neutral-300">Payment</label>
                <select
                  className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100 w-full"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value as ServiceRequest['payment_status'])}
                >
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="refunded">refunded</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-neutral-300">Internal Admin Notes</label>
                <textarea className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100 w-full h-32" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes visible only to admins" />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={save} disabled={saving} className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
                {message && <span className="text-sm text-neutral-400">{message}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }

  const id = ctx.params?.id as string;
  try {
    // Build robust base URL from request headers
    const forwardedProto = (ctx.req.headers['x-forwarded-proto'] as string) || undefined;
    const forwardedHost = (ctx.req.headers['x-forwarded-host'] as string) || undefined;
    const host = (forwardedHost || ctx.req.headers.host)!;
    const protocol = forwardedProto || (host?.includes('localhost') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;

    const resp = await fetch(`${baseUrl}/api/admin/service-requests?id=${id}`, { headers: { cookie: ctx.req.headers.cookie || '' } });
    if (!resp.ok) {
      return { props: { request: null } };
    }
    const json: { data?: unknown; error?: string } = await resp.json();
    return { props: { request: json.data || null } };
  } catch {
    return { props: { request: null } };
  }
};

export default DetailPage;


