import { Camera, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-[#D4A373]/20 bg-[#1A1A1A] text-[#FFF8F5]">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8">
                <div>
                    <h2 className="font-display text-4xl">Velvet Spice</h2>
                    <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">A rose-gold jewellery boutique for soft glam days, wedding guest nights and every viral outfit in between.</p>
                    <div className="mt-6 flex gap-3">
                        {[Camera, Mail, Phone].map((Icon, index) => (
                            <span key={index} className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                                <Icon size={18} />
                            </span>
                        ))}
                    </div>
                </div>
                <FooterList title="Shop" items={["New Arrivals", "Best Sellers", "Earrings", "Necklaces", "Flash Sale"]} />
                <FooterList title="Support" items={["Contact Us", "Blog", "FAQ", "Privacy Policy", "Return Policy", "Order Tracking"]} />
                <div>
                    <h3 className="font-semibold">Boutique Notes</h3>
                    <p className="mt-4 text-sm text-white/70">Get launch drops, styling edits and secret coupons.</p>
                    <div className="mt-4 flex rounded-full bg-white/10 p-1">
                        <input className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" placeholder="Email address" />
                        <button className="rounded-full rose-gradient px-4 py-2 text-sm font-bold text-[#1A1A1A]">Join</button>
                    </div>
                    <p className="mt-5 flex items-center gap-2 text-sm text-white/70">
                        <MapPin size={16} /> Modinagar design studio, ships across India
                    </p>
                </div>
            </div>
            <div className="border-t border-white/10 px-4 py-5 text-center text-xs uppercase tracking-[0.22em] text-white/50">
                <Sparkles className="mx-auto mb-2" size={16} /> Crafted for scroll-stopping jewellery moments
            </div>
        </footer>
    );
}

function FooterList({ title, items }) {
    return (
        <div>
            <h3 className="font-semibold">{title}</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/70">
                {items.map((item) => (
                    <Link key={item} to={`/${item.toLowerCase().replaceAll(" ", "-").replace("new-arrivals", "shop")}`}>
                        {item}
                    </Link>
                ))}
            </div>
        </div>
    );
}
