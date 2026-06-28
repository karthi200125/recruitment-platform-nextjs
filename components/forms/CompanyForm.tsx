'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createCompanyAction } from "@/actions/company/create-company";
import Button from '@/components/Button';
import CustomFormField from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import FormError from '@/components/ui/FormError';
import FormSuccess from '@/components/ui/FormSuccess';
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CompanySchema } from "@/lib/SchemaTypes";
import { Company } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from 'react';

interface CompanyFormProps {
    company?: Company,
    isPending?: boolean;
}

const CompanyForm = ({ company, isPending }: CompanyFormProps) => {

    const { user } = useCurrentUser()
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const [isLoading, startTransition] = useTransition();

    const form = useForm<z.infer<typeof CompanySchema>>({
        resolver: zodResolver(CompanySchema),
        defaultValues: {
            companyName: user?.username || "",
            companyAddress: company?.companyAddress || "",
            companyCity: company?.companyCity || "",
            companyState: company?.companyState || "",
            companyCountry: company?.companyCountry || "",
            companyWebsite: company?.companyWebsite || "",
            companyTotalEmployees: company?.companyTotalEmployees || "",
            companyAbout: company?.companyAbout || "",
            companyBio: company?.companyBio || "",
        },
    });

    const onSubmit = (values: z.infer<typeof CompanySchema>) => {
        startTransition(() => {
            const userId = user?.id
            const isEdit = company ? true : false
            const companyId = company?.id
            createCompanyAction(values, isEdit, companyId)
                .then((data) => {
                    console.log(data)
                    if (data?.success) {
                        setSuccess(data?.success)
                        router.push(`/userProfile/${user?.id}`)
                    }
                    if (data?.error) {
                        setErr(data?.error)
                    }
                })
        });
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <CustomFormField
                        name="companyName"
                        form={form}
                        label="Company Name"
                        placeholder="Ex: Google"
                        isLoading={(isLoading || isPending)}
                    />
                    <CustomFormField
                        name="companyAddress"
                        form={form}
                        label="Company Address"
                        placeholder="Ex: 123 Street"
                        isLoading={(isLoading || isPending)}
                    />
                    <CustomFormField
                        name="companyCountry"
                        form={form}
                        label="Company Country"
                        placeholder="Ex: India"
                        isLoading={(isLoading || isPending)}
                    />
                    <CustomFormField
                        name="companyState"
                        form={form}
                        label="Company State"
                        placeholder="Ex: TamilNadu"
                        isLoading={(isLoading || isPending)}
                    />
                    {/* {state && ( */}
                    <CustomFormField
                        name="companyCity"
                        form={form}
                        label="Company City"
                        placeholder="Ex: Chennai"
                        isLoading={(isLoading || isPending)}
                    />
                    {/* )} */}
                    <CustomFormField
                        name="companyWebsite"
                        form={form}
                        label="Company Website"
                        placeholder="Ex: https://google.com"
                        isLoading={(isLoading || isPending)}
                    />
                    <CustomFormField
                        name="companyTotalEmployees"
                        form={form}
                        label="Company Total Employees"
                        placeholder="Ex: 100"
                        isLoading={(isLoading || isPending)}
                    />
                </div>
                <CustomFormField
                    name="companyBio"
                    form={form}
                    label="About Company Bio"
                    placeholder="Ex:write about company Bio"
                    isLoading={(isLoading || isPending)}
                    isTextarea
                />
                <CustomFormField
                    name="companyAbout"
                    form={form}
                    label="About Company"
                    placeholder="Ex:write about company"
                    isLoading={(isLoading || isPending)}
                    isTextarea
                />

                <FormError message={err} />
                <FormSuccess message={success} />
                <Button isLoading={(isLoading || isPending)} className="w-full">Submit</Button>
            </form>
        </Form>
    );
}

export default CompanyForm;
