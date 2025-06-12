// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

// 1. Importaciones de Leaflet y react-leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // ¡MUY IMPORTANTE! Importa los estilos de Leaflet

// 2. Importamos nuestro nuevo CSS
import './Dashboard.css';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  // Estados para guardar los datos (por ahora vacíos)
  const [mascotas, setMascotas] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);

  // Coordenadas de Lima, Perú
  const limaPosition = [-12.046374, -77.042793];

  // TODO: En un futuro, aquí harás la llamada a tu backend para obtener las mascotas y dispositivos
  useEffect(() => {
    // Ejemplo de cómo se vería la llamada a la API
    // const fetchPetData = async () => {
    //   try {
    //     // const petsResponse = await petService.getPetsByUserId(user.id);
    //     // setMascotas(petsResponse.data);
    //     // const devicesResponse = await deviceService.getDevicesByUserId(user.id);
    //     // setDispositivos(devicesResponse.data);
    //   } catch (error) {
    //     console.error("Error fetching data", error);
    //   }
    // };
    // fetchPetData();
  }, []); // El array vacío significa que este efecto se ejecuta una sola vez

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard-container">
      {/* Columna Izquierda: El Mapa */}
      <div className="map-wrapper">
        <MapContainer center={limaPosition} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Aquí podrás mapear las ubicaciones de tus mascotas para crear marcadores */}
          <Marker position={limaPosition}>
            <Popup>
              ¡Hola! Estás en Lima. <br /> Aquí aparecerán tus mascotas.
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Columna Derecha: Las Tarjetas de Información */}
      <div className="sidebar">
        <div className="info-card">
          <h3>Mascotas</h3>
          <div className="info-card-content">
            {mascotas.length > 0 ? (
              <ul className="info-list">
                {mascotas.map((mascota) => (
                  <li key={mascota.id}>{mascota.nombre}</li>
                ))}
              </ul>
            ) : (
              <p>No se encuentran mascotas registradas.</p>
            )}
          </div>
        </div>

        <div className="info-card">
          <h3>Dispositivos</h3>
          <div className="info-card-content">
            {dispositivos.length > 0 ? (
              <ul className="info-list">
                {dispositivos.map((dispositivo) => (
                  <li key={dispositivo.id}>{dispositivo.serialID}</li>
                ))}
              </ul>
            ) : (
              <p>No se encuentran dispositivos registrados.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;