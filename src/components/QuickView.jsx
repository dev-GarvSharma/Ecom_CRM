import { AnimatePresence, motion } from 'framer-motion';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../redux/slices/cartSlice.js';
import { toggleWishlist } from '../redux/slices/wishlistSlice.js';
import { setCartOpen, setQuickView } from '../redux/slices/uiSlice.js';
import { currency } from '../utils/format.js';
import { resolveImageUrl } from '../utils/image.js';
import Stars from './Stars.jsx';

export default function QuickView() {
  const product = useSelector((state) => state.ui.quickView);
  const dispatch = useDispatch();
  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[94] grid place-items-center bg-[#1A1A1A]/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="relative grid max-h-[90vh] w-full max-w-4xl overflow-auto rounded-3xl bg-[#FFF8F5] shadow-2xl dark:bg-[#1A1A1A] md:grid-cols-2" initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}>
          <button className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/80" onClick={() => dispatch(setQuickView(null))} aria-label="Close quick view"><X /></button>
          <img src={resolveImageUrl(product.images[0])} alt={product.name} className="h-full min-h-[360px] w-full object-cover" />
          <div className="p-7">
            <Stars rating={product.rating} />
            <h2 className="mt-4 font-display text-4xl">{product.name}</h2>
            <p className="mt-3 text-2xl font-bold text-[#D4A373]">{currency(product.price)}</p>
            <p className="mt-4 leading-7 opacity-75">{product.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">{product.colors.map((color) => <span key={color} className="rounded-full bg-white/70 px-4 py-2 text-sm dark:bg-white/10">{color}</span>)}</div>
            <div className="mt-8 flex gap-3">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-full rose-gradient px-5 py-3 font-bold text-[#1A1A1A] disabled:opacity-40" disabled={!product.variants?.some((variant) => variant.active && variant.stock > 0)} onClick={() => { dispatch(addToCart(product)); dispatch(setCartOpen(true)); }}><ShoppingBag size={18} /> Add to Cart</button>
              <button className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-sm dark:bg-white/10" onClick={() => dispatch(toggleWishlist(product))} aria-label="Wishlist"><Heart size={19} /></button>
            </div>
            <Link to={`/product/${product.id}`} onClick={() => dispatch(setQuickView(null))} className="mt-4 block text-center text-sm font-bold text-[#D4A373]">View full details</Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
