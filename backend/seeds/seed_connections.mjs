import { faker } from '@faker-js/faker'
import { createSeedClient } from '@snaplet/seed'


const USER_ID = '531786dd-f200-4372-aec7-cea8f47022bd'

const industries = [
  'Technology', 'Fintech', 'Healthcare', 'Education',
  'Consulting', 'Marketing & Advertising', 'Gaming',
  'Renewable Energy', 'Artificial Intelligence', 'Real Estate'
]

const companies = [
  'Wayne Enterprises', 'Globex Corp', 'Initech', 'Umbrella Health',
  'Waystar Capital', 'Pied Piper', 'Stark Industries',
  'Acme Consulting', 'Blue Origin', 'ByteForge'
]

const roles = [
  'Software Engineer', 'Full-Stack Developer', 'Machine Learning Engineer', 'Data Analyst',
  'Data Engineer', 'DevOps Engineer', 'Cloud Architect', 'Security Analyst',
  'Product Manager', 'Project Manager', 'Scrum Master', 'UX Designer',
  'Content Strategist', 'QA Engineer', 'Research Scientist', 'Growth Marketer',
  'Marketing Director', 'Sales Engineer', 'Account Executive', 'Customer Success Manager',
  'Business Analyst', 'Solutions Consultant', 'Operations Lead', 'Supply Chain Analyst',
  'Finance Manager', 'HR Manager', 'Technical Writer', 'Investment Analyst',
  'DevRel Advocate', 'CTO'
]

const schools = [
  'Stanford University', 'Massachusetts Institute of Technology (MIT)', 'Harvard University', 'Imperial College London',
  'University of Oxford', 'ETH Zurich', 'University of Michigan-Ann Arbor', 'University of California, Los Angeles (UCLA)',
  'University of Toronto', 'National University of Singapore', 'Delft University of Technology', 'University of Tokyo',
  'Peking University', 'University of Melbourne', 'University of Sydney', 'University of Cape Town',
  'University of São Paulo', 'KAIST', 'Hong Kong University of Science & Technology', 'Trinity College Dublin',
  'University of Warwick', 'KTH Royal Institute of Technology', 'Sorbonne University', 'Princeton University',
  'Georgia Institute of Technology', 'Rice University', 'Southern Methodist University (SMU)', 'University of Texas at Austin',
  'Carnegie Mellon University', 'UC Berkeley'
]

const locations = [
  'San Francisco, CA', 'Dallas, TX', 'Seattle, WA',
  'New York, NY', 'Atlanta, GA', 'Austin, TX',
  'Boston, MA', 'Chicago, IL', 'Denver, CO', 'Miami, FL',
  'Los Angeles, CA', 'Houston, TX', 'Philadelphia, PA',
]

const tagPool = [
  'mentor', 'vc', 'friend', 'alumni', 'speaker',
  'investor', 'classmate', 'colleague', 'family', 'advisor',
  'partner', 'client', 'customer', 'investor'
]

const interestsPool = [
  'Reading','Cooking & Baking','Traveling','Gaming',
  'Photography','Hiking','Yoga','Gardening','Painting & Drawing',
  'Writing','Music (playing/listening)','Dancing','Volunteering','Cycling',
  'Running','Board Games & Puzzles','Crafting / DIY','Knitting / Crocheting','Rock Climbing',
  'Surfing','Meditation','Podcasting','Blogging','Language Learning','Chess',
  'Fishing','Baking Bread','Movie Collecting', 'Home Brewing', 'Calligraphy'
]



faker.seed(20250702)


const seed = await createSeedClient()

await seed.public.connections(30, {
  user_id: USER_ID,
  name: () => faker.person.fullName(),
  email: () => faker.internet.email(),
  phone_number: () => faker.phone.number('##########'),

  socials: () => ({
    twitter: faker.internet.userName(),
    linkedin: `linkedin.com/in/${faker.internet.userName()}`,
    instagram: faker.internet.userName()
  }),

  where_met: () => faker.location.city(),
  relationship_type: () =>
    faker.helpers.arrayElements(['professional', 'personal', 'social'], { min: 1, max: 2 })
  ,
  notes: () => faker.lorem.sentences(2),
  avatar_url: null,

  industry: () => faker.helpers.arrayElement(industries),
  company: () => faker.helpers.arrayElement(companies),
  role: () => faker.helpers.arrayElement(roles),
  school: () => faker.helpers.arrayElement(schools),

  last_contact_at: () => faker.date.recent({ days: 90 }),
  interactions_count: () => faker.number.int({ min: 1, max: 7 }),
  connection_score: undefined,

  tags: () =>
    faker.helpers.arrayElements(tagPool, { min: 0, max: 3 }),
  interests: () =>
    faker.helpers.arrayElements(interestsPool, { min: 1, max: 4 }),

  gender: () => faker.helpers.arrayElement(['male', 'female']),
  location: () => faker.helpers.arrayElement(locations)
})

console.log('✅ 30 connections inserted for user', USER_ID)
process.exit(0)
