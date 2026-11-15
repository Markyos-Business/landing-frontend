import type { Locale } from "@/lib/i18n/locales";

export const COPY: Record<Locale, { sent: string; pending: string; failed: string; label: string }> = {
  ar: {
    sent: "تم. وصلك بريد التأكيد.",
    // Said plainly, because it is true and because the alternative is a
    // visitor who thinks they are on a list that does not exist.
    pending: "النموذج غير متصل بعد، ولم يُحفظ أي طلب. راسلنا مباشرة في الوقت الحالي.",
    failed: "لم نستطع إرسال الطلب. حاول مرة أخرى.",
    label: "البريد الإلكتروني",
  },
  en: {
    sent: "Done. Check your inbox for the confirmation.",
    pending:
      "This form is not connected yet, so nothing was stored. Email us directly in the meantime.",
    failed: "That did not go through. Please try again.",
    label: "Email address",
  },
};
