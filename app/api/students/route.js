import { getStudents } from "@/data/students.js";

// Always run on each request (not cached at build time), like a real DB-backed endpoint.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const students = await getStudents();
    return Response.json({ students });
  } catch (error) {
    console.error("GET /api/students failed:", error);
    return Response.json(
      { error: "Could not load students. Please try again." },
      { status: 500 }
    );
  }
}
