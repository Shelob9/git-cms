import { useMemo, useRef } from "react"

export default function Login() {
    let emailRef = useRef<HTMLInputElement>();
    let passwordRef = useRef<HTMLInputElement>();

    const onSubmit = (e) => {
        e.preventDefault();
        console.log({
            email: emailRef.current.value,
            password: passwordRef.current.value
        });
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
                console.log(r);
            })
    };


    return (
        <form onSubmit={onSubmit}>
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
    )
}