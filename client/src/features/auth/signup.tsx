import { EMAIL_REGEX, PASSWORD_REGEX } from "@/common/constants/regex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "@/services/apis/auth/auth.api";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { useErrorParser } from "@/common/errors/useErrorParser";

const SignUp = () => {
  const { t } = useTranslation();
  const { translateInlineError } = useErrorParser();
  const [signUp, { isLoading, isSuccess, error }] = useSignUpMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{
    username: string;
    email: string;
    confirmEmail: string;
    password: string;
  }>({
    mode: "onBlur",
  });

  const email = watch("email");

  const onSubmit = (data: {
    email: string;
    password: string;
    username: string;
  }) =>
    signUp({
      email: data.email,
      password: data.password,
      username: data.username,
    });

  const signupSchema = {
    username: {
      required: t("fields.username.validations.required", { ns: "signup" }),
    },
    email: {
      required: t("fields.email.validations.required", { ns: "signup" }),
      pattern: {
        value: EMAIL_REGEX,
        message: t("fields.email.validations.pattern", { ns: "signup" }),
      },
    },
    confirmEmail: {
      required: t("fields.confirmEmail.validations.required", { ns: "signup" }),
      pattern: {
        value: EMAIL_REGEX,
        message: t("fields.confirmEmail.validations.pattern", { ns: "signup" }),
      },
      validate: (value: string) =>
        value === email ||
        t("fields.confirmEmail.validations.notMatch", { ns: "signup" }),
    },
    password: {
      required: t("fields.password.validations.required", { ns: "signup" }),
      pattern: {
        value: PASSWORD_REGEX,
        message: t("fields.password.validations.pattern", { ns: "signup" }),
      },
    },
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("success.title", { ns: "signup" }), {
        description: t("success.message", { ns: "signup" }),
      });
      navigate("/login", { replace: true });
    }
  }, [isSuccess]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center mb-16">
        <h1 className="text-2xl font-bold text-white">
          {t("title", { ns: "signup" })}
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          {t("subTitle", { ns: "signup" })}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">
            {t("fields.username.label", { ns: "signup" })}
          </Label>
          <Input
            id="username"
            type="text"
            disabled={isLoading}
            placeholder={t("fields.username.placeholder", { ns: "signup" })}
            {...register("username", signupSchema.username)}
          />
          {errors.username && (
            <span className="text-red-400 text-sm">
              {errors.username.message}
            </span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">
            {t("fields.email.label", { ns: "signup" })}
          </Label>
          <Input
            id="email"
            type="email"
            disabled={isLoading}
            placeholder={t("fields.email.placeholder", { ns: "signup" })}
            {...register("email", signupSchema.email)}
          />
          {errors.email && (
            <span className="text-red-400 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmEmail">
            {t("fields.confirmEmail.label", { ns: "signup" })}
          </Label>
          <Input
            id="confirmEmail"
            type="email"
            disabled={isLoading}
            placeholder={t("fields.confirmEmail.placeholder", { ns: "signup" })}
            {...register("confirmEmail", signupSchema.confirmEmail)}
          />
          {errors.confirmEmail && (
            <span className="text-red-400 text-sm">
              {errors.confirmEmail.message}
            </span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">
            {t("fields.password.label", { ns: "signup" })}
          </Label>
          <PasswordInput
            id="password"
            disabled={isLoading}
            placeholder={t("fields.password.placeholder", { ns: "signup" })}
            {...register("password", signupSchema.password)}
          />
          {errors.password && (
            <span className="text-red-400 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>
        <Button type="submit" className="w-full" isLoading={isLoading}>
          {t("signup", { ns: "signup" })}
        </Button>
        {error && (
          <span className="text-red-400 text-sm">
            {translateInlineError(error)}
          </span>
        )}
      </div>
      <div className="text-center text-sm text-muted-foreground mt-2">
        {t("haveAccount", { ns: "signup" })}{" "}
        <Link to="/login" className="underline underline-offset-4">
          {t("login", { ns: "signup" })}
        </Link>
      </div>
    </form>
  );
};

export default SignUp;
