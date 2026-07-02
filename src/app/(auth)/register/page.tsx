import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Create account · Draftly" };

/** `searchParams` carries an optional `email` to pre-fill (from the sign-in link). */
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <AuthForm mode="register" initialEmail={email ?? ""} />;
}
