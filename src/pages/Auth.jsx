import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import {
  confirmVerification,
  isAdminAccount,
  login,
  register,
} from "../api/auth.js";
import LocalStorageService from "../admin/services/localStorageService.js";

export default function Auth({ adminMode = false }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [marketingEmailSubscribed, setMarketingEmailSubscribed] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [purpose, setPurpose] = useState("login");
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSignup = mode === "signup" && !adminMode;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (!challenge) {
        const result = isSignup
          ? await register({
              name: name.trim(),
              phone: phone.trim(),
              email: email.trim() || undefined,
              marketingEmailSubscribed,
            })
          : await login({ phone: phone.trim() });
        const pending = result.data?.data;
        if (!result.success || !pending) {
          setError(result.message || "Unable to request a verification code.");
          return;
        }
        setPurpose(pending.purpose || (isSignup ? "register" : "login"));
        setChallenge(pending);
        if (pending.otp) setCode(String(pending.otp));
        return;
      }

      const result = await confirmVerification({
        phone: phone.trim(),
        purpose,
        code: code.trim(),
      });
      const session = result.data?.data;
      if (!result.success || !session?.accessToken) {
        setError(result.message || "The verification code is invalid or expired.");
        return;
      }
      LocalStorageService.setAuthData(session);
      setChallenge(null);
      if (adminMode) {
        if (!isAdminAccount(session.user)) {
          LocalStorageService.clearAuthData();
          setError("This account does not have administrator access.");
          return;
        }
        navigate("/admin", { replace: true });
        return;
      }
      const redirectTo = searchParams.get("redirect") || "/";
      navigate(redirectTo.startsWith("/") ? redirectTo : "/", { replace: true });
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const requestDifferentCode = async () => {
    setChallenge(null);
    setCode("");
    setError("");
  };

  return (
    <>
      <Seo
        title={adminMode ? "Admin sign in" : isSignup ? "Create account" : "Login"}
        description="Sign in or create your perfume store account."
      />
      <section className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-6xl items-center gap-8 px-4 py-14 lg:grid-cols-2">
        <div className="hidden overflow-hidden rounded-3xl luxury-shadow lg:block">
          <img
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85"
            alt="Perfume bottle"
            className="h-[680px] w-full object-cover"
          />
        </div>
        <div className="rounded-3xl bg-white/60 p-6 shadow-2xl backdrop-blur dark:bg-white/5 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D4A373]">
            {adminMode ? "Administrator access" : "Members lounge"}
          </p>
          <h1 className="mt-3 font-display text-5xl">
            {challenge
              ? "Verify your mobile"
              : isSignup
                ? "Create account"
                : adminMode
                  ? "Admin sign in"
                  : "Welcome back"}
          </h1>
          <p className="mt-3 opacity-70">
            {challenge
              ? `Enter the code sent to ${challenge.destination || phone}.`
              : adminMode
                ? "Sign in with your administrator mobile number."
                : isSignup
                  ? "Create an account with your mobile number."
                  : "Sign in with your verified mobile number."}
          </p>

          <form onSubmit={submit} className="mt-7 grid gap-4">
            {!challenge && isSignup && (
              <Input label="Full name" value={name} onChange={setName} autoComplete="name" required />
            )}
            {!challenge && (
              <Input
                label="Mobile number"
                type="tel"
                value={phone}
                onChange={setPhone}
                autoComplete="tel"
                placeholder="+919876543210"
                // pattern="\\+[1-9][0-9]{7,14}"
                required
              />
            )}
            {!challenge && isSignup && (
              <Input
                label="Email address (optional)"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />
            )}
            {!challenge && isSignup && email.trim() && (
              <label className="flex items-start gap-3 text-xs leading-5 opacity-75">
                <input
                  type="checkbox"
                  checked={marketingEmailSubscribed}
                  onChange={(event) => setMarketingEmailSubscribed(event.target.checked)}
                  className="mt-1 accent-[#A66C46]"
                />
                <span>I agree to receive perfume news, product launches, and promotional emails. I can unsubscribe at any time.</span>
              </label>
            )}
            {challenge && (
              <Input
                label="Verification code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={setCode}
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
            )}
            {challenge?.otp && (
              <p className="text-sm" role="status">
                Development OTP: <strong>{challenge.otp}</strong>
              </p>
            )}
            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}
            <button disabled={submitting} className="rounded-full rose-gradient px-6 py-3 font-bold text-[#1A1A1A] disabled:cursor-wait disabled:opacity-60">
              {submitting
                ? "Please wait…"
                : challenge
                  ? "Verify and continue"
                  : isSignup
                    ? "Send verification code"
                    : "Send login code"}
            </button>
            {challenge && (
              <button type="button" className="text-sm font-semibold" onClick={requestDifferentCode}>
                Use a different number
              </button>
            )}
          </form>

          {!adminMode ? (
            <p className="mt-6 text-center text-sm">
              {isSignup ? "Already have an account? " : "New to the store? "}
              <button
                className="font-bold text-[#A66C46]"
                onClick={() => {
                  setError("");
                  setChallenge(null);
                  setMode(isSignup ? "login" : "signup");
                }}
              >
                {isSignup ? "Sign in" : "Create an account"}
              </button>
            </p>
          ) : (
            <p className="mt-6 text-center text-sm">
              <Link className="font-semibold text-[#A66C46]" to="/">
                Back to shop
              </Link>
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function Input({ label, type = "text", value, onChange, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-[#D4A373]/20 bg-white/80 px-4 py-3 outline-none focus:border-[#D4A373] dark:bg-white/10"
        {...props}
      />
    </label>
  );
}
