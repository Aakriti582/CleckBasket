import { Users, ShieldCheck, BadgeCheck } from "lucide-react";
import aboutHeroImg from "../../assets/about-hero.png";
import storeImg from "../../assets/store-interior.png";

const reviews = [
  {
    rating: 0,
    title: "Review title",
    body: "Review body",
    name: "Reviewer name",
    date: "Date",
  },
  {
    rating: 0,
    title: "Review title",
    body: "Review body",
    name: "Reviewer name",
    date: "Date",
  },
  {
    rating: 0,
    title: "Review title",
    body: "Review body",
    name: "Reviewer name",
    date: "Date",
  },
];

const trustBadges = [
  { icon: Users, label: "5000+ Happy Customers" },
  { icon: ShieldCheck, label: "Secure Payment Options" },
  { icon: BadgeCheck, label: "Authenticity Guaranteed" },
];

function Stars({ count = 0 }) {
  return (
    <div className="flex gap-1 text-gray-300">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? "text-yellow-400" : ""}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function About() {
  return (
    <div>
      {/* Hero banner */}
      <section className="h-[420px] overflow-hidden">
        <img
          src={aboutHeroImg}
          alt="People shopping fresh produce"
          className="w-full h-full object-cover"
        />
      </section>

      {/* About Us panel */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-center text-3xl font-bold text-primary mb-10">
          About Us
        </h1>

        <div className="bg-primary rounded-card overflow-hidden grid md:grid-cols-2">
          <div className="p-10 md:p-14 flex items-center">
            <p className="text-white/90 leading-relaxed">
              At CleckBasket, we bring the freshness of local farms straight
              to your doorstep. Our mission is to connect communities with
              trusted local growers and suppliers, ensuring every product you
              receive is fresh, high-quality, and sustainably sourced. From
              everyday essentials to farm-fresh produce, we make grocery
              shopping simple, convenient, and reliable. With a commitment to
              supporting local businesses and delivering exceptional service,
              CleckBasket is your neighborhood market—online and always
              within reach.
            </p>
          </div>
          <div className="h-64 md:h-auto">
            <img
              src={storeImg}
              alt="Inside a CleckBasket store"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <h2 className="text-center text-2xl font-bold text-primary mb-10">
          What Do Our Clients Say?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="border border-gray-200 rounded-card p-6">
              <Stars count={r.rating} />
              <h3 className="font-bold text-gray-900 mt-4">{r.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{r.body}</p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-4">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-gray-100 rounded-lg px-5 py-4"
            >
              <Icon size={22} className="text-gray-700 shrink-0" />
              <span className="font-semibold text-gray-800 text-sm">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}