/**
 * AuthPages.jsx — all auth pages in one file
 *
 *  1. LoginPage          /login
 *  2. SignupPage          /signup        → on success → /verify
 *  3. ForgotPasswordPage  /forgot-password → on success → /verify-reset
 *  4. VerifyPage          /verify        (email verification after signup)
 *  5. VerifyResetPage     /verify-reset  (OTP from forgot-password email)
 *  6. ResetPasswordPage   /reset-password (new password after OTP verified)
 */

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { authApi } from '../api/api'
import './AuthPages.css'

// ─── HELPERS ──────────────────────────────────────────────────
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

// ─── TRANSLATIONS ─────────────────────────────────────────────
const T = {
  ar: {
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
    invalidEmail:  'يرجى إدخال بريد إلكتروني صحيح',

    signupTitle:    'إنشاء حساب',
    signupSubtitle: 'من فضلك ادخل بياناتك لإنشاء حساب جديد',
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
    requiredFields: 'يرجى ملء جميع الحقول المطلوبة',

    forgotTitle:    'نسيت كلمة المرور؟',
    forgotSubtitle: 'ادخل بريدك الالكتروني وسنرسل لك رمز التحقق',
    sendResetBtn:   'ارسال رمز التحقق',
    backToLogin:    'العودة الى تسجيل الدخول',
    resetSent:      '✉️ تم إرسال رمز التحقق إلى بريدك الإلكتروني',

    verifyTitle:    'تحقق من بريدك الإلكتروني',
    verifySubtitle: 'أدخل رمز التحقق المرسل إلى بريدك الإلكتروني لتفعيل حسابك',
    verifyCode:    'رمز التحقق',
    verifyBtn:     'تحقق',
    resendCode:    'إعادة إرسال الرمز',
    verifySuccess: '🎉 تم التحقق بنجاح! جاري تسجيل الدخول...',
    wrongCode:     'رمز التحقق غير صحيح',

    verifyResetTitle:    'أدخل رمز التحقق',
    verifyResetSubtitle: 'أدخل الرمز المكون من 6 أرقام الذي أرسلناه إلى بريدك الإلكتروني',
    verifyResetBtn:      'تحقق من الرمز',
    verifyResetSuccess:  'تم التحقق! يمكنك الآن تغيير كلمة المرور',

    resetTitle:      'إعادة تعيين كلمة المرور',
    resetSubtitle:   'ادخل كلمة المرور الجديدة',
    newPassword:     'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور',
    resetBtn:        'حفظ كلمة المرور الجديدة',
    passwordMismatch: 'كلمتا المرور غير متطابقتين',
    passwordShort:   'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    resetSuccess:    '✅ تم تغيير كلمة المرور بنجاح!',

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
    invalidEmail:  'Please enter a valid email address',

    signupTitle:    'Create Account',
    signupSubtitle: 'Please enter your details to create a new account',
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
    requiredFields: 'Please fill in all required fields',

    forgotTitle:    'Forgot Password?',
    forgotSubtitle: 'Enter your email and we will send you a verification code',
    sendResetBtn:   'Send Verification Code',
    backToLogin:    'Back to Sign In',
    resetSent:      '✉️ Verification code sent to your email',

    verifyTitle:    'Verify Your Email',
    verifySubtitle: 'Enter the verification code sent to your email to activate your account',
    verifyCode:    'Verification Code',
    verifyBtn:     'Verify',
    resendCode:    'Resend Code',
    verifySuccess: '🎉 Verified! Logging you in...',
    wrongCode:     'Incorrect verification code',

    verifyResetTitle:    'Enter Verification Code',
    verifyResetSubtitle: 'Enter the 6-digit code we sent to your email',
    verifyResetBtn:      'Verify Code',
    verifyResetSuccess:  'Verified! You can now reset your password',

    resetTitle:      'Reset Password',
    resetSubtitle:   'Enter your new password',
    newPassword:     'New Password',
    confirmPassword: 'Confirm Password',
    resetBtn:        'Save New Password',
    passwordMismatch: 'Passwords do not match',
    passwordShort:   'Password must be at least 6 characters',
    resetSuccess:    '✅ Password changed successfully!',

    required: '*',
  },
}

// ─── SHARED COMPONENTS ────────────────────────────────────────

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
        {isPassword && (
          <button type="button" className="auth-eye" onClick={() => setShowPwd(v => !v)}>
            {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {error && <p className="auth-field-error">{error}</p>}
    </div>
  )
}

function ErrorAlert({ msg }) {
  if (!msg) return null
  return (
    <div className="auth-alert auth-alert--error">
      <AlertTriangle size={16} />
      <span>{msg}</span>
    </div>
  )
}

function SuccessAlert({ msg }) {
  if (!msg) return null
  return (
    <div className="auth-alert auth-alert--success">
      <CheckCircle size={16} />
      <span>{msg}</span>
    </div>
  )
}

// Split layout: image | form
function AuthLayout({ children, imageSrc }) {
  return (
    <div className="auth-page">
      <div className="auth-image-panel">
        <img src={imageSrc} alt="baby" />
        <div className="auth-image-overlay" />
      </div>
      <div className="auth-form-side">
        <div className="auth-form-box">
          {children}
        </div>
      </div>
    </div>
  )
}

// Centered card layout (forgot / verify / reset)
function AuthCard({ children }) {
  return (
    <div className="auth-page auth-page--centered">
      <div className="auth-card">
        {children}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// 1. LOGIN
// ══════════════════════════════════════════════════════════════
export function LoginPage() {
  const { language, login } = useApp()
  const t = T[language]
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [loading,  setLoading]  = useState(false)

  const validate = () => {
    let ok = true
    setEmailErr('')
    setError('')
    if (!isValidEmail(email)) { setEmailErr(t.invalidEmail); ok = false }
    if (!password) { setError(t.invalidLogin); ok = false }
    return ok
  }

  const handleLogin = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const data = await authApi.login(email, password)
      login({
        id:        data.userId ?? data.user?.id,
        firstName: data.user?.firstName,
        lastName:  data.user?.lastName,
        email:     data.user?.email ?? email,
        role:      data.user?.role ?? data.user?.userRole ?? null,
      })
      navigate(redirectTo)
    } catch {
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
          label={t.email} type="email"
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder} required error={emailErr}
        />
        <AuthInput
          label={t.password} type="password"
          value={password} onChange={e => setPassword(e.target.value)}
          placeholder={t.passwordPlaceholder} required
        />
        <div className="auth-forgot-row">
          <span>{t.forgotPassword}</span>
          <Link to="/forgot-password" className="auth-link">{t.edit}</Link>
        </div>
      </div>

      <button className={`auth-btn ${loading ? 'auth-btn--loading' : ''}`} onClick={handleLogin} disabled={loading}>
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
// 2. SIGNUP — on success redirects to /verify
// ══════════════════════════════════════════════════════════════
export function SignupPage() {
  const { language } = useApp()
  const t = T[language]
  const navigate = useNavigate()

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })
  const [errors,  setErrors]  = useState({})
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.firstName) e.firstName = t.required
    if (!form.lastName)  e.lastName  = t.required
    if (!isValidEmail(form.email)) e.email = t.invalidEmail
    if (!form.password || form.password.length < 6) e.password = t.passwordShort
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSignup = async () => {
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      await authApi.register(form.firstName, form.lastName, form.email, form.password)
      // API sends a verification email — navigate to verify page with email in state
      navigate('/verify', { state: { email: form.email } })
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
        <div className="auth-row-2">
          <AuthInput label={t.firstName} value={form.firstName} onChange={set('firstName')} required error={errors.firstName} />
          <AuthInput label={t.lastName}  value={form.lastName}  onChange={set('lastName')}  required error={errors.lastName} />
        </div>
        <AuthInput label={t.email}    type="email"    value={form.email}    onChange={set('email')}    required error={errors.email} />
        <AuthInput label={t.phone}    type="tel"      value={form.phone}    onChange={set('phone')} />
        <AuthInput label={t.password} type="password" value={form.password} onChange={set('password')} required error={errors.password} />
        <p className="auth-terms">
          {t.terms1}
          <Link to="/terms"   className="auth-link">{t.termsLink}</Link>
          {t.terms2}
          <Link to="/privacy" className="auth-link">{t.privacyLink}</Link>
        </p>
      </div>

      <button className={`auth-btn ${loading ? 'auth-btn--loading' : ''}`} onClick={handleSignup} disabled={loading}>
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
// 3. FORGOT PASSWORD — sends OTP → /verify-reset
// ══════════════════════════════════════════════════════════════
export function ForgotPasswordPage() {
  const { language } = useApp()
  const t = T[language]
  const navigate = useNavigate()

  const [email,   setEmail]   = useState('')
  const [emailErr,setEmailErr]= useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    setEmailErr('')
    if (!isValidEmail(email)) { setEmailErr(t.invalidEmail); return }
    setLoading(true)
    try {
      await authApi.requestPasswordReset(email)
    } catch { /* don't reveal if email exists */ }
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <AuthCard>
        <div className="auth-success-state">
          <div className="auth-success-icon">✉️</div>
          <h2 className="auth-title">{t.resetSent}</h2>
          <p className="auth-subtitle" style={{ marginBottom: 28 }}>{email}</p>
          <button
            className="auth-btn"
            onClick={() => navigate('/verify-reset', { state: { email } })}
          >
            {t.verifyResetBtn}
          </button>
          <div className="auth-back-row">
            <Link to="/login" className="auth-back-link">
              <ArrowLeft size={14} /> {t.backToLogin}
            </Link>
          </div>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard>
      <div className="auth-verify-icon">🔑</div>
      <h1 className="auth-title">{t.forgotTitle}</h1>
      <p className="auth-subtitle">{t.forgotSubtitle}</p>

      <div className="auth-fields">
        <AuthInput
          label={t.email} type="email"
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder} required error={emailErr}
        />
      </div>

      <button className={`auth-btn ${loading ? 'auth-btn--loading' : ''}`} onClick={handleSend} disabled={loading}>
        {loading ? '...' : t.sendResetBtn}
      </button>

      <div className="auth-back-row">
        <Link to="/login" className="auth-back-link">
          <ArrowLeft size={14} /> {t.backToLogin}
        </Link>
      </div>
    </AuthCard>
  )
}

// ══════════════════════════════════════════════════════════════
// 4. VERIFY PAGE — after signup, verify email
// ══════════════════════════════════════════════════════════════
export function VerifyPage() {
  const { language, login } = useApp()
  const t = T[language]
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''

  const [code,    setCode]    = useState('')
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setError('')
    if (!code.trim()) return
    setLoading(true)
    try {
      const data = await authApi.verifyEmail(code)
      if (data?.token) {
        login({ email, ...(data.user || {}) })
      }
      setSuccess(true)
      setTimeout(() => navigate('/'), 2000)
    } catch {
      setError(t.wrongCode)
    }
    setLoading(false)
  }

  return (
    <AuthCard>
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
          {email && <p className="auth-email-hint">{email}</p>}

          <ErrorAlert msg={error} />

          <div className="auth-fields">
            <AuthInput
              label={t.verifyCode}
              value={code} onChange={e => setCode(e.target.value)}
              placeholder="123456" required
            />
          </div>

          <button className={`auth-btn ${loading ? 'auth-btn--loading' : ''}`} onClick={handleVerify} disabled={loading}>
            {loading ? '...' : t.verifyBtn}
          </button>

          <div className="auth-back-row">
            <Link to="/login" className="auth-back-link">
              <ArrowLeft size={14} /> {t.backToLogin}
            </Link>
          </div>
        </>
      )}
    </AuthCard>
  )
}

// ══════════════════════════════════════════════════════════════
// 5. VERIFY RESET PAGE — OTP entry after forgot-password
// ══════════════════════════════════════════════════════════════
export function VerifyResetPage() {
  const { language } = useApp()
  const t = T[language]
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''

  const [code,    setCode]    = useState('')
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setError('')
    if (!code.trim()) return
    setLoading(true)
    try {
      await authApi.verifyResetToken(code)
      setSuccess(true)
      setTimeout(() => navigate('/reset-password', { state: { token: code, email } }), 1500)
    } catch {
      setError(t.wrongCode)
    }
    setLoading(false)
  }

  return (
    <AuthCard>
      {success ? (
        <div className="auth-success-state">
          <div className="auth-success-icon">✅</div>
          <h2 className="auth-title">{t.verifyResetSuccess}</h2>
        </div>
      ) : (
        <>
          <div className="auth-verify-icon">🔐</div>
          <h1 className="auth-title">{t.verifyResetTitle}</h1>
          <p className="auth-subtitle">{t.verifyResetSubtitle}</p>
          {email && <p className="auth-email-hint">{email}</p>}

          <ErrorAlert msg={error} />

          <div className="auth-fields">
            <AuthInput
              label={t.verifyCode}
              value={code} onChange={e => setCode(e.target.value)}
              placeholder="123456" required
            />
          </div>

          <button className={`auth-btn ${loading ? 'auth-btn--loading' : ''}`} onClick={handleVerify} disabled={loading}>
            {loading ? '...' : t.verifyResetBtn}
          </button>

          <div className="auth-back-row">
            <Link to="/forgot-password" className="auth-back-link">
              <ArrowLeft size={14} /> {t.backToLogin}
            </Link>
          </div>
        </>
      )}
    </AuthCard>
  )
}

// ══════════════════════════════════════════════════════════════
// 6. RESET PASSWORD PAGE — new password after OTP verified
// ══════════════════════════════════════════════════════════════
export function ResetPasswordPage() {
  const { language } = useApp()
  const t = T[language]
  const navigate = useNavigate()
  const location = useLocation()
  const token = location.state?.token
    || new URLSearchParams(window.location.search).get('token')
    || ''

  const [newPwd,     setNewPwd]     = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState(false)
  const [loading,    setLoading]    = useState(false)

  const handleReset = async () => {
    setError('')
    if (!newPwd || !confirmPwd) return
    if (newPwd.length < 6)       { setError(t.passwordShort);   return }
    if (newPwd !== confirmPwd)   { setError(t.passwordMismatch); return }
    setLoading(true)
    try {
      await authApi.confirmPasswordReset(token, newPwd)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2200)
    } catch (err) {
      setError(err.message || 'حدث خطأ، حاول مرة أخرى')
    }
    setLoading(false)
  }

  return (
    <AuthCard>
      {success ? (
        <div className="auth-success-state">
          <div className="auth-success-icon">✅</div>
          <h2 className="auth-title">{t.resetSuccess}</h2>
        </div>
      ) : (
        <>
          <div className="auth-verify-icon">🔒</div>
          <h1 className="auth-title">{t.resetTitle}</h1>
          <p className="auth-subtitle">{t.resetSubtitle}</p>

          <ErrorAlert msg={error} />

          <div className="auth-fields">
            <AuthInput
              label={t.newPassword} type="password"
              value={newPwd} onChange={e => setNewPwd(e.target.value)} required
            />
            <AuthInput
              label={t.confirmPassword} type="password"
              value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} required
            />
          </div>

          <button className={`auth-btn ${loading ? 'auth-btn--loading' : ''}`} onClick={handleReset} disabled={loading}>
            {loading ? '...' : t.resetBtn}
          </button>
        </>
      )}
    </AuthCard>
  )
}
