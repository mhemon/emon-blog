import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import formatDate from '../../utils/DateFormat';

const Blogs = () => {

    const [showFullText, setShowFullText] = useState(false);
    const { user } = useAuth()
    // console.log(user);
    const [axiosSecure] = useAxiosSecure()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const { data: allBlogs = [], isLoading, refetch } = useQuery({
        queryKey: ['all-blogs'],
        queryFn: async () => {
            const res = await axios('http://localhost:5000/blogs')
            return res.data
        }
    })

    if (isLoading && loading) {
        return <Loading />
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

    const handleLike = (singleBlog) => {
        if (!user) {
            Swal.fire({
                title: 'Please Login First?',
                text: "You can't Like without Login!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Login Now!'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login')
                }
            })
            return
        }
        const data = {
            userEmail: user?.email,
            blogId: singleBlog._id
        };
        setLoading(true)
        axiosSecure.post('/like', data)
            .then(res => {
                setLoading(false)
                refetch();
            }).catch((error) => {
                setLoading(false)
                console.error(error);
            });
    }

    const handleComment = (singleBlog) => {
        if (!user) {
            Swal.fire({
                title: 'Please Login First?',
                text: "You can't Comment without Login!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Login Now!'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        // show comment popup
        // get time and date
        const commentedAt = new Date().toISOString();
        Swal.fire({
            title: 'Write your comment',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Comment',
            showLoaderOnConfirm: true,
            preConfirm: (comment) => {
                const commentData = {
                    comment: comment,
                    blogId: singleBlog._id,
                    userName: user?.displayName,
                    userPic: user?.photoURL,
                    commentedAt: commentedAt
                }
                return axiosSecure.post('/comment', commentData)
                    .then(res => {
                        console.log(res);
                        return res;
                    })
                    .catch(error => {
                        Swal.showValidationMessage(`Request failed: ${error}`);
                    });
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                refetch()
                Swal.fire({
                    title: 'Comment Posted!',
                    text: 'Your comment has been posted successfully.',
                    icon: 'success'
                });
            }
        });
    };


    return (
        <div>
            <Helmet>
                <title>Emon Blog | Blog page</title>
            </Helmet>
            <h1 className='text-2xl text-center'>Total Blogs: {allBlogs.length}</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto gap-2 p-2'>
                {
                    allBlogs.map(singleBlog => <div key={singleBlog._id} className="card bg-base-100 shadow-xl">
                        <figure><img src={singleBlog.blogImg} alt="Blog Img" style={{ height: '280px', width: '100%', objectFit: 'cover' }} /></figure>
                        <div className="card-body">
                            <h2 className="card-title">{singleBlog.blogTitle}</h2>
                            <p>{renderBlogDetails(singleBlog.blogDetails)}</p>
                            <div className="card-actions justify-between items-center">
                                <button onClick={() => handleLike(singleBlog)} className="btn">
                                    {singleBlog.likes.includes(user?.email) ? (
                                        <AiFillHeart size="2em" />
                                    ) : (
                                        <AiOutlineHeart size="2em" />
                                    )}
                                    {singleBlog.likes.length}
                                </button>
                                <button onClick={() => handleComment(singleBlog)} className="btn"><FaRegCommentAlt size='2em' /> {singleBlog.comment.length}</button>
                                <p>Total Page View: {singleBlog.pageView}</p>
                                {/* show comment - only for logged in user*/}
                                {user && <>
                                    <h1 className="text-center w-full mt-1 underline font-semibold">Comment</h1>
                                    <div className="flex flex-col">
                                        {singleBlog.comment.map((singleComment, index) => (
                                            <div className="flex items-start border p-4 mb-4" key={index}>
                                                <div className="mr-4">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                                        <img src={singleComment.userPic} alt="User Avatar" className="w-full h-full object-cover" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center mb-2">
                                                        <h4 className="text-sm font-bold mr-2">{singleComment.userName}</h4>
                                                        <span className="text-gray-500 text-sm">{formatDate(singleComment.time)}</span>
                                                    </div>
                                                    <p className="text-gray-800">{singleComment.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </>}
                            </div>
                        </div>
                    </div>)
                }
            </div>
        </div>
    );
};

export default Blogs;