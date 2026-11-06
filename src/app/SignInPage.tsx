import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, isAuthenticated } from '../lib/authSession'
import { signInSchema } from '../lib/validation/schemas'
import FieldError from '../components/FieldError'
import { Button } from '../components/ui/button'
import { cn } from '../lib/utils'

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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(124,58,237,0.35),transparent_55%),radial-gradient(700px_circle_at_80%_0%,rgba(37,99,235,0.35),transparent_50%),linear-gradient(180deg,#020617_0%,#0f172a_50%,#020617_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <section className="max-w-xl space-y-5 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-blue-100/90 backdrop-blur">
            <ShieldCheck className="size-3.5" />
            Expert-led · Evidence-first · Human approvals
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Expert Intelligence Assistant
          </h1>
          <p className="text-sm leading-relaxed text-slate-300">
            Sign in to your workspace. CHRONICLE accelerates research, but experts stay in
            control—nothing is presented to customers until it&apos;s reviewed.
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-blue-400" />
              <span>Structured engagements with traceable evidence and exports.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-violet-400" />
              <span>Demo mode uses local session until your team connects auth API.</span>
            </li>
          </ul>
          <p className="text-xs text-slate-500">
            No account? Your team will issue invites once workspace provisioning is live.
          </p>
        </section>

        <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl shadow-slate-900/40 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-500/30">
              ∞
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Sign in
              </p>
              <p className="text-base font-semibold text-slate-900">Welcome back</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Email
              </label>
              <div
                className={cn(
                  'flex h-11 items-center gap-2 rounded-lg border bg-white px-3 shadow-sm transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/40',
                  errors.email ? 'border-destructive' : 'border-input'
                )}
              >
                <Mail className="size-[18px] text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  className="h-full w-full border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  {...register('email')}
                />
              </div>
              <FieldError message={errors.email?.message} className="mb-0 mt-1.5" />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Password
              </label>
              <div
                className={cn(
                  'flex h-11 items-center gap-2 rounded-lg border bg-white px-3 shadow-sm transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/40',
                  errors.password ? 'border-destructive' : 'border-input'
                )}
              >
                <Lock className="size-[18px] text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  className="h-full w-full border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  {...register('password')}
                />
              </div>
              <FieldError
                message={errors.password?.message}
                className="mb-0 mt-1.5"
              />
            </div>

            <Button type="submit" className="h-11 w-full text-base shadow-md">
              Continue
              <ArrowRight className="size-[18px]" />
            </Button>
          </form>

          <p className="mt-5 text-center text-xs leading-relaxed text-slate-500">
            Demo sign-in stores a local session in this browser until you sign out. Connect auth
            API when the backend is ready.
          </p>
        </section>
      </div>
    </main>
  )
}
