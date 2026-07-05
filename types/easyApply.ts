import type { Job } from "./jobs";
import type { SearchParams } from "./search";

export interface ContactInfo {
    email: string;
    phone: string;
}

export type ResumeData = {
    name: string;
    url: string;
    publicId: string;
    file: File | null;
};

export interface Question {
    id: number;
    question: string;
    type: "input";
}

export type QuestionAnswers = Record<number, string>;

export interface EasyApplyPayload {
    contactInfo: ContactInfo;
    resumeData: ResumeData;
    questionAnswers: QuestionAnswers;
}

export interface EasyApplyProps {
    job: any;    
}

export interface EasyApplyUser {
    email: string;
    username: string;

    phoneNo: string | null;

    userImage: string | null;
    userImagePublicId: string | null;

    city: string | null;
    state: string | null;
    country: string | null;

    resume: string | null;
    resumePublicId: string | null;
}