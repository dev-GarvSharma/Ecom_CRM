import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, saveForLater, updateQuantity } from '../redux/slices/cartSlice.js';
import { setCartOpen } from '../redux/slices/uiSlice.js';
import { currency } from '../utils/format.js';
import { resolveImageUrl } from '../utils/image.js';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.cartOpen);
  const items = useSelector((state) => state.cart.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const progress = Math.min(100, (subtotal / 2999) * 100);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside className="fixed inset-0 z-[90] bg-[#1A1A1A]/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="ml-auto flex h-full w-full max-w-md flex-col bg-[#FFF8F5] p-5 shadow-2xl dark:bg-[#1A1A1A]" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28 }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl">Your Cart</h2>
              <button onClick={() => dispatch(setCartOpen(false))} aria-label="Close cart"><X /></button>
            </div>
            <div className="mt-5 rounded-2xl bg-white/70 p-4 dark:bg-white/10">
              <div className="mb-2 flex items-center justify-between text-sm"><span>Free shipping</span><span>{currency(Math.max(0, 2999 - subtotal))} away</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-[#F7D6E0]"><div className="h-full rose-gradient" style={{ width: `${progress}%` }} /></div>
            </div>
            <div className="no-scrollbar mt-5 flex-1 space-y-4 overflow-auto">
              {items.length === 0 && <EmptyCart />}
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-2xl bg-white/70 p-3 shadow-sm dark:bg-white/10">
                  <img src={resolveImageUrl(item.images[0])} alt={item.name} className="h-24 w-20 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{item.name}</h3>
                    <p className="text-sm text-[#D4A373]">{currency(item.price)}</p>
                    <p className="text-xs opacity-65">{Object.values(item.variantOptions || {}).join(' / ')}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full bg-[#FFF8F5] dark:bg-[#1A1A1A]">
                        <button className="p-2" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}><Minus size={14} /></button>
                        <span className="px-2 text-sm font-bold">{item.quantity}</span>
                        <button className="p-2" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}><Plus size={14} /></button>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => dispatch(saveForLater(item.id))} className="text-xs font-semibold text-[#D4A373]">Save</button>
                        <button onClick={() => dispatch(removeFromCart(item.id))} aria-label="Remove item"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {items.length > 0 && (
              <div className="border-t border-[#D4A373]/20 pt-5">
                <div className="mb-4 flex rounded-full bg-white/80 p-1 dark:bg-white/10"><input className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" placeholder="Coupon code" /><button className="rounded-full bg-[#1A1A1A] px-4 py-2 text-sm font-bold text-white">Apply</button></div>
                <div className="mb-4 flex items-center justify-between text-lg font-bold"><span>Subtotal</span><span>{currency(subtotal)}</span></div>
                <Link to="/checkout" onClick={() => dispatch(setCartOpen(false))} className="block rounded-full rose-gradient px-5 py-3 text-center font-bold text-[#1A1A1A]">Checkout</Link>
              </div>
            )}
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function EmptyCart() {
  return (
    <div className="grid h-96 place-items-center text-center">
      <div>
        <ShoppingBag className="mx-auto text-[#D4A373]" size={46} />
        <p className="mt-4 font-display text-3xl">Your pouch is empty</p>
        <p className="mt-2 text-sm opacity-70">Add something sparkly to start the unboxing.</p>
      </div>
    </div>
  );
}
