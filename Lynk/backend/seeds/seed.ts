import 'dotenv/config';
import fetch from 'node-fetch';
import { faker } from '@faker-js/faker';
import { createSeedClient } from '@snaplet/seed';
import crypto from 'crypto';

const USER_ID = '867c0143-e959-4b5d-9e9d-450056569ec2';


const industries = [ 'Technology','Fintech','Healthcare','Education','Consulting',
  'Marketing & Advertising','Gaming','Renewable Energy','Artificial Intelligence','Real Estate' ];

const companies = [ 'Apple','Microsoft','Google','Amazon','Meta','Netflix','NVIDIA','Intel','Adobe',
  'Salesforce','OpenAI','Snowflake','Databricks','Stripe','Airbnb','Shopify','Twilio','Atlassian',
  'ServiceNow','Cloudflare','JPMorgan Chase','Walmart','Coca-Cola','Ford Motor','Pfizer',
  'Johnson & Johnson','Procter & Gamble','Pied Piper','Waystar Royco','ByteDance','SpaceX','Palantir',
  'Tesla Energy','DeepMind','Canva','McKinsey & Company','Boston Consulting Group',
  'Bain & Company','Goldman Sachs','BlackRock','Wayne Enterprises','Globex Corp','Initech',
  'Umbrella Health','Waystar Capital','Stark Industries','Acme Consulting','Blue Origin','ByteForge' ];

const roles = [ 'Software Engineer','Full-Stack Developer','Machine Learning Engineer','Data Analyst',
  'Data Engineer','DevOps Engineer','Cloud Architect','Security Analyst','Product Manager',
  'Project Manager','Scrum Master','UX Designer','Content Strategist','QA Engineer','Research Scientist',
  'Growth Marketer','Marketing Director','Sales Engineer','Account Executive','Customer Success Manager',
  'Business Analyst','Solutions Consultant','Operations Lead','Supply Chain Analyst','Finance Manager',
  'HR Manager','Technical Writer','Investment Analyst','DevRel Advocate','CTO' ];

const schools = [
  'Stanford University',
  'Massachusetts Institute of Technology',
  'Harvard University',
  'Imperial College London',
  'University of Oxford',
  'ETH Zurich – Swiss Federal Institute of Technology',
  'University of Michigan–Ann Arbor',
  'University of California, Los Angeles',
  'University of Toronto',
  'National University of Singapore',
  'Delft University of Technology',
  'University of Tokyo',
  'Peking University',
  'University of Melbourne',
  'University of Sydney',
  'University of Cape Town',
  'University of São Paulo',
  'Korea Advanced Institute of Science and Technology',
  'Hong Kong University of Science and Technology',
  'Trinity College Dublin',
  'University of Warwick',
  'KTH Royal Institute of Technology',
  'Sorbonne University',
  'Princeton University',
  'Georgia Institute of Technology',
  'Rice University',
  'Southern Methodist University',
  'University of Texas at Austin',
  'Carnegie Mellon University',
  'University of California, Berkeley'
];


const locations = [ 'San Francisco, CA','Dallas, TX','Seattle, WA','New York, NY','Atlanta, GA',
  'Austin, TX','Boston, MA','Chicago, IL','Denver, CO','Miami, FL','Los Angeles, CA','Houston, TX',
  'Philadelphia, PA' ];

const tagPool = [ 'mentor','vc','friend','alumni','speaker','investor','classmate','colleague','family',
  'advisor','partner','client','customer' ];

const interestsPool = [ 'Reading','Cooking','Traveling','Gaming','Photography','Hiking','Yoga','Gardening',
  'Painting','Writing','Music','Dancing','Volunteering','Cycling','Running','Board Games','Crafting',
  'Knitting','Rock Climbing','Surfing','Meditation','Podcasting','Blogging','Language Learning','Chess',
  'Fishing','Baking Bread','Home Brewing','Calligraphy' ];

async function avatar(gender: 'male' | 'female'): Promise<string> {
  try {
    const r = await fetch(
      `https://randomuser.me/api/?gender=${gender}&inc=picture&noinfo`
    );
    const j = (await r.json()) as any;
    return (
      j.results?.[0]?.picture?.large ??
      `https://ui-avatars.com/api/?name=${gender}&background=random`
    );
  } catch {
    return `https://ui-avatars.com/api/?name=${gender}&background=random`;
  }
}

function uuid() {
  return crypto.randomUUID();
}

function makeContact() {
  const gender = faker.helpers.arrayElement(['male', 'female']) as
    | 'male'
    | 'female';
  const first = faker.person.firstName(gender);
  const last = faker.person.lastName();
  const name = `${first} ${last}`;
  const handle = faker.internet.username({ firstName: first, lastName: last });
  const slug = faker.helpers.slugify(name).toLowerCase();

  return {
   
    id: uuid(),

    
    gender,
    name,
    email: faker.internet.email({ firstName: first, lastName: last }),
    phone_number: faker.string.numeric({ length: 10, allowLeadingZeros: false }),
    socials: {
      twitter: handle,
      linkedin: `linkedin.com/in/${slug}`,
      instagram: handle,
    },
    avatar_url: '', // fill later
    industry: faker.helpers.arrayElement(industries),
    company: faker.helpers.arrayElement(companies),
    role: faker.helpers.arrayElement(roles),
    school: faker.helpers.arrayElement(schools),
    location: faker.helpers.arrayElement(locations),

    
    where_met: faker.helpers.arrayElement(locations),
    relationship_type: faker.helpers.arrayElements(
      ['professional', 'personal', 'social'],
      { min: 1, max: 2 }
    ),
    notes: null,
    last_contact_at: faker.date.recent({ days: 365 }),
    interactions_count: faker.number.int({ min: 1, max: 7 }),
    connection_score: null,
    tags: faker.helpers.arrayElements(tagPool, { min: 1, max: 3 }),
    interests: faker.helpers.arrayElements(interestsPool, { min: 1, max: 4 }),
  };
}


(async () => {
  const seed = await createSeedClient();

  const contacts = [];
  for (let i = 0; i < 75; i++) {
    const c = makeContact();
    c.avatar_url = await avatar(c.gender);
    contacts.push(c);
  }

  await seed.connections(
    contacts.map(c => ({
      id: c.id,          
      name: c.name,
      email: c.email,
      phone_number: c.phone_number,
      socials: c.socials,
      avatar_url: c.avatar_url,
      industry: c.industry,
      company: c.company,
      role: c.role,
      school: c.school,
      gender: c.gender,
      location: c.location,
      notes: null,
      where_met: c.where_met,
      relationship_type: c.relationship_type,
      connection_score: null,       
      tags: c.tags,
      interests: c.interests
    }))
  );

  await seed.user_to_connections(
    contacts.map((c) => ({
      user_id: USER_ID,
      connection_id: c.id,
      added_at: new Date().toISOString(),
      where_met: c.where_met,
      relationship_type: c.relationship_type,
      notes: null,
      last_contact_at: c.last_contact_at,
      interactions_count: c.interactions_count,
      connection_score: null,
      tags: c.tags,
      interests: c.interests,
      updated_at: new Date().toISOString(),
    }))
  );

  process.exit(0);
})();