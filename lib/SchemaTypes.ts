import { z } from "zod";

export const UserInfoSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required",
    }),
    email: z.string().email({
        message: "Invalid email address",
    }),
    firstName: z.string().min(1, {
        message: "Firstname is required",
    }),
    userBio: z.string().min(50, {
        message: "User Bio is required",
    }).max(100, {
        message: "Maximum 100 characters",
    }),
    website: z.string().url({
        message: "Invalid website URL",
    }).optional(),
    currentCompany: z.string().optional(),
    lastName: z.string().min(1, {
        message: "Lastname is required",
    }),
    gender: z.string().min(1, {
        message: "Gender is required",
    }),
    address: z.string().min(1, {
        message: "Address is required",
    }),
    city: z.string().min(1, {
        message: "City is required",
    }),
    state: z.string().min(1, {
        message: "State is required",
    }),
    country: z.string().min(1, {
        message: "Country is required",
    }),
    postalCode: z.string().min(1, {
        message: "Postal Code is required",
    }),
    phoneNo: z.string().min(1, {
        message: "Phone Number is required",
    }).max(10, {
        message: "Phone Number is required and should be at least 10 digits",
    }),
    profession: z.string().min(1, {
        message: "Profession name is required",
    }),
});

export const UserEducationSchema = z.object({
    instituteName: z.string().min(1, {
        message: "Institute Name is required",
    }),
    degree: z.string().min(1, {
        message: "Degree is required",
    }),
    fieldOfStudy: z.string().min(1, {
        message: "Degree is required",
    }),
    startDate: z.string().min(1, {
        message: "Start Date is required",
    }),
    endDate: z.string().min(1, {
        message: "Start Date is required",
    }),
    percentage: z.string().min(1, {
        message: "Percentage Date is required",
    }),
})

export const UserExperienceSchema = z.object({
    companyName: z.string().min(1, {
        message: "Company Name is required",
    }),
    position: z.string().min(1, {
        message: "Position is required",
    }),
    startDate: z.string().min(1, {
        message: "Start Date is required",
    }),
    endDate: z.string().min(1, {
        message: "Start Date is required",
    }),
    description: z.string().min(1, {
        message: "Description is required",
    }),
})

export const UserProjectSchema = z.object({
    proName: z.string().min(1, {
        message: "Project Name is required",
    }),
    proLink: z.string().min(1, {
        message: "Project Link is required",
    }),
    proDesc: z.string().min(1, {
        message: "Project description id Rquired",
    }),
})

export const CreateJobSchema = z.object({
    jobTitle: z.string().min(1, {
        message: "Job Title is required",
    }),
    experience: z.string().min(1, {
        message: "Job Experince required",
    }),
    salary: z.string().min(1, {
        message: "Job Salary required",
    }),
    city: z.string().min(1, {
        message: "Job City required",
    }),
    state: z.string().min(1, {
        message: "Job State required",
    }),
    country: z.string().min(1, {
        message: "Job Country required",
    }),
    type: z.string().min(1, {
        message: "Job Type required",
    }),
    mode: z.string().min(1, {
        message: "Job Mode required",
    }),
    company: z.string().min(1, {
        message: "Select Company",
    }),
    isEasyApply: z.boolean({
        required_error: "Please select if this job is EasyApply or not",
    }),
    applyLink: z.string().min(1, {
        message: "External Job Apply link",
    }).optional(),
    vacancies: z.string().min(1, {
        message: "Give How many Vacnacies Your are Hiring",
    }),
})

export const RegisterSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required",
    }),
    email: z.string().email({
        message: "A valid email is required",
    }),
    password: z.string().min(6, {
        message: "Password is required, with a minimum of 6 characters",
    }),
})

export const LoginSchema = z.object({
    email: z.string().email({
        message: "A valid email is required",
    }),
    password: z.string().min(6, {
        message: "Password is required, with a minimum of 6 characters",
    }),
})


export const filterSchema = z.object({
    easyApply: z.string().optional(),
    dateposted: z.string().optional(),
    experiencelevel: z.string().optional(),
    type: z.string().optional(),
    location: z.string().optional(),
    q: z.string().optional(),
    company: z.string().optional(),
    page: z.union([z.string(), z.number()]).optional(),
});

export const RoleSchema = z.enum([
    "CANDIDATE",
    "RECRUITER",
    "ORGANIZATION",
]);

export const CompanySchema = z.object({
    companyName: z.string().min(1, {
        message: "Company Name is required",
    }),
    companyAddress: z.string().min(1, {
        message: "Company Address is required",
    }),
    companyAbout: z.string().min(50, {
        message: "Company Address is required minimum 50 words needed",
    }),
    companyBio: z.string().min(30, {
        message: "Company Bio is required minimum 30 words needed",
    }),
    companyCity: z.string().min(1, {
        message: "Company City is required",
    }),
    companyState: z.string().min(1, {
        message: "Company State is required",
    }),
    companyCountry: z.string().min(1, {
        message: "Company Country is required",
    }),
    companyWebsite: z.string().min(1, {
        message: "Company Website URL is required",
    }).optional(),
    companyTotalEmployees: z.string().min(1, {
        message: "Total Employees must be at least 1",
    }),
});

export const ChangePasswordSchema = z.object({
    oldPassword: z.string().min(6, "Required"),
    newPassword: z.string().min(6, "Minimum 6 characters"),
});

export const ChangeEmailSchema = z.object({
    email: z.string().email("Invalid email"),
});

export const DeleteAccountSchema = z.object({
    password: z.string().min(6, "Password required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "Must include uppercase")
    .regex(/[0-9]/, "Must include number"),
});