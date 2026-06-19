import { useState } from "react";

const ROLES = [
  { id: "customer", label: "Client", icon: "👤" },
  { id: "farmer", label: "Agriculteur", icon: "🌿" },
  { id: "trader", label: "Commerçant", icon: "🏪" },
  { id: "restaurant", label: "Restaurant", icon: "🍽️" },
  { id: "warehouse", label: "Entrepôt", icon: "🏢" },
  { id: "delivery", label: "Livraison", icon: "🚚" },
];

function StrengthBar({ strength }: { strength: number }) {
  const colors = ["#EF4444", "#F59E0B", "#10B981"];
  const labels = ["Faible", "Moyen", "Fort"];
  const s = Math.min(Math.max(strength, 0), 2);
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-colors"
            style={{ background: i <= s ? colors[s] : "#E5E7EB" }} />
        ))}
      </div>
      {strength >= 0 && <p className="text-[10px] font-semibold" style={{ color: colors[s] }}>{labels[s]}</p>}
    </div>
  );
}

function getStrength(pw: string): number {
  if (!pw) return -1;
  if (pw.length < 6) return 0;
  if (pw.length < 10 || !/[0-9]/.test(pw)) return 1;
  return 2;
}

export function RegisterElegant() {
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const strength = getStrength(password);

  return (
    <div className="w-[390px] h-[844px] overflow-hidden relative bg-white flex flex-col select-none">
      {/* ── Compact hero ── */}
      <div
        className="relative flex-shrink-0 flex flex-col justify-end px-6 pt-12 pb-6"
        style={{
          background: "linear-gradient(160deg, #0A2318 0%, #1B4332 60%, #2D6A4F 100%)",
          height: "22%",
        }}
      >
        <div className="absolute top-[-30px] right-[-30px] w-[130px] h-[130px] rounded-full opacity-10"
          style={{ background: "#52B788" }} />
        <div className="flex items-center gap-3">
          <button className="text-white/80">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "system-ui" }}>
              Créer un compte
            </h1>
            <p className="text-green-300/70 text-xs">Rejoignez NAFA Marché</p>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div
        className="flex-1 bg-white overflow-y-auto px-6 pt-5"
        style={{ borderRadius: "24px 24px 0 0", marginTop: "-14px", zIndex: 2 }}
      >
        {/* Role selector */}
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Je suis...</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {ROLES.map(r => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-3.5 py-2.5 rounded-2xl border-2 transition-all"
                style={{
                  borderColor: role === r.id ? "#1B4332" : "#E5E7EB",
                  background: role === r.id ? "#F0FDF4" : "#FAFAF8",
                  minWidth: "70px"
                }}
              >
                <span className="text-lg">{r.icon}</span>
                <span className="text-[10px] font-bold" style={{ color: role === r.id ? "#1B4332" : "#6B7280" }}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Fields */}
        {[
          { label: "Nom complet", placeholder: "Mamadou Diallo", value: name, setter: setName, type: "text", icon: "👤" },
          { label: "E-mail", placeholder: "votre@email.com", value: email, setter: setEmail, type: "email", icon: "✉️" },
          { label: "Téléphone", placeholder: "+224 6XX XXX XXX", value: phone, setter: setPhone, type: "tel", icon: "📱" },
        ].map(f => (
          <div key={f.label} className="mb-3">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{f.label}</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">{f.icon}</span>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={f.value}
                onChange={e => f.setter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition-all placeholder:text-gray-300"
                style={{ fontFamily: "system-ui" }}
              />
            </div>
          </div>
        ))}

        {/* Password */}
        <div className="mb-4">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Mot de passe</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 caractères"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition-all placeholder:text-gray-300"
              style={{ fontFamily: "system-ui" }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {password && <StrengthBar strength={strength} />}
        </div>

        {/* Terms checkbox */}
        <button
          onClick={() => setAgreed(!agreed)}
          className="flex items-start gap-3 mb-5 text-left"
        >
          <div
            className="mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all"
            style={{
              borderColor: agreed ? "#1B4332" : "#D1D5DB",
              background: agreed ? "#1B4332" : "white"
            }}
          >
            {agreed && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <p className="text-[12px] text-gray-500 leading-relaxed" style={{ fontFamily: "system-ui" }}>
            J'accepte les <span className="font-bold" style={{ color: "#1B4332" }}>conditions d'utilisation</span> et la <span className="font-bold" style={{ color: "#1B4332" }}>politique de confidentialité</span>
          </p>
        </button>

        {/* CTA */}
        <button
          className="w-full py-4 rounded-2xl text-white font-bold text-[15px] mb-4"
          style={{
            background: "linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)",
            fontFamily: "system-ui",
            boxShadow: "0 8px 20px rgba(27,67,50,0.35)",
            opacity: agreed ? 1 : 0.6
          }}
        >
          Créer mon compte
        </button>

        <p className="text-center text-sm text-gray-500 pb-6" style={{ fontFamily: "system-ui" }}>
          Déjà inscrit ?{" "}
          <span className="font-bold" style={{ color: "#1B4332" }}>Se connecter</span>
        </p>
      </div>
    </div>
  );
}
