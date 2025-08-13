import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const EditRestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurants/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        setInitialValues(response.data);
      } catch (error) {
        toast.error('Failed to load restaurant data');
        navigate('/restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, navigate]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    cuisineType: Yup.array().min(1, 'Select at least one cuisine type'),
    address: Yup.object().shape({
      street: Yup.string().required('Street address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      zipCode: Yup.string().required('Zip code is required')
    }),
    contact: Yup.object().shape({
      phone: Yup.string().required('Phone number is required'),
      email: Yup.string().email('Invalid email').required('Email is required')
    })
  });

  const onSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/restaurants/${id}`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      toast.success('Restaurant updated successfully!');
      navigate('/restaurants');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update restaurant');
    }
  };

  if (loading) return <div>Loading restaurant data...</div>;
  if (!initialValues) return <div>Restaurant not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Restaurant</h1>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Form fields identical to AddRestaurantForm */}
            {/* Name, Description, Cuisine Type sections */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Restaurant Name</label>
                <Field
                  name="name"
                  type="text"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Include all other fields from AddRestaurantForm */}
              {/* Address, Contact, Opening Hours sections */}
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Update Restaurant
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditRestaurantForm;