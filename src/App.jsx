import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import SearchModal from "./components/SearchModal.jsx";
import QuickView from "./components/QuickView.jsx";
import MobileBottomNav from "./components/MobileBottomNav.jsx";
import FloatingActions from "./components/FloatingActions.jsx";
import Toast from "./components/Toast.jsx";
import Chatbot from "./components/Chatbot.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Auth from "./pages/Auth.jsx";
import Profile from "./pages/Profile.jsx";
import Orders from "./pages/Orders.jsx";
import InfoPage from "./pages/InfoPage.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
    const location = useLocation();
    const darkMode = useSelector((state) => state.ui.darkMode);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [location.pathname]);

    return (
        <div className={darkMode ? "dark min-h-screen" : "light-mode min-h-screen"}>
            <Navbar />
            <main className="pt-28">
                <AnimatePresence mode="wait">
                    <motion.div key={location.pathname} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                        <Routes location={location}>
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/product/:id" element={<ProductDetails />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/about" element={<InfoPage type="about" />} />
                            <Route path="/privacy-policy" element={<InfoPage type="privacy" />} />
                            <Route path="/return-policy" element={<InfoPage type="returns" />} />
                            <Route path="/faq" element={<InfoPage type="faq" />} />
                            <Route path="/contact" element={<Contact />} />
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
            <CartDrawer />
            <SearchModal />
            <QuickView />
            <MobileBottomNav />
            <FloatingActions />
            <Chatbot />
            <Toast />
        </div>
    );
}
