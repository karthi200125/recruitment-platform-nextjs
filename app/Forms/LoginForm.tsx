'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { LoginSchema } from "@/lib/SchemaTypes";
import Button from "@/components/Button";
import FormError from "@/components/ui/FormError";
import { Input } from "@/components/ui/input";
import {
    Form, FormControl, FormField, FormItem, FormMessage,
} from "@/components/ui/form";
import { FaLock, FaLockOpen } from "react-icons/fa";

const LoginForm = () => {
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");

        startTransition(async () => {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false, // 🔥 IMPORTANT
            });

            if (result?.error) {
                setError("Invalid email or password.");
                return;
            }

            // ✅ Get session to check role
            const sessionRes = await fetch("/api/auth/session");
            const session = await sessionRes.json();

            const role = session?.user?.role;

            
            if (!role) {
                router.push("/selectrole");
            } else if (role === "CANDIDATE") {
                router.push("/jobs");
            } else {
                router.push("/dashboard");
            }

            router.refresh(); 
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">

                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input {...field} type="email" placeholder="Email"
                                disabled={isPending}
                                className="bg-white/[0.02] border border-white/10" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <div className="relative">
                                <Input {...field} type={showPass ? "text" : "password"}
                                    placeholder="Password" disabled={isPending}
                                    className="bg-white/[0.02] border border-white/10" />
                                <button type="button"
                                    onClick={() => setShowPass((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                                    {showPass ? <FaLockOpen /> : <FaLock />}
                                </button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormError message={error} />

                <Button type="submit" isLoading={isPending} className="w-full">
                    Login
                </Button>
            </form>
        </Form>
    );
};

export default LoginForm;