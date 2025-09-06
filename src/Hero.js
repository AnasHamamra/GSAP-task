import React, { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";

if (typeof window != "undefined" && gsap && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

function useSplitWords(text) {
  return useMemo(
    () =>
      text.split(/(\s+)/).map((chunk, i) => ({
        key: i,
        text: chunk,
        isSpace: /\s+/.test(chunk),
      })),
    [text]
  );
}

export default function Hero({
  backgroundUrl = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
  headline = "Welcome to Our Website",
  subheadline = "We build amazing experiences",
  ctaText = "Get Started"
}) {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const h1Ref = useRef(null);
  const pRef = useRef(null);
  const btnRef = useRef(null);
  const logoRef = useRef(null);
  const floatRefs = useRef([]);

  const words = useSplitWords(headline);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(h1Ref.current.querySelectorAll(".word"), { opacity: 0, x: -100 });
      gsap.set(pRef.current, { opacity: 0, y: 30 });
      gsap.set(btnRef.current, { scale: 0 });
      gsap.set(bgRef.current, { scale: 1.2 });
      gsap.set(logoRef.current.querySelectorAll("path"), { strokeDasharray: 300, strokeDashoffset: 300 });

      const tl = gsap.timeline({ defaults: { duration: 1, ease: "power4.out" } });

      tl.to(logoRef.current.querySelectorAll("path"), {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.out",
        stagger: 0.2,
      });

      tl.to(bgRef.current, { scale: 1, duration: 1.2, ease: "power2.out" }, "-=1.5");

      const wordEls = h1Ref.current.querySelectorAll(".word");
      if (wordEls && wordEls.length) {
        tl.to(wordEls, { x: 0, opacity: 1, stagger: 0.06 }, "-=0.5");
      } else {
        tl.fromTo(
          h1Ref.current,
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1 },
          "-=0.5"
        );
      }

      tl.to(pRef.current, { opacity: 1, y: 0 }, ">-0.2");

      tl.to(
        btnRef.current,
        { scale: 1.1, duration: 0.8, ease: "elastic.out(1, 0.5)" },
        ">-0.1"
      ).to(btnRef.current, { scale: 1, duration: 0.25 }, ">-0.2");

      floatRefs.current.forEach((el, i) => {
        if (!el) return;
        const amplitude = 15 + i * 5;
        const duration = 4 + i * 0.7;
        gsap.to(el, {
          y: `+=${amplitude}`,
          x: `+=${i % 2 === 0 ? 6 : -6}`,
          repeat: -1,
          yoyo: true,
          duration,
          ease: "sine.inOut",
        });
      });

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          gsap.to(bgRef.current, { opacity: 1 - self.progress, overwrite: true });
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero-section">
      <div
        ref={bgRef}
        className="hero-background"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />

      <svg
        ref={logoRef}
        className="hero-logo"
        width="120"
        height="120"
        viewBox="0 0 200 200"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
      >
        <path d="M20 100 C50 10, 150 10, 180 100 S150 190, 100 180 Z" />
        <path d="M60 100 Q100 30, 140 100 Q100 170, 60 100 Z" />
      </svg>

      <div className="floating-shapes">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (floatRefs.current[i] = el)}
            className="floating-shape"
            style={{
              width: 120 + i * 15,
              height: 120 + i * 15,
              left: `${10 + i * 16}%`,
              top: `${15 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="hero-content">
        <h1 ref={h1Ref} className="hero-headline">
          {words.map(({ key, text, isSpace }) =>
            isSpace ? (
              <span key={key}>&nbsp;</span>
            ) : (
              <span key={key} className="word">
                {text}
              </span>
            )
          )}
        </h1>

        <p ref={pRef} className="hero-subheadline">
          {subheadline}
        </p>

        <button ref={btnRef} className="cta-button">
          {ctaText}
        </button>
      </div>
    </section>
  );
}
