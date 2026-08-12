export function Footer() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black pt-32 pb-8 px-6 md:px-12 border-t border-cream/10 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-16 mb-24">
        
        <div>
          <h2 className="text-[10vw] md:text-7xl font-serif text-cream leading-none tracking-tighter mb-4">
            FELIPE<br/>GARAGEM
          </h2>
        </div>

        <div className="flex gap-16 md:gap-24">
          <div className="flex flex-col gap-4">
            <span className="text-gold text-xs tracking-[0.2em] uppercase font-medium mb-2">Menu</span>
            <button onClick={() => scrollTo('portfolio')} className="text-cream/70 hover:text-cream text-left transition-colors font-light text-lg">Portfolio</button>
            <button onClick={() => scrollTo('about')} className="text-cream/70 hover:text-cream text-left transition-colors font-light text-lg">Sobre</button>
            <button onClick={() => scrollTo('contact')} className="text-cream/70 hover:text-cream text-left transition-colors font-light text-lg">Contato</button>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-gold text-xs tracking-[0.2em] uppercase font-medium mb-2">Social</span>
            <a href="https://instagram.com/felipe.garagemtattoo" target="_blank" rel="noreferrer" className="text-cream/70 hover:text-cream transition-colors font-light text-lg">@felipe.garagemtattoo</a>
            <a href="https://tiktok.com/@felipe.garagemtattoo" target="_blank" rel="noreferrer" className="text-cream/70 hover:text-cream transition-colors font-light text-lg">@felipe.garagemtattoo</a>
            <a href="https://wa.me/5511989719861" target="_blank" rel="noreferrer" className="text-cream/70 hover:text-cream transition-colors font-light text-lg">11989719861</a>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto w-full border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-cream/40 text-sm font-light">
          © {new Date().getFullYear()} Felipe Garagem Tattoo. Todos os direitos reservados.
        </p>
        <p className="text-taupe text-sm font-light">
          Desenvolvido por <a href="https://www.instagram.com/_xkayky.s/" target="_blank" rel="noopener noreferrer" className="text-taupe hover:text-gold transition-colors font-medium">jkayzz</a>
        </p>
      </div>
    </footer>
  );
}
