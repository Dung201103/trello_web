import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'
function AccountVerification() {
  //Lay gia tri email va token tu url
  let [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])
  //Tao mot bien state de biet duoc la da verify tai khoan thanh cong hay chua
  const [verified, setVerifyed] = useState(false)
  //Goi Api de verify tai khoan
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerifyed(true))
    }
  }, [email, token])
  //Neu url co van de thi 404
  if (!email || !token) {
    return <Navigate to='/404' />
  }
  //Neu chua verify thi hien loading
  if (!verified) {
    return <PageLoadingSpinner caption='Verifying your account...' />
  }
  return (
    <Navigate to={`/login?verifiedEmail=${email}`} />
  )
}

export default AccountVerification