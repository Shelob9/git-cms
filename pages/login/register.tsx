import Link from "next/link";
import { useRef } from "react"
import useSession from '../../src/hooks/useSession';
export default function Register() {
    let emailRef = useRef<HTMLInputElement>();
    let passwordRef = useRef<HTMLInputElement>();
    let inviteCodeRef = useRef<HTMLInputElement>();
    let { startSession,isLoggedIn } = useSession();
    const onSubmit = (e) => {
        e.preventDefault();
        fetch(`/api/register`, {
            method: 'POST',
            body: JSON.stringify({
                email: emailRef.current.value,
                password: passwordRef.current.value,
                inviteCode:inviteCodeRef.current.value
            }),
            headers: {
                "content-type": "application/json"
            }
        }).then(r => r.json())
            .then(r => {
                //@ts-ignore
                startSession(r.session);
            })
    };

    return (
        <div>
            {isLoggedIn ? <div>Logged In!</div> : (
                <form onSubmit={onSubmit} action="/api/register" method="POST">
                    <div>
                        <label htmlFor={"email"}>Email</label>
                        <input name={"email"} type={"email"} ref={emailRef}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor={"password"}>Password</label>
                        <input name={"password"} type={"password"} ref={passwordRef}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor={"inviteCode"}>Invite Code</label>
                        <input name={"inviteCode"} type={"text"} ref={inviteCodeRef}
                            required
                            defaultValue={"roy"}
                        />
                    </div>
                    <div>
                        <button type={"submit"} onClick={onSubmit}>Login</button>
                    </div>
                </form>
            )}
            <p><Link href="/login/logout"><a>Logout</a></Link></p>
        </div>
        
    )
}