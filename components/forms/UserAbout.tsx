"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(
    () => import("react-quill"),
    {
        ssr: false,
    }
);

interface UserAboutProps {
    userAbout?: string | null;
    onUserAbout: (content: string) => void;
}

const UserAbout = ({
    userAbout,
    onUserAbout,
}: UserAboutProps) => {
    const [value, setValue] = useState(
        userAbout ?? ""
    );

    useEffect(() => {
        setValue(userAbout ?? "");
    }, [userAbout]);

    const handleChange = (
        content: string
    ) => {
        setValue(content);
        onUserAbout(content);
    };

    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={handleChange}
            placeholder="Write about yourself..."
        />
    );
};

export default UserAbout;