"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, CheckCircle, Loader2, Camera, Video, AlertCircle } from "lucide-react";
import Link from "next/link";

interface FileItem {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif",
  "video/mp4", "video/quicktime", "video/webm", "video/3gpp",
];

export default function UploadPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [globalUploading, setGlobalUploading] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) return "Arquivo muito grande (máx 100MB)";
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const validExts = ["jpg", "jpeg", "png", "webp", "gif", "heic", "heif", "mp4", "mov", "webm", "3gp"];
    if (!ACCEPTED_TYPES.includes(file.type) && !validExts.includes(ext)) {
      return "Tipo de arquivo não suportado";
    }
    return null;
  };

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles);
    const items: FileItem[] = [];

    for (const file of arr) {
      const err = validateFile(file);
      const isImage = file.type.startsWith("image/");
      const preview = isImage ? URL.createObjectURL(file) : "";
      items.push({
        file,
        preview,
        status: err ? "error" : "pending",
        progress: 0,
        error: err || undefined,
      });
    }

    setFiles((prev) => [...prev, ...items]);
    setAllDone(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => {
      const item = prev[idx];
      if (item.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const uploadSingleFile = async (item: FileItem, idx: number, guestName: string): Promise<void> => {
    setFiles((prev) => prev.map((f, i) => i === idx ? { ...f, status: "uploading", progress: 10 } : f));

    try {
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("name", guestName || "Convidado");
      formData.append("message", message);

      const xhr = new XMLHttpRequest();
      
      const result = await new Promise<{ ok: boolean; error?: string }>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 90) + 10;
            setFiles((prev) => prev.map((f, i) => i === idx ? { ...f, progress } : f));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            resolve({ ok: true });
          } else {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({ ok: false, error: data.error || "Erro no upload" });
            } catch {
              resolve({ ok: false, error: "Erro no upload" });
            }
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Falha de conexão")));
        xhr.addEventListener("abort", () => reject(new Error("Cancelado")));

        xhr.open("POST", "/api/upload");
        xhr.send(formData);
      });

      setFiles((prev) => prev.map((f, i) =>
        i === idx
          ? { ...f, status: result.ok ? "done" : "error", progress: 100, error: result.error }
          : f
      ));
    } catch (err: any) {
      setFiles((prev) => prev.map((f, i) =>
        i === idx ? { ...f, status: "error", error: err.message } : f
      ));
    }
  };

  const handleUploadAll = async () => {
    const pending = files.filter((f) => f.status === "pending");
    if (pending.length === 0) return;

    setGlobalUploading(true);
    setAllDone(false);

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === "pending") {
        await uploadSingleFile(files[i], i, name);
      }
    }

    setGlobalUploading(false);
    setAllDone(true);
  };

  const resetAll = () => {
    files.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview); });
    setFiles([]);
    setName("");
    setMessage("");
    setAllDone(false);
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const doneCount = files.filter((f) => f.status === "done").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-wedding-blush via-white to-wedding-lavender">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-wedding-purple-light/30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl text-wedding-text">
              Jony <span className="text-wedding-gold">&amp;</span> Tainara
            </span>
          </Link>
          <Link href="/" className="text-sm text-wedding-text-light hover:text-wedding-purple transition-colors">
            ← Voltar
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {!allDone ? (
          <>
            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-wedding-purple/10 mb-3">
                <Camera className="w-7 h-7 text-wedding-purple" />
              </div>
              <h1 className="font-display text-3xl font-semibold text-wedding-text mb-1">
                Envie suas fotos e vídeos
              </h1>
              <p className="text-wedding-text-light text-sm">
                Compartilhe os momentos que você capturou do casamento 💜
              </p>
            </div>

            {/* Name input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-wedding-text mb-1.5">
                Seu nome <span className="text-wedding-text-light font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Maria Silva"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-wedding-purple/30 focus:border-wedding-purple/50 transition-all text-wedding-text placeholder:text-gray-400"
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-wedding-text mb-1.5">
                Mensagem para os noivos <span className="text-wedding-text-light font-normal">(opcional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Deixe um carinho especial..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-wedding-purple/30 focus:border-wedding-purple/50 transition-all text-wedding-text placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
              className={`
                relative cursor-pointer rounded-2xl border-2 border-dashed p-10
                transition-all duration-300 text-center
                ${isDragging
                  ? "border-wedding-purple bg-wedding-purple/5 scale-[1.02]"
                  : "border-gray-300 bg-white hover:border-wedding-purple/50 hover:bg-wedding-lavender/30"
                }
              `}
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*,video/*,.heic,.heif"
                onChange={(e) => e.target.files && addFiles(e.target.files)}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div className={`
                  flex items-center justify-center w-14 h-14 rounded-full
                  ${isDragging ? "bg-wedding-purple text-white" : "bg-wedding-purple-light/50 text-wedding-purple"}
                  transition-all duration-300
                `}>
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-wedding-text font-medium">
                    {isDragging ? "Solte aqui!" : "Arraste ou toque para selecionar"}
                  </p>
                  <p className="text-sm text-wedding-text-light mt-1">
                    Fotos e vídeos • máx 100MB por arquivo
                  </p>
                </div>
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-wedding-text">
                    {files.length} arquivo{files.length > 1 ? "s" : ""}
                    {pendingCount > 0 && <span className="text-wedding-text-light"> • {pendingCount} pendente{pendingCount > 1 ? "s" : ""}</span>}
                  </h3>
                  <button
                    onClick={() => setFiles([])}
                    className="text-sm text-wedding-text-light hover:text-red-500 transition-colors"
                  >
                    Limpar tudo
                  </button>
                </div>

                {files.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    {/* Preview */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {item.preview ? (
                        <img src={item.preview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Video className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-wedding-text truncate">
                        {item.file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-wedding-text-light">
                          {(item.file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                        {item.status === "uploading" && (
                          <span className="text-xs text-wedding-purple">{item.progress}%</span>
                        )}
                        {item.status === "done" && (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Enviado!
                          </span>
                        )}
                        {item.status === "error" && (
                          <span className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {item.error}
                          </span>
                        )}
                      </div>
                      {item.status === "uploading" && (
                        <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-wedding-purple rounded-full transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    {item.status !== "uploading" && (
                      <button
                        onClick={() => removeFile(idx)}
                        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {item.status === "uploading" && (
                      <Loader2 className="w-4 h-4 text-wedding-purple animate-spin flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            {pendingCount > 0 && (
              <button
                onClick={handleUploadAll}
                disabled={globalUploading}
                className={`
                  w-full mt-6 py-4 rounded-xl font-medium transition-all duration-300
                  ${globalUploading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-wedding-purple text-white hover:bg-wedding-purple-dark shadow-lg shadow-wedding-purple/30 hover:scale-[1.02]"
                  }
                `}
              >
                {globalUploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5" />
                    Enviar {pendingCount} arquivo{pendingCount > 1 ? "s" : ""}
                  </span>
                )}
              </button>
            )}
          </>
        ) : (
          /* SUCCESS SCREEN */
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-5 animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="font-display text-3xl font-semibold text-wedding-text mb-2">
              {doneCount > 0 ? `Obrigado${name ? `, ${name}` : ""}! 💜` : "Ops!"}
            </h2>
            <p className="text-wedding-text-light max-w-md mb-6">
              {doneCount > 0
                ? `${doneCount} arquivo${doneCount > 1 ? "s" : ""} enviado${doneCount > 1 ? "s" : ""} com sucesso! Jony e Tainara vão amar.`
                : "Nenhum arquivo foi enviado. Tente novamente."}
            </p>
            {errorCount > 0 && (
              <p className="text-sm text-red-500 mb-4">
                {errorCount} arquivo{errorCount > 1 ? "s" : ""} falhou{errorCount > 1 ? "ram" : ""}. Você pode tentar novamente.
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={resetAll}
                className="px-6 py-3 bg-wedding-purple text-white rounded-full font-medium shadow-lg shadow-wedding-purple/30 hover:bg-wedding-purple-dark transition-all hover:scale-105"
              >
                Enviar mais fotos
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-white text-wedding-purple rounded-full font-medium border-2 border-wedding-purple/20 hover:border-wedding-purple/40 transition-all"
              >
                Voltar ao início
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
