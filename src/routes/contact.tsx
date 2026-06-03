import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";

const CONTACT_EMAIL = "abimelekgirma@gmail.com";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SnapTok" },
      { name: "description", content: "Get in touch with the SnapTok team." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(5, "Message is too short").max(1000),
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});

    // Open the user's email client with a pre-filled message addressed to us.
    const { name, email, message } = parsed.data;
    const subject = `SnapTok contact from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title={<>Get in <span className="text-brand-gradient">touch</span></>}
        description="Bug reports, takedown requests, partnerships, or just a hello — we'd love to hear from you."
      />
      <section className="container mx-auto max-w-2xl px-4 pb-16">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft hover:bg-secondary/60"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-brand">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Email us directly</p>
            <p className="text-sm font-semibold">{CONTACT_EMAIL}</p>
          </div>
        </a>

        {sent ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
            <CheckCircle2 className="mx-auto h-10 w-10 text-brand-gradient" />
            <h2 className="mt-3 text-xl font-semibold">Message ready to send!</h2>
            <p className="mt-1 text-muted-foreground">
              We opened your email app with the message pre-filled. Just hit send and we'll reply within a couple of days.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <Field label="Your name" error={errors.name}>
              <input
                name="name"
                maxLength={100}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                name="email"
                type="email"
                maxLength={255}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Message" error={errors.message}>
              <textarea
                name="message"
                rows={5}
                maxLength={1000}
                className="w-full rounded-xl border border-border bg-background p-3 outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient text-sm font-semibold text-white shadow-brand transition-transform hover:scale-[1.01]"
            >
              <Send className="h-4 w-4" /> Send message
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              Sending opens your email app, addressed to {CONTACT_EMAIL}.
            </p>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
