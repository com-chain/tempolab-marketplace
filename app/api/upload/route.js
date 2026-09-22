import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Seules les images (JPEG, PNG, WEBP, GIF) sont acceptées." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "L'image ne doit pas dépasser 5 Mo." },
      { status: 400 }
    );
  }

  const extension = file.name.split(".").pop();
  const pathname = `products/${session.user.id}-${Date.now()}.${extension}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}
