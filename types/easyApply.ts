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

export interface EasyApplyJob {
    id: number;
    jobTitle: string;
    questions?: Question[] | null;
}

export interface EasyApplyProps {
    job: EasyApplyJob;
}

export interface EasyApplyUser {
    email: string;
    username: string;

    firstName: string | null;
    lastName: string | null;
    profession: string | null;

    phoneNo: string | null;

    profileImage: string | null;
    profileImagePublicId: string | null;

    city: string | null;
    state: string | null;
    country: string | null;

    resume: string | null;
    resumePublicId: string | null;
}