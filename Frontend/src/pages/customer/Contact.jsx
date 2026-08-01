import { useState } from "react";
import { MapPin } from "lucide-react";
import { sendContactMessage } from "../../api/endpoints/support";

const subjects = [
  { value: "GENERAL", label: "General Inquiry" },
  { value: "ORDER_SUPPORT", label: "Order Support" },
  { value: "TRADER_PARTNERSHIP", label: "Trader Partnership" },
  { value: "FEEDBACK", label: "Feedback" },
];

export default function Contact() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    subject: subjects[0].value,
    message: "",
  });
  const [status, setStatus] = useState(null); // null | "sending" | "sent" | "error"

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendContactMessage(form);
      setStatus("sent");
      setForm({ full_name: "", email: "", subject: subjects[0].value, message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary mb-10">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Form */}
        <div className="bg-white border border-gray-100 rounded-card shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Send us a message
          </h2>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-1">
                FULL NAME
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={onChange}
                required
                placeholder="Julianne Moore"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="julianne@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-1">
                SUBJECT
              </label>
              <select
                name="subject"
                value={form.subject}
                onChange={onChange}
                className={inputClass}
              >
                {subjects.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-1">
                MESSAGE
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                required
                rows={5}
                placeholder="How can our curators help you today?"
                className={inputClass}
              />
            </div>

            {status === "sent" && (
              <p className="text-sm bg-green-50 text-green-700 rounded-lg p-3">
                Message sent — we'll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm bg-red-50 text-red-600 rounded-lg p-3">
                Something went wrong. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-primary hover:bg-primary-light text-white font-semibold tracking-wide rounded-full py-3.5 transition disabled:opacity-60"
            >
              {status === "sending" ? "SENDING..." : "SUBMIT MESSAGE"}
            </button>
          </form>
        </div>

        {/* Info panel */}
        <div className="bg-primary-cream rounded-card p-10">
          <span className="inline-block bg-white text-accent-green text-xs font-bold tracking-wide px-3 py-1 rounded-full">
            OUR ROOTS
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            Central Pickup Point
          </h2>
          <p className="text-gray-600 text-sm mt-2 max-w-sm">
            Visit our flagship garden curator space for order pickups and
            fresh farm-to-table workshops.
          </p>

          <div className="mt-8 bg-white rounded-card h-64 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
              <MapPin size={32} className="text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-500">
                ADDRESS
              </p>
              <p className="text-sm text-gray-800 mt-1">
                Central District Garden,
                <br />
                Kathmandu Valley, NP
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-500">
                CONNECT
              </p>
              <p className="text-sm text-gray-800 mt-1">
                +977 (01) 4455-667
                <br />
                hello@cleckbasket.com
              </p>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <div>
            <p className="text-xs font-semibold tracking-wide text-gray-500 mb-2">
              PICKUP HOURS
            </p>
            <div className="flex justify-between text-sm text-gray-800">
              <span>Mon — Fri</span>
              <span>09:00 AM - 06:00 PM</span>
            </div>
            <div className="flex justify-between text-sm text-gray-800 mt-1">
              <span>Sat — Sun</span>
              <span>10:00 AM - 04:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}