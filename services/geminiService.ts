export async function parseCourseInput(input: string) {
  const res = await fetch("/api/parseCourse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });

  return res.json();
}
