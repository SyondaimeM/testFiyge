// resources/js/Pages/FormBuilder.js

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

function FormBuilder() {
    const [formName, setFormName] = useState('');
    const [formFields, setFormFields] = useState([]);

    // Predefined field types
    const fieldTypes = [
        { id: '1', type: 'text', label: 'Text Input' },
        { id: '2', type: 'textarea', label: 'Textarea' },
        { id: '3', type: 'select', label: 'Select Dropdown' },
        { id: '4', type: 'checkbox', label: 'Checkbox' },
    ];

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(formFields);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setFormFields(items);
    };

    const addField = (field) => {
        setFormFields([...formFields, { ...field, id: Date.now() }]);
    };

    const saveForm = async () => {
        try {
            const response = await axios.post('/api/forms/save', {
                form_name: formName,
                form_data: JSON.stringify({ fields: formFields })
            });
            alert('Form saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save form.');
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Form Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
            />

            <h3>Drag & Drop Fields</h3>
            <div className="field-list">
                {fieldTypes.map((field) => (
                    <button key={field.id} onClick={() => addField(field)}>
                        {field.label}
                    </button>
                ))}
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="formFields">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="form-preview"
                        >
                            {formFields.map((field, index) => (
                                <Draggable key={field.id} draggableId={`${field.id}`} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="field-item"
                                        >
                                            {field.label}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <button onClick={saveForm}>Save Form</button>
        </div>
    );
}

export default FormBuilder;
