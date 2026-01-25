import { Button } from '@mui/material';
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { app } from '../../firebase.js';

export function OAuth() {
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result =  await signInWithPopup(auth, provider);
            console.log(result);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: result.user.displayName,
                    email: result.user.email,
                    avatar: result.user.photoURL
                }),
            });
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
        }
    return (
            <Button type="button" variant='contained' color="error" onClick={handleGoogleClick}> OAuth Component</Button>
    )
}