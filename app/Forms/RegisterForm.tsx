'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { register } from "@/actions/auth/Register";
import { RegisterSchema } from "@/lib/SchemaTypes";

import Button from "@/components/Button";
import FormError from "@/components/ui/FormError";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { FaLock, FaLockOpen } from "react-icons/fa";
import Link from "next/link";

const RegisterForm = () => {
    const router = useRouter();

    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");

        startTransition(async () => {
            const result = await register(values);

            if (result?.error) {
                setError(result.error);
                return;
            }

            router.push("/selectrole");
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">

                <FormField control={form.control} name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Enter Username"
                                    className="bg-white/[0.02] border border-white/10 text-white"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                <FormField control={form.control} name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter Email"
                                    className="bg-white/[0.02] border border-white/10 text-white"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                <FormField control={form.control} name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <Input {...field}
                                        type={showPass ? "text" : "password"}
                                        placeholder="Enter Password"
                                        className="bg-white/[0.02] border border-white/10 text-white"
                                    />
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

                <Link
                    href="/forgot-password"
                    className="text-sm text-gray-500 hover:text-blue-500 transition text-end mt-5"
                >
                    Forgot password?
                </Link>

                <FormError message={error} />

                <Button type="submit" isLoading={isPending} className="w-full">
                    Register
                </Button>
            </form>
        </Form>
    );
};

export default RegisterForm;