'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
});

interface JobDescProps {
    onJobDesc: (content: string) => void;
    jobDesc?: string;
}

const QUILL_MODULES = {
    toolbar: [
        [{ header: [2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
    ],
};

const QUILL_FORMATS = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link'];

const JobDesc = ({ onJobDesc, jobDesc = '' }: JobDescProps) => {
    const [value, setValue] = useState(jobDesc);

    useEffect(() => { setValue(jobDesc); }, [jobDesc]);

    const handleChange = useCallback((content: string) => {
        setValue(content);
        onJobDesc(content);
    }, [onJobDesc]);

    return (
        <div className="job-desc-editor">
            <style>{`
                .job-desc-editor .ql-toolbar {
                    border-top-left-radius: 12px;
                    border-top-right-radius: 12px;
                    border-color: #e2e8f0;
                    background: #f8fafc;
                    padding: 8px 12px;
                }
                .job-desc-editor .ql-container {
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                    border-color: #e2e8f0;
                    font-family: inherit;
                    font-size: 14px;
                    min-height: 220px;
                }
                .job-desc-editor .ql-editor {
                    min-height: 220px;
                    padding: 14px 16px;
                    color: #1e293b;
                    line-height: 1.7;
                }
                .job-desc-editor .ql-editor.ql-blank::before {
                    color: #94a3b8;
                    font-style: normal;
                }
                .job-desc-editor .ql-container:focus-within {
                    border-color: #818cf8;
                    box-shadow: 0 0 0 2px rgba(129,140,248,0.2);
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .job-desc-editor .ql-toolbar .ql-stroke { stroke: #64748b; }
                .job-desc-editor .ql-toolbar .ql-fill { fill: #64748b; }
                .job-desc-editor .ql-toolbar button:hover .ql-stroke { stroke: #4f46e5; }
                .job-desc-editor .ql-toolbar button:hover .ql-fill { fill: #4f46e5; }
                .job-desc-editor .ql-toolbar button.ql-active .ql-stroke { stroke: #4f46e5; }
                .job-desc-editor .ql-toolbar button.ql-active .ql-fill { fill: #4f46e5; }
            `}</style>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder="Describe the role, responsibilities, and requirements..."
            />
        </div>
    );
};

export default JobDesc;