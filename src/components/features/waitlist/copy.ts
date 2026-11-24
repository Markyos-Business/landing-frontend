import type { Locale } from "@/lib/i18n/locales";

export const COPY: Record<Locale, { sent: string; failed: string; label: string }> = {
  ar: { sent: "تم حفظ طلبك. شكرًا لك.", failed: "لم نستطع حفظ الطلب. حاول مرة أخرى.", label: "البريد الإلكتروني" },
  en: { sent: "Your request has been saved. Thank you.", failed: "We could not save your request. Please try again.", label: "Email address" },
};
