import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import collarService from '../api/collarService';
import CollarCard from '../components/collarCard';
import AddCollarModal from '../components/addCollarModal';
import { FaPlus } from 'react-icons/fa';
import './mascotas.css'; // Reutilizamos el CSS de la pagina de mascotas para el layout

const Dispositivos = () => {
  const [collars, setCollars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchCollars = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await collarService.getCollarsByUsername(user.username);
      setCollars(response.data || {});
    } catch (err) {
      console.error("Error fetching collars:", err);
      if (err.response && (err.response.status === 400 || err.response.status === 404)) {
        setCollars([]);
      } else {
        setError("No se pudieron cargar los dispositivos.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCollars();
  }, [fetchCollars]);

  const handleCollarAdded = (newCollar) => {
    setCollars(prevCollars => [...prevCollars, newCollar]);
  };

  if (isLoading) {
    return <div className="loading-container">Cargando tus dispositivos...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="mascotas-page-container">
      <h1>Mis Dispositivos</h1>

      {collars.length > 0 ? (
        <div className="pets-grid">
          {collars.map(collar => (
            <CollarCard key={collar.id} collar={collar} />
          ))}
        </div>
      ) : (
        <div className="no-pets-container">
          <p>Aún no tienes dispositivos registrados.</p>
          <p>¡Haz clic en el botón '+' para agregar tu primer collar!</p>
        </div>
      )}

      <button className="fab-add-pet" onClick={() => setIsModalOpen(true)}>
        <FaPlus />
      </button>

      <AddCollarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCollarAdded={handleCollarAdded}
      />
    </div>
  );
};

export default Dispositivos;