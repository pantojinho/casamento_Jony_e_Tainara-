import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 60;

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "1vV05GlbzYVhn1RTXQE_vbPXPB4p4IywB";

async function getAuthenticatedClient() {
  // Tentar ler arquivos de credenciais locais primeiro (dev local)
  let clientSecret: any;
  let token: any;

  try {
    const baseDir = process.cwd();
    const tokenPath = path.join(baseDir, "google_token.json");
    const secretPath = path.join(baseDir, "google_client_secret.json");

    token = JSON.parse(await readFile(tokenPath, "utf-8"));
    clientSecret = JSON.parse(await readFile(secretPath, "utf-8"));
  } catch {
    // Fallback para variáveis de ambiente (Vercel)
    token = process.env.GOOGLE_TOKEN_JSON ? JSON.parse(process.env.GOOGLE_TOKEN_JSON) : null;
    clientSecret = process.env.GOOGLE_CLIENT_SECRET_JSON
      ? JSON.parse(process.env.GOOGLE_CLIENT_SECRET_JSON)
      : null;
  }

  if (!token || !clientSecret) {
    throw new Error("Google credentials not configured");
  }

  const secretKey = Object.keys(clientSecret)[0];
  const { client_id, client_secret, redirect_uris } = clientSecret[secretKey];

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris?.[0] || "http://localhost:1");
  oAuth2Client.setCredentials(token);

  // Auto-refresh se expirado
  if (token.expiry_date && token.expiry_date < Date.now() + 60000 && token.refresh_token) {
    const { credentials } = await oAuth2Client.refreshAccessToken();
    oAuth2Client.setCredentials(credentials);
  }

  return google.drive({ version: "v3", auth: oAuth2Client });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = (formData.get("name") as string) || "Convidado";
    const message = (formData.get("message") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Validar tamanho (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "Arquivo muito grande (máx 100MB)" }, { status: 413 });
    }

    const drive = await getAuthenticatedClient();

    // Sanitizar nome do convidado
    const safeName = name.replace(/[^a-zA-Z0-9à-úÀ-Ú\s]/g, "").trim() || "Convidado";
    const dateStr = new Date().toISOString().split("T")[0];

    // Criar subpasta do convidado se não existir
    const folderName = `${safeName} - ${dateStr}`;
    let subFolderId: string | undefined;

    // Buscar pasta existente
    try {
      const existing = await drive.files.list({
        q: `name='${folderName}' and '${FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: "files(id, name)",
      });
      if (existing.data.files && existing.data.files.length > 0 && existing.data.files[0].id) {
        subFolderId = existing.data.files[0].id;
      }
    } catch {
      // Se der erro de busca, usa a pasta principal
    }

    // Criar subpasta se não existir
    if (!subFolderId) {
      try {
        const folder = await drive.files.create({
          requestBody: {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
            parents: [FOLDER_ID],
          },
          fields: "id",
        });
        subFolderId = folder.data.id || undefined;
      } catch {
        // Se não conseguir criar subpasta, usa a pasta principal
      }
    }

    // Preparar upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "";
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;

    // Upload via resumable para arquivos grandes
    const { Readable } = await import("stream");
    const stream = Readable.from(buffer);

    const uploadResult = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: subFolderId ? [subFolderId] : [FOLDER_ID],
        description: message ? `De: ${safeName} — ${message}` : `De: ${safeName}`,
      },
      media: {
        mimeType: file.type || "application/octet-stream",
        body: stream,
      },
      fields: "id, name, webViewLink",
    });

    // Log para debug
    console.log(`✅ Upload: ${fileName} (${(file.size / 1024 / 1024).toFixed(2)}MB) by ${safeName}`);

    return NextResponse.json({
      ok: true,
      fileId: uploadResult.data.id,
      fileName: uploadResult.data.name,
    });
  } catch (error: any) {
    console.error("❌ Upload error:", error.message);
    return NextResponse.json(
      { error: error.message || "Erro ao enviar arquivo" },
      { status: 500 }
    );
  }
}
