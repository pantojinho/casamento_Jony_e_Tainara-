"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Camera, Heart, Upload, QrCode, Sparkles, Clock, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

// ============ PHOTO CAROUSEL ============
const PHOTOS = Array.from({ length: 20 }, (_, i) => `/photos/couple-${String(i + 1).padStart(2, "0")}.jpg`);

function PhotoCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % PHOTOS.length), []);
  const prev = useCallback(() => setCurrent((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length), []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  // Preload next few images
  useEffect(() => {
    const preload = (idx: number) => {
      const img = new Image();
      img.src = PHOTOS[idx];
    };
    preload((current + 1) % PHOTOS.length);
    preload((current + 2) % PHOTOS.length);
  }, [current]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Photos */}
      {PHOTOS.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={src}
            alt={`Jony e Tainara - Foto ${i + 1}`}
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-wedding-purple/20 via-transparent to-wedding-gold/20" />

      {/* Navigation arrows */}
      <button
        onClick={(e) => { e.preventDefault(); prev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
        aria-label="Foto anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); next(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
        aria-label="Próxima foto"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); setCurrent(i); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-white w-6 shadow-md"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ============ HERO SECTION ============
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Photo carousel background */}
      <PhotoCarousel />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="mb-6 animate-fade-in-up">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-4">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
            <img
              src="/logo.png"
              alt="Jony & Tainara"
              className="relative w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <p className="font-display text-sm tracking-[0.3em] uppercase text-wedding-gold-light mb-4 animate-fade-in-up drop-shadow-lg">
          Vamos nos casar!
        </p>

        <h1 className="font-display text-5xl md:text-7xl font-light text-white mb-2 animate-fade-in-up drop-shadow-2xl">
          Jony <span className="text-wedding-gold-light italic">&amp;</span> Tainara
        </h1>

        <div className="flex items-center gap-4 my-5 animate-fade-in-up-delay-1">
          <div className="h-px w-16 bg-white/40"></div>
          <Sparkles className="w-4 h-4 text-wedding-gold-light" />
          <div className="h-px w-16 bg-white/40"></div>
        </div>

        <p className="font-display text-xl md:text-2xl text-white/90 mb-8 animate-fade-in-up-delay-1 drop-shadow-lg">
          Compartilhe suas memórias do nosso dia especial
        </p>

        <Link
          href="/enviar"
          className="group relative inline-flex items-center gap-2 px-8 py-4 bg-wedding-purple text-white rounded-full font-medium shadow-lg shadow-wedding-purple/30 hover:shadow-xl hover:shadow-wedding-purple/40 hover:bg-wedding-purple-dark transition-all duration-300 hover:scale-105 animate-fade-in-up-delay-2 backdrop-blur-sm"
        >
          <Camera className="w-5 h-5" />
          <span>Enviar fotos e vídeos</span>
        </Link>

        <p className="mt-4 text-sm text-white/70 animate-fade-in-up-delay-2 drop-shadow">
          Não precisa de login nem cadastro ✨
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/50" />
      </div>
    </section>
  );
}

// ============ HOW IT WORKS ============
function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Crie seu álbum",
      description: "Escolha um nome, uma data e adicione sua foto de capa.",
      icon: "📸",
    },
    {
      number: 2,
      title: "Compartilhe o link",
      description: "Seus convidados enviam fotos e vídeos pelo QR Code ou link.",
      icon: "🔗",
    },
    {
      number: 3,
      title: "Reviva cada lembrança",
      description: "Tudo fica salvo no seu painel, pronto para baixar.",
      icon: "💚",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-wedding-cream">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-wedding-text mb-3">
            Como funciona
          </h2>
          <p className="text-wedding-text-light text-lg">
            Três passos simples para guardar memórias inesquecíveis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="group relative bg-white rounded-2xl p-7 shadow-sm border border-wedding-purple-light/30 hover:shadow-lg hover:border-wedding-purple/30 transition-all duration-300"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-wedding-purple text-white font-bold text-sm shadow-md shadow-wedding-purple/30">
                  {step.number}
                </div>
                <span className="text-2xl">{step.icon}</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-wedding-text mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-wedding-text-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center gap-4 p-6 rounded-2xl border-2 border-dashed border-wedding-purple-light bg-wedding-lavender/50">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-wedding-purple-light/50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-wedding-purple" />
            </div>
            <div>
              <p className="font-display text-lg italic text-wedding-purple font-medium">
                Suas fotos ficam salvas por 1 ano
              </p>
              <p className="text-sm text-wedding-text-light mt-1">
                Prazo garantido para você baixar e guardar suas memórias onde quiser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ CTA ============
function CallToAction() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-wedding-cream to-wedding-lavender">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-wedding-purple/10 mb-6">
          <Heart className="w-8 h-8 text-wedding-purple" fill="currentColor" />
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-light text-wedding-text mb-4">
          Cada momento é único
        </h2>
        <p className="text-wedding-text-light text-lg mb-8 max-w-xl mx-auto">
          Ajude-nos a eternizar este dia. Suas fotos e vídeos farão parte da nossa história para sempre.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/enviar"
            className="inline-flex items-center gap-2 px-8 py-4 bg-wedding-purple text-white rounded-full font-medium shadow-lg shadow-wedding-purple/30 hover:shadow-xl hover:bg-wedding-purple-dark transition-all duration-300 hover:scale-105"
          >
            <Upload className="w-5 h-5" />
            <span>Enviar agora</span>
          </Link>
          <Link
            href="/qrcode"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-wedding-purple rounded-full font-medium border-2 border-wedding-purple/20 hover:border-wedding-purple/40 hover:bg-wedding-lavender/50 transition-all duration-300"
          >
            <QrCode className="w-5 h-5" />
            <span>Ver QR Code</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="py-8 px-4 bg-wedding-text">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-display text-2xl text-white mb-1">
          Jony <span className="text-wedding-gold">&amp;</span> Tainara
        </p>
        <p className="text-white/60 text-sm">
          Feito com 💜 para o nosso casamento
        </p>
      </div>
    </footer>
  );
}

// ============ PAGE ============
export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </main>
  );
}
