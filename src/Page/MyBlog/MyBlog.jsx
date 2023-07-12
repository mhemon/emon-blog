import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loading from '../../components/Loading/Loading';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const MyBlog = () => {
    const [axiosSecure] = useAxiosSecure()
    const { user } = useAuth()

    const [blogDescription, setBlogDescription] = useState('');
    const [showFullText, setShowFullText] = useState(false);

    // we are using TanStack Query so that we don't have to refetch all the time when we delete or update a blog.
    const { data: myBlogs = [], isLoading, refetch } = useQuery({
        queryKey: ['my-blogs'],
        queryFn: async () => {
            const res = await axiosSecure(`/myblogs?email=${user?.email}`)
            return res.data
        }
    })

    if (isLoading) {
        return <Loading />
    }

    const handleUpdate = singleBlog => {
        Swal.fire({
            title: 'Update Blog',
            html: `
                <input type="text" id="title" class="input input-bordered input-warning w-full max-w-xs" value="${singleBlog.blogTitle}" required/>
                <textarea id="description" class="w-full max-w-xs mt-3 textarea textarea-warning">${singleBlog.blogDetails}</textarea>
            `,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Update',
            preConfirm: () => {
                const title = Swal.getPopup().querySelector('#title').value;
                const description = Swal.getPopup().querySelector('#description').value;
                if (!title || !description) {
                    Swal.showValidationMessage('Title and Description are required');
                } else {
                    return { title, description };
                }
            }
        }).then(result => {
            if (result.isConfirmed) {
                const { title, description } = result.value;
                const updateBlog = { blogTitle: title, blogDetails: description }
                axiosSecure.patch(`/myblogs/${singleBlog._id}`, updateBlog)
                    .then(res => {
                        console.log('res from update', res.data);
                        refetch();
                        Swal.fire(
                            'Updated!',
                            'Your blog has been updated.',
                            'success'
                        );
                    });
            }
        });
    }

    const handledelete = singleBlog => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/myblogs/${singleBlog._id}`)
                    .then(res => {
                        console.log('res from delete', res.data);
                        if (res.data.deletedCount > 0) {
                            refetch()
                            Swal.fire(
                                'Deleted!',
                                'Your blog has been deleted.',
                                'success'
                            )
                        }
                    })
            }
        })
    }

    const toggleFullText = () => {
        setShowFullText(!showFullText);
    };

    const renderBlogDetails = (blogDetails) => {
        if (showFullText || blogDetails.split(' ').length <= 100) {
            return blogDetails;
        } else {
            const truncatedText = blogDetails.split(' ').slice(0, 100).join(' ');
            return (
                <>
                    {truncatedText}{' '}
                    <button onClick={toggleFullText} className="text-blue-500">
                        Read more
                    </button>
                </>
            );
        }
    };

    return (
        <div>
            <h1 className='text-2xl text-center'>My Total Blogs: {myBlogs.length}</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto gap-2 p-2'>
                {
                    myBlogs.map(singleBlog => <div key={singleBlog._id} className="card bg-base-100 shadow-xl">
                        <figure><img src={singleBlog.blogImg} alt="Blog Img" style={{ height: '280px', width: '100%', objectFit: 'cover' }}/></figure>
                        <div className="card-body">
                            <h2 className="card-title">{singleBlog.blogTitle}</h2>
                            <p>{renderBlogDetails(singleBlog.blogDetails)}</p>
                            <div className="card-actions justify-end">
                                <button onClick={() => handleUpdate(singleBlog)} className="btn btn-warning">update</button>
                                <button onClick={() => handledelete(singleBlog)} className="btn btn-error">Delete</button>
                            </div>
                        </div>
                    </div>)
                }
            </div>
        </div>
    );
};

export default MyBlog;