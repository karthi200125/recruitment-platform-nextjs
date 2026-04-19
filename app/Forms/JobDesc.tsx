'use client';

import dynamic from 'next/dynamic';
import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(
    () => import('react-quill'),
    {
        ssr: false,
    }
);

interface JobDescProps {
    onJobDesc: (
        content: string
    ) => void;
    jobDesc?: string;
}

const JobDesc = ({
    onJobDesc,
    jobDesc = '',
}: JobDescProps) => {
    const [value, setValue] =
        useState(jobDesc);

    useEffect(() => {
        setValue(jobDesc);
    }, [jobDesc]);

    const handleChange = useCallback(
        (content: string) => {
            setValue(content);
            onJobDesc(content);
        },
        [onJobDesc]
    );

    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={handleChange}
            placeholder="Write the job description here..."
            className="min-h-[250px]"
        />
    );
};

export default JobDesc;