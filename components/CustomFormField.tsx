'use client'

import React from 'react';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import CustomSelect from "./CustomSelect";
import { Textarea } from "./ui/textarea";

interface CustomFormFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    label?: string;
    name: Path<T>;
    placeholder?: string;
    type?: string;
    selectCls?: string;
    isTextarea?: boolean;
    isLoading?: boolean;
    isSelect?: boolean;
    options?: any;
    optionsLoading?: boolean;
    onSelect?: (value: string) => void;
}

const CustomFormField = <T extends FieldValues>({
    form,
    label,
    name,
    placeholder,
    type,
    isTextarea,
    isSelect,
    selectCls,
    options,
    isLoading,
    onSelect,
    optionsLoading
}: CustomFormFieldProps<T>) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        {isSelect ?
                            <CustomSelect
                                field={field}
                                placeholder={placeholder}
                                options={options}
                                isLoading={isLoading}
                                selectCls={selectCls}
                                onSelect={onSelect}
                                optionsLoading={optionsLoading}
                            />
                            :
                            isTextarea ?
                                <Textarea {...field} placeholder={placeholder} id="message-2" disabled={isLoading} />
                                :
                                <Input placeholder={placeholder} {...field} type={type || "text"} disabled={isLoading} />
                        }

                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

// PERFORMANCE FIX: Memoize CustomFormField to prevent re-renders
// Used 50+ times across SkillsForm, EducationForm, ExperienceForm, UserInfoForm, etc.
// Without memo, adding/removing one skill in SkillsForm re-renders ALL 50+ fields (500ms+ overhead)
export default React.memo(CustomFormField) as typeof CustomFormField;
