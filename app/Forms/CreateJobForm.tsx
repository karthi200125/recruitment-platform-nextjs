'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Briefcase, MapPin, DollarSign, Settings2, FileText, Zap, Link2, Users, Building2 } from 'lucide-react';

import { CreateJobSchema } from '@/lib/SchemaTypes';
import { createJobAction } from '@/actions/job/createJobAction';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCustomToast } from '@/lib/CustomToast';

import JobDesc from './JobDesc';
import JobSkills from '../(pages)/createJob/JobSkills';
import JobQuestion from '../(pages)/createJob/JobQuestion';
import { getCompanies } from '@/actions/company/getCompanies';

import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  job?: any;
  isEdit?: boolean;
}

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
const labelCls = "text-xs font-semibold text-slate-700 uppercase tracking-wide";

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
      <Icon className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    </div>
  );
}

const CreateJobForm = ({ job, isEdit = false }: Props) => {
  const { user } = useCurrentUser();
  const router = useRouter();
  const { showErrorToast, showSuccessToast } = useCustomToast();

  const [jobDesc, setJobDesc] = useState(job?.jobDesc ?? '');
  const [skills, setSkills] = useState<string[]>(job?.skills ?? []);
  const [questions, setQuestions] = useState<string[]>(job?.questions ?? []);
  const [isLoading, startTransition] = useTransition();
  const [isEasyApply, setIsEasyApply] = useState<boolean>(job?.isEasyApply ?? false);

  const { data: recruiterCompany } = useQuery({
    queryKey: ['company', user?.id],
    queryFn: () => getCompanies(),
    enabled: !!user?.id && user?.role === 'RECRUITER',
  });

  const companyName = useMemo(() => {
    if (!user) return '';
    return user.role === 'ORGANIZATION' ? user.username : recruiterCompany?.[0]?.companyName || '';
  }, [user, recruiterCompany]);

  const form = useForm<z.infer<typeof CreateJobSchema>>({
    resolver: zodResolver(CreateJobSchema),
    defaultValues: {
      jobTitle: job?.jobTitle ?? '',
      experience: job?.experience ?? '',
      city: job?.city ?? '',
      state: job?.state ?? '',
      country: job?.country ?? 'India',
      salary: job?.salary ?? '',
      isEasyApply: job?.isEasyApply ?? false,
      type: job?.type ?? '',
      mode: job?.mode ?? '',
      applyLink: job?.applyLink ?? '',
      company: companyName,
      vacancies: job?.vacancies ?? '',
    },
  });

  useEffect(() => { if (companyName) form.setValue('company', companyName); }, [companyName, form]);

  const onSubmit = useCallback((values: z.infer<typeof CreateJobSchema>) => {
    startTransition(async () => {
      if (!jobDesc.trim()) { showErrorToast('Job description is required'); return; }
      if (skills.length === 0) { showErrorToast('Add at least one skill'); return; }

      const res = await createJobAction({ values, skills, questions, jobDesc, isEdit, jobId: job?.id });
      if (res?.error) { showErrorToast(res.error); return; }
      showSuccessToast(res.success || 'Job saved successfully');
      router.push('/dashboard');
    });
  }, [jobDesc, skills, questions, isEdit, job?.id, router, showErrorToast, showSuccessToast]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* ── Basic Info ── */}
        <div className="space-y-5">
          <SectionHeader icon={Briefcase} title="Job Details" />

          <FormField control={form.control} name="jobTitle" render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Job Title *</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Senior Frontend Developer" className={inputCls} {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="experience" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Experience</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 2–4 years" className={inputCls} {...field} />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )} />

            <FormField control={form.control} name="vacancies" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Vacancies</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 3" className={inputCls} {...field} />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )} />
          </div>
        </div>

        {/* ── Compensation ── */}
        <div className="space-y-5">
          <SectionHeader icon={DollarSign} title="Compensation" />
          <FormField control={form.control} name="salary" render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Salary Range</FormLabel>
              <FormControl>
                <Input placeholder="e.g. ₹8–15 LPA" className={inputCls} {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )} />
        </div>

        {/* ── Location ── */}
        <div className="space-y-5">
          <SectionHeader icon={MapPin} title="Location" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['city', 'state', 'country'] as const).map((name) => (
              <FormField key={name} control={form.control} name={name} render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>{name.charAt(0).toUpperCase() + name.slice(1)}</FormLabel>
                  <FormControl>
                    <Input placeholder={name === 'city' ? 'Chennai' : name === 'state' ? 'Tamil Nadu' : 'India'} className={inputCls} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )} />
            ))}
          </div>
        </div>

        {/* ── Job Config ── */}
        <div className="space-y-5">
          <SectionHeader icon={Settings2} title="Job Configuration" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Job Type</FormLabel>
                <FormControl>
                  <select {...field} className={inputCls}>
                    <option value="">Select type</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )} />

            <FormField control={form.control} name="mode" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Work Mode</FormLabel>
                <FormControl>
                  <select {...field} className={inputCls}>
                    <option value="">Select mode</option>
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )} />
          </div>

          {/* Easy Apply toggle */}
          <FormField control={form.control} name="isEasyApply" render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(val) => { field.onChange(val); setIsEasyApply(!!val); }}
                    className="mt-0.5"
                  />
                </FormControl>
                <div>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2.5} />
                    Enable Easy Apply
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Candidates can apply with one click without leaving the platform.</p>
                </div>
              </div>
            </FormItem>
          )} />

          {/* Apply link — shown only when Easy Apply is off */}
          {!isEasyApply && (
            <FormField control={form.control} name="applyLink" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>
                  <span className="flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5" strokeWidth={2} />External Apply Link</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://yourcompany.com/careers/role" className={inputCls} {...field} />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )} />
          )}
        </div>

        {/* ── Company (read-only) ── */}
        <div className="space-y-5">
          <SectionHeader icon={Building2} title="Company" />
          <FormField control={form.control} name="company" render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Company Name</FormLabel>
              <FormControl>
                <Input {...field} disabled className={inputCls} />
              </FormControl>
              <p className="text-[11px] text-slate-400 mt-1">Auto-filled from your company profile.</p>
            </FormItem>
          )} />
        </div>

        {/* ── Description, Skills, Questions ── */}
        <div className="space-y-5">
          <SectionHeader icon={FileText} title="Job Description" />
          <JobDesc jobDesc={jobDesc} onJobDesc={setJobDesc} />
        </div>

        <div className="space-y-5">
          <SectionHeader icon={Users} title="Required Skills" />
          <JobSkills alreadySkills={skills} onSkills={setSkills} />
        </div>

        <div className="space-y-5">
          <SectionHeader icon={FileText} title="Screening Questions" />
          <JobQuestion alreadyQuestions={questions} onQuestions={setQuestions} />
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-indigo-200"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />{isEdit ? 'Updating...' : 'Creating...'}</>
          ) : (
            <><Briefcase className="w-4 h-4" strokeWidth={2} />{isEdit ? 'Update Job' : 'Post Job'}</>
          )}
        </button>
      </form>
    </Form>
  );
};

export default CreateJobForm;