import { useState } from "react";

export function LoginPremium() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPass, setFocusPass] = useState(false);

  return (
    <div className="w-[390px] h-[844px] overflow-hidden relative flex flex-col select-none"
      style={{ background: "#FAFAF8" }}>

      {/* ── Abstract top section ── */}
      <div className="relative flex-shrink-0" style={{ height: "34%" }}>
        {/* Background geometric shape */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 290" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A2318" />
              <stop offset="100%" stopColor="#2D6A4F" />
            </linearGradient>
          </defs>
          <path d="M0 0 L390 0 L390 220 Q195 290 0 220 Z" fill="url(#hg)" />
        </svg>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-10 pb-6 gap-4">
          {/* Logo mark */}
          <div className="relative">
            <div className="w-[64px] h-[64px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #52B788, #2D6A4F)" }}>
                <span className="text-white font-black text-2xl" style={{ fontFamily: "system-ui" }}>N</span>
              </div>
            </div>
            {/* Golden ring accent */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-yellow-300/60 bg-yellow-400/20" />
          </div>

          <div className="text-center">
            <p className="text-white font-black text-2xl tracking-tighter" style={{ fontFamily: "system-ui" }}>
              NAFA <span style={{ color: "#86efac" }}>Marché</span>
            </p>
            <p className="text-white/50 text-[11px] tracking-[0.2em] uppercase mt-0.5">Guinée</p>
          </div>
        </div>
      </div>

      {/* ── Form area ── */}
      <div className="flex-1 px-6 pt-6 flex flex-col">
        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-1 rounded-full" style={{ background: "#1B4332" }} />
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase" style={{ color: "#1B4332" }}>
              Bienvenue
            </span>
          </div>
          <h1 className="text-[28px] font-black text-gray-900 leading-tight tracking-tight" style={{ fontFamily: "system-ui" }}>
            Connexion
          </h1>
        </div>

        {/* Email input — floating label style */}
        <div className="relative mb-4">
          <div
            className="rounded-2xl border-2 px-4 pt-5 pb-3 transition-all"
            style={{
              borderColor: focusEmail ? "#1B4332" : "#E5E7EB",
              background: focusEmail ? "#fff" : "#F9FAFB",
              boxShadow: focusEmail ? "0 0 0 4px rgba(27,67,50,0.08)" : "none"
            }}
          >
            <span
              className="absolute left-4 text-[10px] font-bold tracking-wider uppercase transition-all"
              style={{ top: "10px", color: focusEmail || email ? "#1B4332" : "#9CA3AF" }}
            >
              E-mail
            </span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusEmail(true)}
              onBlur={() => setFocusEmail(false)}
              placeholder="votre@email.com"
              className="w-full bg-transparent text-[15px] text-gray-900 focus:outline-none placeholder:text-gray-300"
              style={{ fontFamily: "system-ui" }}
            />
          </div>
        </div>

        {/* Password input — floating label style */}
        <div className="relative mb-2">
          <div
            className="rounded-2xl border-2 px-4 pt-5 pb-3 transition-all"
            style={{
              borderColor: focusPass ? "#1B4332" : "#E5E7EB",
              background: focusPass ? "#fff" : "#F9FAFB",
              boxShadow: focusPass ? "0 0 0 4px rgba(27,67,50,0.08)" : "none"
            }}
          >
            <span
              className="absolute left-4 text-[10px] font-bold tracking-wider uppercase transition-all"
              style={{ top: "10px", color: focusPass || password ? "#1B4332" : "#9CA3AF" }}
            >
              Mot de passe
            </span>
            <div className="flex items-center gap-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusPass(true)}
                onBlur={() => setFocusPass(false)}
                placeholder="••••••••"
                className="flex-1 bg-transparent text-[15px] text-gray-900 focus:outline-none placeholder:text-gray-300"
                style={{ fontFamily: "system-ui" }}
              />
              <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                {showPassword
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>
        </div>

        {/* Forgot */}
        <div className="text-right mb-6">
          <button className="text-xs font-bold" style={{ color: "#1B4332" }}>
            Mot de passe oublié ?
          </button>
        </div>

        {/* CTA */}
        <button
          className="w-full py-4 rounded-2xl text-white font-black text-[16px] tracking-tight relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
            fontFamily: "system-ui",
            boxShadow: "0 10px 30px rgba(27,67,50,0.4)"
          }}
        >
          <span className="relative z-10">Se connecter →</span>
        </button>

        {/* Visitor */}
        <button className="mt-3.5 w-full py-3.5 rounded-2xl text-sm font-semibold text-gray-500"
          style={{ fontFamily: "system-ui" }}>
          Continuer en tant que visiteur
        </button>

        {/* Register */}
        <div className="mt-auto pb-8 pt-4 text-center">
          <p className="text-sm text-gray-400" style={{ fontFamily: "system-ui" }}>
            Pas encore inscrit ?{" "}
            <span className="font-black" style={{ color: "#1B4332" }}>Créer un compte</span>
          </p>
        </div>
      </div>
    </div>
  );
}
