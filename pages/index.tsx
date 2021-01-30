import useSession from "../hooks/useSession"
import Link from 'next/link'

export default function Home() {
  const { isLoggedIn } = useSession();
  return (
    <>
      <>
        <h1>
          Welcome to{' '}
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>
        <div>
          <p>Hi Roy</p>
          <p>{isLoggedIn ? 'Logged in' :  <Link href="/login">
            <a>Login</a>
          </Link>}
          </p>
        </div>
       
        
      </>
    </>
  )
}
