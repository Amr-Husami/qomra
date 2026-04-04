/**
 * AuthPages.jsx
 * ─────────────────────────────────────────────────────────────
 * All 5 auth pages live here:
 *
 *  1. LoginPage        → /login
 *  2. SignupPage        → /signup
 *  3. ForgotPasswordPage → /forgot-password
 *  4. ResetPasswordPage  → /reset-password
 *  5. VerifyPage        → /verify
 *
 * 💡 LAYOUT (desktop):
 *   Left side  = baby photo (decorative)
 *   Right side = form
 *   Mobile     = form only (photo hidden)
 *
 * 🔌 API PLAN (for backend guy):
 *   POST /api/auth/login              { email, password }
 *   POST /api/auth/register           { firstName, lastName, email, phone, password }
 *   POST /api/auth/forgot-password    { email }
 *   POST /api/auth/reset-password     { token, newPassword, confirmPassword }
 *   POST /api/auth/verify-email       { code }
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { authApi } from '../api/api'
import './AuthPages.css'

// ─── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  ar: {
    // Login
    loginTitle:    'تسجيل الدخول',
    loginSubtitle: 'من فضلك ادخل بريد الالكتروني و كلمة المرور لتسجيل الدخول',
    email:         'البريد الالكتروني',
    emailPlaceholder: 'user@gmail.com',
    password:      'كلمة المرور',
    passwordPlaceholder: '••••••••••••',
    forgotPassword: 'نسيت كلمة المرور؟',
    edit:          'تعديل',
    loginBtn:      'تسجيل الدخول',
    noAccount:     'ليس لديك حساب؟',
    createAccount: 'إنشاء حساب',
    invalidLogin:  'البريد الالكتروني او كلمة المرور غير صحيحات',

    // Signup
    signupTitle:    'إنشاء حساب',
    signupSubtitle: 'من فضلك ادخل بريد الالكتروني و كلمة المرور لتسجيل الدخول',
    firstName:     'الاسم الأول',
    lastName:      'الاسم الأخير',
    phone:         'رقم الهاتف',
    terms1:        'بمجرد الضغط على إنشاء حساب فإنك توافق على ',
    termsLink:     'شروط الاستخدام',
    terms2:        ' و ',
    privacyLink:   'سياسة الخصوصية',
    signupBtn:     'انشاء الحساب',
    haveAccount:   'لديك حساب؟',
    loginLink:     'تسجيل الدخول',

    // Forgot Password
    forgotTitle:    'نسيت كلمة المرور؟',
    forgotSubtitle: 'يرجى ادخال البريد الالكتروني لارسال رابط تغيير كلمة المرور',
    sendResetBtn:   'ارسال رمز اعادة التعيين',
    backToLogin:    'العودة الى تسجيل الدخول',
    resetSent:      'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني!',

    // Reset Password
    resetTitle:    'إعادة تعيين كلمة المرور',
    resetSubtitle: 'ادخل كلمة المرور الجديدة و حاول ان تحتفظ بها',
    newPassword:   'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور الجديدة',
    resetBtn:      'اعادة تعيين كلمة المرور',
    passwordMismatch: 'كلمتا المرور غير متطابقتين',
    resetSuccess:  'تم تغيير كلمة المرور بنجاح!',

    // Verify
    verifyTitle:    'تحقق من بريدك الإلكتروني',
    verifySubtitle: 'أدخل رمز التحقق المرسل إلى بريدك الإلكتروني',
    verifyCode:    'رمز التحقق',
    verifyBtn:     'تحقق',
    resendCode:    'إعادة إرسال الرمز',
    verifySuccess: 'تم التحقق بنجاح! جاري تسجيل الدخول...',

    required: '*',
  },
  en: {
    loginTitle:    'Sign In',
    loginSubtitle: 'Please enter your email and password to sign in',
    email:         'Email Address',
    emailPlaceholder: 'user@gmail.com',
    password:      'Password',
    passwordPlaceholder: '••••••••••••',
    forgotPassword: 'Forgot your password?',
    edit:          'Reset',
    loginBtn:      'Sign In',
    noAccount:     "Don't have an account?",
    createAccount: 'Create Account',
    invalidLogin:  'Invalid email or password',

    signupTitle:    'Create Account',
    signupSubtitle: 'Please enter your details to create an account',
    firstName:     'First Name',
    lastName:      'Last Name',
    phone:         'Phone Number',
    terms1:        'By creating an account you agree to our ',
    termsLink:     'Terms of Service',
    terms2:        ' and ',
    privacyLink:   'Privacy Policy',
    signupBtn:     'Create Account',
    haveAccount:   'Already have an account?',
    loginLink:     'Sign In',

    forgotTitle:    'Forgot Password?',
    forgotSubtitle: 'Enter your email to receive a password reset link',
    sendResetBtn:   'Send Reset Code',
    backToLogin:    'Back to Sign In',
    resetSent:      'Password reset link sent to your email!',

    resetTitle:    'Reset Password',
    resetSubtitle: 'Enter your new password and remember to keep it safe',
    newPassword:   'New Password',
    confirmPassword: 'Confirm New Password',
    resetBtn:      'Reset Password',
    passwordMismatch: 'Passwords do not match',
    resetSuccess:  'Password changed successfully!',

    verifyTitle:    'Verify Your Email',
    verifySubtitle: 'Enter the verification code sent to your email',
    verifyCode:    'Verification Code',
    verifyBtn:     'Verify',
    resendCode:    'Resend Code',
    verifySuccess: 'Verified! Logging you in...',

    required: '*',
  },
}

// ─── REUSABLE COMPONENTS ──────────────────────────────────────

// Input field with floating label
function AuthInput({ label, type = 'text', value, onChange, placeholder, required, error }) {
  const [showPwd, setShowPwd] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPwd ? 'text' : 'password') : type

  return (
    <div className={`auth-field ${error ? 'auth-field--error' : ''}`}>
      {label && (
        <label className="auth-label">
          {label} {required && <span className="auth-required">*</span>}
        </label>
      )}
      <div className="auth-input-wrap">
        <input
          type={inputType}
          className="auth-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder || ''}
        />
        {/* Show/hide password toggle */}
        {isPassword && (
          <button
            type="button"
            className="auth-eye"
            onClick={() => setShowPwd(v => !v)}
          >
            {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {error && <p className="auth-field-error">{error}</p>}
    </div>
  )
}

// Error alert box (red)
function ErrorAlert({ msg }) {
  if (!msg) return null
  return (
    <div className="auth-alert auth-alert--error">
      <AlertTriangle size={16} />
      <span>{msg}</span>
    </div>
  )
}

// Success alert box (green)
function SuccessAlert({ msg }) {
  if (!msg) return null
  return (
    <div className="auth-alert auth-alert--success">
      <CheckCircle size={16} />
      <span>{msg}</span>
    </div>
  )
}

// Left side decorative image panel
function AuthImagePanel({ src }) {
  return (
    <div className="auth-image-panel">
      <img src={src} alt="baby" />
      <div className="auth-image-overlay" />
    </div>
  )
}

// Wrapper that gives us the split layout
function AuthLayout({ children, imageSrc }) {
  return (
    <div className="auth-page">
      <AuthImagePanel src={imageSrc} />
      <div className="auth-form-side">
        <div className="auth-form-box">
          {children}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// 1. LOGIN PAGE
// ══════════════════════════════════════════════════════════════
export function LoginPage() {
  const { language, login } = useApp()
  const t = T[language]
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async () => {
    setError('')
    if (!email || !password) { setError(t.invalidLogin); return }

    setLoading(true)

    // 🔌 API NEEDED: POST /api/auth/login  { email, password }
    // The API should return: { user: { id, firstName, lastName, email }, token }
    // On error: { message: "Invalid credentials" }

    try {
      // 🔌 REAL API CALL: POST /api/auth/login
      const data = await authApi.login(email, password)
      login({
        id:        data.userId ?? data.user?.id,
        firstName: data.user?.firstName,
        lastName:  data.user?.lastName,
        email:     data.user?.email ?? email,
        role:      data.user?.role ?? data.user?.userRole ?? null,
      })
      navigate(redirectTo)
    } catch (err) {
      setError(t.invalidLogin)
    }

    setLoading(false)
  }

  return (
    <AuthLayout imageSrc="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=700&q=80">
      <h1 className="auth-title">{t.loginTitle}</h1>
      <p className="auth-subtitle">{t.loginSubtitle}</p>

      <ErrorAlert msg={error} />

      <div className="auth-fields">
        <AuthInput
          label={t.email}
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          required
        />
        <AuthInput
          label={t.password}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={t.passwordPlaceholder}
          required
        />

        {/* Forgot password link */}
        <div className="auth-forgot-row">
          <span>{t.forgotPassword}</span>
          <Link to="/forgot-password" className="auth-link">{t.edit}</Link>
        </div>
      </div>

      <button
        className={`auth-btn ${loading ? 'auth-btn--loading' : ''}`}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? '...' : t.loginBtn}
      </button>

      <p className="auth-switch">
        {t.noAccount}&nbsp;
        <Link to="/signup" className="auth-link">{t.createAccount}</Link>
      </p>
    </AuthLayout>
  )
}

// ══════════════════════════════════════════════════════════════
// 2. SIGNUP PAGE
// ══════════════════════════════════════════════════════════════
export function SignupPage() {
  const { language, login } = useApp()
  const t = T[language]
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: ''
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSignup = async () => {
    setError('')
    if (!form.firstName || !form.email || !form.password) {
      setError('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    setLoading(true)

    // 🔌 API NEEDED: POST /api/auth/register
    // Body: { firstName, lastName, email, phone, password }
    // Returns: { user, token } or redirect to /verify

    try {
      // 🔌 REAL API CALL: POST /api/auth/register
      // ⚠️ Backend has no phone field - we skip it
      const data = await authApi.register(form.firstName, form.lastName, form.email, form.password)
      login({ id: data.userId, firstName: form.firstName, lastName: form.lastName, email: form.email })
      navigate('/')
    } catch (err) {
      setError(err.message || 'حدث خطأ، حاول مرة أخرى')
    }
    setLoading(false)
  }

  return (
    <AuthLayout imageSrc="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=700&q=80">
      <h1 className="auth-title">{t.signupTitle}</h1>
      <p className="auth-subtitle">{t.signupSubtitle}</p>

      <ErrorAlert msg={error} />

      <div className="auth-fields">
        {/* Two columns: First name + Last name */}
        <div className="auth-row-2">
          <AuthInput label={t.firstName} value={form.firstName} onChange={set('firstName')} required />
          <AuthInput label={t.lastName}  value={form.lastName}  onChange={set('lastName')}  required />
        </div>

        <AuthInput label={t.email}    type="email"    value={form.email}    onChange={set('email')}    required />
        <AuthInput label={t.phone}    type="tel"      value={form.phone}    onChange={set('phone')}    required />
        <AuthInput label={t.password} type="password" value={form.password} onChange={set('password')} required />

        {/* Terms */}
        <p className="auth-terms">
          {t.terms1}
          <Link to="/terms"   className="auth-link">{t.termsLink}</Link>
          {t.terms2}
          <Link to="/privacy" className="auth-link">{t.privacyLink}</Link>
        </p>
      </div>

      <button
        className={`auth-btn ${loading ? 'auth-btn--loading' : ''}`}
        onClick={handleSignup}
        disabled={loading}
      >
        {loading ? '...' : t.signupBtn}
      </button>

      <p className="auth-switch">
        {t.haveAccount}&nbsp;
        <Link to="/login" className="auth-link">{t.loginLink}</Link>
      </p>
    </AuthLayout>
  )
}

// ══════════════════════════════════════════════════════════════
// 3. FORGOT PASSWORD PAGE
// ══════════════════════════════════════════════════════════════
export function ForgotPasswordPage() {
  const { language } = useApp()
  const t = T[language]

  const [email,   setEmail]   = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!email) return
    setLoading(true)

    try {
      // 🔌 REAL API: POST /api/auth/reset-password  { email }
      await authApi.requestPasswordReset(email)
      setSuccess(true)
    } catch (err) {
      // Even on error show success (security: don't reveal if email exists)
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    // Forgot password uses centered card layout (no image panel)
    <div className="auth-page auth-page--centered">
      <div className="auth-card">
        {success ? (
          <div className="auth-success-state">
            <div className="auth-success-icon">✉️</div>
            <h2 className="auth-title">{t.resetSent}</h2>
            <Link to="/login" className="auth-btn" style={{ display: 'block', textAlign: 'center' }}>
              {t.backToLogin}
            </Link>
          </div>
        ) : (
          <>
            <h1 className="auth-title">{t.forgotTitle}</h1>
            <p className="auth-subtitle">{t.forgotSubtitle}</p>

            <div className="auth-fields">
              <AuthInput
                label={t.email}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              className={`auth-btn ${loading ? 'auth-btn--loading' : ''}`}
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? '...' : t.sendResetBtn}
            </button>

            <div className="auth-back-row">
              <Link to="/login" className="auth-back-link">
                <ArrowLeft size={14} />
                {t.backToLogin}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// 4. RESET PASSWORD PAGE
// ══════════════════════════════════════════════════════════════
export function ResetPasswordPage() {
  const { language } = useApp()
  const t = T[language]
  const navigate = useNavigate()

  const [newPwd,     setNewPwd]     = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState(false)
  const [loading,    setLoading]    = useState(false)

  const handleReset = async () => {
    setError('')
    if (!newPwd || !confirmPwd) return
    if (newPwd !== confirmPwd) { setError(t.passwordMismatch); return }

    setLoading(true)

    try {
      // 🔌 REAL API: POST /api/auth/reset-password/confirm  { token, newPassword }
      // Token comes from the URL (backend sends it by email)
      const urlToken = new URLSearchParams(window.location.search).get('token') || 'TOKEN'
      await authApi.confirmPasswordReset(urlToken, newPwd)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || 'حدث خطأ، حاول مرة أخرى')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page auth-page--centered">
      <div className="auth-card">
        {success ? (
          <div className="auth-success-state">
            <div className="auth-success-icon">✅</div>
            <h2 className="auth-title">{t.resetSuccess}</h2>
          </div>
        ) : (
          <>
            <h1 className="auth-title">{t.resetTitle}</h1>
            <p className="auth-subtitle">{t.resetSubtitle}</p>

            <ErrorAlert msg={error} />

            <div className="auth-fields">
              <AuthInput
                label={t.newPassword}
                type="password"
                value={newPwd}
                onChange={e => setNewPwd(e.target.value)}
                required
              />
              <AuthInput
                label={t.confirmPassword}
                type="password"
                value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)}
                required
              />
            </div>

            <button
              className={`auth-btn ${loading ? 'auth-btn--loading' : ''}`}
              onClick={handleReset}
              disabled={loading}
            >
              {loading ? '...' : t.resetBtn}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// 5. VERIFY PAGE
// ══════════════════════════════════════════════════════════════
export function VerifyPage() {
  const { language } = useApp()
  const t = T[language]
  const navigate = useNavigate()

  const [code,    setCode]    = useState('')
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setError('')
    if (!code) return
    setLoading(true)

    // 🔌 API NEEDED: POST /api/auth/verify-email  { code }
    await new Promise(r => setTimeout(r, 900))
    if (code === '123456') {
      setSuccess(true)
      setTimeout(() => navigate('/'), 2000)
    } else {
      setError('رمز التحقق غير صحيح')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page auth-page--centered">
      <div className="auth-card">
        {success ? (
          <div className="auth-success-state">
            <div className="auth-success-icon">🎉</div>
            <h2 className="auth-title">{t.verifySuccess}</h2>
          </div>
        ) : (
          <>
            <div className="auth-verify-icon">✉️</div>
            <h1 className="auth-title">{t.verifyTitle}</h1>
            <p className="auth-subtitle">{t.verifySubtitle}</p>

            <ErrorAlert msg={error} />

            <div className="auth-fields">
              <AuthInput
                label={t.verifyCode}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="123456"
                required
              />
            </div>

            <button
              className={`auth-btn ${loading ? 'auth-btn--loading' : ''}`}
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? '...' : t.verifyBtn}
            </button>

            <div className="auth-back-row">
              <button className="auth-back-link" onClick={handleVerify}>
                {t.resendCode}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}