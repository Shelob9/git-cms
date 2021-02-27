import useSession from "../hooks/useSession";
import React from 'react';
export default function LogoutPage() {
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