import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api';
import { cn } from '../../lib/utils';

const ROLE_STYLE: Record<string, string> = {
  'super-admin': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  admin: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  editor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  member: 'bg-white/10 text-white/60 border-white/15',
};

function getInitials(firstName?: string, lastName?: string, username?: string) {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  return (username ?? 'U').slice(0, 2).toUpperCase();
}

function Field({ label, optional, children, hint }: {
  label: string; optional?: boolean; children: React.ReactNode; hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">{label}</span>
        {optional && (
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/25">
            optional
          </span>
        )}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[11px] text-white/30">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', readOnly }: {
  value: string; onChange?: (v: string) => void; placeholder?: string; type?: string; readOnly?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={cn(
        'h-11 w-full rounded-xl border px-4 text-sm outline-none transition',
        readOnly
          ? 'border-white/5 bg-white/3 text-white/70 cursor-default'
          : 'border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:border-sky-500/50 focus:bg-white/8 focus:ring-1 focus:ring-sky-500/20',
      )}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-sky-500/50 focus:bg-white/8 focus:ring-1 focus:ring-sky-500/20"
    />
  );
}

function TagInput({ values, onChange, placeholder, max = 15 }: {
  values: string[]; onChange: (v: string[]) => void; placeholder?: string; max?: number;
}) {
  const [inputVal, setInputVal] = useState('');
  function add() {
    const v = inputVal.trim();
    if (v && !values.includes(v) && values.length < max) onChange([...values, v]);
    setInputVal('');
  }
  return (
    <div className="min-h-[46px] rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/20">
      <div className="flex flex-wrap gap-1.5">
        {values.map((v, i) => (
          <span key={i} className="flex items-center gap-1 rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-0.5 text-xs font-medium text-sky-300">
            {v}
            <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="text-sky-400/50 transition hover:text-red-400" aria-label={`Remove ${v}`}>x</button>
          </span>
        ))}
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={values.length === 0 ? placeholder : ''}
          className="min-w-[140px] flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none"
        />
      </div>
    </div>
  );
}

function CardSection({ title, icon, children }: {
  title: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/4">
      <div className="flex items-center gap-3 border-b border-white/8 px-6 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8 text-white/60">{icon}</span>
        <h2 className="text-sm font-bold text-white/80">{title}</h2>
      </div>
      <div className="space-y-5 p-6">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
        checked ? 'bg-sky-500' : 'bg-white/15',
      )}
    >
      <span className={cn(
        'pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg transition-transform duration-200',
        checked ? 'translate-x-5' : 'translate-x-0',
      )} />
    </button>
  );
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    bio: user?.bio ?? '',
    location: user?.location ?? '',
    occupation: user?.occupation ?? '',
    skills: (user?.skills as string[]) ?? [],
    certifications: (user?.certifications as string[]) ?? [],
    isVisible: user?.isVisible ?? true,
    avatar: user?.avatar ?? '',
    socialLinks: (user?.socialLinks as Record<string, string>) ?? {},
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setAvatarError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setAvatarError('Image must be under 5 MB.'); return; }
    setAvatarError('');
    setAvatarUploading(true);
    try {
      const res = await apiClient.uploadAvatar(file);
      const url: string = res.data.url;
      // Make absolute if relative
      const absUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL ?? 'http://localhost:1337'}${url}`;
      set('avatar', absUrl);
      // Persist immediately so it survives without clicking Save
      await updateProfile({ ...form, avatar: absUrl });
    } catch {
      setAvatarError('Upload failed. Please try again.');
    } finally {
      setAvatarUploading(false);
      // Reset input so same file can be re-selected
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await updateProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const displayName = form.firstName && form.lastName
    ? `${form.firstName} ${form.lastName}`
    : user?.username ?? '';

  const roleKey = user?.memberRole ?? 'member';
  const roleStyle = ROLE_STYLE[roleKey] ?? ROLE_STYLE.member;

  const completenessFields = [form.firstName, form.lastName, form.bio, form.location, form.occupation];
  const filled = completenessFields.filter(Boolean).length + (form.skills.length > 0 ? 1 : 0);
  const total = completenessFields.length + 1;
  const pct = Math.round((filled / total) * 100);

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(14,165,233,0.12),transparent_60%),radial-gradient(ellipse_at_100%_100%,rgba(249,115,22,0.10),transparent_55%)]" />
        <div className="relative z-10 px-6 pb-8 pt-8 md:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-5">
              {/* Avatar with upload overlay */}
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-orange-500 text-2xl font-black text-white shadow-xl ring-4 ring-white/10 overflow-hidden">
                  {form.avatar
                    ? <img src={form.avatar} alt="Profile" className="h-20 w-20 object-cover" />
                    : getInitials(form.firstName, form.lastName, user?.username)}
                  {avatarUploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60">
                      <svg className="h-6 w-6 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                    </div>
                  )}
                </div>
                {/* Hidden file input */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  aria-label="Upload profile photo"
                />
                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-sky-500 transition hover:bg-sky-400 disabled:opacity-50"
                  aria-label="Change profile photo"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
              </div>
              <div>
                <h1 className="text-xl font-black text-white">{displayName || user?.username}</h1>
                <p className="text-sm text-white/40">@{user?.username}</p>
                <span className={cn('mt-1.5 inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider', roleStyle)}>
                  {roleKey}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm sm:min-w-[180px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">Profile</span>
                <span className={cn('text-sm font-black', pct === 100 ? 'text-emerald-400' : 'text-orange-400')}>{pct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', pct === 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-sky-500 to-orange-500')}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[11px] text-white/30">{filled} of {total} fields filled</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6 px-6 pt-8 md:px-10">
        <CardSection title="Basic information" icon={
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" /><path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        }>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name"><Input value={form.firstName} onChange={(v) => set('firstName', v)} placeholder="Jane" /></Field>
            <Field label="Last name"><Input value={form.lastName} onChange={(v) => set('lastName', v)} placeholder="Doe" /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Username" hint="Cannot be changed after registration."><Input value={user?.username ?? ''} readOnly /></Field>
            <Field label="Email"><Input value={user?.email ?? ''} readOnly /></Field>
          </div>
          <Field label="Location" optional><Input value={form.location} onChange={(v) => set('location', v)} placeholder="Derby, UK" /></Field>
          <Field label="Bio" optional hint="Shown on your public profile in the member directory.">
            <Textarea value={form.bio} onChange={(v) => set('bio', v)} placeholder="Tell the community a little about yourself..." rows={4} />
          </Field>
          {/* Avatar upload */}
          <Field label="Profile photo" optional hint="JPG, PNG or WebP · Max 5 MB">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 to-orange-500">
                {form.avatar
                  ? <img src={form.avatar} alt="" className="h-14 w-14 object-cover" />
                  : <span className="flex h-14 w-14 items-center justify-center text-sm font-black text-white">{getInitials(form.firstName, form.lastName, user?.username)}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 bg-white/6 px-4 text-sm font-semibold text-white/80 transition hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-300 disabled:opacity-50"
                >
                  {avatarUploading ? (
                    <><svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" /></svg> Uploading…</>
                  ) : (
                    <><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg> {form.avatar ? 'Change photo' : 'Upload photo'}</>
                  )}
                </button>
                {avatarError && <p className="text-xs text-red-400">{avatarError}</p>}
                {form.avatar && !avatarUploading && (
                  <button
                    type="button"
                    onClick={() => { set('avatar', ''); updateProfile({ ...form, avatar: '' }); }}
                    className="text-xs text-white/30 transition hover:text-red-400"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </Field>
        </CardSection>

        <CardSection title="Professional details" icon={
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" /><path strokeLinecap="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
          </svg>
        }>
          <Field label="Occupation / role" optional>
            <Input value={form.occupation} onChange={(v) => set('occupation', v)} placeholder="Software Engineer, UX Designer, Founder..." />
          </Field>
          <Field label="Skills" optional hint="Press Enter after each skill. Up to 15.">
            <TagInput values={form.skills} onChange={(v) => set('skills', v)} placeholder="e.g. React, Python, Figma - press Enter" />
          </Field>
          <Field label="Certifications" optional hint="Press Enter after each certification.">
            <TagInput values={form.certifications as string[]} onChange={(v) => set('certifications', v)} placeholder="e.g. AWS Certified - press Enter" />
          </Field>
        </CardSection>

        <CardSection title="Social & links" icon={
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path strokeLinecap="round" d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
        }>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="LinkedIn" optional>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
                </span>
                <input value={form.socialLinks.linkedin ?? ''} onChange={(e) => set('socialLinks', { ...form.socialLinks, linkedin: e.target.value })} placeholder="linkedin.com/in/you" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20" />
              </div>
            </Field>
            <Field label="GitHub" optional>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                </span>
                <input value={form.socialLinks.github ?? ''} onChange={(e) => set('socialLinks', { ...form.socialLinks, github: e.target.value })} placeholder="github.com/you" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20" />
              </div>
            </Field>
          </div>
          <Field label="Website / portfolio" optional>
            <input value={form.socialLinks.website ?? ''} onChange={(e) => set('socialLinks', { ...form.socialLinks, website: e.target.value })} placeholder="https://yourwebsite.com" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20" />
          </Field>
        </CardSection>

        <CardSection title="Privacy & visibility" icon={
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
          </svg>
        }>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/4 p-4">
            <div>
              <p className="text-sm font-semibold text-white">Visible in member directory</p>
              <p className="mt-0.5 text-xs leading-relaxed text-white/40">Allow other members to see your profile. Admins can always see all members.</p>
            </div>
            <Toggle checked={form.isVisible} onChange={(v) => set('isVisible', v)} />
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-orange-500/15 bg-orange-500/5 px-4 py-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/15">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-orange-300">Your role: <span className="capitalize">{roleKey}</span></p>
              <p className="text-[11px] text-white/35">Roles can only be changed by an admin or super-admin.</p>
            </div>
          </div>
          <div className="rounded-xl border border-white/6 bg-white/3 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30">Member since</p>
            <p className="mt-0.5 text-sm text-white/60">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
            </p>
          </div>
        </CardSection>

        <div className={cn(
          'flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all',
          saved ? 'border-emerald-500/30 bg-emerald-500/8' : error ? 'border-red-500/30 bg-red-500/5' : 'border-white/8 bg-white/4',
        )}>
          <div className="flex items-center gap-2 text-sm">
            {saved ? (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                <span className="font-semibold text-emerald-400">Changes saved successfully</span>
              </>
            ) : error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              <span className="text-white/30">Unsaved changes will be lost.</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-7 text-sm font-bold text-white shadow-lg shadow-orange-900/30 transition hover:bg-orange-400 disabled:opacity-60"
          >
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Saving...
              </>
            ) : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
