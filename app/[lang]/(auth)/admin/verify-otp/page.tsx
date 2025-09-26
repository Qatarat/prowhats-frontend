"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  useAdminLoginMutation,
  useSendAdminOtpMutation,
} from "@/features/auth/authQuery";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authAction } from "@/features/auth/authSlice";
import { useLanguage } from "@/contexts/LanguageContext";
import Cookies from "js-cookie";

type OtpType = "phone" | "email";
const OTP_LENGTH = 4;

const STRINGS = {
  en: {
    checkYourPhone: "Check your phone",
    checkYourEmail: "Check your email",
    enterCodeToTarget: (n: number) =>
      `Please enter the ${n}-digit code sent to `,
    verifying: "Verifying…",
    verifyAndLogin: "Verify & Login to your Account",
    notSeeingCode: "Not seeing the code?",
    resendAgain: "Resend again",
    pleaseEnterNDigits: (n: number) => `Please enter the ${n}-digit code.`,
    sessionExpired: "Session expired. Please request a new code.",
    invalidCode: "Invalid code. Please try again.",
    sendingCode: "Sending verification code...",
    codeSent: "Verification code sent. Check your inbox/SMS.",
    sendFailed: "Failed to send verification code. Please try again.",
    unknown: "(unknown)",
  },
  ar: {
    checkYourPhone: "تحقّق من هاتفك",
    checkYourEmail: "تحقّق من بريدك الإلكتروني",
    enterCodeToTarget: (n: number) =>
      `يرجى إدخال الرمز المكوّن من ${n} أرقام المُرسل إلى `,
    verifying: "جارٍ التحقق…",
    verifyAndLogin: "تحقّق وسجّل الدخول إلى حسابك",
    notSeeingCode: "لم يصلك الرمز؟",
    resendAgain: "أعد الإرسال",
    pleaseEnterNDigits: (n: number) =>
      `يرجى إدخال الرمز المكوّن من ${n} أرقام.`,
    sessionExpired: "انتهت الجلسة. يرجى طلب رمز جديد.",
    invalidCode: "رمز غير صحيح. يرجى المحاولة مرة أخرى.",
    sendingCode: "جارٍ إرسال رمز التحقق...",
    codeSent: "تم إرسال رمز التحقق. تفقد بريدك/رسائلك النصية.",
    sendFailed: "فشل إرسال رمز التحقق. يرجى المحاولة مرة أخرى.",
    unknown: "(غير معروف)",
  },
} as const;

export default function OTPVerificationPage() {
  const { language } = useLanguage(); // 'en' | 'ar'
  const L = STRINGS[(language as "en" | "ar") ?? "en"];
  const isRTL = language === "ar";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Expect these from the login step
  const type = (searchParams.get("type") as OtpType) || "phone";
  const target = searchParams.get("target") || ""; // phone or email value to show
  const secret = searchParams.get("secret") || ""; // otp_secret returned from "sent-otp"

  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const code = useMemo(() => otp.join(""), [otp]);
  const allFilled = useMemo(() => otp.every((d) => d !== ""), [otp]);
  const canSubmit = useMemo(
    () => allFilled && !isLoading,
    [allFilled, isLoading]
  );

  const focusIndex = (i: number) => inputRefs.current[i]?.focus();

  const handleChange = (index: number, value: string) => {
    // Only digits; keep the last typed digit if multiple
    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = v;
    setOtp(next);
    if (v && index < OTP_LENGTH - 1) focusIndex(index + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      focusIndex(index - 1);
    if (e.key === "ArrowLeft" && index > 0) focusIndex(index - 1);
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) focusIndex(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!paste) return;
    const next = otp.slice();
    for (let i = 0; i < OTP_LENGTH; i++) next[i] = paste[i] || "";
    setOtp(next);
    const lastIndex = Math.min(paste.length, OTP_LENGTH) - 1;
    if (lastIndex >= 0 && lastIndex < OTP_LENGTH - 1) focusIndex(lastIndex + 1);
  };

  const dispatch = useDispatch();

  const onSubmit = useCallback(async () => {
    if (!allFilled || code.length !== OTP_LENGTH) {
      toast.error(L.pleaseEnterNDigits(OTP_LENGTH));
      return;
    }
    if (!secret) {
      toast.error(L.sessionExpired);
      return;
    }

    const payload =
      type === "email"
        ? {
            email: target,
            otp_type: "email",
            user_type: "admin",
            otp_secret: secret,
            otp_code: code,
          }
        : {
            phone: target,
            otp_type: "phone",
            user_type: "admin",
            otp_secret: secret,
            otp_code: code,
          };

    try {
      const res = await adminLogin(payload).unwrap();

      const token = res?.response?.token;
      const refresh = res?.response?.refresh_token;
      if (token) localStorage.setItem("access_token", token);
      if (refresh) localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("admin", "true");
      localStorage.setItem("country", "ar");

      dispatch(authAction.getUser(res?.response?.admin));
      Cookies.set("sidebar_state", "true", { expires: 180 });

      setTimeout(() => {
        toast.success(
          res?.message ||
            (language === "ar"
              ? "تم التحقق بنجاح!"
              : "Verification successful!")
        );
      }, 200);

      // router.replace("/admin");
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || L.invalidCode;
      toast.error(msg);
      setOtp(Array(OTP_LENGTH).fill(""));
      focusIndex(0);
    }
  }, [
    allFilled,
    code,
    secret,
    target,
    type,
    adminLogin,
    dispatch,
    language,
    L,
  ]);

  useEffect(() => {
    // Auto-submit when all digits are filled
    if (allFilled && code.length === OTP_LENGTH) {
      void onSubmit();
    }
  }, [allFilled, code, onSubmit]);

  const [sendAdminOtp] = useSendAdminOtpMutation();
  const onResend = async () => {
    const payload =
      type === "email"
        ? {
            email: target.trim(),
            otp_type: "email",
            device_id: "jjj*A&S",
            user_type: "admin",
          }
        : {
            phone: target.trim(),
            otp_type: "phone",
            device_id: "jjj*A&S",
            user_type: "admin",
          };

    const id = toast.loading(L.sendingCode);
    try {
      const res = await sendAdminOtp(payload as any).unwrap();
      router.push(
        `/${language}/admin/verify-otp?type=${type}&target=${target}&secret=${res?.response?.secret_code}`
      );
      toast.success(L.codeSent);
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || L.sendFailed;
      toast.error(msg);
    } finally {
      toast.dismiss(id);
    }
  };

  const maskedTarget =
    type === "phone"
      ? target
        ? target.replace(/.(?=.{4})/g, "•")
        : L.unknown
      : target
      ? (() => {
          const [u, d] = target.split("@");
          if (!d) return target;
          const safeU =
            u.length <= 2
              ? u[0] + "•"
              : u[0] + "•".repeat(u.length - 2) + u[u.length - 1];
          return `${safeU}@${d}`;
        })()
      : L.unknown;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Toaster position="top-center" />
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-xl">
            {type === "phone" ? L.checkYourPhone : L.checkYourEmail}
          </CardTitle>
          <p
            className={`text-sm text-gray-500 mt-1 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {L.enterCodeToTarget(OTP_LENGTH)}
            <span className="font-semibold">{maskedTarget}</span>
          </p>
        </CardHeader>

        <CardContent>
          <div
            className={`flex justify-between gap-2 my-4 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={(el: any) => (inputRefs.current[index] = el)}
                disabled={isLoading}
                className="text-center text-xl w-12 h-12"
                dir="ltr" // keep digits LTR even in Arabic
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={onSubmit} disabled={!canSubmit}>
            {isLoading ? L.verifying : L.verifyAndLogin}
          </Button>
          <p
            className={`text-xs text-gray-500 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {L.notSeeingCode}{" "}
            <button
              type="button"
              onClick={onResend}
              className="underline font-medium"
              disabled={isLoading}
            >
              {L.resendAgain}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
