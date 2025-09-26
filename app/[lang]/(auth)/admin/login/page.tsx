"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useMemo, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSendAdminOtpMutation } from "@/features/auth/authQuery";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

type OtpType = "email" | "phone";

const STRINGS = {
  en: {
    welcomeBack: "Welcome Back",
    loginToAccess: "Login to access your account",
    email: "Email",
    phone: "Mobile",
    emailPlaceholder: "you@example.com",
    phoneInvalid: "Please enter a valid phone number.",
    emailInvalid: "Please enter a valid email address.",
    sendCode: "Send Verification Code",
    sending: "Sending…",
    sendingCode: "Sending verification code...",
    codeSent: "Verification code sent. Check your inbox/SMS.",
    sendFailed: "Failed to send verification code. Please try again.",
    consentLine: "By clicking Verification Code, you agree to our",
    terms: "Terms of Service",
    and: "and",
    privacy: "Privacy Policy",
  },
  ar: {
    welcomeBack: "مرحبًا بعودتك",
    loginToAccess: "سجّل الدخول للوصول إلى حسابك",
    email: "البريد الإلكتروني",
    phone: "رقم الجوال",
    emailPlaceholder: "you@example.com",
    phoneInvalid: "يرجى إدخال رقم جوال صالح.",
    emailInvalid: "يرجى إدخال بريد إلكتروني صالح.",
    sendCode: "إرسال رمز التحقق",
    sending: "جارٍ الإرسال…",
    sendingCode: "جارٍ إرسال رمز التحقق...",
    codeSent: "تم إرسال رمز التحقق. تفقد بريدك/رسائلك النصية.",
    sendFailed: "فشل إرسال رمز التحقق. يرجى المحاولة مرة أخرى.",
    consentLine: "بالنقر على «رمز التحقق»، فإنك توافق على",
    terms: "شروط الخدمة",
    and: "و",
    privacy: "سياسة الخصوصية",
  },
} as const;

export default function LoginPage() {
  const { language } = useLanguage(); // 'en' | 'ar'
  const L = STRINGS[(language as "en" | "ar") ?? "en"];
  const isRTL = language === "ar";

  // (Optional) make default tab consistent with your UX; using "phone" here
  const [tab, setTab] = useState<OtpType>("email");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [sendAdminOtp, { isLoading }] = useSendAdminOtpMutation();

  const isValidEmail = useMemo(() => {
    if (tab !== "email") return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [tab, email]);

  const isValidPhone = useMemo(() => {
    if (tab !== "phone") return true;
    // Count digits only
    return phone.trim().replace(/\D/g, "").length >= 8;
  }, [tab, phone]);

  const canSubmit = useMemo(() => {
    if (isLoading) return false;
    if (tab === "email") return isValidEmail && email.trim().length > 0;
    return isValidPhone && phone.trim().length > 0;
  }, [tab, email, phone, isValidEmail, isValidPhone, isLoading]);

  const router = useRouter();

  const onSubmit = useCallback(async () => {
    const payload =
      tab === "email"
        ? {
            email: email.trim(),
            otp_type: "email",
            device_id: "jjj*A&S",
            user_type: "admin",
          }
        : {
            phone: phone.trim(),
            otp_type: "phone",
            device_id: "jjj*A&S",
            user_type: "admin",
          };

    try {
      const res = await sendAdminOtp(payload as any).unwrap();
      // toast.success(L.codeSent); // updates SAME toast
      router.push(
        `/${language}/admin/verify-otp/?type=${tab}&target=${
          tab === "phone" ? phone : email
        }&secret=${res?.response?.secret_code}`
      );

      setTimeout(() => {
        toast.success(L.codeSent);
      }, 200);
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || L.sendFailed;
      toast.error(msg);
    } finally {
    }
  }, [tab, email, phone, sendAdminOtp, language, L]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <CardTitle className="text-2xl font-semibold">
              {L.welcomeBack}
            </CardTitle>
            <p
              className={`text-sm text-gray-500 ${
                isRTL ? "text-right w-full" : ""
              }`}
            >
              {L.loginToAccess}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="email"
            value={tab}
            onValueChange={(v) => setTab(v as OtpType)}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="email">{L.email}</TabsTrigger>
              <TabsTrigger value="phone">{L.phone}</TabsTrigger>
            </TabsList>

            <TabsContent value="phone" className="space-y-2">
              <div className={"text-left"}>
                <PhoneInput
                  country={"us"}
                  value={phone}
                  onChange={(val) => setPhone(val)}
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "6px",
                  }}
                  inputClass="!w-full"
                  containerClass={`!w-full`}
                />
                {tab === "phone" && !isValidPhone && (
                  <p
                    className={`text-xs text-red-600 mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {L.phoneInvalid}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-2">
              <Input
                type="email"
                placeholder={L.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={isRTL ? "text-right" : ""}
                dir={isRTL ? "rtl" : "ltr"}
              />
              {tab === "email" && !isValidEmail && (
                <p
                  className={`text-xs text-red-600 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {L.emailInvalid}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" onClick={onSubmit} disabled={!canSubmit}>
            {isLoading ? L.sending : L.sendCode}
          </Button>

          <p
            className={`text-xs text-gray-500 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {L.consentLine}{" "}
            <a href="#" className="underline">
              {L.terms}
            </a>{" "}
            {L.and}{" "}
            <a href="#" className="underline">
              {L.privacy}
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
