import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { OAuth } from './Components/OAuth';

import { useState, useEffect } from 'react';

export default function SignUp() {

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
            const API_BASE = import.meta.env.VITE_API_BASE || "";
            const res = await fetch("${API_BASE}/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
             console.log(data);
             if (data.success === false){
                console.log("Sign Up failed");
                return;
             }
             console.log("Sign Up successful");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='max-w-lg mx-auto my-5'>
                <form className="p-4 flex flex-col gap-4"  onSubmit={handleSubmit}>
                    <TextField id="username" label="Username" variant="outlined" required onChange={handleChange} />
                    <TextField id="email" label="Email" variant="outlined" required onChange={handleChange} />
                    <TextField id="password" label="Password" type="password" variant="outlined"  required onChange={handleChange}/>
                    <Button type="submit" variant="contained">Sign Up</Button>
                    <OAuth />
                </form>
                Already have an account? <a href="/signin" className='text-blue-500'>Sign In</a>
        </div>
    )
}
