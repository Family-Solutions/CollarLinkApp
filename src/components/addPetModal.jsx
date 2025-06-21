import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import petService from '../api/petService';
import './addPetModal.css';

const AddPetModal = ({ isOpen, onClose, onPetAdded }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: 'Macho',
    age: '',
    collarId: '' // El usuario lo escribira directamente
  })
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reinicia el formulario cuando el modal se cierra
  const handleClose = () => {
    setFormData({
        name: '', species: '', breed: '', gender: 'Macho', age: '', collarId: ''
    });
    setError('');
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const petData = {
      ...formData,
      // Convertimos age y collarId a números. Si collarId está vacío, se envía null.
      age: parseInt(formData.age),
      collarId: formData.collarId ? parseInt(formData.collarId) : null,
      username: user.username,
    };

    if (!petData.name || !petData.species || !petData.breed || !petData.age) {
        setError('Los campos Nombre, Especie, Raza y Edad son obligatorios.');
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await petService.createPet(petData);
      onPetAdded(response.data); // Pasa la nueva mascota al componente padre
      handleClose(); // Cierra el modal y resetea el form
    } catch (err) {
      setError('Error al crear la mascota. Revisa los datos o inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Registrar Nueva Mascota</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" required />
            <input name="species" value={formData.species} onChange={handleChange} placeholder="Especie (ej. Perro)" required />
            <input name="breed" value={formData.breed} onChange={handleChange} placeholder="Raza" required />
            <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Edad" required />
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
            {/* Campo de texto simple para el ID del collar */}
            <input name="collarId" type="number" value={formData.collarId} onChange={handleChange} placeholder="ID del Dispositivo (Opcional)" />
          </div>
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Mascota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;