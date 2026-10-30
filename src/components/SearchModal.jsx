import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useCatalog } from '../catalog/useCatalog.js';
import { setSearchOpen } from '../redux/slices/uiSlice.js';
import { useMemo, useState } from 'react';
import { resolveImageUrl } from '../utils/image.js';

export default function SearchModal() {
  const { products } = useCatalog();
  const open = useSelector((state) => state.ui.searchOpen);
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const suggestions = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()) || product.category.toLowerCase().includes(query.toLowerCase())).slice(0, 5), [products, query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[95] bg-[#1A1A1A]/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="mx-auto mt-24 max-w-2xl rounded-3xl bg-[#FFF8F5] p-5 shadow-2xl dark:bg-[#1A1A1A]" initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
            <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-inner dark:bg-white/10">
              <Search className="text-[#D4A373]" />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search hoops, chokers, kundan..." className="min-w-0 flex-1 bg-transparent outline-none" />
              <button onClick={() => dispatch(setSearchOpen(false))} aria-label="Close search"><X /></button>
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#D4A373]">{query ? 'Suggestions' : 'Trending Searches'}</p>
              <div className="mt-4 grid gap-3">
                {(query ? suggestions : products.slice(0, 5)).map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`} onClick={() => dispatch(setSearchOpen(false))} className="flex items-center gap-4 rounded-2xl bg-white/70 p-3 transition hover:bg-[#F7D6E0] dark:bg-white/10">
                    <img src={resolveImageUrl(product.images[0])} alt={product.name} className="h-16 w-16 rounded-xl object-cover" />
                    <div><p className="font-semibold">{product.name}</p><p className="text-sm opacity-60">{product.category}</p></div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
