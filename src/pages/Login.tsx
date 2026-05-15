import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LogIn, Mail, Lock, ShieldCheck, 
  ArrowRight, Github, Chrome 
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'sonner';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success(t('auth.success'));
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(t('auth.error'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-amber p-2.5 rounded-xl shadow-amber group-hover:scale-110 transition-transform">
              <ShieldCheck className="text-amber-foreground" size={24} />
            </div>
            <span className="text-2xl font-black font-display tracking-tight text-foreground">
              {t('brand.name')}
            </span>
          </Link>
          <h1 className="text-3xl font-black text-foreground mb-2">Hoş Geldiniz</h1>
          <p className="text-muted-foreground font-medium">Hukuk Dashboard'una giriş yapın</p>
        </div>

        <div className="bg-card p-8 rounded-[2.5rem] border border-border/60 shadow-card">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">E-Posta</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@mkhukuk.com"
                  className="w-full bg-muted/50 pl-12 pr-4 py-4 rounded-2xl border border-border/60 focus:ring-2 focus:ring-amber/50 outline-none text-foreground font-bold transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-muted/50 pl-12 pr-4 py-4 rounded-2xl border border-border/60 focus:ring-2 focus:ring-amber/50 outline-none text-foreground font-bold transition-all"
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full bg-amber text-amber-foreground py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-amber hover:bg-amber-light transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? 'Giriş Yapılıyor...' : (
                <>
                  GİRİŞ YAP <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Google ile giriş kaldırıldı */}
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Bir hesabınız yok mu? <span className="text-amber font-bold cursor-pointer hover:underline">Ofis Yöneticisine Danışın</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
