import { useRouter } from 'next/router'
import BriefUser from '../../components/BriefUser';

export default function BriefUserPage() {
  const router = useRouter()
  const { creationId } = router.query

  return (
    <BriefUser creationId={creationId} />
  );
  }