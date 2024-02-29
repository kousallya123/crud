import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import axiosInstance from '../services/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import * as Yup from 'yup';
import {toast} from 'react-toastify'

function Register() {
  const navigate = useNavigate();

  const handleRegister = async (values, { setSubmitting }) => {
    const { firstName,lastName, email, password } = values;
      try {
        const data={
          firstName,
          lastName,
          email,
          password
        }
        const response = await axiosInstance.post('register', data);
        if (response.data) {
          navigate('/login');
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


  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: { firstName: '',lastName:'', email: '', password: ''},
    validationSchema: validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <div className="flex h-screen items-center justify-center bg-gray-200">
      <div className="bg-white p-12 rounded-lg shadow-lg w-[24rem]">
        <h1 className="text-2xl font-poppins mb-6">Register</h1>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-2 text-sm">
            <input
              type="text"
              placeholder="Enter Your First Name"
              className="w-full p-2 border rounded"
              {...formik.getFieldProps('firstName')}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="text-red-500 text-xs">{formik.errors.firstName}</div>
            )}
          </div>

          <div className="mb-2 text-sm">
            <input
              type="text"
              placeholder="Enter Your Last Name"
              className="w-full p-2 border rounded"
              {...formik.getFieldProps('lastName')}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="text-red-500 text-xs">{formik.errors.lastName}</div>
            )}
          </div>

          <div className="mb-2 text-sm">
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

          <div className="mb-2 text-sm">
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
            {formik.isSubmitting ? 'Submitting' : 'Sign up'}
          </button>

          <div className="flex mt-8">
            <span className="text-sm font-poppins">Already user?</span>
            <Link to="/login" className="text-red-500 text-sm ml-1">
              <u>Log in</u>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
