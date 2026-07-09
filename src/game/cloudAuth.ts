import { createClient, type Provider, type Session, type User } from '@supabase/supabase-js';

export type CloudSocialProvider = 'google' | 'apple' | 'facebook';
export type GameAccountProvider = 'email' | 'gmail' | 'facebook';

export interface CloudAccountProfile {
  provider: GameAccountProvider;
  displayName: string;
  email?: string;
  userId: string;
  connectedAt: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';
const AUTH_REDIRECT_URL = import.meta.env.VITE_AUTH_REDIRECT_URL?.trim() || '';

let client: ReturnType<typeof createClient> | null = null;

export function isCloudAuthConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function cloudAuthSetupLabel(): string {
  return isCloudAuthConfigured()
    ? 'Cloud sign-in ready'
    : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable cloud sign-in.';
}

export function getCloudAuthClient() {
  if (!isCloudAuthConfigured()) return null;
  client ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      flowType: 'pkce',
      storageKey: 'seatsavvy-cloud-auth',
    },
  });
  return client;
}

export async function signInWithEmailPassword(email: string, password: string): Promise<CloudAccountProfile> {
  const auth = requireClient();
  const { data, error } = await auth.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const profile = cloudAccountFromSession(data.session);
  if (!profile) throw new Error('Cloud sign-in did not return a session yet.');
  return profile;
}

export async function createEmailPasswordAccount(
  email: string,
  password: string,
  displayName?: string,
): Promise<CloudAccountProfile | null> {
  const auth = requireClient();
  const { data, error } = await auth.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName?.trim() || undefined,
      },
      emailRedirectTo: redirectUrl(),
    },
  });
  if (error) throw error;
  return cloudAccountFromSession(data.session);
}

export async function startSocialSignIn(provider: CloudSocialProvider): Promise<void> {
  const auth = requireClient();
  const { error } = await auth.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: redirectUrl(),
      queryParams:
        provider === 'google'
          ? {
              access_type: 'offline',
              prompt: 'select_account',
            }
          : undefined,
    },
  });
  if (error) throw error;
}

export async function getCurrentCloudAccount(): Promise<CloudAccountProfile | null> {
  const auth = getCloudAuthClient();
  if (!auth) return null;
  const { data, error } = await auth.auth.getSession();
  if (error) throw error;
  return cloudAccountFromSession(data.session);
}

export function subscribeToCloudAccount(
  callback: (profile: CloudAccountProfile | null) => void,
): () => void {
  const auth = getCloudAuthClient();
  if (!auth) return () => undefined;
  const { data } = auth.auth.onAuthStateChange((_event, session) => {
    callback(cloudAccountFromSession(session));
  });
  return () => data.subscription.unsubscribe();
}

export async function signOutCloud(): Promise<void> {
  const auth = getCloudAuthClient();
  if (!auth) return;
  await auth.auth.signOut();
}

export function cloudAccountFromSession(session: Session | null): CloudAccountProfile | null {
  if (!session?.user) return null;
  return cloudAccountFromUser(session.user);
}

function cloudAccountFromUser(user: User): CloudAccountProfile {
  const provider = gameProviderFromSupabase(user.app_metadata?.provider);
  const metadata = user.user_metadata ?? {};
  const displayName =
    stringOrUndefined(metadata.display_name) ||
    stringOrUndefined(metadata.full_name) ||
    stringOrUndefined(metadata.name) ||
    user.email?.split('@')[0] ||
    'SeatSavvy Player';

  return {
    provider,
    displayName,
    email: user.email ?? undefined,
    userId: user.id,
    connectedAt: new Date().toISOString(),
  };
}

function gameProviderFromSupabase(provider: unknown): GameAccountProvider {
  if (provider === 'google') return 'gmail';
  if (provider === 'facebook') return 'facebook';
  return 'email';
}

function redirectUrl(): string {
  if (AUTH_REDIRECT_URL) return AUTH_REDIRECT_URL;
  return `${window.location.origin}${window.location.pathname}`;
}

function requireClient() {
  const auth = getCloudAuthClient();
  if (!auth) {
    throw new Error('Cloud sign-in needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return auth;
}

function stringOrUndefined(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
