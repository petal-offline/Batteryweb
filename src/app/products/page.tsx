import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { ProductCatalog } from "@/components/product-catalog";
import { SiteHeader } from "@/components/site-header";
import { getProducts } from "@/lib/products";

const contactNumbers = ["8799759565", "9990941779"];
const email = "kuldeeptelecommunication@gmail.com";
const address = "RZ-26P/54, Street No.2, Indra Park, Palam Colony, New Delhi-110045";
const whatsappUrl = "https://wa.me/918799759565";

export default function ProductsPage() {
  const products = getProducts();

  return (
    <main>
      <SiteHeader />

      <section className="catalog-hero">
        <div className="catalog-hero-inner">
          <a className="catalog-back-link" href="/#products">
            <ArrowLeft size={18} aria-hidden="true" />
            Back to homepage
          </a>
          <p className="eyebrow">KCEL product inventory</p>
          <h1>NMC and LFP battery cells</h1>
          <p>
            Browse available cell listings, compare voltage and capacity, then send a
            direct WhatsApp enquiry for the exact product.
          </p>
        </div>
      </section>

      <section className="catalog-page" aria-label="Battery cell products">
        <ProductCatalog products={products} enquiryNumbers={contactNumbers} />
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
            <a href={`tel:+91${contactNumbers[0]}`}>
              <Phone size={18} aria-hidden="true" />
              {contactNumbers[0]}
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
