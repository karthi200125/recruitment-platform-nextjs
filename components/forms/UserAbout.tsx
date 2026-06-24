'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface UserAboutProps {
    onUserAbout: (content: string) => void;
    UserAbout?: any;
}

const UserAbout = ({ onUserAbout, UserAbout }: UserAboutProps) => {
    const [value, setValue] = useState<string>(UserAbout || '');

    const handleChange = (content: string) => {
        setValue(content);
        onUserAbout(content);
    };

    return (
        <ReactQuill
            value={value}
            onChange={handleChange}
            theme="snow"
            placeholder="Write the About you..."
        />
    );
};

export default UserAbout;
