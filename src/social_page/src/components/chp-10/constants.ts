import { CommitteeMember, Right, RightScenario, TimelineEvent } from './types';

// Import images
import ambedkarImage from './images/Dr. B.R. Ambedkar.jpg';
import prasadImage from './images/Dr. Rajendra Prasad.jpg';
import ayyangarImage from './images/N. Gopalaswamy Ayyangar.jpg';
import ayyarImage from './images/Alladi Krishnaswamy Ayyar.jpg';
import munshiImage from './images/k-m-munshi.jpg';
import saadullahImage from './images/Syed Mohammed Saadullah.jpg';
import raoImage from './images/N_Madava_Rao.jpg';
import krishnamachariImage from './images/T.T. Krishnamachari.jpg';

export const COMMITTEE_MEMBERS: CommitteeMember[] = [
  {
    name: "Dr. B.R. Ambedkar",
    role: "Chairman",
    imagePlaceholder: ambedkarImage,
    description: "Known as the 'Father of the Indian Constitution'. He led the drafting committee."
  },
  {
    name: "Dr. Rajendra Prasad",
    role: "President of Assembly",
    imagePlaceholder: prasadImage,
    description: "Unanimously elected as the permanent president of the Constituent Assembly."
  },
  {
    name: "N. Gopalaswamy Ayyangar",
    imagePlaceholder: ayyangarImage,
    description: "A key member of the drafting committee."
  },
  {
    name: "Alladi Krishnaswamy Ayyar",
    imagePlaceholder: ayyarImage,
    description: "Distinguished lawyer and member of the committee."
  },
  {
    name: "Dr. K.M Munshi",
    imagePlaceholder: munshiImage,
    description: "Educationalist and politician involved in drafting."
  },
  {
    name: "Syed Mohammed Saadullah",
    imagePlaceholder: saadullahImage,
    description: "Former Prime Minister of Assam and committee member."
  },
  {
    name: "N. Madhava Rao",
    imagePlaceholder: raoImage,
    description: "Civil servant who joined the drafting process."
  },
  {
    name: "T.T. Krishnamachari",
    imagePlaceholder: krishnamachariImage,
    description: "Joined the committee and contributed to financial aspects."
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "1946",
    date: "December 9th",
    title: "First Meeting of Constituent Assembly",
    description: "The Constituent Assembly met for the first time in the Central Hall of Parliament House, New Delhi. Initially, it had 389 members representing British India and the princely states. After partition, the number reduced to 299 members. The assembly included 9 women members, making it a diverse and representative body. This historic meeting marked the beginning of India's journey to create its own Constitution."
  },
  {
    year: "1946",
    date: "December 11th",
    title: "President Elected",
    description: "Dr. Rajendra Prasad was unanimously elected as the permanent President of the Constituent Assembly. He served in this role throughout the entire constitution-making process, providing leadership and guidance. Dr. Prasad later became the first President of independent India. H.C. Mukherjee and V.T. Krishnamachari were elected as Vice-Presidents of the Assembly."
  },
  {
    year: "1947",
    date: "January 22nd",
    title: "Objective Resolution Adopted",
    description: "Pandit Jawaharlal Nehru moved the historic 'Objective Resolution' in the Constituent Assembly. This resolution outlined the fundamental principles and philosophy that would guide the Constitution. It declared India as an independent, sovereign republic and laid down the objectives of justice, equality, liberty, and fraternity. This resolution later became the basis for the Preamble of the Constitution."
  },
  {
    year: "1947",
    date: "August 15th",
    title: "India Gains Independence",
    description: "India achieved independence from British rule. The Indian Independence Act 1947 came into effect, dividing British India into two independent dominions: India and Pakistan. This momentous event gave the Constituent Assembly complete sovereignty to draft the Constitution for a free India. The assembly now had full authority to create a Constitution reflecting the aspirations of the Indian people."
  },
  {
    year: "1947",
    date: "August 29th",
    title: "Drafting Committee Formed",
    description: "The Drafting Committee was established with Dr. B.R. Ambedkar as its Chairman. The committee consisted of 7 members: Dr. B.R. Ambedkar (Chairman), N. Gopalaswamy Ayyangar, Alladi Krishnaswamy Ayyar, Dr. K.M. Munshi, Syed Mohammed Saadullah, N. Madhava Rao, and T.T. Krishnamachari. This committee was tasked with preparing the draft of the Constitution based on the reports of various other committees and the debates in the Assembly."
  },
  {
    year: "1948",
    date: "February 21st",
    title: "First Draft Published",
    description: "The Drafting Committee published the first draft of the Constitution. This draft was circulated to the members of the Constituent Assembly and the public for comments and suggestions. The draft underwent extensive scrutiny and received over 7,000 amendments. The committee worked meticulously to incorporate relevant suggestions while maintaining the core principles of the Constitution."
  },
  {
    year: "1949",
    date: "November 26th",
    title: "Constitution Adopted",
    description: "The Constituent Assembly adopted the Constitution of India after nearly three years of deliberations. The assembly held 11 sessions over 165 days, discussing and refining every aspect of the Constitution. On this day, 284 members signed the Constitution, making it official. This day is now celebrated as Constitution Day (Samvidhan Divas) in India to honor this historic achievement."
  },
  {
    year: "1950",
    date: "January 26th",
    title: "Constitution Comes into Effect",
    description: "The Constitution of India officially came into effect, transforming India into a Republic. This date was chosen because it was on January 26, 1930, that the Indian National Congress had declared Purna Swaraj (Complete Independence). Dr. Rajendra Prasad was sworn in as the first President of India, and the first general elections were scheduled. We celebrate this day as Republic Day with great pride and patriotism."
  }
];

export const FUNDAMENTAL_RIGHTS: Right[] = [
  {
    id: "equality",
    title: "Right to Equality",
    description: "Everyone is equal before the law. No discrimination based on religion, race, caste, sex, or place of birth.",
    icon: "equal",
    keyPoints: [
      "Equality before law for all citizens",
      "No discrimination on grounds of religion, race, caste, sex, or place of birth",
      "Equal access to public places",
      "Abolition of untouchability",
      "Abolition of titles (except military and academic)"
    ]
  },
  {
    id: "freedom",
    title: "Right to Freedom",
    description: "Freedom of speech, expression, assembly, association, movement, residence, and profession.",
    icon: "mic",
    keyPoints: [
      "Freedom of speech and expression",
      "Freedom to assemble peacefully",
      "Freedom to form associations or unions",
      "Freedom to move freely throughout India",
      "Freedom to reside and settle in any part of India",
      "Freedom to practice any profession or occupation"
    ]
  },
  {
    id: "exploitation",
    title: "Right against Exploitation",
    description: "Prohibits human trafficking, forced labor, and employment of children in hazardous jobs.",
    icon: "shield-check",
    keyPoints: [
      "Prohibition of human trafficking",
      "Prohibition of forced labor (begar)",
      "Prohibition of employment of children below 14 years",
      "Protection from bonded labor",
      "Protection from exploitation in hazardous industries"
    ]
  },
  {
    id: "religion",
    title: "Right to Freedom of Religion",
    description: "Freedom to profess, practice, and propagate any religion.",
    icon: "sparkles",
    keyPoints: [
      "Freedom to profess any religion",
      "Freedom to practice any religion",
      "Freedom to propagate any religion",
      "Freedom to manage religious affairs",
      "No religious instruction in government schools",
      "Right to establish religious institutions"
    ]
  },
  {
    id: "cultural",
    title: "Cultural & Educational Rights",
    description: "Right of minorities to establish and administer educational institutions to preserve their culture.",
    icon: "graduation-cap",
    keyPoints: [
      "Right of minorities to conserve their language, script, and culture",
      "Right to establish and administer educational institutions",
      "No discrimination in admission to educational institutions",
      "Protection of interests of minorities",
      "Right to receive education in mother tongue"
    ]
  },
  {
    id: "remedies",
    title: "Constitutional Remedies",
    description: "Right to move the court if any fundamental rights are violated.",
    icon: "gavel",
    keyPoints: [
      "Right to move Supreme Court or High Court",
      "Writ jurisdiction (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari)",
      "Right to constitutional remedies is itself a fundamental right",
      "Power of courts to issue writs for enforcement of rights",
      "Protection against violation of fundamental rights"
    ]
  }
];

export const SCENARIOS: RightScenario[] = [
  {
    id: 1,
    scenario: "A 12-year-old boy is forced to work in a dangerous firecracker factory.",
    correctRightId: "exploitation",
    explanation: "The Right against Exploitation bans child labor in hazardous conditions."
  },
  {
    id: 2,
    scenario: "A group of people wants to peacefully gather to discuss a neighborhood problem.",
    correctRightId: "freedom",
    explanation: "The Right to Freedom grants citizens the freedom to assemble peacefully."
  },
  {
    id: 3,
    scenario: "A rich person and a poor person commit the same traffic violation. They should pay the same fine.",
    correctRightId: "equality",
    explanation: "The Right to Equality ensures everyone is equal before the law."
  },
  {
    id: 4,
    scenario: "A community wants to open a school to teach their traditional language and dance.",
    correctRightId: "cultural",
    explanation: "Cultural & Educational Rights allow minorities to preserve their culture."
  },
  {
    id: 5,
    scenario: "The police arrested a man without telling him why, and he wants to go to court to complain.",
    correctRightId: "remedies",
    explanation: "Right to Constitutional Remedies allows citizens to seek justice from courts."
  }
];