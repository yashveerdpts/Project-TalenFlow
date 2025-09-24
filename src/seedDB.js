import { db } from './dexieDB';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';

const JOB_COUNT = 25;
const CANDIDATE_COUNT = 1000;
const ASSESSMENT_COUNT = 3;

const STAGES = ["Applied", "Screening", "Interview", "Offer", "Hired" ,"Rejected"];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedJobs = async () => {
  const jobs = [];
  for (let i = 0; i < JOB_COUNT; i++) {
    const title = faker.person.jobTitle();
    jobs.push({
      title: title,
      slug: faker.helpers.slugify(title).toLowerCase(),
      status: getRandom(['active', 'archived']),
      order: Date.now() - i * 1000,
      createdAt: faker.date.past(),
      tags: faker.helpers.arrayElements(['Remote', 'Full-time', 'Engineering', 'Marketing', 'Senior'], { min: 1, max: 3 }),
    });
  }
  await db.jobs.bulkAdd(jobs);
  console.log(`${JOB_COUNT} jobs seeded.`);
  return await db.jobs.toArray();
};

const seedCandidates = async (createdJobs) => {
  const candidates = [];
  const jobIds = createdJobs.map(j => j.id);
  for (let i = 0; i < CANDIDATE_COUNT; i++) {
    const stage = getRandom(STAGES);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    candidates.push({
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }),
      stage: stage,
      jobId: getRandom(jobIds),
      timeline: [{ stage: stage, date: faker.date.past().toISOString() }],
      notes: [], 
    });
  }
  await db.candidates.bulkAdd(candidates);
  console.log(`${CANDIDATE_COUNT} candidates seeded.`);
};

const generateQuestion = (type) => {
  const sampleQuestions = [
    "How would you rate your experience with React?",
    "Describe a challenging project you've worked on.",
    "What is your preferred method for state management?",
    "How do you handle tight deadlines and pressure?",
    "Walk me through your process for debugging a complex issue.",
    "What are your long-term career goals?",
    "How do you stay up-to-date with new technologies?"
  ];

  const question = {
    id: nanoid(),
    text: getRandom(sampleQuestions),
    type: type,
    options: [],
    validation: { required: faker.datatype.boolean() },
    conditional: { dependsOn: null, showIfValue: '' },
  };
  
  if (type === 'single-choice' || type === 'multi-choice') {
    question.options = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  }
  if (type === 'numeric') {
    question.validation.min = 1;
    question.validation.max = 5;
    question.text = "On a scale of 1 to 5, how would you rate your communication skills?";
  }
  if (type === 'short-text'){
    question.text = "What is your greatest strength?";
  }
  return question;
};

const seedAssessments = async (createdJobs) => {
  const assessments = [];
  const jobsToAssess = createdJobs.slice(0, ASSESSMENT_COUNT);

  for (let i = 0; i < ASSESSMENT_COUNT; i++) {
    const sections = [];
    for (let s = 0; s < 2; s++) {
      const questions = [];
      for (let q = 0; q < 6; q++) {
        const qType = getRandom(['short-text', 'long-text', 'single-choice', 'multi-choice', 'numeric']);
        questions.push(generateQuestion(qType));
      }
      sections.push({
        id: nanoid(),
        title: s === 0 ? 'Technical Skills' : 'Behavioral Questions',
        questions: questions,
      });
    }
    
    const assessmentTitle = `${jobsToAssess[i].title} Assessment`;
    assessments.push({
      jobId: jobsToAssess[i].id,
      title: assessmentTitle,
      structure: {
        id: nanoid(),
        title: assessmentTitle,
        sections: sections,
      },
    });
  }
  await db.assessments.bulkAdd(assessments);
  console.log(`${ASSESSMENT_COUNT} assessments seeded.`);
};

export const runSeed = async () => {
  try {
    const jobCount = await db.jobs.count();
    if (jobCount > 0) {
      console.log("Database already seeded. Skipping.");
      return;
    }

    console.log("Seeding database...");
    await db.transaction('rw', db.jobs, db.candidates, db.assessments, async () => {
      const createdJobs = await seedJobs();
      await seedCandidates(createdJobs);
      await seedAssessments(createdJobs);
    });
    console.log("Database seeding complete!");

  } catch (error) {
    console.error("Failed to seed database:", error);
  }
};