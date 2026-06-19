import { useState } from "react";

const ROLES = [
  { id: "customer", label: "Client", emoji: "👤" },
  { id: "farmer", label: "Agriculteur", emoji: "🌿" },
  { id: "trader", label: "Commerçant", emoji: "🏪" },
  { id: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { id: "warehouse", label: "Entrepôt", emoji: "🏢" },
  { id: "delivery", label: "Livraison", emoji: "🚚" },
];

function StrengthBar({ strength }: { strength: number }) {
  const colors = ["#EF4444", "#F59E0B", "#10B981"];
  const labels = ["Faible", "Moyen", "Fort"];
  const s = Math.min(Math.max(strength, 0), 2);
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="flex gap-1 flex-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i <= s ? colors[s] : "#E5E7EB" }} />
        ))}
      </div>
      <span className="text-[10px] font-bold" style={{ color: colors[s] }}>{labels[s]}</span>
    </div>
  );
}

function getStrength(pw: string): number {
  if (!pw) return -1;
  if (pw.length < 6) return 0;
  if (pw.length < 10 || !/[0-9]/.test(pw)) return 1;
  return 2;
}

export function RegisterPremium() {
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [focusField, setFocusField] = useState("");
  const strength = getStrength(password);

  const Field = ({ id, label, type = "text", placeholder, value, onChange }: any) => (
    <div className="relative mb-3">
      <div
        className="rounded-2xl border-2 px-4 pt-5 pb-3 transition-all"
        style={{
          borderColor: focusField === id ? "#1B4332" : "#EBEBEB",
          background: focusField === id ? "#fff" : "#F7F7F5",
          boxShadow: focusField === id ? "0 0 0 4px rgba(27,67,50,0.08)" : "none"
        }}
      >
        <span className="absolute left-4 text-[9px] font-black tracking-[0.15em] uppercase transition-all"
          style={{ top: "9px", color: focusField === id || value ? "#1B4332" : "#9CA3AF" }}>
          {label}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocusField(id)}
          onBlur={() => setFocusField("")}
          className="w-full bg-transparent text-[14px] text-gray-900 focus:outline-none placeholder:text-gray-300"
          style={{ fontFamily: "system-ui" }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-[390px] h-[844px] overflow-hidden relative flex flex-col select-none"
      style={{ background: "#FAFAF8" }}>

      {/* ── Header shape ── */}
      <div className="relative flex-shrink-0" style={{ height: "18%" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 152" preserveAspectRatio="none">
          <defs>
            <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A2318" />
              <stop offset="100%" stopColor="#2D6A4F" />
            </linearGradient>
          </defs>
          <path d="M0 0 L390 0 L390 110 Q195 160 0 110 Z" fill="url(#rg)" />
        </svg>
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
        <div className="relative z-10 flex items-center gap-3 px-5 pt-12 pb-4">
          <button className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#52B788" }} />
              <p className="text-white/60 text-[10px] font-bold tracking-widest uppercase">NAFA Marché</p>
            </div>
            <h1 className="text-white font-black text-[20px] tracking-tight leading-tight" style={{ fontFamily: "system-ui" }}>
              Créer un compte
            </h1>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="flex-1 px-5 pt-4 overflow-y-auto">
        {/* Role pills */}
        <div className="mb-4">
          <p className="text-[10px] font-black tracking-[0.15em] uppercase text-gray-400 mb-2">Votre rôle</p>
          <div className="flex flex-wrap gap-2">
            {ROLES.map(r => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className="px-3.5 py-2 rounded-full text-[11px] font-bold border-2 transition-all flex items-center gap-1.5"
                style={{
                  borderColor: role === r.id ? "#1B4332" : "#E5E7EB",
                  background: role === r.id ? "#1B4332" : "#fff",
                  color: role === r.id ? "#fff" : "#374151"
                }}
              >
                <span>{r.emoji}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Name + Email */}
        <Field id="name" label="Nom complet" placeholder="Mamadou Diallo" value={name} onChange={setName} />
        <Field id="email" label="Adresse e-mail" type="email" placeholder="votre@email.com" value={email} onChange={setEmail} />
        <Field id="phone" label="Téléphone" type="tel" placeholder="+224 6XX XXX XXX" value={phone} onChange={setPhone} />

        {/* Password with strength */}
        <div className="relative mb-3">
          <div
            className="rounded-2xl border-2 px-4 pt-5 pb-3 transition-all"
            style={{
              borderColor: focusField === "pwd" ? "#1B4332" : "#EBEBEB",
              background: focusField === "pwd" ? "#fff" : "#F7F7F5",
              boxShadow: focusField === "pwd" ? "0 0 0 4px rgba(27,67,50,0.08)" : "none"
            }}
          >
            <span className="absolute left-4 text-[9px] font-black tracking-[0.15em] uppercase"
              style={{ top: "9px", color: focusField === "pwd" || password ? "#1B4332" : "#9CA3AF" }}>
              Mot de passe
            </span>
            <div className="flex items-center gap-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 caractères"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusField("pwd")}
                onBlur={() => setFocusField("")}
                className="flex-1 bg-transparent text-[14px] text-gray-900 focus:outline-none placeholder:text-gray-300"
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
          {password && <StrengthBar strength={strength} />}
        </div>

        {/* Terms */}
        <button onClick={() => setAgreed(!agreed)} className="flex items-start gap-3 mb-4 text-left">
          <div className="mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
            style={{ borderColor: agreed ? "#1B4332" : "#D1D5DB", background: agreed ? "#1B4332" : "white" }}>
            {agreed && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed" style={{ fontFamily: "system-ui" }}>
            J'accepte les <span className="font-black" style={{ color: "#1B4332" }}>conditions</span> et la <span className="font-black" style={{ color: "#1B4332" }}>politique de confidentialité</span>
          </p>
        </button>

        {/* CTA */}
        <button
          className="w-full py-4 rounded-2xl text-white font-black text-[16px] tracking-tight mb-3"
          style={{
            background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
            fontFamily: "system-ui",
            boxShadow: "0 10px 30px rgba(27,67,50,0.4)",
            opacity: agreed ? 1 : 0.55
          }}
        >
          Créer mon compte →
        </button>

        <p className="text-center text-[13px] text-gray-400 pb-6" style={{ fontFamily: "system-ui" }}>
          Déjà inscrit ?{" "}
          <span className="font-black" style={{ color: "#1B4332" }}>Se connecter</span>
        </p>
      </div>
    </div>
  );
}
