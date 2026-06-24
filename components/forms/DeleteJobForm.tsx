import { deleteJob } from '@/actions/job/delete-job';
import Button from '@/components/Button';
import { useCustomToast } from '@/lib/CustomToast';
import { useQueryClient } from '@tanstack/react-query';
import { useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JobList from '../../app/(public)/jobs/JobLists/JobList';
import { closeModal } from '@/store/ModalSlice';

const DeleteJobForm = ({ job }: any) => {

  const user = useSelector((state: any) => state.user.user)
  const [isLoading, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast()
  const dispatch = useDispatch()

  const HandleDelete = () => {
    startTransition(() => {
      deleteJob(job?.id)
        .then((data: any) => {
          if (data?.success) {
            queryClient.invalidateQueries({ queryKey: ['getUser', user?.id] })
            showSuccessToast(data?.success)
            dispatch(closeModal('deletejobmodal'))
          }
        })
    })
  }

  return (
    <div className="space-y-5">
      <JobList job={job} />
      <Button onClick={HandleDelete} isLoading={isLoading} className='w-full'>Delete Job</Button>
    </div>
  )
}

export default DeleteJobForm