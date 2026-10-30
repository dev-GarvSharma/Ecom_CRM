import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Seo from '../components/Seo.jsx';
import Section from '../components/Section.jsx';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice.js';
import { currency } from '../utils/format.js';
import { resolveImageUrl } from '../utils/image.js';

export default function Cart() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 2999 || subtotal === 0 ? 0 : 99;

  return (
    <>
      <Seo title="Cart" description="Review your Velvet Spice cart and checkout securely." />
      <Section eyebrow="Shopping pouch" title="Cart">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.length === 0 && <div className="rounded-3xl bg-white/55 p-10 text-center shadow-xl dark:bg-white/5"><p className="font-display text-4xl">Your cart is empty</p><Link to="/shop" className="mt-5 inline-block rounded-full rose-gradient px-6 py-3 font-bold text-[#1A1A1A]">Shop now</Link></div>}
            {items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-3xl bg-white/60 p-4 shadow-lg dark:bg-white/5 sm:grid-cols-[120px_1fr_auto]">
                <img src={resolveImageUrl(item.images[0])} alt={item.name} className="h-32 w-full rounded-2xl object-cover sm:w-28" />
                <div><h3 className="font-display text-2xl">{item.name}</h3><p className="mt-1 text-sm opacity-60">{Object.values(item.variantOptions || {}).join(' / ')}</p><p className="mt-3 font-bold text-[#D4A373]">{currency(item.price)}</p></div>
                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <div className="flex items-center rounded-full bg-[#FFF8F5] dark:bg-white/10"><button className="p-3" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}><Minus size={15} /></button><span className="px-2 font-bold">{item.quantity}</span><button className="p-3" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}><Plus size={15} /></button></div>
                  <button onClick={() => dispatch(removeFromCart(item.id))} className="text-[#D4A373]"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-3xl bg-white/60 p-6 shadow-xl dark:bg-white/5">
            <h2 className="font-display text-3xl">Order Summary</h2>
            <div className="mt-5 space-y-3 text-sm"><Row label="Subtotal" value={currency(subtotal)} /><Row label="Shipping" value={shipping ? currency(shipping) : 'Free'} /><Row label="Coupon" value="- Rs. 0" /></div>
            <div className="my-5 border-t border-[#D4A373]/20" />
            <Row label="Total" value={currency(subtotal + shipping)} strong />
            <Link to="/checkout" className="mt-6 block rounded-full rose-gradient px-6 py-3 text-center font-bold text-[#1A1A1A]">Proceed to checkout</Link>
          </aside>
        </div>
      </Section>
    </>
  );
}

function Row({ label, value, strong }) {
  return <div className={`flex justify-between ${strong ? 'text-xl font-bold' : ''}`}><span>{label}</span><span>{value}</span></div>;
}
