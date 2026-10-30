import { SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import Seo from '../components/Seo.jsx';
import Section from '../components/Section.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { useCatalog } from '../catalog/useCatalog.js';

export default function Shop() {
  const { categories, products, loading, error } = useCatalog();
  const [params] = useSearchParams();
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [sort, setSort] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [onlyTrending, setOnlyTrending] = useState(false);
  const [visible, setVisible] = useState(8);

  const filtered = useMemo(() => {
    let list = products.filter((product) => (category === 'All' || product.category === category) && product.price <= maxPrice && (!onlyTrending || product.tags.includes('trending')));
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'latest') list = [...list].sort((a, b) => Number(b.tags.includes('new arrivals')) - Number(a.tags.includes('new arrivals')));
    return list;
  }, [category, maxPrice, onlyTrending, products, sort]);

  return (
    <>
      <Seo title="Shop" description="Browse earrings, necklaces, rings, bracelets and premium artificial jewellery from Velvet Spice." />
      <Section eyebrow="Boutique shop" title="Find your sparkle">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-3xl border border-[#D4A373]/20 bg-white/55 p-5 shadow-xl backdrop-blur dark:bg-white/5">
            <div className="mb-5 flex items-center gap-2 font-bold"><SlidersHorizontal size={18} /> Filters</div>
            <label className="text-sm font-semibold">Category</label>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#D4A373]/20 bg-white/70 px-4 py-3 outline-none dark:bg-white/10">
              <option>All</option>
              {categories.map((item) => <option key={item.id}>{item.name}</option>)}
            </select>
            <label className="mt-5 block text-sm font-semibold">Price up to {maxPrice}</label>
            <input type="range" min="700" max="5000" step="100" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="mt-3 w-full accent-[#D4A373]" />
            <div className="mt-5 grid gap-3 text-sm">
              {['Rose Gold', 'Blush Pink', 'Gold', 'Pearl'].map((color) => <label key={color} className="flex items-center gap-3"><span className="h-4 w-4 rounded-full border border-[#D4A373]/30 bg-[#F7D6E0]" /> {color}</label>)}
              <label className="mt-2 flex items-center gap-3"><input type="checkbox" checked={onlyTrending} onChange={(event) => setOnlyTrending(event.target.checked)} className="accent-[#D4A373]" /> Trending only</label>
              <label className="flex items-center gap-3"><input type="checkbox" className="accent-[#D4A373]" /> 4 stars and above</label>
              <label className="flex items-center gap-3"><input type="checkbox" className="accent-[#D4A373]" /> In stock</label>
            </div>
          </aside>
          <div>
            <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-white/55 p-4 shadow-sm backdrop-blur dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-semibold">{filtered.length} pieces found</p>
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-full border border-[#D4A373]/20 bg-white/70 px-4 py-2 text-sm outline-none dark:bg-white/10">
                <option value="popular">Sort by popularity</option>
                <option value="latest">Latest</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {loading && Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-96" />)}
              {!loading && filtered.slice(0, visible).map((product) => <ProductCard key={product.id} product={product} />)}
              {!loading && error && <p role="alert" className="sm:col-span-2">{error}</p>}
              {!loading && !error && filtered.length === 0 && <p className="sm:col-span-2">No jewelry matches those filters.</p>}
            </div>
            {visible < filtered.length && <button onClick={() => setVisible(visible + 4)} className="mx-auto mt-8 block rounded-full bg-[#1A1A1A] px-7 py-3 font-bold text-white">Load more</button>}
          </div>
        </div>
      </Section>
    </>
  );
}
