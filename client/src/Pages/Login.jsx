import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../services/axiosInstance'
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import {toast} from 'react-toastify'

function Login() {
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    const { email, password } = values;
    try {
      const response = await axiosInstance.post('login', {
        email,password
      });

    if(response.data){
      const { accessToken } = response.data;
      // Set token in local storage
      localStorage.setItem('accessToken', accessToken);
      navigate('/home')
    }
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }

    setSubmitting(false);
  };

  const user = localStorage.getItem('accessToken');
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, []);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: LoginSchema,
    onSubmit: handleLogin,
  });

  return (
    <div className="flex h-screen items-center justify-center bg-gray-200">
      <div className="bg-white p-12 rounded-lg shadow-lg w-[24rem]">
        <h1 className="text-2xl font-poppins mb-6">Log in</h1>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-2 font-sm">
            <input
              type="email"
              placeholder="Enter your email..."
              className="w-full p-2 border rounded"
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-xs">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-2  font-sm">
            <input
              type="password"
              placeholder="**********"
              className="w-full p-2 border rounded"
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-xs">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded mt-6"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Logging In...' : 'Log In'}
          </button>

          <div className="flex mt-8">
            <span className="text-sm font-poppins">New user?</span>
            <Link to="/register" className="text-red-500 text-sm ml-1">
              <u>Sign up</u>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
