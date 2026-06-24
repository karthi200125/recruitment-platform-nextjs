export type Role = "CANDIDATE" | "RECRUITER" | "ORGANIZATION";
export type Tier = "FREE" | "PRO";

type Limit = number | "UNLIMITED";

export type CandidateFeatures = {
  APPLICATIONS_PER_DAY: Limit;
  APPLICATIONS_PER_MONTH: Limit;
  MAX_SKILLS: number;
  MAX_MESSAGES_PER_MONTH: Limit;
  CAN_VIEW_PROFILE_VIEWS: boolean;
  PRIORITY_APPLICATION: boolean;
};

export type RecruiterFeatures = {
  MAX_ACTIVE_JOBS: number;
  JOBS_PER_MONTH: number;
  MAX_MESSAGES_PER_MONTH: Limit;
  CAN_USE_ADVANCED_FILTERS: boolean;
  CAN_SEND_BULK_EMAIL: boolean;
  CAN_VIEW_ANALYTICS: boolean;
};

export type OrganizationFeatures = {
  MAX_ACTIVE_JOBS: number;
  TEAM_MEMBERS: number | "UNLIMITED";
  CAN_USE_ADVANCED_ANALYTICS: boolean;
  CAN_BRANDING: boolean;
  PRIORITY_LISTING: boolean;
};

export const FEATURES = {
  CANDIDATE: {
    FREE: {
      APPLICATIONS_PER_DAY: 5,
      APPLICATIONS_PER_MONTH: 50,
      MAX_SKILLS: 10,
      MAX_MESSAGES_PER_MONTH: 5,
      CAN_VIEW_PROFILE_VIEWS: false,
      PRIORITY_APPLICATION: false,
    },
    PRO: {
      APPLICATIONS_PER_DAY: "UNLIMITED",
      APPLICATIONS_PER_MONTH: "UNLIMITED",
      MAX_SKILLS: 50,
      MAX_MESSAGES_PER_MONTH: "UNLIMITED",
      CAN_VIEW_PROFILE_VIEWS: true,
      PRIORITY_APPLICATION: true,
    },
  },

  RECRUITER: {
    FREE: {
      MAX_ACTIVE_JOBS: 2,
      JOBS_PER_MONTH: 5,
      MAX_MESSAGES_PER_MONTH: 10,
      CAN_USE_ADVANCED_FILTERS: false,
      CAN_SEND_BULK_EMAIL: false,
      CAN_VIEW_ANALYTICS: false,
    },
    PRO: {
      MAX_ACTIVE_JOBS: 20,
      JOBS_PER_MONTH: 50,
      MAX_MESSAGES_PER_MONTH: "UNLIMITED",
      CAN_USE_ADVANCED_FILTERS: true,
      CAN_SEND_BULK_EMAIL: true,
      CAN_VIEW_ANALYTICS: true,
    },
  },

  ORGANIZATION: {
    FREE: {
      MAX_ACTIVE_JOBS: 3,
      TEAM_MEMBERS: 1,
      CAN_USE_ADVANCED_ANALYTICS: false,
      CAN_BRANDING: false,
      PRIORITY_LISTING: false,
    },
    PRO: {
      MAX_ACTIVE_JOBS: 50,
      TEAM_MEMBERS: "UNLIMITED",
      CAN_USE_ADVANCED_ANALYTICS: true,
      CAN_BRANDING: true,
      PRIORITY_LISTING: true,
    },
  },
} as const;