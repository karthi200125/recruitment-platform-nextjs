import * as z from "zod";

export const UserInfoSchema = z.object({
    username: z.string().trim().min(3, {
        message: "Username must be at least 3 characters.",
    }).max(30, {
        message: "Username cannot exceed 30 characters.",
    }),
    email: z.string().email({
        message: "Invalid email address.",
    }),
    firstName: z.string().trim().max(50, {
        message: "First name cannot exceed 50 characters.",
    }).optional().or(z.literal("")),
    lastName: z.string().trim().max(50, {
        message: "Last name cannot exceed 50 characters.",
    }).optional().or(z.literal("")),

    userBio: z.string().trim().max(100, {
        message: "User bio cannot exceed 100 characters.",
    }).optional().or(z.literal("")),
    website: z.union([z.literal(""), z.string().trim().url({
        message: "Please enter a valid website URL.",
    }),]).optional(),
    profession: z.string().trim().max(100, {
        message: "Profession cannot exceed 100 characters.",
    }).optional().or(z.literal("")),
    gender: z.string().trim().optional().or(z.literal("")),
    address: z.string().trim().max(255, {
        message: "Address cannot exceed 255 characters.",
    }).optional().or(z.literal("")),
    city: z.string().trim().max(100, {
        message: "City cannot exceed 100 characters.",
    }).optional().or(z.literal("")),
    state: z.string().trim().max(100, {
        message: "State cannot exceed 100 characters.",
    }).optional().or(z.literal("")),
    country: z.string().trim().max(100, {
        message: "Country cannot exceed 100 characters.",
    }).optional().or(z.literal("")),
    postalCode: z.string().trim().max(20, {
        message: "Postal code cannot exceed 20 characters.",
    }).optional().or(z.literal("")),
    phoneNo: z.union([z.literal(""), z.string().trim().regex(/^[0-9]{10}$/, {
        message: "Phone number must contain exactly 10 digits.",
    }),]).optional(),
});


export const ChangePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required."),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters."),
        confirmPassword: z.string().min(1, "Confirm your password."),
    })
    .refine(
        (data) => data.newPassword === data.confirmPassword,
        {
            path: ["confirmPassword"],
            message: "Passwords do not match.",
        }
    );

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
        message: "Job Experience is required",
    }),

    salary: z.string().min(1, {
        message: "Job Salary is required",
    }),

    city: z.string().min(1, {
        message: "Job City is required",
    }),

    state: z.string().min(1, {
        message: "Job State is required",
    }),

    country: z.string().min(1, {
        message: "Job Country is required",
    }),

    type: z.string().min(1, {
        message: "Job Type is required",
    }),

    mode: z.string().min(1, {
        message: "Job Mode is required",
    }),

    company: z.string().min(1, {
        message: "Company is required",
    }),

    isEasyApply: z.boolean(),

    applyLink: z.string(),

    vacancies: z.string().min(1, {
        message: "Vacancies are required",
    }),
})
    .refine(
        (data) =>
            data.isEasyApply ||
            data.applyLink.trim().length > 0,
        {
            path: ["applyLink"],
            message: "Apply link is required.",
        }
    );

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
        message: "Company description must contain at least 50 characters.",
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
    companyWebsite: z
        .string()
        .trim()
        .url("Enter a valid website URL.")
        .optional()
        .or(z.literal("")),
    companyTotalEmployees: z.string().min(1, {
        message: "Total Employees must be at least 1",
    }),
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

export const ChangeEmailSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().optional(),
});

export const DeleteAccountSchema = z.object({
    password: z.string().optional(),
    confirmText: z.string().refine(
        (val) => val === "DELETE",
        {
            message: 'Type "DELETE" to confirm',
        }
    ),
});
