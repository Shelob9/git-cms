import '../styles/globals.css'
import { CookiesProvider } from 'react-cookie';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CookiesProvider>
        <>
          <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
              <Component {...pageProps} />
            </main>
          </div>
          <footer className="flex items-center justify-center w-full h-24 border-t">
            ...
          </footer>
      
        </>
      </CookiesProvider>
    </>
  )
}

export default MyApp
