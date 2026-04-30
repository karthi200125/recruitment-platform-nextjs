
export type Role = "CANDIDATE" | "RECRUITER" | "ORGANIZATION";
export type Tier = "FREE" | "PRO";

export type CandidateFeatures = {
  MAX_APPLICATIONS_PER_DAY: number; 
  CAN_MESSAGE: boolean;
  CAN_VIEW_PROFILE_VIEWS: boolean;
};

export type RecruiterFeatures = {
  MAX_JOB_POSTS: number;
  CAN_MESSAGE: boolean;
  CAN_VIEW_ALL_APPLICANTS: boolean;
};

export type OrganizationFeatures = {
  MAX_JOB_POSTS: number;
  CAN_ANALYTICS: boolean;
};

export const FEATURES = {
  CANDIDATE: {
    FREE: {
      MAX_APPLICATIONS_PER_DAY: 5,
      CAN_MESSAGE: false,
      CAN_VIEW_PROFILE_VIEWS: false,
    },
    PRO: {
      MAX_APPLICATIONS_PER_DAY: -1, // ✅ unlimited
      CAN_MESSAGE: true,
      CAN_VIEW_PROFILE_VIEWS: true,
    },
  },

  RECRUITER: {
    FREE: {
      MAX_JOB_POSTS: 1,
      CAN_MESSAGE: false,
      CAN_VIEW_ALL_APPLICANTS: false,
    },
    PRO: {
      MAX_JOB_POSTS: -1,
      CAN_MESSAGE: true,
      CAN_VIEW_ALL_APPLICANTS: true,
    },
  },

  ORGANIZATION: {
    FREE: {
      MAX_JOB_POSTS: 1,
      CAN_ANALYTICS: false,
    },
    PRO: {
      MAX_JOB_POSTS: -1,
      CAN_ANALYTICS: true,
    },
  },
} as const;