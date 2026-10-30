import { useState } from "react";
import { Camera, Mail, MapPin, Phone } from "lucide-react";
import Seo from "../components/Seo.jsx";
import Section from "../components/Section.jsx";
import { submitContactMessage } from "../api/contact.js";

const inputClass = "w-full rounded-2xl bg-white/80 px-4 py-3 outline-none dark:bg-white/10";

export default function Contact() {
    const [submitting, setSubmitting] = useState(false);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");

    const submit = async (event) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        setSubmitting(true);
        setNotice("");
        setError("");
        const form = new FormData(formElement);
        const result = await submitContactMessage(Object.fromEntries(form.entries()));
        if (result.success) {
            formElement.reset();
            setNotice(result.message || "Your message has been received.");
        } else {
            setError(result.message || "We could not send your message. Please try again.");
        }
        setSubmitting(false);
    };

    return (
        <>
            <Seo title="Contact" description="Contact Velvet Spice customer support." />
            <Section eyebrow="Get in touch" title="Contact Us">
                <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
                    <form onSubmit={submit} className="grid gap-4 rounded-3xl bg-white/60 p-6 shadow-xl dark:bg-white/5">
                        <label className="grid gap-2">Name<input className={inputClass} name="name" autoComplete="name" required minLength={2} maxLength={120} /></label>
                        <label className="grid gap-2">Email<input className={inputClass} name="email" type="email" autoComplete="email" required maxLength={254} /></label>
                        <label className="grid gap-2">Phone number<input className={inputClass} name="phone" type="tel" autoComplete="tel" required maxLength={30} /></label>
                        <label className="grid gap-2">Issue<input className={inputClass} name="subject" required minLength={2} maxLength={180} /></label>
                        <label className="grid gap-2">Describe your issue<textarea className={`${inputClass} min-h-40`} name="message" required minLength={10} maxLength={10000} /></label>
                        <input className="pointer-events-none absolute -left-[10000px] h-px w-px opacity-0" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                        {notice && <p role="status" className="text-green-700 dark:text-green-300">{notice}</p>}
                        {error && <p role="alert" className="text-red-700 dark:text-red-300">{error}</p>}
                        <button disabled={submitting} className="rounded-full rose-gradient px-6 py-3 font-bold text-[#1A1A1A] disabled:opacity-60">
                            {submitting ? "Sending…" : "Send message"}
                        </button>
                    </form>
                    <div className="rounded-3xl bg-[#1A1A1A] p-6 text-[#FFF8F5] shadow-xl">
                        <h2 className="font-display text-4xl">Boutique Support</h2>
                        <div className="mt-6 grid gap-4 text-sm text-white/75">
                            <p className="flex items-center gap-3"><Mail className="text-[#D4A373]" /> hello@velvetspice.in</p>
                            <p className="flex items-center gap-3"><Phone className="text-[#D4A373]" /> +91 99999 99999</p>
                            <p className="flex items-center gap-3"><Camera className="text-[#D4A373]" /> @velvetspice</p>
                            <p className="flex items-center gap-3"><MapPin className="text-[#D4A373]" /> Modinagar, India</p>
                        </div>
                    </div>
                </div>
            </Section>
        </>
    );
}
