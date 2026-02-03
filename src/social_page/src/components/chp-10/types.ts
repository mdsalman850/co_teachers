export enum AppStage {
  WELCOME = 'WELCOME',
  BASICS = 'BASICS',
  TIMELINE = 'TIMELINE',
  COMMITTEE = 'COMMITTEE',
  RIGHTS = 'RIGHTS'
}

export interface CommitteeMember {
  name: string;
  role?: string;
  imagePlaceholder: string;
  description: string;
}

export interface TimelineEvent {
  year: string;
  date: string;
  title: string;
  description: string;
}

export interface RightScenario {
  id: number;
  scenario: string;
  correctRightId: string;
  explanation: string;
}

export interface Right {
  id: string;
  title: string;
  description: string;
  icon: string;
  keyPoints?: string[];
}