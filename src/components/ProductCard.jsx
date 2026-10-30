import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice.js';
import { toggleWishlist } from '../redux/slices/wishlistSlice.js';
import { setCartOpen, setQuickView, showToast } from '../redux/slices/uiSlice.js';
import { currency, discountPercent } from '../utils/format.js';
import { resolveImageUrl } from '../utils/image.js';
import Stars from './Stars.jsx';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wished = useSelector((state) => state.wishlist.items.some((item) => item.id === product.id));

  const add = () => {
    if (!product.variants?.some((variant) => variant.active && variant.stock > 0)) return;
    dispatch(addToCart(product));
    dispatch(setCartOpen(true));
    dispatch(showToast(`${product.name} added to cart`));
  };

  return (
    <motion.article
      className="group overflow-hidden rounded-2xl border border-[#D4A373]/20 bg-white/60 backdrop-blur transition hover:-translate-y-1 dark:bg-white/5"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F7D6E0]/25">
        <Link to={`/product/${product.id}`}>
          <img
            src={resolveImageUrl(product.images[0])}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-0"
          />
          <img
            src={resolveImageUrl(product.images[1] || product.images[0])}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100"
          />
        </Link>
        <span className="absolute left-3 top-3 rounded-full bg-[#1A1A1A] px-3 py-1 text-xs font-semibold text-[#FFF8F5]">
          {discountPercent(product.price, product.oldPrice)}% Off
        </span>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-white/85 text-[#1A1A1A] shadow-lg transition hover:bg-[#F7D6E0]"
            onClick={() => dispatch(toggleWishlist(product))}
            aria-label="Add to wishlist"
          >
            <Heart size={18} fill={wished ? '#D4A373' : 'none'} />
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-white/85 text-[#1A1A1A] shadow-lg transition hover:bg-[#F7D6E0]"
            onClick={() => dispatch(setQuickView(product))}
            aria-label="Quick view"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <Stars rating={product.rating} />
          <span className="text-xs text-[#1A1A1A]/55 dark:text-white/60">{product.badge}</span>
        </div>
        <Link to={`/product/${product.id}`} className="block font-semibold text-[#1A1A1A] transition hover:text-[#D4A373] dark:text-[#FFF8F5]">
          {product.name}
        </Link>
        <div className="flex items-center justify-between gap-3">
          <p className="font-bold text-[#1A1A1A] dark:text-[#FFF8F5]">
            {currency(product.price)} <span className="ml-1 text-sm font-medium text-[#1A1A1A]/40 line-through dark:text-white/40">{currency(product.oldPrice)}</span>
          </p>
          <button className="grid h-10 w-10 place-items-center rounded-full rose-gradient text-[#1A1A1A] shadow-lg disabled:cursor-not-allowed disabled:opacity-40" onClick={add} disabled={!product.variants?.some((variant) => variant.active && variant.stock > 0)} aria-label="Add to cart">
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
