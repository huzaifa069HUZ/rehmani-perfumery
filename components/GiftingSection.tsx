'use client';

import { 
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover 
} from "@/components/ui/animated-slideshow";
import { SparklesText } from "@/components/ui/sparkles-text";

const SLIDES = [
  {
    id: "gifting-corporate",
    title: "CORPORATE GIFTING",
    imageUrl: "/assets/corporate%20gifting.png",
  },
  {
    id: "gifting-wedding",
    title: "WEDDING FAVOURS",
    imageUrl: "/assets/wedding%20gift.png",
  },
  {
    id: "gifting-celebrations",
    title: "CELEBRATIONS",
    imageUrl: "/assets/gift-poster-2.png",
  },
  {
    id: "gifting-partners",
    title: "GIFTS FOR PARTNERS",
    imageUrl: "/assets/love%20gift.png",
  },
];

export default function GiftingSection() {
  return (
    <HoverSlider className="relative min-h-[90vh] py-24 md:py-32 flex flex-col justify-center px-4 md:px-8 lg:px-12 bg-[#fcf8f2] border-y border-[#d3a958]/20 overflow-hidden">
      
      {/* ── Arabic Geometric Minimalist Pattern Background (Peach/Beige Theme) ── */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
          opacity: 0.25,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23e6d1b8' stroke-width='0.7'%3E%3Cpolygon points='40,4 76,22 76,58 40,76 4,58 4,22'/%3E%3Cpolygon points='40,14 66,28 66,52 40,66 14,52 14,28'/%3E%3Cpolygon points='40,24 56,32 56,48 40,56 24,48 24,32'/%3E%3Cline x1='40' y1='4' x2='40' y2='24'/%3E%3Cline x1='76' y1='22' x2='56' y2='32'/%3E%3Cline x1='76' y1='58' x2='56' y2='48'/%3E%3Cline x1='40' y1='76' x2='40' y2='56'/%3E%3Cline x1='4' y1='58' x2='24' y2='48'/%3E%3Cline x1='4' y1='22' x2='24' y2='32'/%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }} 
      />

      {/* Subtle radial masking blending natively into the peach/beige bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#fcf8f2_80%)] pointer-events-none z-0" />

      <div className="container mx-auto max-w-[90rem] relative z-10 w-full">
        
        {/* Header - Dark bold font against light beige */}
        <div className="mb-14 lg:mb-20 flex flex-col md:flex-row items-center gap-4 md:gap-8 justify-center">
          <span className="hidden md:block w-16 md:w-32 h-[2px] bg-[#d3a958]" />
          <SparklesText 
            text="The Art Of Gifting" 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-sans font-black tracking-tight text-[#2b1f13] uppercase text-center md:text-left drop-shadow-sm"
            colors={{ first: "#d3a958", second: "#b8860b" }}
          />
          <span className="w-16 md:hidden h-[2px] bg-[#d3a958]" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Navigation */}
          <div className="lg:col-span-8 flex flex-col gap-0 md:gap-0 w-full relative z-20 overflow-visible">
            {SLIDES.map((slide, index) => (
              <div key={slide.id} className="w-full">
                <TextStaggerHover
                  index={index}
                  // Mobile text shrunk elegantly to prevent viewport clipping. Added touch responsiveness.
                  className="cursor-pointer text-[1.4rem] min-[400px]:text-[1.7rem] sm:text-[2.4rem] md:text-[3.2rem] lg:text-[3.8rem] xl:text-[4.5rem] font-sans font-black uppercase tracking-tighter text-[#1f1a14]/60 hover:text-[#b8860b] transition-colors duration-500 whitespace-nowrap pl-4 pr-12 -ml-4 -mr-12 py-0 w-full block"
                  text={slide.title}
                />
              </div>
            ))}
          </div>
          
          {/* Right Imagery Viewer - Rich shadow and border for light backgrounds */}
          <div className="lg:col-span-4 w-full flex justify-center lg:justify-end relative z-10 mt-10 lg:mt-0">
            <HoverSliderImageWrap className="w-full max-w-[280px] sm:max-w-xs lg:max-w-full aspect-[4/5] lg:aspect-[3/4] object-cover rounded-xl shadow-[0_25px_60px_rgba(43,31,19,0.15)] border-[3px] border-[#e8dfcf] ml-auto">
              {SLIDES.map((slide, index) => (
                <div key={slide.id} className="relative w-full h-full">
                  <HoverSliderImage
                    index={index}
                    imageUrl={slide.imageUrl}
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                  {/* Subtle warm tint to marry the photo with the nude/peach bg */}
                  <div className="absolute inset-0 bg-[#d3a958]/5 mix-blend-multiply pointer-events-none" />
                </div>
              ))}
            </HoverSliderImageWrap>
          </div>

        </div>
      </div>
    </HoverSlider>
  );
}
