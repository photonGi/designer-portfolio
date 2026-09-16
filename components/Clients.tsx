"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";

const clients = [
  { src: "/images/clients/client1.png", alt: "Client logo 1", width: 48, height: 40 },
  { src: "/images/clients/client2.png", alt: "UnumPay", width: 125, height: 30 },
  { src: "/images/clients/client3.png", alt: "Client logo 3", width: 27, height: 40 },
  { src: "/images/clients/client4.png", alt: "Panopto", width: 118, height: 30 },
  { src: "/images/clients/client5.png", alt: "Nishat", width: 44, height: 40 },
  { src: "/images/clients/client6.png", alt: "Airkart", width: 100, height: 30 },
  { src: "/images/clients/client7.png", alt: "Client logo 7", width: 69, height: 30 },
  { src: "/images/clients/client8.png", alt: "Client logo 8", width: 131, height: 20 },
  { src: "/images/clients/client9.png", alt: "Client logo 9", width: 141, height: 30 },
  { src: "/images/clients/client10.png", alt: "Client logo 10", width: 66, height: 40 },
  { src: "/images/clients/client11.png", alt: "Client logo 11", width: 141, height: 30 },
  { src: "/images/clients/client12.png", alt: "Client logo 12", width: 97, height: 30 },
] as const;

function LogoRow({
  ariaHidden,
  animate,
}: {
  ariaHidden?: boolean;
  animate: boolean;
}) {
  return (
    <ul
      className={`flex shrink-0 items-center gap-[72px] px-10 md:gap-[140px] md:px-10 ${
        animate ? "animate-clients-marquee" : ""
      }`}
      aria-hidden={ariaHidden || undefined}
    >
      {clients.map((client) => (
        <li
          key={`${ariaHidden ? "b" : "a"}-${client.src}`}
          className="relative flex shrink-0 items-center"
          style={{ width: client.width, height: client.height }}
        >
          <Image
            src={client.src}
            alt={ariaHidden ? "" : client.alt}
            width={client.width}
            height={client.height}
            unoptimized
            className="client-logo h-full w-full object-contain"
          />
        </li>
      ))}
    </ul>
  );
}

export default function Clients() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative flex w-full items-center overflow-hidden py-10 md:min-h-[120px] md:py-10"
      aria-label="Clients"
    >
      <div className="flex w-max items-center">
        <LogoRow animate={!reduceMotion} />
        <LogoRow ariaHidden animate={!reduceMotion} />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[100px] bg-gradient-to-r from-background from-[14%] to-transparent md:w-[200px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[100px] bg-gradient-to-l from-background from-[14%] to-transparent md:w-[200px]"
      />
    </section>
  );
}
