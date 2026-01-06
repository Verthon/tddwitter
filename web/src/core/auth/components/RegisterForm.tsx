import { useState } from "react";
import { useNavigate } from "react-router";
import * as z from "zod/mini";
import { Form } from "@base-ui/react/form";

import { useTranslation } from "src/i18n/useTranslation";
import { Button } from "src/ui/Button/Button";
import { Field } from "src/ui/field/Field";
import { useRegister } from "../hooks/useRegister";

const createSchema = (t: ReturnType<typeof useTranslation>["t"]) =>
  z
    .object({
      username: z.string().check(
        z.minLength(1, {
          error: t("core.auth.register.error.usernameRequired"),
        }),
        z.minLength(3, {
          error: t("core.auth.register.error.usernameMinLength"),
        })
      ),
      email: z
        .email({ error: t("core.auth.register.error.emailInvalid") })
        .check(
          z.minLength(1, { error: t("core.auth.register.error.emailRequired") })
        ),
      password: z
        .string()
        .check(
          z.minLength(1, t("core.auth.register.error.passwordRequired")),
          z.minLength(6, t("core.auth.register.error.passwordMinLength"))
        ),
      confirmPassword: z
        .string()
        .check(
          z.minLength(1, t("core.auth.register.error.confirmPasswordRequired"))
        ),
    })
    .check(
      z.refine((data) => data.password === data.confirmPassword, {
        message: t("core.auth.register.error.passwordMismatch"),
        path: ["confirmPassword"],
      })
    );

export const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { register, isPending } = useRegister();

  const submitForm = async (formValues: Form.Values) => {
    const schema = createSchema(t);
    const result = schema.safeParse(formValues);

    if (!result.success) {
      return {
        errors: z.flattenError(result.error).fieldErrors,
      };
    }

    register({
      username: result.data.username,
      email: result.data.email,
      password: result.data.password,
    });

    return {
      errors: {},
    };
  };

  const handleSignInClick = () => {
    navigate("/login");
  };

  return (
    <Form
      className="w-full max-w-md space-y-6"
      errors={errors}
      validationMode="onBlur"
      onFormSubmit={async (formValues) => {
        const response = await submitForm(formValues);
        console.log("response.errors", response.errors);
        setErrors(response.errors);
      }}
    >
      <Field.Root name="username">
        <Field.Label>{t("core.auth.register.usernameLabel")}</Field.Label>
        <Field.Control type="text" autoComplete="username" required />
        <Field.Error />
      </Field.Root>

      <Field.Root name="email">
        <Field.Label>{t("core.auth.register.emailLabel")}</Field.Label>
        <Field.Control type="email" autoComplete="email" required />
        <Field.Error />
      </Field.Root>

      <Field.Root name="password">
        <Field.Label>{t("core.auth.register.passwordLabel")}</Field.Label>
        <Field.Control type="password" autoComplete="new-password" required />
        <Field.Error />
      </Field.Root>

      <Field.Root name="confirmPassword">
        <Field.Label>
          {t("core.auth.register.confirmPasswordLabel")}
        </Field.Label>
        <Field.Control type="password" autoComplete="new-password" required />
        <Field.Error />
      </Field.Root>

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isDisabled={isPending}
        >
          {isPending
            ? t("core.auth.register.submitting")
            : t("core.auth.register.submitButton")}
        </Button>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          {t("core.auth.register.haveAccount")}{" "}
        </span>
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
          onClick={handleSignInClick}
          disabled={isPending}
        >
          {t("core.auth.register.signIn")}
        </button>
      </div>
    </Form>
  );
};
