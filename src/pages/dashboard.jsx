// src/pages/Dashboard.jsx - VERSIÓN ACTUALIZADA

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importamos los servicios que necesitamos
import petService from '../api/petService';
import collarService from '../api/collarService';

// Importaciones de Leaflet y su CSS
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Importamos el CSS del Dashboard
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  // Estados para guardar los datos
  const [mascotas, setMascotas] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  
  // Estados para controlar la carga y errores de la UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Coordenadas de Lima, Perú
  const limaPosition = [-12.046374, -77.042793];

  useEffect(() => {
    // Si no hay un usuario logueado, no hacemos nada.
    if (!user) {
        setIsLoading(false);
        return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Hacemos las dos llamadas a la API en paralelo para más eficiencia
        const [petsResponse, devicesResponse] = await Promise.all([
          petService.getPetsByUsername(user.username),
          collarService.getCollarsByUsername(user.username)
        ]);
        
        // Guardamos los datos en sus respectivos estados
        setMascotas(petsResponse.data || []);
        setDispositivos(devicesResponse.data || []);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("No se pudieron cargar los datos del panel. Inténtalo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]); // Este efecto se ejecuta cada vez que el objeto 'user' cambia.

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Componente pequeño para mostrar la lista en las tarjetas
  const InfoList = ({ title, items, renderItem, emptyMessage }) => (
    <div className="info-card">
        <h3>{title}</h3>
        <div className="info-card-content">
            {isLoading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p className="text-error">Error al cargar.</p>
            ) : items.length > 0 ? (
                <ul className="info-list">
                    {items.map(renderItem)}
                </ul>
            ) : (
                <p>{emptyMessage}</p>
            )}
        </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Columna Izquierda: El Mapa */}
      <div className="map-wrapper">
        <MapContainer center={limaPosition} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* TODO: Próximamente, aquí mapearemos las mascotas para mostrar sus marcadores */}
          <Marker position={limaPosition}>
            <Popup>
              ¡Bienvenido, {user?.username}! <br /> Aquí aparecerán tus mascotas.
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Columna Derecha: Las Tarjetas de Información */}
      <div className="sidebar">
        <InfoList
            title="Mascotas"
            items={mascotas}
            renderItem={(mascota) => <li key={mascota.id}>{mascota.name}</li>}
            emptyMessage="No tienes mascotas registradas."
        />

        <InfoList
            title="Dispositivos"
            items={dispositivos}
            renderItem={(dispositivo) => <li key={dispositivo.id}>{dispositivo.serialNumber}</li>}
            emptyMessage="No tienes dispositivos registrados."
        />
      </div>
    </div>
  );
};

export default Dashboard;