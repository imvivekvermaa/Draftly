import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Sign in · Draftly" };

/** `searchParams` carries an optional `email` to pre-fill (from the sign-up link). */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <AuthForm mode="login" initialEmail={email ?? ""} />;
}
