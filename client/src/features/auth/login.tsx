import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { EMAIL_REGEX } from "@/common/constants/regex";
import useAuth from "./useAuth";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PasswordInput } from "@/components/ui/password-input";
import { useErrorParser } from "@/common/errors/useErrorParser";

const Login = () => {
  const { t } = useTranslation();
  const { translateInlineError } = useErrorParser();
  const { sigIn } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  const { isLoading: isSigIng, request, isSuccess, error } = sigIn;

  const onSubmit = (data: { email: string; password: string }) =>
    request(data.email, data.password);

  const loginSchema = {
    email: {
      required: t("fields.email.validations.required", { ns: "login" }),
      pattern: {
        value: EMAIL_REGEX,
        message: t("fields.email.validations.pattern", { ns: "login" }),
      },
    },
    password: {
      required: t("fields.password.validations.required", { ns: "login" }),
    },
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/portfolio", { replace: true });
    }
  }, [isSuccess]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center mb-16">
        <h1 className="text-2xl font-bold text-white">
          {t("title", { ns: "login" })}
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          {t("subTitle", { ns: "login" })}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">
            {t("fields.email.label", { ns: "login" })}
          </Label>
          <Input
            id="email"
            type="email"
            disabled={isSigIng}
            autoComplete="username"
            placeholder={t("fields.email.placeholder", { ns: "login" })}
            {...register("email", loginSchema.email)}
          />
          {errors.email && (
            <span className="text-red-400 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">
              {t("fields.password.label", { ns: "login" })}
            </Label>
            <Link
              to="#"
              className="ml-auto text-muted-foreground text-sm underline-offset-4 hover:underline"
            >
              {t("fields.password.forgotPassword", { ns: "login" })}
            </Link>
          </div>
          <PasswordInput
            id="password"
            disabled={isSigIng}
            placeholder={t("fields.password.placeholder", { ns: "login" })}
            {...register("password", loginSchema.password)}
          />
          {errors.password && (
            <span className="text-red-400 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>
        <Button type="submit" className="w-full" isLoading={isSigIng}>
          {t("login.normal", { ns: "login" })}
        </Button>

        {error && (
          <span className="text-red-400 text-sm">
            {translateInlineError(error)}
          </span>
        )}
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            {t("login.alternative", { ns: "login" })}
          </span>
        </div>
        <Button
          variant="outline"
          className="w-full text-white"
          disabled={isSigIng}
        >
          <img
            src="/public/assets/images/google_logo.png"
            alt="Google logo"
            width={32}
            height={32}
          />
          {t("login.google", { ns: "login" })}
        </Button>
      </div>
      <div className="text-center text-sm text-muted-foreground mt-2">
        {t("login.doNotHaveAccount", { ns: "login" })}{" "}
        <Link to="/signup" className="underline underline-offset-4">
          {t("signUp", { ns: "login" })}
        </Link>
      </div>
    </form>
  );
};

export default Login;
