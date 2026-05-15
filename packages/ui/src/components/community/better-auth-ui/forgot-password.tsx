"use client";

import { useAuth, useFetchOptions, useRequestPasswordReset } from "@better-auth-ui/react";
import { Button } from "@cozydevs/ui/components/community/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cozydevs/ui/components/community/shadcn/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@cozydevs/ui/components/community/shadcn/field";
import { Input } from "@cozydevs/ui/components/community/shadcn/input";
import { Label } from "@cozydevs/ui/components/community/shadcn/label";
import { Spinner } from "@cozydevs/ui/components/community/shadcn/spinner";
import { cn } from "@cozydevs/ui/lib/utils";
import { type ReactNode, type SyntheticEvent, useState } from "react";
import { toast } from "sonner";

export type ForgotPasswordProps = {
  className?: string;
};

/**
 * Render a card-based "Forgot Password" form that sends a password-reset email.
 *
 * The form displays an email input, submit button, and a link back to sign-in.
 * Toasts are displayed on success or error via the `useForgotPassword` hook.
 *
 * @param className - Optional additional CSS class names applied to the card
 * @returns The forgot-password form UI as a JSX element
 */
export function ForgotPassword({ className }: ForgotPasswordProps) {
  const { authClient, basePaths, localization, plugins, viewPaths, Link } = useAuth();

  const { fetchOptions, resetFetchOptions } = useFetchOptions();

  const { mutate: requestPasswordReset, isPending } = useRequestPasswordReset(authClient, {
    onError: (error) => {
      toast.error(error.error?.message || error.message);
      resetFetchOptions();
    },
    onSuccess: () => toast.success(localization.auth.passwordResetEmailSent),
  });

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    requestPasswordReset({
      email: formData.get("email") as string,
      fetchOptions,
    });
  }

  const Captcha = plugins.find((plugin) => plugin.captchaComponent)?.captchaComponent as ReactNode;

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
  }>({});

  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader>
        <CardTitle className="font-semibold text-xl">{localization.auth.forgotPassword}</CardTitle>
      </CardHeader>

      <CardContent>
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
                disabled={isPending}
                onChange={() => {
                  setFieldErrors((prev) => ({
                    ...prev,
                    email: undefined,
                  }));
                }}
                onInvalid={(e) => {
                  e.preventDefault();

                  setFieldErrors((prev) => ({
                    ...prev,
                    email: (e.target as HTMLInputElement).validationMessage,
                  }));
                }}
                aria-invalid={!!fieldErrors.email}
              />

              <FieldError>{fieldErrors.email}</FieldError>
            </Field>

            {Captcha && <div className="flex justify-center">{Captcha}</div>}

            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending && <Spinner />}

                {localization.auth.sendResetLink}
              </Button>
            </div>
          </FieldGroup>
        </form>

        <div className="mt-4 flex w-full flex-col items-center gap-3">
          <FieldDescription className="text-center">
            {localization.auth.rememberYourPassword}{" "}
            <Link
              href={`${basePaths.auth}/${viewPaths.auth.signIn}`}
              className="underline underline-offset-4"
            >
              {localization.auth.signIn}
            </Link>
          </FieldDescription>
        </div>
      </CardContent>
    </Card>
  );
}
