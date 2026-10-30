import { useState } from 'react';
import { Truck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Section from '../components/Section.jsx';
import { currency } from '../utils/format.js';
import { resolveImageUrl } from '../utils/image.js';
import { synchronizeCart, placeCashOnDeliveryOrder } from '../api/checkout.js';
import { clearCart } from '../redux/slices/cartSlice.js';
import LocalStorageService from '../admin/services/localStorageService.js';

export default function Checkout() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const authenticated = Boolean(LocalStorageService.getAccessToken());
  const submitOrder = async (event) => {
    event.preventDefault();
    if (!authenticated) {
      navigate('/auth?redirect=%2Fcheckout');
      return;
    }
    if (!items.length) {
      setMessage('Your cart is empty.');
      return;
    }
    setSubmitting(true);
    setMessage('');
    const values = new FormData(event.currentTarget);
    const recipient = `${values.get('firstName')} ${values.get('lastName')}`.trim();
    const address = {
      recipient,
      phone: values.get('phone'),
      line1: values.get('line1'),
      city: values.get('city'),
      postalCode: values.get('postalCode'),
      country: 'IN',
    };
    const synced = await synchronizeCart(items.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    })));
    if (!synced.success) {
      setMessage(synced.message || 'Could not validate your cart.');
      setSubmitting(false);
      return;
    }
    const result = await placeCashOnDeliveryOrder({ address, paymentMode: 'COD' });
    if (!result.success) {
      setMessage(result.message || 'Could not place the order.');
      setSubmitting(false);
      return;
    }
    dispatch(clearCart());
    setMessage(`Order ${result.data?.data?.orderNumber || ''} placed successfully.`);
    setSubmitting(false);
  };
  return (
    <>
      <Seo title="Checkout" description="Complete your Velvet Spice jewellery order with secure checkout." />
      <Section eyebrow="Secure checkout" title="Almost yours">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <form onSubmit={submitOrder} className="grid gap-5 rounded-3xl bg-white/60 p-6 shadow-xl dark:bg-white/5">
            <Block title="Shipping Address">
              <div className="grid gap-3 sm:grid-cols-2"><Input name="firstName" placeholder="First name" required /><Input name="lastName" placeholder="Last name" required /><Input name="phone" placeholder="Phone number" required /><Input name="email" type="email" placeholder="Email" /><Input name="line1" placeholder="Address line" wide required /><Input name="city" placeholder="City" required /><Input name="postalCode" placeholder="PIN code" required /></div>
            </Block>
            <Block title="Payment Method">
              <Pay title="Cash on delivery" />
            </Block>
            {message && <p role="status" className="text-sm">{message}</p>}
            {!authenticated && <p className="text-sm">Sign in is required to place an order. <Link className="font-bold underline" to="/auth?redirect=%2Fcheckout">Sign in</Link></p>}
            <button disabled={submitting || !items.length} className="rounded-full rose-gradient px-7 py-3 font-bold text-[#1A1A1A] disabled:opacity-50">{submitting ? 'Placing order...' : 'Place cash-on-delivery order'}</button>
          </form>
          <aside className="h-fit rounded-3xl bg-[#1A1A1A] p-6 text-[#FFF8F5] shadow-xl">
            <h2 className="font-display text-3xl">Order Summary</h2>
            <div className="mt-5 space-y-4">{items.map((item) => <div key={item.id} className="flex gap-3"><img src={resolveImageUrl(item.images[0])} alt={item.name} className="h-16 w-16 rounded-xl object-cover" /><div className="flex-1"><p className="font-semibold">{item.name}</p><p className="text-sm text-white/60">{Object.values(item.variantOptions || {}).join(' / ')} · Qty {item.quantity}</p></div><span>{currency(item.price * item.quantity)}</span></div>)}</div>
            <div className="my-5 border-t border-white/10" />
            <div className="flex justify-between text-xl font-bold"><span>Total</span><span>{currency(subtotal)}</span></div>
          </aside>
        </div>
      </Section>
    </>
  );
}

function Block({ title, children }) {
  return <section><h2 className="mb-3 font-display text-3xl">{title}</h2>{children}</section>;
}

function Input({ placeholder, wide, ...props }) {
  return <input {...props} className={`rounded-2xl border border-[#D4A373]/20 bg-white/75 px-4 py-3 outline-none dark:bg-white/10 ${wide ? 'sm:col-span-2' : ''}`} placeholder={placeholder} />;
}

function Pay({ title }) {
  return <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#D4A373]/20 bg-white/70 p-4 dark:bg-white/10"><input type="radio" name="pay" className="accent-[#D4A373]" checked readOnly /> <span className="text-[#D4A373]"><Truck /></span><span className="font-semibold">{title}</span></label>;
}
