import type { Locale } from "@/lib/i18n/locales";

export const COPY: Record<
  Locale,
  { sent: string; subscribed: string; failed: string; invalid: string; label: string }
> = {
  ar: {
    sent: "تم حفظ طلبك. شكرًا لك.",
    subscribed: "اشتركت في النشرة. شكرًا لك.",
    failed: "لم نستطع حفظ الطلب. حاول مرة أخرى.",
    invalid: "اكتب بريداً إلكترونياً صحيحاً.",
    label: "البريد الإلكتروني",
  },
  en: {
    sent: "Your request has been saved. Thank you.",
    subscribed: "You're subscribed. Thank you.",
    failed: "We could not save your request. Please try again.",
    invalid: "Enter a valid email address.",
    label: "Email address",
  },
};
