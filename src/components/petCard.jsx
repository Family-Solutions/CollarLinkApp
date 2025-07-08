import React from 'react';
import './petCard.css';
import { FaPaw, FaTimes } from 'react-icons/fa';

const PetCard = ({ pet, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${pet.name}?`)) {
      try {
        await onDelete(pet.id);
      } catch (error) {
        console.error('Error al eliminar mascota:', error);
        alert('Error al eliminar la mascota. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="pet-card">
      <button className="pet-card-delete-btn" onClick={handleDelete} title="Eliminar mascota">
        <FaTimes />
      </button>
      <div className="pet-card-header">
        <FaPaw className="pet-card-icon" />
        <h3 className="pet-card-name">{pet.name}</h3>
      </div>
      <div className="pet-card-body">
        <p><strong>Especie:</strong> {pet.species}</p>
        <p><strong>Raza:</strong> {pet.breed}</p>
        <p><strong>Edad:</strong> {pet.age} años</p>
        <p><strong>Dispositivo:</strong> {pet.collarId || 'No asignado'}</p>
      </div>
    </div>
  );
};

export default PetCard;