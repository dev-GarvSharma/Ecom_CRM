import { Heart, Menu, Moon, Search, ShoppingBag, Sun, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCartOpen, setSearchOpen, toggleDarkMode } from "../redux/slices/uiSlice.js";

const links = [
    ["Home", "/"],
    ["Shop", "/shop"],
    ["Blog", "/blog"],
    ["About", "/about"],
    ["Contact", "/contact"],
    ["FAQ", "/faq"],
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobile, setMobile] = useState(false);
    const dispatch = useDispatch();
    const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
    const wishlistCount = useSelector((state) => state.wishlist.items.length);
    const darkMode = useSelector((state) => state.ui.darkMode);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navClass = scrolled ? "glass py-3" : "bg-transparent py-5";

    return (
        <>
            <div className="fixed inset-x-0 top-0 z-50">
                <div className="bg-[#1A1A1A] px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.24em] text-[#FFF8F5]">Free shimmer pouch on orders above Rs. 2,999</div>
                <nav className={`${navClass} transition-all duration-300`}>
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <button className="lg:hidden" onClick={() => setMobile(true)} aria-label="Open menu">
                            <Menu />
                        </button>
                        <Link to="/" className="font-display text-3xl font-bold text-[#1A1A1A] dark:text-[#FFF8F5]">
                            Velvet Spice
                        </Link>
                        <div className="hidden items-center gap-8 lg:flex">
                            {links.map(([label, to]) => (
                                <NavLink key={to} to={to} className={({ isActive }) => `text-sm font-semibold ${isActive ? "text-[#D4A373]" : "text-[#1A1A1A] dark:text-[#FFF8F5]"}`}>
                                    {label}
                                </NavLink>
                            ))}
                            <div className="group relative py-2">
                                <button className="text-sm font-semibold text-[#1A1A1A] dark:text-[#FFF8F5]">Categories</button>
                                <div className="invisible absolute left-1/2 top-full grid w-[520px] -translate-x-1/2 grid-cols-3 gap-3 rounded-2xl border border-[#D4A373]/20 bg-[#FFF8F5]/95 p-4 opacity-0 shadow-2xl backdrop-blur transition group-hover:visible group-hover:opacity-100 dark:bg-[#1A1A1A]/95">
                                    {["Earrings", "Necklaces", "Rings", "Bracelets", "Hair Jewels", "Anklets"].map((item) => (
                                        <Link key={item} to={`/shop?category=${item}`} className="rounded-xl bg-white/60 p-4 text-sm font-semibold transition hover:bg-[#F7D6E0] dark:bg-white/10">
                                            {item}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconButton onClick={() => dispatch(setSearchOpen(true))} label="Search">
                                <Search size={19} />
                            </IconButton>
                            <IconButton onClick={() => dispatch(toggleDarkMode())} label="Toggle theme">
                                {darkMode ? <Sun size={19} /> : <Moon size={19} />}
                            </IconButton>
                            <Link
                                to="/wishlist"
                                className="relative hidden h-10 w-10 place-items-center rounded-full bg-white/60 shadow-sm transition hover:bg-[#F7D6E0] sm:grid dark:bg-white/10"
                                aria-label="Wishlist"
                            >
                                <Heart size={19} />
                                {wishlistCount > 0 && <Badge count={wishlistCount} />}
                            </Link>
                            <button
                                className="relative grid h-10 w-10 place-items-center rounded-full bg-white/60 shadow-sm transition hover:bg-[#F7D6E0] dark:bg-white/10"
                                onClick={() => dispatch(setCartOpen(true))}
                                aria-label="Cart"
                            >
                                <ShoppingBag size={19} />
                                {cartCount > 0 && <Badge count={cartCount} />}
                            </button>
                            <Link
                                to="/profile"
                                className="hidden h-10 w-10 place-items-center rounded-full bg-white/60 shadow-sm transition hover:bg-[#F7D6E0] sm:grid dark:bg-white/10"
                                aria-label="Profile"
                            >
                                <UserRound size={19} />
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>

            {mobile && (
                <div className="fixed inset-0 z-[80] bg-[#1A1A1A]/50 lg:hidden">
                    <div className="h-full w-80 max-w-[86vw] bg-[#FFF8F5] p-6 shadow-2xl dark:bg-[#1A1A1A]">
                        <div className="mb-8 flex items-center justify-between">
                            <span className="font-display text-3xl">Velvet Spice</span>
                            <button onClick={() => setMobile(false)} aria-label="Close menu">
                                <X />
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {links.map(([label, to]) => (
                                <Link key={to} to={to} onClick={() => setMobile(false)} className="text-lg font-semibold">
                                    {label}
                                </Link>
                            ))}
                            <Link to="/auth" onClick={() => setMobile(false)} className="text-lg font-semibold">
                                Login / Signup
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function IconButton({ children, onClick, label }) {
    return (
        <button className="hidden h-10 w-10 place-items-center rounded-full bg-white/60 shadow-sm transition hover:bg-[#F7D6E0] sm:grid dark:bg-white/10" onClick={onClick} aria-label={label}>
            {children}
        </button>
    );
}

function Badge({ count }) {
    return <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#D4A373] px-1 text-[10px] font-bold text-[#1A1A1A]">{count}</span>;
}
