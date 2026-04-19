'use client';

import React, { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CiSearch } from "react-icons/ci";
import { debounce } from '@/lib/debounce';

interface SelectProps {
    field: {
        onChange: (value: string) => void;
        value: string;
    };
    label?: string;
    placeholder?: string;
    isLoading?: boolean;
    selectCls?: string;
    options?: string[];
    optionsLoading?: boolean
    onSelect?: (value: string) => void;
}

const CustomSelect: React.FC<SelectProps> = ({
    field,
    placeholder,
    isLoading = false,
    options = [],
    selectCls = '',
    onSelect,
    optionsLoading
}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filteredOptions, setFilteredOptions] = useState<string[]>(options || []);

    const debounceSearch = debounce((term: string) => {
        setFilteredOptions(
            options.filter(option =>
                option.toLowerCase().includes(term.toLowerCase())
            )
        );
    }, 300);

    useEffect(() => {
        debounceSearch(searchTerm);
    }, [searchTerm, options]);

    const handleValueChange = (value: string) => {
        field.onChange(value);
        onSelect?.(value);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <Select
            onValueChange={handleValueChange}
            value={field.value}
            disabled={isLoading}
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <SelectTrigger
                className={`w-full ${selectCls} ${field.value ? 'font-bold' : 'text-[var(--lighttext)] font-normal'}`}
                onClick={() => setIsOpen(true)}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <div className="w-full flex items-center gap-2 border-b border-gray-300 px-2">
                    <CiSearch size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        className="w-full p-2 focus:outline-none text-sm font-bold placeholder:text-[var(--lighttext)]"
                    />
                </div>
                <SelectGroup>
                    {filteredOptions.length > 0 ?
                        optionsLoading ?
                            <h4>Loading.....</h4>
                            :
                            (
                                filteredOptions?.map(option => (
                                    <SelectItem key={option} value={option} className="capitalize">
                                        {option}
                                    </SelectItem>
                                ))
                            ) : (
                            <h4 className="p-2 text-[var(--lighttext)] font-semibold">
                                No options found
                            </h4>
                        )}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default CustomSelect;
