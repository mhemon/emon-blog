import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Lottie from "lottie-react";
import Swal from 'sweetalert2';
import LoginAnim from '../../assets/login.json'
import SocialLogin from '../Shared/SocialLogin/SocialLogin';
import useAuth from '../../hooks/useAuth';
import Loading from '../../components/Loading/Loading';
import { updateProfile } from 'firebase/auth';

const Signup = () => {
    const { createUser } = useAuth()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showpass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedOption, setSelectedOption] = useState('user');

    if (loading) {
        return <Loading />
    }
    const onSubmit = data => {
        setLoading(true)
        const email = data.email
        const password = data.password
        const name = data.name || 'anonymous'
        const photoURL = 'https://i.ibb.co/9T2XqZ3/user-1.png'
        createUser(email, password)
            .then(result => {
                console.log('firebase profile created');
                updateProfile(result.user, {
                    displayName: name,
                    photoURL: photoURL
                })
                    .then(() => {
                        console.log('update profile done from firebase');
                        // user create and name update success
                        const updateUser = {
                            name: data.name,
                            email: data.email,
                            image: data.photoURL,
                            role: selectedOption
                        }
                        fetch('http://localhost:5000/users', {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(updateUser)
                        })
                            .then(res => res.json())
                            .then(() => {
                                setLoading(false)
                                Swal.fire({
                                    title: 'Account Created!',
                                    showClass: {
                                        popup: 'animate__animated animate__fadeInDown'
                                    },
                                    hideClass: {
                                        popup: 'animate__animated animate__fadeOutUp'
                                    }
                                })
                                navigate('/')
                            })
                    })
                    .catch(error => {
                        setLoading(false)
                        console.error(error)
                        Swal.fire({
                            icon: 'error',
                            title: `${error.code}`,
                            text: `${error.message}`
                        })
                    })
            })
            .catch(error => {
                setLoading(false)
                console.error(error)
                Swal.fire({
                    icon: 'error',
                    title: `${error.code}`,
                    text: `${error.message}`
                })
            })
    };
    return (
        <div>
            <Helmet>
                <title>Emon Blog | Signup</title>
            </Helmet>

            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center hidden md:block md:w-1/2 max-w-lg">
                        <Lottie animationData={LoginAnim} loop={true} />;
                    </div>
                    <div className="card flex md:w-1/2 max-w-sm shadow-2xl bg-base-100">
                        <form onSubmit={handleSubmit(onSubmit)} className="card-body pb-[10px]">
                            <h3 className='text-3xl text-center font-semibold'>Please Signup</h3>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input name='name' type="text" placeholder="name" className="input input-bordered" {...register("name", { required: true })} />
                                {errors.name && <span className='text-red-600'>Name is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input name='email' type="email" placeholder="email" className="input input-bordered" {...register("email", { required: true })} />
                                {errors.email && <span className='text-red-600'>Email is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <div className='flex items-center'>
                                    <input type={showpass ? 'text' : 'password'} placeholder="password" className="input input-bordered w-full" {...register("password", { required: true })} />
                                    <span className='-ml-8'>{showpass ? <AiFillEyeInvisible onClick={() => setShowPass(!showpass)} title='hide password' /> : <AiFillEye onClick={() => setShowPass(!showpass)} title='show password' />}</span>
                                </div>
                                {errors.password?.type === 'required' && <span className='text-red-600'>Password is required</span>}
                            </div>
                            <div className='form-control'>
                                <label className="label">
                                    <span className="label-text">Pick User Type</span>
                                </label>
                                <select className="select select-warning w-full max-w-xs"
                                value={selectedOption}
                                onChange={(e) => setSelectedOption(e.target.value)}>
                                    <option value='user'>User</option>
                                    <option value='author'>Author</option>
                                </select>
                            </div>
                            <div className="form-control mt-2">
                                <button type='submit' className="btn bg-yellow-200">Signup</button>
                            </div>
                            <Link to='/login'><p className='text-center'>Alreday have an account? Login</p></Link>
                        </form>
                        <SocialLogin />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;