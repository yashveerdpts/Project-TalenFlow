import Dexie from "dexie";

const db = new Dexie("TalentFlowDB");
db.version(1).stores({
  jobs: "++id, title, slug, status, order",
  candidates: "++id, name, email, stage",
  assessments: "++id, &jobId, title, structure",
  responses: "++id, assessmentId, candidateId, answers"
});

export { db };