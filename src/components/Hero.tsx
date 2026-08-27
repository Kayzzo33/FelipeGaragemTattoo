export function Hero() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .hero-container {
            position: relative;
            min-height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .hero-text {
            color: #EFCFA1;
            line-height: 0.8;
            letter-spacing: -0.02em;
            position: absolute;
            white-space: nowrap;
        }
        .text-felipe {
            top: 22%;
            left: 2%;
            font-size: clamp(4rem, 16vw, 16rem);
            z-index: 25;
        }
        .text-garagem {
            top: 60%;
            right: 2%;
            font-size: clamp(3rem, 13vw, 13rem);
            z-index: 30;
        }
        .image-placeholder {
            background-color: #1a1a1a;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(239, 207, 161, 0.3);
            font-size: 0.75rem;
            border: 1px solid rgba(201, 164, 92, 0.2);
            font-family: monospace;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }
        .img-left {
            top: 50%;
            left: 14%;
            width: 22%;
            aspect-ratio: 3 / 4;
            z-index: 20;
        }
        .img-right {
            top: 18%;
            right: 15%;
            width: 30%;
            aspect-ratio: 4 / 4.5;
            z-index: 20;
        }
        .img-mobile-extra {
            display: none;
        }
        
        @media (max-width: 1024px) {
            .text-felipe { font-size: 15vw; z-index: 25; }
            .text-garagem { font-size: 13vw; right: 2%; z-index: 30; }
            .img-left { width: 28%; }
            .img-right { width: 38%; }
        }
        @media (max-width: 768px) {
            .hero-container { min-height: 105vh; padding-top: 5rem; }
            .text-felipe { top: 12%; left: 4%; font-size: 23vw; z-index: 25; }
            
            .img-mobile-extra { 
                display: flex; 
                top: 25%; left: 7%; width: 50%; aspect-ratio: 2 / 3; z-index: 15; 
            }
            .img-right { 
                top: 35%; right: 6%; width: 44%; aspect-ratio: 1 / 1.1; z-index: 18; 
            }
            .img-left { 
                top: 56%; left: 24%; width: 46%; aspect-ratio: 4 / 3; z-index: 16; 
            }
            
            .text-garagem { 
                top: 71%; left: 50%; transform: translateX(-50%); font-size: 18vw; z-index: 30; 
            }
        }
        @media (max-width: 480px) {
            .hero-container { min-height: 108vh; padding-top: 5.5rem; }
            .text-felipe { top: 13%; left: 4%; font-size: 24vw; z-index: 25; }
            
            .img-mobile-extra { 
                top: 26%; left: 5%; width: 48%; aspect-ratio: 2 / 3; z-index: 15; 
            }
            .img-right { 
                top: 36%; right: 4%; width: 46%; aspect-ratio: 1 / 1.1; z-index: 18; 
            }
            .img-left { 
                top: 57%; left: 28%; width: 50%; aspect-ratio: 5 / 4; z-index: 16; 
            }
            
            .text-garagem { 
                top: 73%; left: 50%; transform: translateX(-50%); right: auto; font-size: 19vw; z-index: 30; 
            }
        }
      `}} />
      <section className="hero-container bg-black">
        <h1 className="font-serif hero-text text-felipe">FELIPE</h1>
        
        <div className="image-placeholder img-mobile-extra overflow-hidden border-none bg-transparent">
            <img 
              src="https://res.cloudinary.com/utnt7lxo/image/upload/v1787832256/%EF%B8%8FSHOFS_PHOTOGRAPHER_ENSAIO_CORPORATIVO_17__1_Original.jpg" 
              alt="Felipe Garagem" 
              className="w-full h-full object-cover grayscale opacity-90" 
              referrerPolicy="no-referrer"
            />
        </div>

        <div className="image-placeholder img-left overflow-hidden border-none bg-transparent">
            <img 
              src="https://res.cloudinary.com/utnt7lxo/image/upload/v1787832254/IMG_1793.jpg" 
              alt="Tattoo 1" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
        </div>

        <div className="image-placeholder img-right overflow-hidden border-none bg-transparent">
            <img 
              src="https://res.cloudinary.com/utnt7lxo/image/upload/v1787832834/%EF%B8%8FSHOFS_PHOTOGRAPHER_ENSAIO_CORPORATIVO_3__1_Original.jpg" 
              alt="Tattoo 2" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
        </div>

        <h1 className="font-serif hero-text text-garagem">GARAGEM</h1>
      </section>
    </>
  );
}
