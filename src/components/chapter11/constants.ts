import { Crown, Gavel, Users, Building, Flag, BookOpen, MapPin, UserCheck } from 'lucide-react';

export interface RoleData {
  id: string;
  title: string;
  level: 'Union' | 'State';
  minAge: number;
  term?: string;
  icon: any;
  qualifications: string[];
  powers?: string[];
  composition?: string;
  notes?: string;
}

export const ROLES: RoleData[] = [
  {
    id: 'president',
    title: 'President of India',
    level: 'Union',
    minAge: 35,
    term: '5 years',
    icon: Crown,
    qualifications: [
      'Citizen of India',
      'Completed 35 years of age',
      'Qualified for election as member of Lok Sabha'
    ],
    powers: [
      'Constitutional Head of State',
      'First Citizen of the country',
      'Nominal Powers (Executive)',
      'Emergency Powers (National, Constitutional, Financial)'
    ],
    notes: 'The President appoints the Governor of states.'
  },
  {
    id: 'pm',
    title: 'Prime Minister',
    level: 'Union',
    minAge: 25, // Assuming Lok Sabha member
    icon: UserCheck,
    qualifications: [
      'Leader of the majority party in Lok Sabha',
      'Member of either House of Parliament'
    ],
    powers: [
      'Real Executive Head of Union Government',
      'Leader of the House',
      'Presents resolution of cabinet',
      'Advises President on appointment of ministers'
    ]
  },
  {
    id: 'loksabha',
    title: 'Lok Sabha Member (MP)',
    level: 'Union',
    minAge: 25,
    term: '5 years',
    icon: Users,
    composition: '543 Elected Members',
    qualifications: [
      'Citizen of India',
      'Completed 25 years of age',
      'Should not hold office of profit',
      'Name must be in the electoral rolls'
    ],
    notes: 'Called the Lower House. Members elected directly by voters. (Anglo-Indian nomination discontinued in 2019).'
  },
  {
    id: 'rajyasabha',
    title: 'Rajya Sabha Member',
    level: 'Union',
    minAge: 30,
    term: 'Permanent Body (Members 6 years)',
    icon: Building,
    composition: 'Max 250 Members (238 elected, 12 nominated)',
    qualifications: [
      'Citizen of India',
      'Completed 30 years of age',
      'Should not hold office of profit'
    ],
    notes: 'Called the Upper House or Council of States. VP presides over sessions.'
  },
  {
    id: 'supremecourt',
    title: 'Supreme Court Justice',
    level: 'Union',
    minAge: 0, // Age not specified as min, but experience required
    icon: Gavel,
    composition: '1 Chief Justice + 33 Justices (Current Strength)',
    qualifications: [
      'Citizen of India',
      'Judge of High Court for at least 5 years OR',
      'Advocate of High Court for at least 10 years'
    ],
    notes: 'Situated in Delhi. The highest judicial forum and final court of appeal.'
  },
  {
    id: 'governor',
    title: 'Governor',
    level: 'State',
    minAge: 35,
    term: '5 years',
    icon: MapPin,
    qualifications: [
      'Citizen of India',
      'Completed 35 years of age',
      'Not a member of Parliament or State Assembly',
      'No income earning post'
    ],
    powers: [
      'Constitutional Head of State Executive',
      'Appointed by the President'
    ]
  },
  {
    id: 'cm',
    title: 'Chief Minister',
    level: 'State',
    minAge: 25,
    icon: UserCheck,
    qualifications: [
      'Leader of majority party in State Assembly',
      'Member of State Legislature'
    ],
    powers: [
      'Real Executive Head of State',
      'Head of State Council of Ministers'
    ]
  },
  {
    id: 'mla',
    title: 'MLA (Vidhan Sabha)',
    level: 'State',
    minAge: 25,
    icon: Users,
    composition: 'Varies by State (e.g., 119 in Telangana)',
    qualifications: [
      'Citizen of India',
      'Completed 25 years of age',
      'No office of profit'
    ],
    notes: 'Elected directly by voters for 5 years.'
  },
  {
    id: 'mlc',
    title: 'MLC (Vidhan Parishad)',
    level: 'State',
    minAge: 30,
    icon: Building,
    composition: 'Varies (Max 1/3rd of MLA count)',
    qualifications: [
      'Citizen of India',
      'Completed 30 years of age',
      'No office of profit'
    ],
    notes: 'Legislative Council. 5/6th elected indirectly, 1/6th nominated by Governor.'
  },
  {
    id: 'highcourt',
    title: 'High Court Justice',
    level: 'State',
    minAge: 0, 
    icon: Gavel,
    composition: 'Chief Justice + Other Judges (Decided by President)',
    qualifications: [
      'Citizen of India',
      'Held judicial office in India for 10 years OR',
      'Advocate of a High Court for 10 years'
    ],
    notes: 'The highest judicial authority at the State level.'
  }
];

