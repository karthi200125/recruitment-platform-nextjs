"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Building2,
    Globe,
    MapPin,
    Users,
    FileText,
    Image as ImageIcon,
    AlertCircle,
} from "lucide-react";

import { createCompanyAction } from "@/actions/company/create-company";
import Button from "@/components/Button";
import CustomFormField from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import FormError from "@/components/ui/FormError";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCustomToast } from "@/lib/CustomToast";
import { CompanySchema } from "@/lib/SchemaTypes";
import { UploadFile } from "@/components/upload/UploadFile";
import type { Company } from "@/types";

interface CompanyFormProps {
    company?: Company | null;
}

interface SectionProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}

function Section({ icon, title, description, children }: SectionProps) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr] md:gap-8">
            {/* Left: label */}
            <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    <span className="text-neutral-400">{icon}</span>
                    {title}
                </div>
                <p className="text-xs leading-relaxed text-neutral-500">{description}</p>
            </div>

            <div>{children}</div>
        </div>
    );
}

function SectionDivider() {
    return <hr className="border-neutral-100" />;
}

export default function CompanyForm({ company }: CompanyFormProps) {
    const { user } = useCurrentUser();
    const router = useRouter();
    const [isLoading, startTransition] = useTransition();
    const { update } = useSession();
    const { showErrorToast, showSuccessToast } = useCustomToast();

    const [err, setErr] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const [companyImage, setCompanyImage] = useState(
        company?.companyImage ?? ""
    );
    const [companyImagePublicId, setCompanyImagePublicId] = useState(
        company?.companyImagePublicId ?? ""
    );

    const isEdit = Boolean(company);

    const form = useForm<z.infer<typeof CompanySchema>>({
        resolver: zodResolver(CompanySchema),
        mode: "onChange",
        defaultValues: {
            companyName: company?.companyName ?? "",
            companyAddress: company?.companyAddress ?? "",
            companyCity: company?.companyCity ?? "",
            companyState: company?.companyState ?? "",
            companyCountry: company?.companyCountry ?? "",
            companyWebsite: company?.companyWebsite ?? "",
            companyTotalEmployees: company?.companyTotalEmployees ?? "",
            companyBio: company?.companyBio ?? "",
            companyAbout: company?.companyAbout ?? "",
        },
    });

    const onSubmit = (values: z.infer<typeof CompanySchema>) => {
        if (!user?.id) {
            showErrorToast("User not found.");
            return;
        }

        setErr("");

        startTransition(async () => {
            const result = await createCompanyAction(
                values,
                companyImage,
                companyImagePublicId,
                isEdit,
                company?.id
            );

            if ("error" in result) {
                setErr(result.error);
                showErrorToast(result.error);
                return;
            }

            await update();
            showSuccessToast(result.success);
            router.refresh();

            if (!isEdit) {
                router.push(`/userProfile/${user.id}`);
            }
        });
    };

    const logoReady = isEdit ? true : Boolean(companyImage);

    const canSubmit =
        form.formState.isValid &&
        logoReady &&
        !isUploading &&
        !isLoading;

    const fieldLoading = isLoading;

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
                noValidate
            >
                {/* ── Section 1: Identity ── */}
                <Section
                    icon={<Building2 className="h-4 w-4" />}
                    title="Company identity"
                    description="Your company's name and website as they'll appear to candidates."
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <CustomFormField
                            name="companyName"
                            form={form}
                            label="Company name"
                            placeholder="e.g. Acme Corp"
                            isLoading={fieldLoading}
                        />
                        <CustomFormField
                            name="companyWebsite"
                            form={form}
                            label="Website"
                            placeholder="https://acme.com"
                            isLoading={fieldLoading}
                        />
                    </div>
                </Section>

                <SectionDivider />

                {/* ── Section 2: Location ── */}
                <Section
                    icon={<MapPin className="h-4 w-4" />}
                    title="Location"
                    description="Where your company is based. Candidates use this to filter jobs by location."
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <CustomFormField
                            name="companyAddress"
                            form={form}
                            label="Street address"
                            placeholder="e.g. 123 Main St"
                            isLoading={fieldLoading}
                        />
                        <CustomFormField
                            name="companyCity"
                            form={form}
                            label="City"
                            placeholder="e.g. Chennai"
                            isLoading={fieldLoading}
                        />
                        <CustomFormField
                            name="companyState"
                            form={form}
                            label="State / Province"
                            placeholder="e.g. Tamil Nadu"
                            isLoading={fieldLoading}
                        />
                        <CustomFormField
                            name="companyCountry"
                            form={form}
                            label="Country"
                            placeholder="e.g. India"
                            isLoading={fieldLoading}
                        />
                    </div>
                </Section>

                <SectionDivider />

                {/* ── Section 3: Company details ── */}
                <Section
                    icon={<Users className="h-4 w-4" />}
                    title="Company details"
                    description="Help candidates understand your company's size and culture."
                >
                    <div className="space-y-4">
                        <CustomFormField
                            name="companyTotalEmployees"
                            form={form}
                            label="Total employees"
                            placeholder="e.g. 50–200"
                            isLoading={fieldLoading}
                        />
                        {/* Bio is the short tagline — shown in listings */}
                        <CustomFormField
                            name="companyBio"
                            form={form}
                            label="Company tagline"
                            placeholder="A one-line summary of what your company does (min 30 characters)"
                            isLoading={fieldLoading}
                            isTextarea
                        />
                        {/* About is the long-form description — shown on the company page */}
                        <CustomFormField
                            name="companyAbout"
                            form={form}
                            label="About your company"
                            placeholder="Tell candidates about your mission, culture, and what makes your company a great place to work (min 50 characters)"
                            isLoading={fieldLoading}
                            isTextarea
                        />
                    </div>
                </Section>

                <SectionDivider />

                {/* ── Section 4: Logo ── */}
                <Section
                    icon={<ImageIcon className="h-4 w-4" />}
                    title="Company logo"
                    description={
                        isEdit
                            ? "Replace your logo or keep the existing one."
                            : "Upload your company logo. Required before you can create your profile."
                    }
                >
                    <div className="space-y-3">
                        <UploadFile
                            type="company-logo"
                            existingFile={
                                companyImage
                                    ? { url: companyImage, name: company?.companyName ?? "Company logo" }
                                    : undefined
                            }
                            fields={company?.id ? { companyId: company.id } : undefined}
                            onUploadSuccess={(result) => {
                                setCompanyImage(result.url);
                                setCompanyImagePublicId(result.publicId);
                                setIsUploading(false);
                            }}
                            onDelete={() => {
                                setCompanyImage("");
                                setCompanyImagePublicId("");
                            }}
                            disabled={fieldLoading}
                        />
                        {!isEdit && !companyImage && form.formState.isSubmitted && (
                            <p className="flex items-center gap-1.5 text-xs text-red-600">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                A company logo is required.
                            </p>
                        )}
                    </div>
                </Section>

                <SectionDivider />

                {/* ── Submit ── */}
                <div className="flex flex-col gap-3">
                    <FormError message={err} />

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-neutral-400">
                            {isEdit
                                ? "Changes are saved immediately and visible to all users."
                                : "You can edit these details at any time from your company settings."}
                        </p>

                        <Button
                            type="submit"
                            disabled={!canSubmit}
                            isLoading={isLoading}
                        >
                            {isEdit ? "Save changes" : "Create company"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}