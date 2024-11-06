import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FormsList = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get('/api/forms/list');
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Forms List</h2>
      {forms.length === 0 ? (
        <p>No forms available.</p>
      ) : (
        <ul style={styles.formList}>
          {forms.map((form) => (
            <li key={form.id} style={styles.formItem}>
              <span>{form.form_name}</span>
              <Link to={`/builder/${form.id}`} style={styles.editButton}>Edit</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  formList: {
    listStyleType: 'none',
    padding: 0,
  },
  formItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  editButton: {
    padding: '5px 10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '3px',
  },
};

export default FormsList;