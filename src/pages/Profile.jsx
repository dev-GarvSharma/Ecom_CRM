import { useEffect, useState } from 'react';
import { Bell, Heart, LogOut, MapPin, Package, RotateCcw, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Section from '../components/Section.jsx';
import { orders } from '../data/products.js';
import { get, put } from '../admin/app/axiosWrapper.js';
import LocalStorageService from '../admin/services/localStorageService.js';

export default function Profile() {
  const [marketingPreference, setMarketingPreference] = useState(null);
  const [emailDraft, setEmailDraft] = useState('');
  const [preferenceBusy, setPreferenceBusy] = useState(false);
  const [preferenceMessage, setPreferenceMessage] = useState('');
  const signedIn = Boolean(LocalStorageService.getAccessToken());

  useEffect(() => {
    if (!signedIn) return;
    get('auth/me/marketing-preferences').then((result) => {
      if (result.success) {
        const preference = result.data?.data || null;
        setMarketingPreference(preference);
        setEmailDraft(preference?.email || '');
      }
    });
  }, [signedIn]);

  const updateMarketingPreference = async (subscribed) => {
    setPreferenceBusy(true);
    setPreferenceMessage('');
    const result = await put('auth/me/marketing-preferences', { subscribed });
    setPreferenceBusy(false);
    if (!result.success) {
      setPreferenceMessage(result.message || 'Could not update email preferences.');
      return;
    }
    setMarketingPreference((current) => ({ ...current, subscribed }));
    setPreferenceMessage(subscribed ? 'You are subscribed to campaign emails.' : 'You are unsubscribed from campaign emails.');
  };

  const saveAccountEmail = async () => {
    setPreferenceBusy(true);
    setPreferenceMessage('');
    const result = await put('auth/me', { email: emailDraft.trim() });
    setPreferenceBusy(false);
    if (!result.success) {
      setPreferenceMessage(result.message || 'Could not update your email.');
      return;
    }
    setMarketingPreference((current) => ({
      ...current,
      email: result.data?.data?.email || '',
      subscribed: result.data?.data?.marketingEmailSubscribed || false,
    }));
    setPreferenceMessage('Account email saved. Review the opt-in below to receive campaign emails.');
  };
  const cards = [
    [Package, 'My Orders', `${orders.length} recent orders`, '/orders'],
    [Heart, 'Wishlist', 'Saved favourites', '/wishlist'],
    [MapPin, 'Saved Addresses', 'Home and studio address', '#'],
    [Bell, 'Notifications', 'Drop alerts and offers', '#'],
    [RotateCcw, 'Returns', 'Refund history', '#'],
    [UserRound, 'Profile Edit', 'Name, phone and email', '#'],
  ];

  return (
    <>
      <Seo title="Profile" description="Manage Velvet Spice orders, addresses, wishlist and account details." />
      <Section eyebrow="Dashboard" title="Your boutique profile">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-3xl bg-[#1A1A1A] p-6 text-[#FFF8F5] shadow-xl">
            <div className="grid h-20 w-20 place-items-center rounded-full rose-gradient text-3xl font-bold text-[#1A1A1A]">VS</div>
            <h2 className="mt-5 font-display text-4xl">Hi, Shikha</h2>
            <p className="mt-2 text-white/60">Gold tier member</p>
            <button className="mt-8 flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 font-bold"><LogOut size={18} /> Logout</button>
          </aside>
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map(([Icon, title, text, to]) => (
              <Link key={title} to={to} className="rounded-3xl bg-white/60 p-6 shadow-lg transition hover:-translate-y-1 dark:bg-white/5">
                <Icon className="text-[#D4A373]" />
                <h3 className="mt-4 font-display text-3xl">{title}</h3>
                <p className="mt-2 text-sm opacity-65">{text}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 rounded-3xl bg-white/60 p-6 shadow-lg dark:bg-white/5">
          <h2 className="font-display text-3xl">Email preferences</h2>
          <p className="mt-2 text-sm opacity-70">Choose whether to receive perfume news, product launches, and promotional emails.</p>
          {!signedIn ? <Link to="/auth?redirect=%2Fprofile" className="mt-4 inline-block font-semibold text-[#A66C46]">Sign in to manage preferences</Link> : marketingPreference ? (
            <>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input type="email" value={emailDraft} onChange={(event) => setEmailDraft(event.target.value)} placeholder="you@example.com" className="min-w-0 flex-1 rounded-xl border border-[#D4A373]/30 bg-white/80 px-4 py-3 text-sm dark:bg-white/10" />
                <button type="button" disabled={preferenceBusy || emailDraft.trim() === (marketingPreference.email || '')} onClick={saveAccountEmail} className="rounded-full rose-gradient px-5 py-3 text-sm font-bold text-[#1A1A1A] disabled:opacity-50">Save email</button>
              </div>
              <label className="mt-5 flex items-start gap-3 text-sm">
                <input type="checkbox" className="mt-1 accent-[#A66C46]" checked={Boolean(marketingPreference.subscribed)} disabled={preferenceBusy || !marketingPreference.email} onChange={(event) => updateMarketingPreference(event.target.checked)} />
                <span>{marketingPreference.email ? `Send campaign email to ${marketingPreference.email}` : 'Add an email address to subscribe.'}</span>
              </label>
            </>
          ) : <p className="mt-4 text-sm">Loading preferences…</p>}
          {preferenceMessage && <p className="mt-3 text-sm" role="status">{preferenceMessage}</p>}
        </div>
      </Section>
    </>
  );
}
