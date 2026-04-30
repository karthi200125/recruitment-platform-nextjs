// types/easyApply.ts

export type ContactInfo = {
    email: string;
    phone: string;
};

export type ResumeData = {
    name: string;
    url: string;
};

export type EasyApplyProps = {
    job: {
        id: number;
        questions?: {
            id: number;
            question: string;
            type: "input";
        }[];
    };
    safeSearchParams?: Record<string, string>;
};

export type Question = {
  id: number;
  question: string;
  type: "input";
};

export type QuestionAnswers = Record<number, string>;

export type EasyApplyPayload = {
    contactInfo: ContactInfo;
    resumeData: ResumeData;
    questionAnswers: QuestionAnswers;
};


export type EasyApplyUser = {
    email: string;
    phoneNo: string | null;
    userImage: string | null;
    userImagePublicId: string | null;
    username: string;
    city: string | null;
    state: string | null;
    country: string | null;
    resume: string | null;
    resumePublicId: string | null;
};
