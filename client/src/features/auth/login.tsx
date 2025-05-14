import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();

  return (
    <form>
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
            placeholder={t("fields.email.placeholder", { ns: "login" })}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">
              {t("fields.password.label", { ns: "login" })}
            </Label>
            <a
              href="#"
              className="ml-auto text-muted-foreground text-sm underline-offset-4 hover:underline"
            >
              {t("fields.password.forgotPassword", { ns: "login" })}
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder={t("fields.password.placeholder", { ns: "login" })}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          {t("login.normal", { ns: "login" })}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            {t("login.alternative", { ns: "login" })}
          </span>
        </div>
        <Button variant="outline" className="w-full text-white">
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
        <a href="#" className="underline underline-offset-4">
          {t("signUp", { ns: "login" })}
        </a>
      </div>
    </form>
  );
};

export default Login;
