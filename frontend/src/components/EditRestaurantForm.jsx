import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
  'Friday', 'Saturday', 'Sunday'
];

const EditRestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      await axios.put(
        `http://localhost:5001/api/restaurants/${id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Restaurant updated successfully!');
      navigate('/restaurants');
    } catch (error) {
      console.error('Update error:', error);
      if (error.response) {
        toast.error(error.response?.data?.message || 'Failed to update restaurant');
      } else {
        toast.error('Network error or server is not responding');
      }
    } finally {
      setSubmitting(false);
    }
  };

useEffect(() => {
  const fetchRestaurant = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5001/api/restaurants/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // The key fix - access response.data.data instead of response.data
      const apiData = response.data.data;
      console.log('API Data Received:', apiData);

      // Transform opening hours to include all days
      const openingHours = DAYS_OF_WEEK.map(day => {
        const existingDay = apiData.openingHours?.find(d => d.day === day);
        return existingDay ? {
          day,
          open: existingDay.open || '09:00',
          close: existingDay.close || '17:00',
          isClosed: existingDay.isClosed || false
        } : {
          day,
          open: '09:00',
          close: '17:00',
          isClosed: false
        };
      });

      const formData = {
        name: apiData.name || '',
        description: apiData.description || '',
        cuisineType: apiData.cuisineType || [],
        address: {
          street: apiData.address?.street || '',
          city: apiData.address?.city || '',
          state: apiData.address?.state || '',
          zipCode: apiData.address?.zipCode || ''
        },
        contact: {
          phone: apiData.contact?.phone || '',
          email: apiData.contact?.email || ''
        },
        openingHours: openingHours
      };

      console.log('Form Data Prepared:', formData);
      setInitialValues(formData);

    } catch (error) {
      console.error('Fetch error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('userToken');
        navigate('/login');
      } else {
        toast.error('Failed to load restaurant data');
        navigate('/restaurants');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchRestaurant();
}, [id, navigate]);

  if (loading || !initialValues) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" style={{
      backgroundImage: "url('/form-bg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Restaurant
            </h1>
            
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              enableReinitialize={true}
            >
              {({ values, errors, isSubmitting, setFieldValue }) => (
                <Form className="space-y-8">
                  {/* Basic Info Section */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">Restaurant Name</label>
                      <Field
                        name="name"
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                        value={values.name}
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">Description</label>
                      <Field
                        as="textarea"
                        name="description"
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                        value={values.description}
                      />
                      <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">Cuisine Type</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Italian', 'Indian', 'Mexican', 'Chinese', 'Japanese', 'American', 'Mediterranean', 'Other'].map((cuisine) => (
                          <div key={cuisine} className="flex items-center">
                            <Field
                              type="checkbox"
                              name="cuisineType"
                              value={cuisine}
                              checked={values.cuisineType.includes(cuisine)}
                              onChange={(e) => {
                                const currentCuisines = values.cuisineType;
                                if (e.target.checked) {
                                  setFieldValue('cuisineType', [...currentCuisines, cuisine]);
                                } else {
                                  setFieldValue('cuisineType', currentCuisines.filter(c => c !== cuisine));
                                }
                              }}
                              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-gray-700">
                              {cuisine}
                            </label>
                          </div>
                        ))}
                      </div>
                      <ErrorMessage name="cuisineType" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Address</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Street</label>
                        <Field
                          name="address.street"
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                          value={values.address.street}
                        />
                        <ErrorMessage name="address.street" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">City</label>
                        <Field
                          name="address.city"
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                          value={values.address.city}
                        />
                        <ErrorMessage name="address.city" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">State</label>
                        <Field
                          name="address.state"
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                          value={values.address.state}
                        />
                        <ErrorMessage name="address.state" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Zip Code</label>
                        <Field
                          name="address.zipCode"
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                          value={values.address.zipCode}
                        />
                        <ErrorMessage name="address.zipCode" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
                        <Field
                          name="contact.phone"
                          type="tel"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                          value={values.contact.phone}
                        />
                        <ErrorMessage name="contact.phone" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Email</label>
                        <Field
                          name="contact.email"
                          type="email"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                          value={values.contact.email}
                        />
                        <ErrorMessage name="contact.email" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Opening Hours Section */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Opening Hours</h2>
                    
                    <div className="space-y-4">
                      {values.openingHours.map((day, index) => (
                        <div key={day.day} className="p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={day.isClosed}
                                onChange={() => {
                                  const newHours = [...values.openingHours];
                                  newHours[index].isClosed = !newHours[index].isClosed;
                                  setFieldValue('openingHours', newHours);
                                }}
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 font-medium text-gray-700">
                                {day.day}
                              </span>
                            </div>
                            {day.isClosed && (
                              <span className="text-red-500 text-sm font-medium">Closed</span>
                            )}
                          </div>
                          
                          {!day.isClosed && (
                            <div className="grid grid-cols-2 gap-4 ml-6">
                              <div>
                                <label className="block text-gray-600 mb-1 text-sm">Opening Time</label>
                                <Field
                                  name={`openingHours[${index}].open`}
                                  type="time"
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                  value={day.open}
                                />
                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1 text-sm">Closing Time</label>
                                <Field
                                  name={`openingHours[${index}].close`}
                                  type="time"
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                  value={day.close}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => navigate('/restaurants')}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow hover:shadow-md transition font-medium"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRestaurantForm;