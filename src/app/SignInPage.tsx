import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, isAuthenticated } from '../lib/authSession'
import { signInSchema } from '../lib/validation/schemas'
import FieldError from '../components/FieldError'
import './SignInPage.css'

type SignInFormValues = {
  email: string
  password: string
}

export default function SignInPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from ?? '/app'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  if (isAuthenticated()) {
    return <Navigate to="/app" replace />
  }

  function onSubmit(values: SignInFormValues) {
    signIn(values.email)
    navigate(from, { replace: true })
  }

  return (
    <main className="signin-page">
      <section className="signin-card">
        <div className="signin-brand">
          <div className="brand-icon">E</div>
          <span>Expert Intelligence Assistant</span>
        </div>

        <div className="signin-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your workspace.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label htmlFor="email">Email address</label>
          <div className="signin-input">
            <Mail size={18} />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={errors.email ? 'true' : 'false'}
              {...register('email')}
            />
          </div>
          <FieldError message={errors.email?.message} />

          <label htmlFor="password">Password</label>
          <div className="signin-input">
            <Lock size={18} />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={errors.password ? 'true' : 'false'}
              {...register('password')}
            />
          </div>
          <FieldError message={errors.password?.message} />

          <button type="submit" className="signin-button">
            Sign in <ArrowRight size={18} />
          </button>
        </form>

        <p className="signin-footer">
          Demo sign-in stores a local session until the auth API is connected.
        </p>
      </section>
    </main>
  )
}
