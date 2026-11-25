import type { Locale } from "@/lib/i18n/locales";
import type { ContactTopic, ContactWho } from "@/lib/contact";

/*
 * The form's own strings.
 *
 * Field labels and states live here rather than in the content file, for the
 * same reason the waitlist's do: a content file describes a page, and these
 * are the component's own machinery — the same four labels and the same five
 * outcomes wherever the form is placed. What the *page* says around the form
 * (its heading and its lead) is content, and stays in `content/pages/`.
 *
 * The Arabic is transcreated, not translated, per §11. Sentence case, no
 * exclamation marks, no emoji, "you" over "we" where there is a choice.
 */

export type ContactCopy = {
  fields: {
    name: string;
    email: string;
    phone: string;
    company: string;
    who: string;
    country: string;
    topic: string;
    replyLanguage: string;
    message: string;
  };
  placeholders: {
    name: string;
    email: string;
    phone: string;
    company: string;
    country: string;
    message: string;
  };
  /**
   * The word marking a field as skippable.
   *
   * Appended to the five optional labels rather than marking the four
   * required ones with an asterisk. An asterisk is a convention a reader has
   * to already know, it is read aloud as "star" by some screen readers, and
   * on a form where most fields are optional it would put a mark on
   * everything that matters and nothing on what does not.
   */
  optional: string;
  /** The empty first option of an optional select. */
  choose: string;
  topics: Record<ContactTopic, string>;
  who: Record<ContactWho, string>;
  languages: Record<Locale, string>;
  submit: string;
  sending: string;
  /** The honeypot's label. Never seen, but it is a real labelled field. */
  honeypot: string;
  /**
   * What is wrong with a required field, shown under it and announced with it
   * (25 Nov 2026). Until then a blank submit did nothing at all and a bad
   * address got only the generic `states.invalid` line.
   */
  errors: {
    name: string;
    email: string;
    emailFormat: string;
    message: string;
  };
  states: {
    sent: string;
    invalid: string;
    limited: string;
    /** Ends mid-sentence: the inbox address follows as a link. */
    undelivered: string;
    failed: string;
  };
};

export const COPY: Record<Locale, ContactCopy> = {
  ar: {
    fields: {
      name: "الاسم",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      company: "الاستوديو أو الشركة",
      who: "من أنت",
      country: "الدولة",
      topic: "الموضوع",
      replyLanguage: "لغة الردّ",
      message: "رسالتك",
    },
    placeholders: {
      name: "اسمك",
      email: "name@company.com",
      phone: "+966 5X XXX XXXX",
      company: "اسم الاستوديو أو الشركة",
      country: "السعودية",
      message: "اكتب رسالتك هنا…",
    },
    optional: "اختياري",
    choose: "اختر…",
    who: {
      freelancer: "مستقل",
      studio: "استوديو",
      company: "شركة",
      other: "غير ذلك",
    },
    languages: {
      ar: "العربية",
      en: "الإنجليزية",
    },
    topics: {
      sales: "المبيعات وخطة المؤسسات",
      support: "الدعم",
      studios: "شراكات الاستوديوهات",
      press: "الصحافة",
      security: "الأمان",
      feature: "اقتراح ميزة",
      other: "شيء آخر",
    },
    submit: "أرسل الرسالة",
    sending: "جارٍ الإرسال…",
    honeypot: "موقع الشركة",
    errors: {
      name: "اكتب اسمك.",
      email: "اكتب بريدك الإلكتروني.",
      emailFormat: "اكتب بريداً إلكترونياً صحيحاً، مثل name@company.com.",
      message: "اكتب رسالتك.",
    },
    states: {
      sent: "وصلت رسالتك. نقرأ كل رسالة، وسيصلك الردّ على بريدك.",
      invalid: "راجع الحقول ثم أعد المحاولة.",
      limited: "أرسلت عدة رسائل للتوّ. انتظر قليلاً ثم حاول مرة أخرى.",
      undelivered: "لم تُرسل رسالتك. راسلنا مباشرة على ",
      failed: "لم نستطع الاتصال. تحقّق من اتصالك ثم أعد المحاولة.",
    },
  },
  en: {
    fields: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      company: "Studio or company",
      who: "Who you are",
      country: "Country",
      topic: "What's it about?",
      replyLanguage: "Reply in",
      message: "Your message",
    },
    placeholders: {
      name: "Your name",
      email: "name@company.com",
      phone: "+966 5X XXX XXXX",
      company: "The studio or company you work with",
      country: "Saudi Arabia",
      message: "Write your message here…",
    },
    optional: "optional",
    choose: "Select…",
    who: {
      freelancer: "Freelancer",
      studio: "Studio",
      company: "Company",
      other: "Something else",
    },
    languages: {
      ar: "Arabic",
      en: "English",
    },
    topics: {
      sales: "Sales and Enterprise",
      support: "Support",
      studios: "Studio partnerships",
      press: "Press",
      security: "Security",
      feature: "Suggest a feature",
      other: "Something else",
    },
    submit: "Send message",
    sending: "Sending…",
    honeypot: "Company website",
    errors: {
      name: "Enter your name.",
      email: "Enter your email address.",
      emailFormat: "Enter a valid email, like name@company.com.",
      message: "Write your message.",
    },
    states: {
      sent: "Your message arrived. We read every one, and the reply comes to your email.",
      invalid: "Check the fields and try again.",
      limited: "That's a few messages in a row. Give it a minute and try again.",
      undelivered: "Your message was not sent. Write to us directly at ",
      failed: "We couldn't reach the server. Check your connection and try again.",
    },
  },
};
