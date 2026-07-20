"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import Link from "next/link";
import { Download, ArrowLeft } from "lucide-react";

export default function QRCodePage() {
  const [size, setSize] = useState(256);
  const siteUrl = typeof window !== "undefined" ? `${window.location.origin}/enviar` : "";

  const downloadSVG = () => {
    const svg = document.getElementById("qrcode-svg");
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode-casamento-jony-tainara.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-wedding-blush via-white to-wedding-lavender">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-wedding-purple-light/30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl text-wedding-text">
              Jony <span className="text-wedding-gold">&amp;</span> Tainara
            </span>
          </Link>
          <Link href="/" className="text-sm text-wedding-text-light hover:text-wedding-purple transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Início
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-semibold text-wedding-text mb-2">
            QR Code do Casamento
          </h1>
          <p className="text-wedding-text-light">
            Imprima ou compartilhe para que os convidados enviem fotos 📸
          </p>
        </div>

        {/* QR Code card */}
        <div className="bg-white rounded-3xl shadow-xl border border-wedding-purple-light/30 p-8 md:p-12">
          <div className="flex flex-col items-center">
            {/* QR */}
            <div className="p-6 bg-white rounded-2xl border-4 border-wedding-purple/10 mb-6">
              {siteUrl ? (
                <QRCodeSVG
                  id="qrcode-svg"
                  value={siteUrl}
                  size={size}
                  level="M"
                  marginSize={2}
                  fgColor="#7C3AED"
                />
              ) : (
                <div style={{ width: size, height: size }} className="bg-gray-100 rounded animate-pulse" />
              )}
            </div>

            {/* URL */}
            <div className="w-full mb-6">
              <p className="text-center text-sm text-wedding-text-light mb-2">
                Aponta para:
              </p>
              <div className="bg-wedding-lavender/50 rounded-lg px-4 py-2 text-center">
                <code className="text-sm text-wedding-purple break-all">
                  {siteUrl || "carregando..."}
                </code>
              </div>
            </div>

            {/* Size selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-wedding-text-light">Tamanho:</span>
              {[200, 256, 320, 400].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    size === s
                      ? "bg-wedding-purple text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s}px
                </button>
              ))}
            </div>

            {/* Download */}
            <button
              onClick={downloadSVG}
              className="inline-flex items-center gap-2 px-6 py-3 bg-wedding-purple text-white rounded-full font-medium shadow-lg shadow-wedding-purple/30 hover:bg-wedding-purple-dark transition-all hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Baixar QR Code (SVG)
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 rounded-2xl border-2 border-dashed border-wedding-purple-light bg-wedding-lavender/50">
          <h3 className="font-display text-lg font-medium text-wedding-purple mb-2">
            💡 Como usar
          </h3>
          <ul className="space-y-2 text-sm text-wedding-text-light">
            <li>📱 Baixe o QR Code acima</li>
            <li>🖼️ Coloque em um quadro na entrada do casamento</li>
            <li>💬 Compartilhe o link no grupo do WhatsApp</li>
            <li>💌 Imprima nos convites ou mesas</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
