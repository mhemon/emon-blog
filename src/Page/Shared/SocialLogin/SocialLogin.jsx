import React, { useState } from 'react';
import { BsGoogle } from "react-icons/bs";
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const SocialLogin = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const photoURL = 'https://i.ibb.co/9T2XqZ3/user-1.png';

  const handleGoogle = () => {
    // Ask user for user type using Swal.fire
    Swal.fire({
      title: 'Select User Type',
      input: 'select',
      inputOptions: {
        user: 'User',
        author: 'Author',
      },
      inputPlaceholder: 'Select user type',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Submit',
      inputValidator: (value) => {
        if (!value) {
          return 'You must select a user type';
        }
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          const userType = result.value;

          // Perform Google login with the selected user type
          googleLogin()
            .then((result) => {
              fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                  'content-type': 'application/json'
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, image: photoURL, role: userType })
              })
                .then(res => res.json())
                .then(() => {
                  navigate(from, { replace: true });
                })
            })
            .catch(error => {
              console.error(error)
              Swal.fire({
                icon: 'error',
                title: `${error.code}`
              })
            });
        }
      });
  };

  return (
    <div>
      <div className="divider">OR</div>
      <div className='flex justify-center items-center pb-4'>
        <button onClick={handleGoogle} className="btn btn-circle bg-yellow-200">
          <BsGoogle color='black' />
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
