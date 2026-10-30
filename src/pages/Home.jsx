import { ArrowRight, Gem, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Seo from "../components/Seo.jsx";
import Section from "../components/Section.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Stars from "../components/Stars.jsx";
import { testimonials } from "../data/products.js";
import { resolveImageUrl } from "../utils/image.js";
import { useCatalog } from "../catalog/useCatalog.js";

export default function Home() {
    const { categories, products } = useCatalog();
    return (
        <>
            <Seo title="Luxury Artificial Jewellery" description="Shop rose gold, blush and crystal artificial jewellery with a premium Instagram boutique aesthetic." />
            <Hero />
            <Marquee />
            <Section eyebrow="Curated edits" title="Trending Collections">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.slice(0, 6).map((category) => (
                        <Link key={category.name} to={`/shop?category=${category.name}`} className="group relative aspect-[4/3] overflow-hidden rounded-2xl luxury-shadow">
                            {category.image ? <img src={category.image} alt={category.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" /> : <div aria-hidden="true" className="h-full w-full bg-gradient-to-br from-[#e6d6c6] via-[#c2a78f] to-[#5b483a] transition duration-700 group-hover:scale-110" />}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 to-transparent" />
                            <div className="absolute bottom-5 left-5 text-white">
                                <p className="font-display text-3xl">{category.name}</p>
                                <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
                                    Shop edit <ArrowRight size={16} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </Section>
            <Section eyebrow="Fresh drop" title="New Arrivals">
                <ProductScroller products={products.slice(0, 8)} />
            </Section>
            <PromoBand />
            <Section eyebrow="Loved by the glow club" title="Best Sellers">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </Section>
            <FlashSale />
            <InstagramGallery />
            <WhyChooseUs />
            <Testimonials />
            <Newsletter />
        </>
    );
}

function Hero() {
    return (
        <section className="relative min-h-[calc(100vh-7rem)] overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=1800&q=85"
                alt="Jewellery model wearing rose gold accessories"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F5]/95 via-[#FFF8F5]/68 to-[#1A1A1A]/25 dark:from-[#1A1A1A]/88 dark:via-[#1A1A1A]/45" />
            <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center px-4 pb-20 pt-10 sm:px-6 lg:px-8">
                <motion.div className="max-w-2xl" initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    <p className="mb-4 inline-flex rounded-full border border-[#D4A373]/30 rose-gradient px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#1A1A1A]  backdrop-blur">
                        Rose gold boutique drop
                    </p>
                    <h1 className="font-display text-6xl leading-[0.95] text-[#1A1A1A] dark:text-[#FFF8F5] sm:text-7xl lg:text-8xl">Velvet Spice</h1>
                    <p className="mt-6 max-w-xl text-lg leading-8 text-[#1A1A1A]/72 dark:text-white/78">
                        Artificial jewellery with the premium softness of blush silk, glossy reels and candlelit unboxing moments.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link to="/shop" className="rounded-full rose-gradient px-7 py-3 font-bold text-[#1A1A1A] shadow-xl">
                            Shop the drop
                        </Link>
                        <Link to="/about" className="rounded-full border border-[#1A1A1A]/20 bg-white/50 px-7 py-3 font-bold backdrop-blur dark:border-white/20">
                            Brand story
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function Marquee() {
    return (
        <div className="overflow-hidden border-y border-[#D4A373]/20 bg-[#1A1A1A] py-4 text-[#FFF8F5]">
            <motion.div className="flex min-w-max gap-10 text-sm font-bold uppercase tracking-[0.3em]" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 22, ease: "linear" }}>
                {Array.from({ length: 2 }).flatMap((_, copy) =>
                    ["Anti-tarnish glow", "Gift-ready packaging", "COD available", "New reels every Friday", "Free shipping over Rs. 2,999"].map((text) => <span key={`${copy}-${text}`}>{text}</span>),
                )}
            </motion.div>
        </div>
    );
}

function ProductScroller({ products: list }) {
    return (
        <div className="no-scrollbar flex gap-5 overflow-x-auto pb-4">
            {list.map((product) => (
                <div key={product.id} className="w-72 shrink-0">
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}

function PromoBand() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid overflow-hidden rounded-3xl bg-[#1A1A1A] text-[#FFF8F5] luxury-shadow lg:grid-cols-2">
                <div className="p-8 sm:p-12">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D4A373]">Luxury pouch included</p>
                    <h2 className="mt-3 font-display text-5xl">Unbox the outfit moment before the outfit.</h2>
                    <p className="mt-4 text-white/70">Every order arrives in a soft velvet sleeve with care card, shimmer tissue and a tiny note.</p>
                </div>
                <img
                    src="https://images.unsplash.com/photo-1602752250015-52934bc45613?auto=format&fit=crop&w=1200&q=80"
                    alt="Premium jewellery packaging"
                    loading="lazy"
                    className="h-full min-h-80 w-full object-cover"
                />
            </div>
        </section>
    );
}

function FlashSale() {
    const { products } = useCatalog();
    return (
        <Section eyebrow="Limited sparkle" title="Flash Sale">
            <div className="grid items-center gap-8 rounded-3xl border border-[#D4A373]/20 bg-white/55 p-6 shadow-xl backdrop-blur dark:bg-white/5 lg:grid-cols-[1fr_1.4fr]">
                <div>
                    <p className="font-display text-5xl">Pink Hour</p>
                    <p className="mt-3 leading-7 opacity-70">Up to 38% off on crystal necklaces, cascade earrings and viral rings until midnight.</p>
                    <div className="mt-5 flex gap-3">
                        {["07 H", "24 M", "18 S"].map((time) => (
                            <span key={time} className="rounded-2xl bg-[#1A1A1A] px-5 py-3 font-bold text-white">
                                {time}
                            </span>
                        ))}
                    </div>
                </div>
                <ProductScroller products={products.filter((item) => item.badge === "Flash Sale" || item.badge === "Viral Pick" || item.badge === "New")} />
            </div>
        </Section>
    );
}

function InstagramGallery() {
    const { products } = useCatalog();
    const images = products.concat(products).slice(0, 8);
    return (
        <Section eyebrow="@velvetspice" title="Instagram Gallery">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {images.map((product, index) => (
                    <img key={`${product.id}-${index}`} src={resolveImageUrl(product.images[index % 2])} alt="" loading="lazy" className="aspect-square rounded-2xl object-cover shadow-lg" />
                ))}
            </div>
        </Section>
    );
}

function WhyChooseUs() {
    const items = [
        [Gem, "Premium finish", "High-shine pieces with comfort-first plating."],
        [Truck, "Fast delivery", "Dispatch in 24 hours with live tracking."],
        [ShieldCheck, "Easy returns", "7-day return support for a confident cart."],
        [Sparkles, "Gift-ready", "Every order feels like an influencer PR box."],
    ];
    return (
        <Section eyebrow="Why us" title="Soft luxury, serious details">
            <div className="grid gap-4 md:grid-cols-4">
                {items.map(([Icon, title, text]) => (
                    <div key={title} className="rounded-2xl bg-white/60 p-6 shadow-lg dark:bg-white/10">
                        <Icon className="text-[#D4A373]" />
                        <h3 className="mt-4 font-display text-2xl">{title}</h3>
                        <p className="mt-2 text-sm leading-6 opacity-70">{text}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
}

function Testimonials() {
    return (
        <Section eyebrow="Reviews" title="Girls are obsessed">
            <div className="grid gap-4 md:grid-cols-3">
                {testimonials.map((item) => (
                    <div key={item.name} className="rounded-2xl bg-white/60 p-6 shadow-lg dark:bg-white/10">
                        <Stars rating={item.rating} />
                        <p className="mt-4 leading-7">"{item.text}"</p>
                        <p className="mt-4 font-semibold text-[#D4A373]">- {item.name}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
}

function Newsletter() {
    return (
        <section className="mx-auto max-w-5xl px-4 py-14 text-center">
            <div className="rounded-3xl rose-gradient p-8 text-[#1A1A1A] shadow-2xl sm:p-12">
                <h2 className="font-display text-5xl">Join the sparkle list</h2>
                <p className="mx-auto mt-3 max-w-xl">First access to drops, styling edits, secret sale codes and the prettiest launch notes.</p>
                <div className="mx-auto mt-6 flex max-w-lg rounded-full bg-white/80 p-1">
                    <input className="min-w-0 flex-1 bg-transparent px-5 outline-none" placeholder="Email address" />
                    <button className="rounded-full bg-[#1A1A1A] px-6 py-3 font-bold text-white">Subscribe</button>
                </div>
            </div>
        </section>
    );
}
