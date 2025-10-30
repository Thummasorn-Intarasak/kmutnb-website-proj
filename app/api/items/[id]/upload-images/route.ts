import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002/api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const files = formData
      .getAll("images")
      .filter((f) => f instanceof File) as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No image files provided" },
        { status: 400 }
      );
    }

    const backendFormData = new FormData();
    for (const file of files) {
      backendFormData.append("images", file);
    }

    const response = await fetch(
      `${API_BASE_URL}/items/${params.id}/upload-images`,
      {
        method: "PATCH",
        body: backendFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to upload images" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}
