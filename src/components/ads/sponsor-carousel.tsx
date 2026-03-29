"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Sponsor {
  id: string;
  name: string;
  tagline: string;
  url: string;
  logo: React.ReactNode;
}

const SPONSORS: Sponsor[] = [
  {
    id: "construdata",
    name: "ConstruData",
    tagline: "Inteligência Operacional para Construção e Saneamento",
    url: "https://www.instagram.com/construdata_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    logo: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/sponsors/construdata-logo.svg"
        alt="ConstruData"
        className="h-16 w-16 rounded-xl"
      />
    ),
  },
  {
    id: "engelfer",
    name: "Engelfer Engenharia",
    tagline: "Projetos e execução em saneamento e infraestrutura hídrica",
    url: "https://www.instagram.com/engelfer_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    logo: (
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#1B3A2B]">
        <svg width={32} height={32} viewBox="0 0 40 40" fill="none">
          <polygon points="20,4 36,13 36,27 20,36 4,27 4,13" stroke="white" strokeWidth="1.5" fill="none" />
          <polygon points="20,10 30,16 30,24 20,30 10,24 10,16" stroke="white" strokeWidth="1" fill="none" opacity="0.6" />
          <rect x="15" y="15" width="10" height="10" stroke="white" strokeWidth="1" fill="none" transform="rotate(45 20 20)" />
        </svg>
      </div>
    ),
  },
];

// Duplicate for seamless loop
const LOOP_SPONSORS = [...SPONSORS, ...SPONSORS, ...SPONSORS];

export function SponsorCarousel() {
  return (
    <div className="w-full">
      <div className="relative mx-auto flex max-w-4xl items-center justify-center">
        <Carousel
          opts={{ loop: true, align: "center" }}
          plugins={[AutoScroll({ playOnInit: true, speed: 0.5, stopOnInteraction: false })]}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {LOOP_SPONSORS.map((sponsor, i) => (
              <CarouselItem
                key={`${sponsor.id}-${i}`}
                className="flex basis-1/2 justify-center pl-0 sm:basis-1/3 md:basis-1/4"
              >
                <a
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-4 flex flex-col items-center gap-2 rounded-xl p-4 transition-opacity hover:opacity-80"
                >
                  {sponsor.logo}
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-800">{sponsor.name}</p>
                    <p className="max-w-[160px] text-[10px] leading-tight text-slate-500">
                      {sponsor.tagline}
                    </p>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-50 to-transparent" />
      </div>
    </div>
  );
}

/** Dark variant for dashboard / authenticated pages */
export function SponsorCarouselDark() {
  return (
    <div className="w-full">
      <div className="relative mx-auto flex max-w-4xl items-center justify-center">
        <Carousel
          opts={{ loop: true, align: "center" }}
          plugins={[AutoScroll({ playOnInit: true, speed: 0.5, stopOnInteraction: false })]}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {LOOP_SPONSORS.map((sponsor, i) => (
              <CarouselItem
                key={`${sponsor.id}-${i}`}
                className="flex basis-1/2 justify-center pl-0 sm:basis-1/3 md:basis-1/4"
              >
                <a
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-4 flex flex-col items-center gap-2 rounded-xl p-4 transition-opacity hover:opacity-80"
                >
                  {sponsor.logo}
                  <div className="text-center">
                    <p className="text-xs font-bold text-text-primary">{sponsor.name}</p>
                    <p className="max-w-[160px] text-[10px] leading-tight text-text-muted">
                      {sponsor.tagline}
                    </p>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-dark-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-dark-bg to-transparent" />
      </div>
    </div>
  );
}
