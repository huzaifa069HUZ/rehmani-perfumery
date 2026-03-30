'use client';
import { useState, FormEvent, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './auth.module.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authImagePanel}>
        <img src="/herobg.jpg" alt="Luxury Perfumes" className={styles.authImage} />
        <div className={styles.authOverlay}></div>
        <div className={styles.authImagePanelContent}>
          <h1 className={styles.authHeading}>Welcome to rahmani</h1>
          <p className={styles.authSub}>Enter the world of Royal Attars</p>
        </div>
      </div>

      <div className={styles.authFormPanel}>
        <video
          className={styles.authFormBgVideo}
          src="/login-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className={styles.formBox}>
          <h2 className={styles.formTitle}>{isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}</h2>
          <p className={styles.formDesc}>
            {isLogin ? 'Enter your details below to access your account.' : 'Join the legacy of premium Arabian perfumery.'}
          </p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.authBtn} disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className={styles.divider}>OR</div>

          <button type="button" className={styles.googleBtn} onClick={handleGoogleSignIn} disabled={loading}>
            <svg className={styles.googleIcon} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className={styles.toggleText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className={styles.toggleLink} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register now.' : 'Sign in here.'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
