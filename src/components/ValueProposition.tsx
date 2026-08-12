import { BlurRevealText } from './BlurRevealText';

export function ValueProposition() {
  return (
    <section className="py-32 md:py-48 px-6 md:px-12 flex items-center justify-center bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <BlurRevealText 
          text="Transformando histórias singulares em obras de arte na pele."
          elementType="h2"
          className="text-4xl md:text-5xl lg:text-7xl font-sans font-light leading-tight text-cream"
        />
      </div>
    </section>
  );
}
