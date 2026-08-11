import { ArrowUpRight, BatteryCharging, Bike, HousePlug } from "lucide-react";

const whatsappNumber = "918799759565";

const batterySolutions = [
  {
    name: "Two-Wheeler",
    description:
      "Battery options for electric scooters and motorcycles, matched to vehicle use, voltage, capacity, and expected range.",
    details: "Electric scooters and motorcycles",
    Icon: Bike,
    imagePosition: "left center"
  },
  {
    name: "Three-Wheeler",
    description:
      "Reliable battery supply for e-rickshaws and commercial three-wheelers where daily operating range and cycle life matter.",
    details: "E-rickshaw and commercial mobility",
    Icon: BatteryCharging,
    imagePosition: "center center"
  },
  {
    name: "Inverter",
    description:
      "Battery solutions for inverter backup, homes, offices, retail operations, and essential power continuity requirements.",
    details: "Backup power and inverter systems",
    Icon: HousePlug,
    imagePosition: "right center"
  }
] as const;

export function BatterySolutions() {
  return (
    <section className="battery-solutions" id="battery" aria-labelledby="battery-solutions-title">
      <div className="section-heading battery-solutions-heading">
        <div>
          <p className="section-kicker">Battery solutions</p>
          <h2 id="battery-solutions-title">Battery support for the way your business moves.</h2>
        </div>
        <p>
          Tell KCEL the application, required voltage, capacity, quantity, and timeline for a
          tailored quotation.
        </p>
      </div>

      <div className="battery-solutions-grid">
        {batterySolutions.map(({ name, description, details, Icon, imagePosition }) => {
          const enquiry = encodeURIComponent(
            `Hello KCEL, I would like a quotation for ${name.toLowerCase()} batteries. Please share suitable available options.`
          );

          return (
            <article
              className="battery-solution-card"
              key={name}
              style={{ "--battery-image-position": imagePosition } as React.CSSProperties}
            >
              <div className="battery-solution-icon" aria-hidden="true">
                <Icon size={25} strokeWidth={1.8} />
              </div>
              <p>{details}</p>
              <h3>{name} Batteries</h3>
              <span>{description}</span>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${enquiry}`}
                target="_blank"
                rel="noreferrer"
              >
                Request a quote
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
