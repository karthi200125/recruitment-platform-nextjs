export const FEATURES = {
    CANDIDATE: {
        FREE: {
            MAX_APPLICATIONS_PER_DAY: 5,
            CAN_MESSAGE: false,
            CAN_VIEW_PROFILE_VIEWS: false,
        },
        PRO: {
            MAX_APPLICATIONS_PER_DAY: Infinity,
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
            MAX_JOB_POSTS: Infinity,
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
            MAX_JOB_POSTS: Infinity,
            CAN_ANALYTICS: true,
        },
    },
};