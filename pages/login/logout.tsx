import { useRef } from "react"
import useSession from '../../hooks/useSession';
export default function Logout() {
   
    let { endSession,isLoggedIn } = useSession();
    

    return (
        <div>
            {!isLoggedIn ? <div>Not Logged In</div> : (
                <div>
                   
                    <div>
                        <button onClick={(e) => {
                            e.preventDefault();
                            endSession();
                        }}>Logout</button>
                    </div>
                </div>
            )}
        </div>
        
    )
}