import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loading from '../../components/Loading/Loading';
import Swal from 'sweetalert2';
const ImageHostingToken = import.meta.env.VITE_Image_Upload_Token

const NewBlog = () => {
    const { user } = useAuth()
    const [axiosSecure] = useAxiosSecure()
    const [loading, setLoading] = useState(false);
    const ImageHostingURL = `https://api.imgbb.com/1/upload?key=${ImageHostingToken}`
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    if(loading){
        return <Loading/>
    }
    const onSubmit = data => {
        setLoading(true)
        const formData = new FormData();
        formData.append('image', data.image[0])
        fetch(ImageHostingURL, {
            method : 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(ImgResponse => {
            if(ImgResponse.success){
                const ImgURL = ImgResponse.data.display_url
                const {title, details} = data
                const createdAt = new Date().toISOString();
                const newBlog = {blogTitle: title, blogDetails: details, author: user?.displayName, authorEmail: user?.email, blogImg: ImgURL, comment: "", createdAt: createdAt}
                console.log(newBlog);
                axiosSecure.post('/newblog', newBlog)
                .then(res => {
                    setLoading(false)
                    console.log(res);
                    if(res.data.insertedId){
                        reset()
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Blog added Successfully',
                            showConfirmButton: false,
                            timer: 1500
                          })
                    }
                })
            }
        })
        .catch(error => {
            setLoading(false)
            console.log(error);
        })
    }
    return (
        <div>
            <h1 className='text-2xl text-center'>Create a new Blog</h1>
            <div className='w-full md:w-1/2 mx-auto mt-2 card shadow-2xl bg-base-100 p-4'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Blog Title</span>
                        </label>
                        <input type="text" placeholder="Blog Title" className="input input-bordered input-warning" {...register("title", { required: true })} />
                        {errors.title && <span className='text-red-600'>Title is required</span>}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Blog Details</span>
                        </label>
                        <textarea className="textarea textarea-warning" placeholder="Blog Details" {...register("details", { required: true })}></textarea>
                        {errors.details && <span className='text-red-600'>Blog details is required</span>}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Upload Blog Images</span>
                        </label>
                        <input type="file" className="file-input file-input-bordered file-input-warning w-full max-w-xs" {...register("image", { required: true })}/>
                        {errors.image && <span className='text-red-600'>Please select an images</span>}
                    </div>
                    <div className="form-control mt-2">
                        <button type='submit' className="btn bg-yellow-500">Post</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewBlog;