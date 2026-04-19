'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { CreateJobSchema } from '@/lib/SchemaTypes';
import { createJobAction } from '@/actions/job/createJobAction';
import { getRecruiterCompany } from '@/actions/company/getCompanies';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCustomToast } from '@/lib/CustomToast';

import Button from '@/components/Button';
import CustomFormField from '@/components/CustomFormField';
import JobDesc from './JobDesc';
import JobSkills from '../(pages)/createJob/JobSkills';
import JobQuestion from '../(pages)/createJob/JobQuestion';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

import { Switch } from '@/components/ui/switch';

import {
  experiences,
  getCities,
  getStates,
  JobMode,
  JobTypes,
} from '@/getOptionsData';

interface CreateJobFormProps {
  job?: any;
  isEdit?: boolean;
}

const CreateJobForm = ({
  job,
  isEdit = false,
}: CreateJobFormProps) => {
  const { user } = useCurrentUser();

  const router = useRouter();

  const { showErrorToast, showSuccessToast } =
    useCustomToast();

  const [jobDesc, setJobDesc] = useState(
    job?.jobDesc ?? ''
  );

  const [skills, setSkills] = useState<string[]>(
    job?.skills ?? []
  );

  const [questions, setQuestions] = useState<string[]>(
    job?.questions ?? []
  );

  const [skillsErr, setSkillsErr] = useState('');
  const [state, setState] = useState('');

  const [isLoading, startTransition] =
    useTransition();

  const { data: recruiterCompany } = useQuery({
    queryKey: ['getRecruiterCompany', user?.id],
    queryFn: () =>
      getRecruiterCompany(user?.id),
    enabled:
      !!user?.id &&
      user?.role === 'RECRUITER',
  });

  const companyName = useMemo(() => {
    if (!user) return '';

    return user.role === 'ORGANIZATION'
      ? user.username
      : recruiterCompany?.companyName ?? '';
  }, [user, recruiterCompany]);

  const form = useForm<
    z.infer<typeof CreateJobSchema>
  >({
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

  useEffect(() => {
    if (companyName) {
      form.setValue('company', companyName);
    }
  }, [companyName, form]);

  const onSubmit = useCallback(
    (values: z.infer<typeof CreateJobSchema>) => {
      startTransition(async () => {
        if (skills.length < 1) {
          setSkillsErr('Add at least one skill');
          showErrorToast('Add at least one skill');
          return;
        }

        if (!jobDesc.trim()) {
          showErrorToast(
            'Add a Job Description'
          );
          return;
        }

        const result = await createJobAction({
          values,
          skills,
          questions,
          jobDesc,
          isEdit,
          jobId: job?.id,
        });

        if (result?.error) {
          showErrorToast(result.error);
          return;
        }

        if (result?.success) {
          showSuccessToast(result.success);
          router.push('/dashboard');
        }
      });
    },
    [
      skills,
      questions,
      jobDesc,
      isEdit,
      job?.id,
      router,
      showErrorToast,
      showSuccessToast,
    ]
  );

  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: getStates,
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities', state],
    queryFn: () => getCities(state),
    enabled: !!state,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* YOUR EXISTING FORM JSX CAN STAY SAME */}

        <Button
          isLoading={isLoading}
          className="w-full"
        >
          {isEdit ? 'Edit Job' : 'Create Job'}
        </Button>
      </form>
    </Form>
  );
};

export default CreateJobForm;