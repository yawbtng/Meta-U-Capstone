
import 'dotenv/config';
import { faker } from '@faker-js/faker';
import { createSeedClient } from '@snaplet/seed';

const USER_ID = '531786dd-f200-4372-aec7-cea8f47022bd';

const industries = [ 'Technology','Fintech','Healthcare','Education','Consulting',
  'Marketing & Advertising','Gaming','Renewable Energy','Artificial Intelligence','Real Estate' ];

const companies = [ 'Wayne Enterprises','Globex Corp','Initech','Umbrella Health',
  'Waystar Capital','Pied Piper','Stark Industries','Acme Consulting','Blue Origin','ByteForge' ];

const roles = [
  'Software Engineer','Full-Stack Developer','Machine Learning Engineer','Data Analyst',
  'Data Engineer','DevOps Engineer','Cloud Architect','Security Analyst','Product Manager',
  'Project Manager','Scrum Master','UX Designer','Content Strategist','QA Engineer',
  'Research Scientist','Growth Marketer','Marketing Director','Sales Engineer',
  'Account Executive','Customer Success Manager','Business Analyst','Solutions Consultant',
  'Operations Lead','Supply Chain Analyst','Finance Manager','HR Manager','Technical Writer',
  'Investment Analyst','DevRel Advocate','CTO' ];

const schools = [ 'Stanford University','Massachusetts Institute of Technology (MIT)',
  'Harvard University','Imperial College London','University of Oxford','ETH Zurich',
  'University of Michigan-Ann Arbor','University of California, Los Angeles (UCLA)',
  'University of Toronto','National University of Singapore','Delft University of Technology',
  'University of Tokyo','Peking University','University of Melbourne','University of Sydney',
  'University of Cape Town','University of São Paulo','KAIST',
  'Hong Kong University of Science & Technology','Trinity College Dublin','University of Warwick',
  'KTH Royal Institute of Technology','Sorbonne University','Princeton University',
  'Georgia Institute of Technology','Rice University','Southern Methodist University (SMU)',
  'University of Texas at Austin','Carnegie Mellon University','UC Berkeley' ];

const locations = [ 'San Francisco, CA','Dallas, TX','Seattle, WA','New York, NY','Atlanta, GA',
  'Austin, TX','Boston, MA','Chicago, IL','Denver, CO','Miami, FL','Los Angeles, CA','Houston, TX',
  'Philadelphia, PA' ];

const tagPool = [ 'mentor','vc','friend','alumni','speaker','investor','classmate',
  'colleague','family','advisor','partner','client','customer' ];

const interestsPool = [ 'Reading','Cooking & Baking','Traveling','Gaming','Photography',
  'Hiking','Yoga','Gardening','Painting & Drawing','Writing','Music (playing/listening)',
  'Dancing','Volunteering','Cycling','Running','Board Games & Puzzles','Crafting / DIY',
  'Knitting / Crocheting','Rock Climbing','Surfing','Meditation','Podcasting','Blogging',
  'Language Learning','Chess','Fishing','Baking Bread','Movie Collecting','Home Brewing',
  'Calligraphy' ];

faker.seed(20250702);

const factory = () => {
  const first = faker.person.firstName();
  const last  = faker.person.lastName();
  const full  = `${first} ${last}`;
  const handle = faker.internet.userName({ firstName: first, lastName: last });
  const slug   = faker.helpers.slugify(full).toLowerCase();
  return {
    name: full,
    email: faker.internet.email({ firstName: first, lastName: last }),
    phone_number: `${faker.string.numeric({ length: 10, allowLeadingZeros: false })}`,
    socials: {
      twitter: handle,
      linkedin: `linkedin.com/in/${slug}`,
      instagram: handle
    },
    where_met: faker.helpers.arrayElement(locations),
    relationship_type: faker.helpers.arrayElements(
      ['professional', 'personal', 'social'],
      { min: 1, max: 2 }
    ),
    notes: null,
    avatar_url: null,
    industry: faker.helpers.arrayElement(industries),
    company: faker.helpers.arrayElement(companies),
    role: faker.helpers.arrayElement(roles),
    school: faker.helpers.arrayElement(schools),
    last_contact_at: faker.date.recent({ days: 500 }),
    interactions_count: faker.number.int({ min: 1, max: 7 }),
    connection_score: null,
    tags: faker.helpers.arrayElements(tagPool, { min: 0, max: 3 }),
    interests: faker.helpers.arrayElements(interestsPool, { min: 1, max: 4 }),
    gender: faker.helpers.arrayElement(['male', 'female']),
    location: faker.helpers.arrayElement(locations)
  };
};

(async () => {
  const seed = await createSeedClient();

  const contactsToCreate = Array.from({ length: 100 }, factory);

  const contacts = await seed['connections'].create(contactsToCreate);
  if (contacts && Array.isArray(contacts)) {
    const userConnections = contacts.map(contact => ({
      user_id: USER_ID,
      connection_id: contact.id,
      added_at: new Date().toISOString()
    }));
    await seed['user_to_connections'].create(userConnections);
  }
  process.exit(0);
})();
