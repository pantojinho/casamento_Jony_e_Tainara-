import Link from "next/link";
import { Camera, Heart, Upload, QrCode, Sparkles, Clock, ChevronDown } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

// ============ HERO SECTION ============
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-wedding-blush via-white to-wedding-lavender overflow-hidden">
      {/* Decoração de fundo */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-5 text-6xl animate-pulse">💐</div>
        <div className="absolute top-20 right-8 text-5xl">🌸</div>
        <div className="absolute bottom-32 left-10 text-4xl">🌷</div>
        <div className="absolute bottom-20 right-12 text-5xl">💐</div>
        <div className="absolute top-1/3 right-5 text-3xl opacity-50">✨</div>
        <div className="absolute bottom-1/4 left-8 text-3xl opacity-50">✨</div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="mb-8 animate-fade-in-up">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <div className="absolute inset-0 bg-wedding-purple-light/30 rounded-full blur-xl"></div>
            <img
              src="/logo.png"
              alt="Jony & Tainara"
              className="relative w-full h-full object-contain"
            />
          </div>
        </div>

        <p className="font-display text-sm tracking-[0.3em] uppercase text-wedding-gold mb-4 animate-fade-in-up">
          Vamos nos casar!
        </p>

        <h1 className="font-display text-6xl md:text-7xl font-light text-wedding-text mb-2 animate-fade-in-up">
          Jony <span className="text-wedding-gold italic">&amp;</span> Tainara
        </h1>

        <div className="flex items-center gap-4 my-6 animate-fade-in-up-delay-1">
          <div className="h-px w-16 bg-wedding-gold/40"></div>
          <Sparkles className="w-4 h-4 text-wedding-gold" />
          <div className="h-px w-16 bg-wedding-gold/40"></div>
        </div>

        <p className="font-display text-2xl text-wedding-text-light mb-8 animate-fade-in-up-delay-1">
          Compartilhe suas memórias do nosso dia especial
        </p>

        <Link
          href="/enviar"
          className="group relative inline-flex items-center gap-2 px-8 py-4 bg-wedding-purple text-white rounded-full font-medium shadow-lg shadow-wedding-purple/30 hover:shadow-xl hover:shadow-wedding-purple/40 hover:bg-wedding-purple-dark transition-all duration-300 hover:scale-105 animate-fade-in-up-delay-2"
        >
          <Camera className="w-5 h-5" />
          <span>Enviar fotos e vídeos</span>
        </Link>

        <p className="mt-4 text-sm text-wedding-text-light animate-fade-in-up-delay-2">
          Não precisa de login nem cadastro ✨
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-wedding-text-light/50" />
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
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-wedding-text mb-3">
            Como funciona
          </h2>
          <p className="text-wedding-text-light text-lg">
            Três passos simples para guardar memórias inesquecíveis
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="group relative bg-white rounded-2xl p-7 shadow-sm border border-wedding-purple-light/30 hover:shadow-lg hover:border-wedding-purple/30 transition-all duration-300"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Number badge */}
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

        {/* Dashed box - storage notice */}
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

// ============ CTA SECTION ============
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
