import { createServer, Model, Factory, Response } from "miragejs";
import { faker } from '@faker-js/faker';

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    models: {
      job: Model,
      candidate: Model,
    },

    factories: {
      job: Factory.extend({
        title(i) {
          return `Senior Frontend Developer ${i + 1}`;
        },
        slug(i) {
          return `senior-frontend-developer-${i + 1}`;
        },
        status() {
          return Math.random() > 0.5 ? "active" : "archived";
        },
        order(i) {
          return i;
        },
        tags() {
          return ["React", "JavaScript"];
        }
      }),
      // Added candidate factory
      candidate: Factory.extend({
        name() {
          return faker.person.fullName();
        },
        email() {
          return faker.internet.email().toLowerCase();
        },
        stage() {
          const stages = ["Applied", "Screening", "Interview", "Offer", "Hired"];
          return stages[Math.floor(Math.random() * stages.length)];
        },
        timeline() {
            const initialStage = this.stage || "Applied";
            return [
                { stage: initialStage, date: faker.date.past() }
            ];
        }
      }),
    },
// Seeded 1000 candidates
    seeds(server) {
      server.createList("job", 15);
      server.createList("candidate", 1000);
    },

    routes() {
      this.namespace = "api";
      this.timing = 750;

      // Job routes (existing)
      this.get("/jobs", (schema) => {
        return schema.jobs.all();
      });

      this.get("/jobs/:id", (schema, request) => {
        const id = request.params.id;
        const job = schema.jobs.find(id);
        if (!job) {
          return new Response(404, {}, { error: "Job not found" });
        }
        return job;
      });
      
      this.post("/jobs", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.jobs.create(attrs);
      });

      this.patch("/jobs/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const job = schema.jobs.find(id);
        if (!job) {
          return new Response(404, {}, { error: "Job not found" });
        }
        job.update(attrs);
        return job;
      });

      //New Candidate Routes
      this.get("/candidates", (schema) => {
        return schema.candidates.all();
      });

      this.get("/candidates/:id", (schema, request) => {
          const id = request.params.id;
          const candidate = schema.candidates.find(id);
           if (!candidate) {
          return new Response(404, {}, { error: "Candidate not found" });
        }
        return candidate;
      });

      this.patch("/candidates/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const candidate = schema.candidates.find(id);

        if (!candidate) {
          return new Response(404, {}, { error: "Candidate not found" });
        }

        //timeline add, if stage is changing
        if (attrs.stage && attrs.stage !== candidate.stage) {
            const newTimelineEntry = { stage: attrs.stage, date: new Date() };
            attrs.timeline = [...candidate.timeline, newTimelineEntry];
        }

        candidate.update(attrs);
        return candidate;
      });
    },
  });
}