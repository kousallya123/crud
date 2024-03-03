import React, { useState, useEffect } from 'react';
import axios from '../services/axiosInstance';
import DataNotFound from '../assets/data-not-found.mp4'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { IoMdLogOut } from "react-icons/io";
import axiosInstance from '../services/axiosInstance'
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
const navigate=useNavigate()
  const pageSize = 5; // Number of rows per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/dashboard', {
          params: {
            search: searchTerm,
            filter: filterOption,
            sortBy: sortOption,
            sortOrder,
            page: currentPage,
            pageSize,
          },
        });
        console.log(response.data);
        setData(response.data.users);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, filterOption, sortOption, sortOrder, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: selectedUser?.firstName || '',
      lastName: selectedUser?.lastName || '',
      email: selectedUser?.email || '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { firstName, lastName, email } = values
      try {
        const response = await axiosInstance.put(`user/${selectedUser._id}`, { email, firstName, lastName });
        if (response.status === 200) {
          const updatedUserData = response.data.user;
          setData((prevData) =>
            prevData.map((user) =>
              user._id === selectedUser._id ? { ...user, ...updatedUserData } : user
            )
          );

        }

        closeModal();
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

    },
  });
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (userId) => {
    try {
      const response = await axiosInstance.delete(`user/${userId}`);
      if (response.status === 200) {
        setData((prevData) => prevData.filter((user) => user._id !== userId));
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
  };

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    window.location.href = '/';
    return; 
  }
  
  const handleLogout=()=>{
    localStorage.removeItem('accessToken')
    navigate('/')
  }

  return (
    <div className="container min-h-[100vh] mx-auto p-2">
      <div className="flex  md:flex-row justify-between mb-4 items-center">
        <div className="text-base md:text-lg text-black-400 font-xl mb-2 md:mb-0">User List</div>
        <div className="flex  md:flex-row justify-between items-center">
          <input
            type="text"
            placeholder="Search"
            className="p-1 md:p-2 border rounded mb-2 md:mb-0 md:mr-2 text-sm md:text-base w-full md:w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by First Name"
            className="p-1 md:p-2 border rounded mb-2 md:mb-0 md:mr-2 text-sm md:text-base w-full md:w-auto"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          />

          <select
            className="p-1 md:p-2 border rounded mb-2 md:mb-0 md:mr-2 text-sm md:text-base"
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="email">Email</option>
          </select>
          <select
            className="p-1 md:p-2 border rounded mb-2 md:mb-0 md:mr-2 text-sm md:text-base"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <IoMdLogOut size={20} style={{cursor:"pointer"}} onClick={handleLogout}/>
        </div>
       
      </div>


      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : data && data.length > 0 ? (
        <>
          <table className="w-full border-collapse border border-gray-800 bg-white shadow-md">
            <thead>
              <tr className="bg-red-500 text-left text-white">
                <th className="p-2 border-r border-red-800">First Name</th>
                <th className="p-2 border-r border-red-800">Last Name</th>
                <th className="p-2 border-r border-red-800">Email</th>
                <th className="p-2 border-r border-red-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user, index) => (
                <tr key={index} className="border border-gray-800" onClick={() => handleEditClick(user)}>
                  <td className="p-2 border-r border-gray-800">{user.firstName}</td>
                  <td className="p-2 border-r border-gray-800">{user.lastName}</td>
                  <td className="p-2 border-r border-gray-800">{user.email}</td>
                  <td className="p-2 border-r border-gray-800 flex">
                    {/* Edit Icon */}
                    <span onClick={(e) => { e.stopPropagation(); handleEditClick(user); }}><MdEdit color="#d11a2a" size={17} /></span>
                    {/* Delete Icon */}
                    <span onClick={(e) => { e.stopPropagation(); handleDeleteClick(user._id); }} style={{cursor:"pointer"}}><MdDeleteForever color="#0f52b9" size={17} /></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <button
              className="bg-red-500 text-white p-2 border rounded mr-2 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="p-2 border rounded">{currentPage}</span>
            <button
              className="bg-red-500 text-white p-2 border rounded ml-2 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(currentPage + 1)}
              // disabled={currentPage === totalPages}
            >{console.log(currentPage,totalPages,'l')}
              Next
            </button>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-8 rounded shadow-md">
                <h1>Edit User</h1>
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-2 text-sm">
                    <input
                      type="text"
                      placeholder="First Name"
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
                      placeholder="Last Name"
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
                      placeholder="Email"
                      className="w-full p-2 border rounded"
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-500 text-xs">{formik.errors.email}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bg-red-500 text-white px-4 py-2 rounded mt-6"
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? 'Submitting' : 'Update'}
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded mt-2 ml-2 font-sm"
                    disabled={formik.isSubmitting}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>

          )}
        </>

      ) : (
        <div className='flex justify-center'>
          <video src={DataNotFound} autoPlay loop />
        </div>
      )}
    </div>
  );
};

export default Home;
