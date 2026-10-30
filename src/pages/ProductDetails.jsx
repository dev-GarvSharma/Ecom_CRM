import { Heart, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import Seo from '../components/Seo.jsx';
import Section from '../components/Section.jsx';
import Stars from '../components/Stars.jsx';
import { useCatalog } from '../catalog/useCatalog.js';
import { addToCart } from '../redux/slices/cartSlice.js';
import { setCartOpen } from '../redux/slices/uiSlice.js';
import { toggleWishlist } from '../redux/slices/wishlistSlice.js';
import { currency } from '../utils/format.js';
import { resolveImageUrl } from '../utils/image.js';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, loading, error } = useCatalog();
  const product = products.find((item) => item.id === id || item.slug === id);
  if (loading) return <Section eyebrow="Jewelry" title="Loading piece"><p>Loading the latest catalog.</p></Section>;
  if (error || !product) return <Section eyebrow="Jewelry" title="Piece unavailable"><p>{error || "This product is no longer available."}</p></Section>;

  return <ProductDetailContent key={product.id} product={product} products={products} />;
}

function ProductDetailContent({ product, products }) {
  const [image, setImage] = useState(product.images[0] || '');
  const [variantId, setVariantId] = useState(product.variants[0]?.id || '');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('Description');
  const dispatch = useDispatch();
  const variants = product.variants || [];
  const selectedVariant = variants.find((variant) => variant.id === variantId) || variants[0];
  const similar = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);

  const add = () => {
    if (!selectedVariant || selectedVariant.stock < qty) return;
    dispatch(addToCart({ ...product, selectedVariant, quantity: qty }));
    dispatch(setCartOpen(true));
  };

  const variantLabel = (variant) => Object.entries(variant.options || {}).map(([key, value]) => `${key}: ${value}`).join(' · ') || variant.sku;

  return (
    <>
      <Seo title={product.name} description={product.description} />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="grid gap-4 md:grid-cols-[90px_1fr]">
            <div className="order-2 flex gap-3 md:order-1 md:flex-col">{product.images.map((src) => <button key={src} onClick={() => setImage(src)} className="overflow-hidden rounded-2xl border border-[#D4A373]/20"><img src={resolveImageUrl(src)} alt="" className="h-20 w-20 object-cover" /></button>)}</div>
            <div className="order-1 overflow-hidden rounded-3xl bg-[#F7D6E0]/30 luxury-shadow md:order-2"><img src={resolveImageUrl(image)} alt={product.name} className="aspect-4/5 w-full object-cover transition duration-500 hover:scale-110" /></div>
          </div>
          <div className="lg:pt-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D4A373]">{product.category}</p>
            <h1 className="mt-3 font-display text-5xl">{product.name}</h1>
            {product.rating > 0 && <div className="mt-4 flex items-center gap-3"><Stars rating={product.rating} /><span className="text-sm opacity-60">{product.reviews} reviews</span></div>}
            <p className="mt-5 text-3xl font-bold text-[#D4A373]">{currency(selectedVariant?.price ?? product.price)} {selectedVariant?.compareAtPrice > selectedVariant?.price && <span className="text-lg text-current/35 line-through">{currency(selectedVariant.compareAtPrice)}</span>}</p>
            <p className="mt-5 leading-8 opacity-75">{product.description}</p>
            <div className="mt-6">
              <p className="mb-2 font-semibold">Choose an option</p>
              <div className="grid gap-2">{variants.map((variant) => <button key={variant.id} onClick={() => setVariantId(variant.id)} className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm ${selectedVariant?.id === variant.id ? 'border-[#D4A373] bg-[#F7D6E0]/45' : 'border-[#D4A373]/20 bg-white/70 dark:bg-white/10'}`}><span>{variantLabel(variant)}</span><span className="shrink-0 text-xs opacity-65">{variant.stock > 0 ? `${variant.stock} available` : 'Sold out'}</span></button>)}</div>
              <p className="mt-4 text-sm opacity-70">{product.material}</p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full bg-white/70 dark:bg-white/10"><button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button><span className="px-3 font-bold">{qty}</span><button className="p-3" onClick={() => setQty(Math.min(selectedVariant?.stock || 1, qty + 1))}><Plus size={16} /></button></div>
              <button onClick={add} disabled={!selectedVariant || selectedVariant.stock < qty} className="flex flex-1 items-center justify-center gap-2 rounded-full rose-gradient px-6 py-3 font-bold text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-40"><ShoppingBag size={18} /> {selectedVariant?.stock ? 'Add to Cart' : 'Sold out'}</button>
              <button onClick={() => dispatch(toggleWishlist(product))} className="grid h-12 w-12 place-items-center rounded-full bg-white/70 shadow dark:bg-white/10"><Heart size={18} /></button>
            </div>
            <button onClick={add} disabled={!selectedVariant || selectedVariant.stock < qty} className="mt-3 w-full rounded-full bg-[#1A1A1A] px-6 py-3 font-bold text-white disabled:opacity-40">Buy Now</button>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Info icon={<Truck />} title="Delivery estimate" text="Arrives in 3-5 days across major Indian cities." />
              <Info icon={<ShieldCheck />} title="Secure payment" text="COD, UPI, cards and wallet UI supported." />
            </div>
          </div>
        </div>
        <div className="mt-12 rounded-3xl bg-white/55 p-5 shadow-xl dark:bg-white/5">
          <div className="flex flex-wrap gap-2">{['Description', 'Reviews', 'Shipping'].map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-full px-5 py-2 text-sm font-bold ${tab === item ? 'rose-gradient text-[#1A1A1A]' : 'bg-white/70 dark:bg-white/10'}`}>{item}</button>)}</div>
          <p className="mt-5 leading-8 opacity-75">{tab === 'Description' && product.description}{tab === 'Reviews' && 'Customers love the shine, comfort fit and premium pouch packaging.'}{tab === 'Shipping' && 'Orders ship within 24 hours with tracking updates on WhatsApp and email.'}</p>
        </div>
      </Section>
      <Section eyebrow="You may also love" title="Similar Products">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{similar.map((item) => <ProductCard key={item.id} product={item} />)}</div>
      </Section>
      <Section eyebrow="Recently viewed" title="Still sparkling in your mind">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.filter((item) => item.id !== product.id).slice(0, 4).map((item) => <ProductCard key={item.id} product={item} />)}</div>
      </Section>
    </>
  );
}

function Info({ icon, title, text }) {
  return <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/10"><div className="text-[#D4A373]">{icon}</div><p className="mt-2 font-bold">{title}</p><p className="mt-1 text-sm opacity-65">{text}</p></div>;
}
