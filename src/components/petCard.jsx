import React from 'react';
import './petCard.css';
import { FaPaw } from 'react-icons/fa';

const PetCard = ({ pet }) => {
  return (
    <div className="pet-card">
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