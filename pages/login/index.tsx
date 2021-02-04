import Link from "next/link";
import { useRef } from "react"
import useSession from '../../hooks/useSession';
export default function Login() {
    let emailRef = useRef<HTMLInputElement>();
    let passwordRef = useRef<HTMLInputElement>();
    let { startSession,isLoggedIn } = useSession();
    const onSubmit = (e) => {
        e.preventDefault();
        fetch(`/api/login`, {
            method: 'POST',
            body: JSON.stringify({
                email: emailRef.current.value,
                password: passwordRef.current.value
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
            {isLoggedIn ? (
                <div>
                    <h2>Logged In!</h2>
                    <p><Link href="/login/logout"><a>Logout</a></Link></p>
                </div>
            ) : (
                    <div>
                        <h2>Login!</h2>
                        <form onSubmit={onSubmit} action="/api/login" method="POST">
                            <div>
                                <label htmlFor={"email"}>Email</label>
                                <input name={"email"} type={"email"} ref={emailRef}
                            
                                    defaultValue={"test@email.com"}
                                />
                            </div>
                            <div>
                                <label htmlFor={"password"}>Password</label>
                                <input name={"password"} type={"password"} ref={passwordRef}
                                    defaultValue={"password"}
                                />
                            </div>
                            <div>
                                <button type={"submit"} onClick={onSubmit}>Login</button>
                            </div>
                        </form>
                    </div>
            )}
            <p><Link href="/login/register"><a>Register</a></Link></p>
        </div>
    )
}