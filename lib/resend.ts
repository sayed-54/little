import { Resend } from "resend";

// Lazily create the Resend client so a missing key doesn't crash the server at startup.
// Pages will still render; only the email-sending code path will fail.
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
