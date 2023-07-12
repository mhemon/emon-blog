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

const Blogs = () => {

    const [showFullText, setShowFullText] = useState(false);
    const { user } = useAuth()
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

    }

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
                                <button onClick={() => handleComment(singleBlog)} className="btn"><FaRegCommentAlt size='2em' /> {singleBlog.likeCount}</button>
                                <p>Total Page View: {singleBlog.pageView}</p>
                            </div>
                        </div>
                    </div>)
                }
            </div>
        </div>
    );
};

export default Blogs;