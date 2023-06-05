import { useRouter } from 'next/router'
import Profils from '../../components/Profils'

export default function ProfilesPage() {
  const router = useRouter()
  const { username } = router.query

return <Profils username={username}/>
}
