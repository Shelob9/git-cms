
import { useCookies } from 'react-cookie'
import { useMemo, useEffect, useState } from 'react'
const useSession = () => {
	let cookieName = process.env.NEXT_PUBLIC_GIT_CMS_COOKIE_NAME;
	const [cookies, setCookie] = useCookies([cookieName])
    const [session, setSession] = useState<{ jwt: string; uuid: string }|undefined>();

	useEffect(() => {
		if (cookies[cookieName]) {
			startSession(cookies[cookieName])
		}
	}, [])
	const removeCookie = () => {
		setCookie(cookieName, undefined, {
			path: '/',
			expires: new Date(3),
		})
	}
	
    const startSession = (newSession: { jwt: string; uuid: string }) => {
        setCookie(cookieName, JSON.stringify(newSession), { path: '/' });
        setSession(newSession);
    };

    const endSession = () => {
        setSession(undefined);
        setCookie(cookieName, undefined, {
			path: '/',
			expires: new Date(3),
		})
	}
	
	const isLoggedIn = useMemo<boolean>(() => {
		return undefined != session;
	}, [session,cookies]);
    
	return { session,endSession, removeCookie,startSession,isLoggedIn }
}

export default useSession;