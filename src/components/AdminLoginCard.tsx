import React, { useState, useRef, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useApp } from '../lib/store';

export const AdminLoginCard: React.FC = () => {
  const { loginAdmin } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = loginAdmin(password);
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-12">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Badge & Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-xl shadow-purple-600/30 ring-1 ring-white/20 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full mb-2">
            Panel Restringido
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Administración DIAS LEAGUE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm">
            Esta sección está reservada para los organizadores y directivos. Ingresa la clave autorizada para desbloquear.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Clave de Acceso
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="input-card-admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa la clave..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-slate-500 font-mono tracking-wider transition-colors outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg"
                title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          <button
            id="btn-submit-card-admin-login"
            type="submit"
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Desbloquear Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
