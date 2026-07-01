"use client";

import type { AuthPlugin } from "@better-auth-ui/react";
import { useAuth } from "@better-auth-ui/react";
import { Button } from "@workspace/ui/components/community/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/community/shadcn/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSeparator,
} from "@workspace/ui/components/community/shadcn/field";
import { Input } from "@workspace/ui/components/community/shadcn/input";
import { Label } from "@workspace/ui/components/community/shadcn/label";
import { Spinner } from "@workspace/ui/components/community/shadcn/spinner";
import { cn } from "@workspace/ui/lib/utils";
import { type SyntheticEvent, useState } from "react";
import { toast } from "sonner";

import { ProviderButtons, type SocialLayout } from "./provider-buttons";

type EmailOtpSignInProps = {
  className?: string;
  socialLayout?: SocialLayout;
  socialPosition?: "top" | "bottom";
};

type EmailOtpAuthClient = {
  emailOtp: {
    sendVerificationOtp(params: { email: string; type: "sign-in" }): Promise<AuthClientResult>;
  };
  signIn: {
    emailOtp(params: { email: string; otp: string }): Promise<AuthClientResult>;
  };
};

type AuthClientResult = {
  error?: {
    message?: string;
  } | null;
};

export function emailOtpPlugin(): AuthPlugin {
  return {
    id: "email-otp",
    fallbackViews: {
      auth: {
        signIn: EmailOtpSignIn,
      },
    },
  };
}

function EmailOtpSignIn({
  className,
  socialLayout,
  socialPosition = "bottom",
}: EmailOtpSignInProps) {
  const { authClient, localization, redirectTo, socialProviders, navigate } = useAuth();
  const emailOtpAuthClient = authClient as unknown as EmailOtpAuthClient;

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    otp?: string;
  }>({});

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsPending(true);
    try {
      if (!codeSent) {
        const result = await emailOtpAuthClient.emailOtp.sendVerificationOtp({
          email,
          type: "sign-in",
        });
        if (result.error) throw new Error(result.error.message || "Could not send code");

        setCodeSent(true);
        toast.success("Code sent");
        return;
      }

      const result = await emailOtpAuthClient.signIn.emailOtp({ email, otp });
      if (result.error) throw new Error(result.error.message || "Invalid code");

      navigate({ to: redirectTo });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsPending(false);
    }
  };

  const showSeparator = socialProviders && socialProviders.length > 0;

  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{localization.auth.signIn}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          {socialPosition === "top" && socialProviders && socialProviders.length > 0 && (
            <>
              <ProviderButtons socialLayout={socialLayout} />

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card m-0 flex items-center text-xs">
                {localization.auth.or}
              </FieldSeparator>
            </>
          )}

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field data-invalid={!!fieldErrors.email}>
                <Label htmlFor="email">{localization.auth.email}</Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={localization.auth.emailPlaceholder}
                  required
                  disabled={isPending || codeSent}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  onInvalid={(event) => {
                    event.preventDefault();
                    setFieldErrors((prev) => ({
                      ...prev,
                      email: (event.target as HTMLInputElement).validationMessage,
                    }));
                  }}
                  aria-invalid={!!fieldErrors.email}
                />

                <FieldError>{fieldErrors.email}</FieldError>
              </Field>

              {codeSent && (
                <Field data-invalid={!!fieldErrors.otp}>
                  <Label htmlFor="otp">Code</Label>

                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    placeholder="123456"
                    required
                    disabled={isPending}
                    value={otp}
                    onChange={(event) => {
                      setOtp(event.target.value);
                      setFieldErrors((prev) => ({ ...prev, otp: undefined }));
                    }}
                    onInvalid={(event) => {
                      event.preventDefault();
                      setFieldErrors((prev) => ({
                        ...prev,
                        otp: (event.target as HTMLInputElement).validationMessage,
                      }));
                    }}
                    aria-invalid={!!fieldErrors.otp}
                  />

                  <FieldError>{fieldErrors.otp}</FieldError>
                </Field>
              )}

              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={isPending}>
                  {isPending && <Spinner />}
                  {codeSent ? localization.auth.signIn : "Send code"}
                </Button>

                {codeSent && (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => {
                      setCodeSent(false);
                      setOtp("");
                    }}
                  >
                    Use another email
                  </Button>
                )}
              </div>
            </FieldGroup>
          </form>

          {socialPosition === "bottom" && (
            <>
              {showSeparator && (
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card flex items-center text-xs">
                  {localization.auth.or}
                </FieldSeparator>
              )}

              {socialProviders && socialProviders.length > 0 && (
                <ProviderButtons socialLayout={socialLayout} />
              )}
            </>
          )}
        </div>

        {codeSent && (
          <FieldDescription className="mt-4 text-center">
            Check your email and enter the code above.
          </FieldDescription>
        )}
      </CardContent>
    </Card>
  );
}
