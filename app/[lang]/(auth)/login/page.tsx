"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LangSwitch } from "@/components/LangSwitch";

export default function LoginPage() {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValidEmail = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const isValidPassword = useMemo(() => {
    return password.trim().length >= 6;
  }, [password]);

  const canSubmit = isValidEmail && isValidPassword;

  const onSubmit = () => {
    console.log("Login with", { email, password });
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Card className=" w-full relative
      max-w-2xl

    px-4 sm:px-4 md:px-16 lg:px-20 xl:px-28 2xl:px-40
    py-20 sm:py-24 md:py-20 lg:py-20 xl:pt-24 xl:pb-20 2xl:pb-36 2xl:pt-40 ">
        <div className="absolute start-8 top-8 pb-8">
          <LangSwitch />
        </div>
        <div  className="absolute end-8 top-8 pb-8">
          <p className="pt-2">{t("loginTitle")}</p>
        </div>


        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">
            {t("loginTitle") || "Login to your account"}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {t("loginSubtitle") ||
              "Sign in to your account and start the adventure"}
          </p>
        </CardHeader>

        <CardContent className="space-y-4" >
          {/* Email */}
          <div className="text-left" >
           <label className={`block text-sm font-medium mb-1 ${isRTL ? "text-right" : "text-left"}`}>
            {t("email")}
          </label>

            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={isRTL ? "text-right" : ""}
              dir={isRTL ? "rtl" : "ltr"}
            />
            {!isValidEmail && email && (
              <p className="text-xs text-red-600 mt-1">
                {t("emailInvalid") || "Enter a valid email"}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="text-left">
            <label className={`block text-sm font-medium mb-1 ${isRTL ? "text-right" : "text-left"}`}>
            {t("password")}
          </label>
            <Input
              type="password"
              placeholder={t("passwordPlaceholder") || "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={isRTL ? "text-right" : ""}
              dir={isRTL ? "rtl" : "ltr"}
            />
            {!isValidPassword && password && (
              <p className="text-xs text-red-600 mt-1">
                {t("passwordInvalid") || "Password must be at least 6 characters"}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={onSubmit}
            disabled={!canSubmit}
          >
            {t("signIn") || "Sign in"}
          </Button>

          <Button
            variant="link"
            className="text-sm text-gray-600 hover:underline"
          >
            {t("resetPassword") || "Reset password"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            {t("agreeTextPart1") || "By clicking sign in, you agree to our"}{" "}
            <a href="/terms" className="underline hover:text-gray-700">
              {t("terms") }
            </a>{" "}
            {t("and") }{" "}
            <a href="/privacy" className="underline hover:text-gray-700">
              {t("privacyPolicy")}
            </a>
            .
          </p>
        </CardFooter>





      </Card>
    </div>
  );
}
