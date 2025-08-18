import React from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

type ServiceRequestRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  project_name: string | null;
  status: string;
  payment_status: string;
  price_paid: number;
  created_at: string;
  service_name?: string | null;
};

interface PageProps {
  initialData: ServiceRequestRow[];
  page: number;
  totalPages: number;
  q: string;
  status: string;
  payment: string;
}

const ServiceRequestsAdmin: React.FC<PageProps> = ({ initialData, page, totalPages, q, status: statusInit, payment: paymentInit }) => {
  const [rows] = React.useState<ServiceRequestRow[]>(initialData);
  const [search, setSearch] = React.useState(q || '');
  const [status, setStatus] = React.useState(statusInit || '');
  const [payment, setPayment] = React.useState(paymentInit || '');

  const filtered = React.useMemo(() => {
    return rows.filter((r) => {
      const q = search.toLowerCase();
      const matchesQ = !q || r.customer_name.toLowerCase().includes(q) || r.customer_email.toLowerCase().includes(q) || (r.project_name || '').toLowerCase().includes(q) || (r.service_name || '').toLowerCase().includes(q);
      const matchesStatus = !status || r.status === status;
      const matchesPayment = !payment || r.payment_status === payment;
      return matchesQ && matchesStatus && matchesPayment;
    });
  }, [rows, search, status, payment]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (status) params.set('status', status);
    if (payment) params.set('payment', payment);
    params.set('page', '1');
    window.location.search = params.toString();
  };

  const gotoPage = (n: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(n));
    if (search) params.set('q', search); else params.delete('q');
    if (status) params.set('status', status); else params.delete('status');
    if (payment) params.set('payment', payment); else params.delete('payment');
    window.location.search = params.toString();
  };

  const exportCsv = () => {
    const headers = ['created_at','customer_name','customer_email','project_name','service_name','status','payment_status','price_paid'];
    const lines = [headers.join(',')].concat(
      filtered.map(r => [
        new Date(r.created_at).toISOString(),
        JSON.stringify(r.customer_name),
        JSON.stringify(r.customer_email),
        JSON.stringify(r.project_name || ''),
        JSON.stringify(r.service_name || ''),
        r.status,
        r.payment_status,
        String(r.price_paid)
      ].join(','))
    );
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'service-requests.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Service Requests</h1>
          <button onClick={exportCsv} className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100">Export CSV</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100"
            placeholder="Search name, email, project, service"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">pending</option>
            <option value="in_progress">in_progress</option>
            <option value="review">review</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
          <select className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100" value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="">All Payments</option>
            <option value="pending">pending</option>
            <option value="paid">paid</option>
            <option value="refunded">refunded</option>
          </select>
          <button onClick={applyFilters} className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500">Apply</button>
        </div>

        <div className="overflow-auto rounded-xl ring-1 ring-neutral-700/60">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-900 text-neutral-300">
              <tr>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Project</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-900/60">
                  <td className="px-4 py-3"><Link className="underline decoration-neutral-700 hover:decoration-neutral-500" href={`/admin/service-requests/${r.id}`}>{new Date(r.created_at).toLocaleString()}</Link></td>
                  <td className="px-4 py-3"><Link className="underline decoration-neutral-700 hover:decoration-neutral-500" href={`/admin/service-requests/${r.id}`}>{r.customer_name}</Link></td>
                  <td className="px-4 py-3">{r.customer_email}</td>
                  <td className="px-4 py-3">{r.project_name || '-'}</td>
                  <td className="px-4 py-3">{r.service_name || '-'}</td>
                  <td className="px-4 py-3">{r.status}</td>
                  <td className="px-4 py-3">{r.payment_status}</td>
                  <td className="px-4 py-3">${r.price_paid.toFixed(2)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-neutral-400" colSpan={8}>No matching requests.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <button disabled={page <= 1} onClick={() => gotoPage(page - 1)} className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100 disabled:opacity-50">Prev</button>
          <div className="text-neutral-400 text-sm">Page {page} of {totalPages}</div>
          <button disabled={page >= totalPages} onClick={() => gotoPage(page + 1)} className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100 disabled:opacity-50">Next</button>
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

  const { q = '', status = '', payment = '', page = '1' } = ctx.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
  const limit = 25;
  const from = (pageNum - 1) * limit;
  const to = from + limit - 1;

  let base = supabaseAdmin
    .from('service_requests')
    .select('id, customer_name, customer_email, project_name, status, payment_status, price_paid, created_at, services:services(name)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status) base = base.eq('status', status);
  if (payment) base = base.eq('payment_status', payment);
  if (q) base = base.or(`customer_name.ilike.%${q}%,customer_email.ilike.%${q}%,project_name.ilike.%${q}%`);

  const { data: rowsData, error, count } = await base.range(from, to);

  let initialData: ServiceRequestRow[] = ((rowsData as Array<{
    id: string;
    customer_name: string;
    customer_email: string;
    project_name: string | null;
    status: string;
    payment_status: string;
    price_paid: number | string | null;
    created_at: string;
    services?: { name?: string | null } | null;
  }>) || []).map((r) => ({
    id: r.id,
    customer_name: r.customer_name,
    customer_email: r.customer_email,
    project_name: r.project_name,
    status: r.status,
    payment_status: r.payment_status,
    price_paid: Number(r.price_paid || 0),
    created_at: r.created_at,
    service_name: r.services?.name || null,
  }));

  if (error) {
    initialData = [];
  }

  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { props: { initialData, page: pageNum, totalPages, q, status, payment } };
};

export default ServiceRequestsAdmin;


