import { useEffect, useState } from 'react';
import { CheckCircle2, PackageCheck, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Section from '../components/Section.jsx';
import { get } from '../admin/app/axiosWrapper.js';
import LocalStorageService from '../admin/services/localStorageService.js';
import { currency } from '../utils/format.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    get('orders')
      .then((result) => {
        if (!active) return;
        if (!result.success) throw new Error(result.message || 'Could not load orders.');
        setOrders(result.data?.data || []);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Could not load orders.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const signedIn = Boolean(LocalStorageService.getAccessToken());
  return (
    <>
      <Seo title="Orders" description="Track Velvet Spice jewellery orders." />
      <Section eyebrow="Tracking" title="My Orders">
        {!signedIn ? <div className="rounded-3xl bg-white/60 p-8 text-center shadow-xl dark:bg-white/5"><p>Sign in to see your orders.</p><Link to="/auth?redirect=%2Forders" className="mt-4 inline-block rounded-full rose-gradient px-6 py-3 font-bold text-[#1A1A1A]">Sign in</Link></div> : null}
        {signedIn && loading ? <p>Loading orders...</p> : null}
        {signedIn && error ? <p role="alert">{error}</p> : null}
        {signedIn && !loading && !error && orders.length === 0 ? <p>No orders yet.</p> : null}
        <div className="space-y-5">
          {signedIn && !loading && !error && orders.map((order) => (
            <article key={order.id} className="rounded-3xl bg-white/60 p-6 shadow-xl dark:bg-white/5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="font-display text-3xl">Order {order.orderNumber}</h2><p className="text-sm opacity-65">Placed {new Date(order.createdAt).toLocaleDateString()}</p></div>
                <p className="font-bold text-[#D4A373]">{currency(order.total)}</p>
              </div>
              <div className="mt-4 space-y-2">{(order.items || []).map((item) => <p key={item.id} className="text-sm">{item.name} · {Object.values(item.variantOptions || {}).join(' / ')} · Qty {item.quantity}</p>)}</div>
              <div className="mt-7 grid gap-3 md:grid-cols-4">
                {['Processing', 'Packed', 'Shipped', 'Delivered'].map((step, index) => {
                  const stepByStatus = { Pending: 0, Processing: 1, Shipped: 2, Delivered: 3 };
                  const active = order.status !== 'Cancelled' && index <= (stepByStatus[order.status] ?? 0);
                  const Icon = [Sparkles, PackageCheck, Truck, CheckCircle2][index];
                  return <div key={step} className={`rounded-2xl p-4 ${active ? 'rose-gradient text-[#1A1A1A]' : 'bg-white/70 opacity-50 dark:bg-white/10'}`}><Icon /><p className="mt-3 font-bold">{order.status === 'Cancelled' ? 'Cancelled' : step}</p></div>;
                })}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
