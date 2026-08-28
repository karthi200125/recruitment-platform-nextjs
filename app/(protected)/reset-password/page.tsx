import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";


export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="h-[calc(100vh-100px)] flex items-center justify-center">
                    Loading...
                </div>
            }
        >
            <ResetPasswordClient />
        </Suspense>
    );
}