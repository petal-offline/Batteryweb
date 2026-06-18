import {
  ArrowRight,
  BatteryCharging,
  ClipboardCheck,
  Factory,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { ProductShowcase } from "@/components/product-showcase";
import { SiteHeader } from "@/components/site-header";
import { getProducts } from "@/lib/products";

const contactNumbers = ["8799759565", "9990941779"];
const email = "kuldeeptelecommunication@gmail.com";
const address = "RZ-26P/54, Street No.2, Indra Park, Palam Colony, New Delhi-110045";
const whatsappUrl = "https://wa.me/918799759565";

export default function Home() {
  const products = getProducts();

  return (
    <main>
      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-overlay" />
        <div className="hero-inner">
          <p className="eyebrow">Wholesale battery cell supply | New Delhi</p>
          <h1>KULDEEP COMMUNICATION & ELECTRONICS (KCEL)</h1>
          <p className="hero-copy">
            Industrial supply of lithium-ion, NMC, and LFP battery cells for pack builders,
            OEM requirements, backup systems, solar storage, and specialized energy projects.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href={whatsappUrl} target="_blank" rel="noreferrer">
              <FaWhatsapp aria-hidden="true" />
              Request Quote
            </a>
            <a className="secondary-action" href="#products">
              View Products
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="trust-row" aria-label="Business highlights">
            <span>
              <BatteryCharging size={18} aria-hidden="true" />
              Lithium-ion
            </span>
            <span>
              <ShieldCheck size={18} aria-hidden="true" />
              NMC / LFP cells
            </span>
            <span>
              <Factory size={18} aria-hidden="true" />
              Industrial buyers
            </span>
          </div>
        </div>
      </section>

      <section className="intro-band" aria-labelledby="intro-title">
        <div className="section-grid">
          <div>
            <p className="section-kicker">Specialized supply</p>
            <h2 id="intro-title">Battery cells for serious commercial requirements.</h2>
          </div>
          <p>
            KCEL supports buyers who need reliable sourcing, technical clarity, and prompt
            quotation for high-value cell requirements. The website inventory is Git-managed
            through the admin portal, so pricing and stock notes can stay current without
            developer support.
          </p>
        </div>
      </section>

      <section className="products-section" id="products" aria-labelledby="products-title">
        <ProductShowcase products={products} enquiryUrl={whatsappUrl} />
      </section>

      <section className="capabilities" id="capabilities" aria-labelledby="capabilities-title">
        <div className="section-heading">
          <p className="section-kicker">How KCEL supports buyers</p>
          <h2 id="capabilities-title">Clear supply conversations from first call to dispatch.</h2>
        </div>
        <div className="capability-grid">
          <div className="capability-item">
            <ClipboardCheck size={28} aria-hidden="true" />
            <h3>Requirement matching</h3>
            <p>Share chemistry, cell format, pack target, quantity, and timeline to align supply.</p>
          </div>
          <div className="capability-item">
            <ShieldCheck size={28} aria-hidden="true" />
            <h3>Industrial-grade clarity</h3>
            <p>Product details are kept structured so buyers can compare specifications quickly.</p>
          </div>
          <div className="capability-item">
            <Truck size={28} aria-hidden="true" />
            <h3>Wholesale coordination</h3>
            <p>Pricing and availability are handled through direct quotation for current stock.</p>
          </div>
        </div>
      </section>

      <section className="contact-band" id="contact" aria-labelledby="contact-title">
        <div>
          <p className="section-kicker">Direct industrial sales</p>
          <h2 id="contact-title">Send the cell requirement. KCEL will respond with availability.</h2>
        </div>
        <div className="contact-actions">
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <FaWhatsapp aria-hidden="true" />
            WhatsApp Quote
          </a>
          <a href={`tel:+91${contactNumbers[0]}`}>
            <Phone size={18} aria-hidden="true" />
            {contactNumbers[0]}
          </a>
          <a href={`tel:+91${contactNumbers[1]}`}>
            <Phone size={18} aria-hidden="true" />
            {contactNumbers[1]}
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <strong>KULDEEP COMMUNICATION & ELECTRONICS (KCEL)</strong>
            <p>Wholesaler and supplier of lithium-ion, NMC, and LFP battery cells.</p>
          </div>
          <address>
            <span>
              <MapPin size={18} aria-hidden="true" />
              {address}
            </span>
            <a href={`mailto:${email}`}>
              <Mail size={18} aria-hidden="true" />
              {email}
            </a>
          </address>
        </div>
      </footer>

      <a
        className="floating-whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Contact KCEL on WhatsApp"
      >
        <FaWhatsapp aria-hidden="true" />
      </a>
    </main>
  );
}
