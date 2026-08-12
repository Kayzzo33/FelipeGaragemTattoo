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
            z-index: 10;
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
            .text-felipe { font-size: 15vw; }
            .text-garagem { font-size: 13vw; right: 2%; }
            .img-left { width: 28%; }
            .img-right { width: 38%; }
        }
        @media (max-width: 768px) {
            .hero-container { min-height: 120vh; }
            .text-felipe { top: 10%; left: 4%; font-size: 26vw; z-index: 10; }
            
            .img-mobile-extra { 
                display: flex; 
                top: 20%; left: 8%; width: 55%; aspect-ratio: 2 / 3.2; z-index: 20; 
            }
            .img-right { 
                top: 28%; right: 8%; width: 45%; aspect-ratio: 1 / 1.1; z-index: 25; 
            }
            .img-left { 
                top: 52%; left: 35%; width: 50%; aspect-ratio: 4 / 3; z-index: 22; 
            }
            
            .text-garagem { 
                top: 65%; left: 50%; transform: translateX(-50%); font-size: 19vw; z-index: 30; 
            }
        }
        @media (max-width: 480px) {
            .hero-container { min-height: 125vh; }
            .text-felipe { top: 10%; left: 4%; font-size: 28vw; z-index: 10; }
            
            .img-mobile-extra { 
                top: 22%; left: 6%; width: 52%; aspect-ratio: 2 / 3.2; z-index: 20; 
            }
            .img-right { 
                top: 30%; right: 6%; width: 48%; aspect-ratio: 1 / 1.1; z-index: 25; 
            }
            .img-left { 
                top: 54%; left: 40%; width: 55%; aspect-ratio: 5 / 4; z-index: 22; 
            }
            
            .text-garagem { 
                top: 68%; left: 50%; transform: translateX(-50%); right: auto; font-size: 20vw; z-index: 30; 
            }
        }
      `}} />
      <section className="hero-container bg-black">
        <h1 className="font-serif hero-text text-felipe">FELIPE</h1>
        
        <div className="image-placeholder img-mobile-extra overflow-hidden border-none bg-transparent">
            <img src="https://drive.google.com/thumbnail?sz=w1000&id=1JzMcw8v4_ca_zAGb389GXLaewK6bhVVE" alt="Felipe Garagem" className="w-full h-full object-cover grayscale opacity-90" />
        </div>

        <div className="image-placeholder img-left overflow-hidden border-none bg-transparent">
            <img src="https://drive.google.com/thumbnail?sz=w1000&id=1ZqLIPK_0ZR9J7pRKDFqZELoLdMmVY04K" alt="Tattoo 1" className="w-full h-full object-cover" />
        </div>

        <div className="image-placeholder img-right overflow-hidden border-none bg-transparent">
            <img src="https://drive.google.com/thumbnail?sz=w1000&id=1gZfeRr3HwzlvicqKPiJJ6breEuS6fdQg" alt="Tattoo 2" className="w-full h-full object-cover" />
        </div>

        <h1 className="font-serif hero-text text-garagem">GARAGEM</h1>
      </section>
    </>
  );
}
