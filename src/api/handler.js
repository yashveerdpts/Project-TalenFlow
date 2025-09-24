import { setupWorker } from "msw/browser";
import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";

const jobs = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `Senior Frontend Developer ${i + 1}`,
  slug: `senior-frontend-developer-${i + 1}`,
  status: Math.random() > 0.5 ? "active" : "archived",
  order: i,
  tags: ["React", "JavaScript"],
}));

const candidates = Array.from({ length: 1000 }, (_, i) => {
  const stage = faker.helpers.arrayElement([
    "Applied",
    "Screening",
    "Interview",
    "Offer",
    "Hired",
  ]);
  return {
    id: i + 1,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    stage,
    timeline: [{ stage, date: faker.date.past() }],
  };
});

export const handlers = [
  // Jobs
  http.get("/api/jobs", () => HttpResponse.json({ jobs })),
  http.get("/api/jobs/:id", ({ params }) => {
    const job = jobs.find((j) => j.id === Number(params.id));
    return job
      ? HttpResponse.json(job)
      : HttpResponse.json({ error: "Job not found" }, { status: 404 });
  }),

  // Candidates
  http.get("/api/candidates", () => HttpResponse.json({ candidates })),
  http.get("/api/candidates/:id", ({ params }) => {
    const candidate = candidates.find((c) => c.id === Number(params.id));
    return candidate
      ? HttpResponse.json(candidate)
      : HttpResponse.json({ error: "Candidate not found" }, { status: 404 });
  }),
];

export const worker = setupWorker(...handlers);
