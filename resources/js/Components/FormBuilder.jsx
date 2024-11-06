import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

const FormBuilder = () => {
  const [formElements, setFormElements] = useState([]);
  const [properties, setProperties] = useState({
    label: '',
    placeholder: '',
    name: '',
    type: 'text',
  });
  const [formDetails, setFormDetails] = useState({
    id: Date.now(),
    form_name: '',
    form_data: '[]',
    form_id: 'form_' + Date.now(),
    version_id: 'v1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const [savedForms, setSavedForms] = useState([]);
  const [editingForm, setEditingForm] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllForms();
  }, []);

  const fetchAllForms = async () => {
    try {
      const response = await axios.get('/api/lists');
      setSavedForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setMessage('Failed to fetch forms. Please try again.');
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(formElements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormElements(items);
    updateFormDetails(items);
  };

  const handleAddElement = (type) => {
    const newElement = {
      id: `${Date.now()}`,
      type,
      content: `${type} field`,
      properties: {
        label: properties.label || `${type} Label`,
        placeholder: properties.placeholder || `${type} placeholder`,
        name: properties.name || `${type}_name`,
        type: type,
        required: false,
      },
    };
    const updatedElements = [...formElements, newElement];
    setFormElements(updatedElements);
    updateFormDetails(updatedElements);
  };

  const handleDeleteElement = (id) => {
    const updatedElements = formElements.filter(element => element.id !== id);
    setFormElements(updatedElements);
    updateFormDetails(updatedElements);
  };

  const updateFormDetails = (elements) => {
    setFormDetails({
      ...formDetails,
      form_data: JSON.stringify(elements),
      updated_at: new Date().toISOString(),
    });
  };

  const handlePropertyChange = (e) => {
    setProperties({
      ...properties,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveForm = async () => {
    try {
      let response;
      if (editingForm) {
        response = await axios.put(`/api/forms/update/${editingForm.id}`, formDetails);
      } else {
        response = await axios.post('/api/forms/save', formDetails);
      }
      
      if (response.data.success) {
        setMessage(`Form ${editingForm ? 'updated' : 'saved'} successfully!`);
        fetchAllForms();
        resetForm();
      } else {
        setMessage('Failed to save form. Please try again.');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      setMessage('An error occurred while saving the form.');
    }
  };

  const handleEditForm = async (formId) => {
    try {
      const response = await axios.get(`/api/forms/${formId}`);
      const form = response.data;
      setEditingForm(form);
      setFormDetails(form);
      setFormElements(JSON.parse(form.form_data));
      setMessage('Form loaded for editing.');
    } catch (error) {
      console.error('Error fetching form:', error);
      setMessage('An error occurred while loading the form.');
    }
  };

  const handleDeleteForm = async (formId) => {
    try {
      const response = await axios.delete(`/api/forms/${formId}`);
      if (response.data.success) {
        fetchAllForms();
        setMessage('Form deleted successfully.');
        if (editingForm && editingForm.id === formId) {
          resetForm();
        }
      } else {
        setMessage('Failed to delete form. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      setMessage('An error occurred while deleting the form.');
    }
  };

  const resetForm = () => {
    setFormDetails({
      id: Date.now(),
      form_name: '',
      form_data: '[]',
      form_id: 'form_' + Date.now(),
      version_id: 'v1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setFormElements([]);
    setEditingForm(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredForms = savedForms.filter(form => 
    form.form_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2>Form Builder</h2>
      {message && <div style={styles.message}>{message}</div>}
      <input
        type="text"
        value={formDetails.form_name}
        onChange={(e) => setFormDetails({ ...formDetails, form_name: e.target.value })}
        placeholder="Form Name"
        style={styles.formNameInput}
      />
      <div style={styles.wrapper}>
        <div style={styles.sidebar}>
          <h3>Form Elements</h3>
          {['text', 'textarea', 'checkbox', 'radio', 'date', 'file'].map((type) => (
            <button key={type} onClick={() => handleAddElement(type)} style={styles.sidebarButton}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div style={styles.formBuilderContainer}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="form-builder">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={styles.droppableArea}>
                  {formElements.map((element, index) => (
                    <Draggable key={element.id} draggableId={element.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...styles.draggableItem, ...provided.draggableProps.style }}
                        >
                          <div style={styles.elementContent}>
                            <label>{element.properties.label}</label>
                            {element.type === 'textarea' && (
                              <textarea placeholder={element.properties.placeholder} style={styles.inputField} />
                            )}
                            {element.type === 'text' && (
                              <input type="text" placeholder={element.properties.placeholder} style={styles.inputField} />
                            )}
                            {element.type === 'checkbox' && (
                              <input type="checkbox" style={styles.inputField} />
                            )}
                            {element.type === 'radio' && (
                              <input type="radio" style={styles.inputField} />
                            )}
                            {element.type === 'date' && (
                              <input type="date" style={styles.inputField} />
                            )}
                            {element.type === 'file' && (
                              <input type="file" style={styles.inputField} />
                            )}
                          </div>
                          <button onClick={() => handleDeleteElement(element.id)} style={styles.deleteElementButton}>
                            Delete
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div style={styles.propertyEditor}>
          <h3>Edit Properties</h3>
          <div style={styles.formGroup}>
            <label>Label:</label>
            <input
              type="text"
              name="label"
              value={properties.label}
              onChange={handlePropertyChange}
              style={styles.inputField}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Placeholder:</label>
            <input
              type="text"
              name="placeholder"
              value={properties.placeholder}
              onChange={handlePropertyChange}
              style={styles.inputField}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={properties.name}
              onChange={handlePropertyChange}
              style={styles.inputField}
            />
          </div>
        </div>
      </div>
      <button onClick={handleSaveForm} style={styles.saveButton}>
        {editingForm ? 'Update Form' : 'Save Form'}
      </button>
      <div style={styles.savedFormsList}>
        <h3>Saved Forms</h3>
        <input
          type="text"
          placeholder="Search forms..."
          value={searchTerm}
          onChange={handleSearch}
          style={styles.searchInput}
        />
        {filteredForms.length === 0 ? (
          <p>No forms found.</p>
        ) : (
          <ul>
            {filteredForms.map((form) => (
              <li key={form.id} style={styles.savedFormItem}>
                <strong>{form.form_name}</strong>
                <button onClick={() => handleEditForm(form.id)} style={styles.editButton}>Edit</button>
                <button onClick={() => handleDeleteForm(form.id)} style={styles.deleteButton}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    padding: '20px',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  sidebar: {
    width: '250px',
    padding: '15px',
    borderRight: '1px solid #ddd',
  },
  sidebarButton: {
    display: 'block',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
  },
  formBuilderContainer: {
    flex: 1,
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    marginLeft: '15px',
  },
  droppableArea: {
    minHeight: '400px',
    padding: '10px',
    border: '1px dashed #ccc',
    borderRadius: '8px',
    overflowY: 'auto',
  },
  draggableItem: {
    margin: '10px 0',
    padding: '15px',
    backgroundColor: '#fafafa',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    cursor: 'move',
  },
  elementContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  inputField: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  propertyEditor: {
    width: '250px',
    padding: '15px',
    borderLeft: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  formGroup: {
    marginBottom: '10px',
  },
  saveButton: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '5px',
    marginTop: '20px',
    cursor: 'pointer',
  },
  savedFormsList: {
    marginTop: '20px',
  },
  savedFormItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  editButton: {
    padding: '5px 10px',
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  deleteElementButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  formNameInput: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '20px',
  },
  message: {
    padding: '10px',
    marginBottom: '20px',
    backgroundColor: '#e6f7ff',
    border: '1px solid #91d5ff',
    borderRadius: '4px',
    color: '#1890ff',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
};

export default FormBuilder;