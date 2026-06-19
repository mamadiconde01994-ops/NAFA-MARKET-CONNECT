import { useState } from "react";

export function LoginElegant() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-[390px] h-[844px] overflow-hidden relative bg-white flex flex-col select-none">
      {/* ── Hero header ── */}
      <div
        className="relative flex-shrink-0 flex flex-col items-center justify-end pb-10 pt-14"
        style={{
          background: "linear-gradient(160deg, #0A2318 0%, #1B4332 55%, #2D6A4F 100%)",
          height: "38%",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-40px] right-[-40px] w-[180px] h-[180px] rounded-full opacity-10"
          style={{ background: "#52B788" }} />
        <div className="absolute bottom-[-20px] left-[-30px] w-[120px] h-[120px] rounded-full opacity-10"
          style={{ background: "#52B788" }} />

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div
            className="w-[72px] h-[72px] rounded-[22px] flex items-center justify-center shadow-xl"
            style={{ background: "linear-gradient(135deg, #52B788 0%, #2D6A4F 100%)" }}
          >
            <span className="text-white font-black text-3xl" style={{ fontFamily: "system-ui, sans-serif" }}>N</span>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "system-ui" }}>NAFA Marché</p>
            <p className="text-green-300 text-xs mt-0.5 tracking-widest uppercase opacity-80">Guinée · Marché digital</p>
          </div>
        </div>
      </div>

      {/* ── White card ── */}
      <div
        className="flex-1 bg-white flex flex-col px-6 pt-7 overflow-hidden"
        style={{ borderRadius: "28px 28px 0 0", marginTop: "-20px", zIndex: 2 }}
      >
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight" style={{ fontFamily: "system-ui" }}>
            Bon retour 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">Connectez-vous à votre compte</p>
        </div>

        {/* Email field */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
            Adresse e-mail
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
            </span>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all placeholder:text-gray-400"
              style={{ fontFamily: "system-ui" }}
            />
          </div>
        </div>

        {/* Password field */}
        <div className="mb-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
            Mot de passe
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-11 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all placeholder:text-gray-400"
              style={{ fontFamily: "system-ui" }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword
                ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="text-right mb-5">
          <button className="text-xs font-semibold" style={{ color: "#1B4332" }}>
            Mot de passe oublié ?
          </button>
        </div>

        {/* CTA */}
        <button
          className="w-full py-4 rounded-2xl text-white font-bold text-[15px] shadow-lg active:scale-[0.98] transition-transform"
          style={{ background: "linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)", fontFamily: "system-ui", boxShadow: "0 8px 20px rgba(27,67,50,0.35)" }}
        >
          Se connecter
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Guest */}
        <button className="w-full py-3.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
          style={{ fontFamily: "system-ui" }}>
          Continuer en tant que visiteur
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Pas encore inscrit ?{" "}
          <span className="font-bold" style={{ color: "#1B4332" }}>Créer un compte</span>
        </p>
      </div>
    </div>
  );
}
