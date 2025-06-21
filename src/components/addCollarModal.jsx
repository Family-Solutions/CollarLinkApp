import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import collarService from '../api/collarService';
import './addPetModal.css'; //vamos a reutilizar el CSS de AddPetModal para este modal

const AddCollarModal = ({ isOpen, onClose, onCollarAdded }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    serialNumber: '',
    model: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setFormData({ serialNumber: '', model: '' });
    setError('');
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
    if (!formData.serialNumber || !formData.model) {
      setError('Ambos campos son obligatorios.');
      return;
    }
    setIsSubmitting(true);

    const collarData = {
      ...formData,
      username: user.username,
    };

    try {
      const response = await collarService.createCollar(collarData);
      onCollarAdded(response.data);
      handleClose();
    } catch (err) {
      setError('Error al registrar el dispositivo. ¿El Serial ya existe?');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Registrar Nuevo Dispositivo</h2>
        <form onSubmit={handleSubmit}>
          {/* Usamos un layout de una columna para este form simple */}
          <div className="form-group-modal">
            <input name="serialNumber" value={formData.serialNumber} onChange={handleChange} placeholder="Número de Serie del Collar" required />
            <input name="model" value={formData.model} onChange={handleChange} placeholder="Modelo (ej. T-Beam v1.1)" required />
          </div>
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Dispositivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Necesitaremos un pequeño ajuste en el CSS para el layout simple
// Agrega esto al final de tu AddPetModal.css
/*
.form-group-modal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}
*/
export default AddCollarModal;