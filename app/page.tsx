import Portfolio from '@/src/ui/Portfolio';
import { destinations } from '@/src/data/world-map';
export default function Page() {
  return (
    <>
      <Portfolio />
      <section
        id="readable-portfolio"
        className="semantic-portfolio"
        aria-label="Portfolio text view"
      >
        <p className="eyebrow">THE READABLE VERSION</p>
        <h2>
          Omar Khaled <span>Software Engineer</span>
        </h2>
        <p>
          A small digital world for engineering, building, and exploring AI.
        </p>
        <p className="content-notice">
          Foundation preview. Professional content will be added only after the
          CV has been verified.
        </p>
        <div className="semantic-grid">
          {destinations.map((place) => (
            <section key={place.id} id={`section-${place.id}`}>
              <p className="eyebrow">{place.chapter}</p>
              <h3>{place.label}</h3>
              <p>{place.description}</p>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
