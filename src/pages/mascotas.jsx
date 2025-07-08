// src/pages/Mascotas.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import petService from '../api/petService';
import PetCard from '../components/petCard';
import AddPetModal from '../components/addPetModal';
import { FaPlus } from 'react-icons/fa';
import './mascotas.css';

const Mascotas = () => {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  // useCallback para evitar que la función se recree en cada render
  const fetchPets = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await petService.getPetsByUsername(user.username);
      setPets(response.data || []); // Aseguramos que 'pets' sea siempre un array
    } catch (err) {
      console.error("Error fetching pets:", err);
      // Si el backend devuelve 400 (o 404), puede ser que no tenga mascotas, lo cual no es un error.
      if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          setPets([]); // Establece un array vacío si no se encuentran mascotas
      } else {
          setError("No se pudieron cargar las mascotas. Inténtalo de nuevo más tarde.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Depende del objeto 'user'

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // Esta función se pasa al modal para actualizar la lista sin recargar
  const handlePetAdded = (newPet) => {
    setPets(prevPets => [...prevPets, newPet]);
  };

  if (isLoading) {
    return <div className="loading-container">Cargando tus mascotas...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="mascotas-page-container">
      <h1>Mis Mascotas</h1>

      {pets.length > 0 ? (
        <div className="pets-grid">
          {pets.map(pet => (
            // Asumiendo que cada mascota tiene un 'id' único devuelto por el backend
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      ) : (
        <div className="no-pets-container">
          <p>Aún no tienes mascotas registradas.</p>
          <p>¡Haz clic en el botón '+' para agregar la primera!</p>
        </div>
      )}

      <button className="fab-add-pet" onClick={() => setIsModalOpen(true)}>
        <FaPlus />
      </button>

      {/* El modal ya no necesita la prop 'devices' */}
      <AddPetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPetAdded={handlePetAdded}
      />
    </div>
  );
};

export default Mascotas;