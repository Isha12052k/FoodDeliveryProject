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

  // Days for opening hours
  const DAYS_OF_WEEK = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
    'Friday', 'Saturday', 'Sunday'
  ];

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurants/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        
        // Ensure openingHours has all days
        const completeOpeningHours = DAYS_OF_WEEK.map(day => {
          const existingDay = response.data.openingHours?.find(d => d.day === day);
          return existingDay || {
            day,
            open: '09:00',
            close: '17:00',
            isClosed: false
          };
        });

        setInitialValues({
          ...response.data,
          openingHours: completeOpeningHours
        });
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

  if (loading) return <div className="p-4">Loading restaurant data...</div>;
  if (!initialValues) return <div className="p-4">Restaurant not found</div>;

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
            {/* Basic Info Section */}
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

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  rows="4"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Cuisine Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Italian', 'Indian', 'Mexican', 'Chinese', 'Japanese', 'American', 'Mediterranean', 'Other'].map((cuisine) => (
                    <div key={cuisine} className="flex items-center">
                      <input
                        type="checkbox"
                        id={cuisine}
                        checked={values.cuisineType.includes(cuisine)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFieldValue('cuisineType', [...values.cuisineType, cuisine]);
                          } else {
                            setFieldValue('cuisineType', values.cuisineType.filter(c => c !== cuisine));
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={cuisine}>{cuisine}</label>
                    </div>
                  ))}
                </div>
                <ErrorMessage name="cuisineType" component="div" className="text-red-500 text-sm" />
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Street</label>
                  <Field
                    name="address.street"
                    type="text"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage name="address.street" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">City</label>
                  <Field
                    name="address.city"
                    type="text"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage name="address.city" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">State</label>
                  <Field
                    name="address.state"
                    type="text"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage name="address.state" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Zip Code</label>
                  <Field
                    name="address.zipCode"
                    type="text"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage name="address.zipCode" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number</label>
                  <Field
                    name="contact.phone"
                    type="tel"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage name="contact.phone" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <Field
                    name="contact.email"
                    type="email"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage name="contact.email" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
            </div>

            {/* Opening Hours Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Opening Hours</h2>
              
              {values.openingHours.map((day, index) => (
                <div key={day.day} className="mb-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={day.isClosed}
                      onChange={() => {
                        const newHours = [...values.openingHours];
                        newHours[index].isClosed = !newHours[index].isClosed;
                        setFieldValue('openingHours', newHours);
                      }}
                      className="mr-2"
                    />
                    <span className="font-medium">{day.day}</span>
                  </div>
                  
                  {!day.isClosed && (
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <div>
                        <label className="block text-gray-700 mb-2">Opening Time</label>
                        <Field
                          name={`openingHours[${index}].open`}
                          type="time"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Closing Time</label>
                        <Field
                          name={`openingHours[${index}].close`}
                          type="time"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/restaurants')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditRestaurantForm;