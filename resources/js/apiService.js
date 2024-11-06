// import axios from 'axios';

// const ApiService = {
//   setAuthToken: (token) => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//       delete axios.defaults.headers.common['Authorization'];
//     }
//   },

//   // Login to get the token
//   login: async (credentials) => {
//     const response = await axios.post('/api/login', credentials);
//     const token = response.data.token;
//     ApiService.setAuthToken(token);
//     return token;
//   },

//   // Logout and remove the token
//   logout: async () => {
//     await axios.post('/api/logout');
//     ApiService.setAuthToken(null);
//   },

//   // Save form data
//   saveForm: async (formData) => {
//     const response = await axios.post('/api/forms/save', formData);
//     return response.data;
//   },

//   // Fetch form data
//   fetchForm: async (formId) => {
//     const response = await axios.get(`/api/forms/${formId}`);
//     return response.data;
//   },

//   // Update form data
//   updateForm: async (formId, formData) => {
//     const response = await axios.put(`/api/forms/update/${formId}`, formData);
//     return response.data;
//   },

//   // List all forms
//   listForms: async () => {
//     const response = await axios.get('/api/forms/list');
//     return response.data;
//   }
// };

// export default ApiService;
