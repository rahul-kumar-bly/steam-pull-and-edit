import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';

import { useState, useEffect } from 'react';
import { OAuth } from './Components/OAuth';

export default function SignIn() {

    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);


    const  handleChange = async (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value
        });
        console.log(event.target.value);
    };


    const  handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
             console.log(data);
             if (data.success === false){
                console.log("Sign in failed");
                return;
             }
             console.log("Sign in successful");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='max-w-lg mx-auto my-5'>
                <form className="p-4 flex flex-col gap-4"  onSubmit={handleSubmit}>
                    <TextField id="email" label="Email" variant="outlined" required onChange={handleChange} />
                    <TextField id="password" label="Password" type="password" variant="outlined"  required onChange={handleChange}/>
                    <Button type="submit" variant="contained">Sign In</Button>
                    <OAuth />
                </form>
            Don't have an account? <a href="/signup" className='text-blue-500'>Sign Up</a>
        </div>
    )
}
