'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { register } from "@/actions/auth/Register";
import { RegisterSchema, RoleSchema } from "@/lib/SchemaTypes";

import Button from "@/components/Button";
import FormError from "@/components/ui/FormError";
import FormSuccess from "@/components/ui/FormSuccess";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { FaLock, FaLockOpen } from "react-icons/fa";
import { useCustomToast } from "@/lib/CustomToast";

type Role = z.infer<typeof RoleSchema>;

const roles: Role[] = ["CANDIDATE", "RECRUITER", "ORGANIZATION"];

const RegisterForm = () => {
    const router = useRouter();
    const { showErrorToast } = useCustomToast();

    const [showPass, setShowPass] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | undefined>();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
        setSuccess("");

        if (!selectedRole) {
            showErrorToast("Please select a role.");
            return;
        }

        startTransition(async () => {
            const result = await register(values, selectedRole);

            if (result?.error) {
                setError(result.error);
                return;
            }

            if (result?.success) {
                setSuccess(result.success);

                form.reset();
                setSelectedRole(undefined);

                router.push("/signin");
            }
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
            >
                {/* ROLE SELECT */}
                <Select
                    value={selectedRole}
                    onValueChange={(value) => setSelectedRole(value as Role)}
                    disabled={isPending}
                >
                    <SelectTrigger className="w-full bg-white/[0.02] border border-white/10">
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {/* USERNAME */}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Enter Username"
                                    disabled={isPending}
                                    className="bg-white/[0.02] border border-white/10"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* EMAIL */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter Email"
                                    disabled={isPending}
                                    className="bg-white/[0.02] border border-white/10"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* PASSWORD */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showPass ? "text" : "password"}
                                        placeholder="Enter Password"
                                        disabled={isPending}
                                        className="bg-white/[0.02] border border-white/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPass((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                                    >
                                        {showPass ? <FaLockOpen /> : <FaLock />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormError message={error} />
                <FormSuccess message={success} />

                <Button
                    type="submit"
                    isLoading={isPending}
                    className="w-full !bg-white !text-black"
                >
                    Register
                </Button>
            </form>
        </Form>
    );
};

export default RegisterForm;