import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Importamos los servicios que necesitamos
import petService from '../api/petService';
import collarService from '../api/collarService';
import geofenceService from '../api/geofenceService'; 

// Importaciones de Leaflet y su CSS
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'; // <-- NUEVO: Añadir Circle
import 'leaflet/dist/leaflet.css';

// Importamos el CSS del Dashboard
import './dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  // Estados para guardar los datos
  const [mascotas, setMascotas] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [geocercas, setGeocercas] = useState([]); 
  

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Coordenadas de Lima, Perú
  const limaPosition = [-12.046374, -77.042793];

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Hacemos las TRES llamadas a la API en paralelo
        const [petsResponse, devicesResponse, geofencesResponse] = await Promise.all([ // <-- NUEVO
          petService.getPetsByUsername(user.username),
          collarService.getCollarsByUsername(user.username),
          geofenceService.getGeofencesByUsername(user.username) 
        ]);
        
        // Guardamos los datos en sus respectivos estados
        setMascotas(petsResponse.data || []);
        setDispositivos(devicesResponse.data || []);
        setGeocercas(geofencesResponse.data || []);

        // Imprimir información de los collares en consola
        console.log("=== INFORMACIÓN DE COLLARES ===");
        console.log("Cantidad de collares encontrados:", devicesResponse.data?.length || 0);
        console.log("Datos completos de collares:", devicesResponse.data);
        
        if (devicesResponse.data && devicesResponse.data.length > 0) {
          devicesResponse.data.forEach((collar, index) => {
            console.log(`--- Collar ${index + 1} ---`);
            console.log("ID:", collar.id);
            console.log("Username:", collar.username);
            console.log("Serial Number:", collar.serialNumber);
            console.log("Model:", collar.model);
            console.log("Last Latitude:", collar.lastLatitude);
            console.log("Last Longitude:", collar.lastLongitude);
            console.log("Collar completo:", collar);
          });
        } else {
          console.log("No se encontraron collares para este usuario");
        } 

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("No se pudieron cargar los datos del panel. Inténtalo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

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
      <div className="map-wrapper">
        <MapContainer center={limaPosition} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Mostrar geocercas */}
          {!isLoading && geocercas.map(geofence => (
            <Circle
              key={geofence.id}
              center={[geofence.latitude, geofence.longitude]}
              radius={geofence.radius}
              pathOptions={{ color: 'purple', fillColor: 'purple', fillOpacity: 0.2 }}
            >
              <Popup>
                <strong>Geocerca:</strong> {geofence.name} <br />
                <strong>Radio:</strong> {geofence.radius} metros
              </Popup>
            </Circle>
          ))}

          {/* Mostrar collares como puntos destacados */}
          {!isLoading && dispositivos
            .filter(collar => collar.lastLatitude && collar.lastLongitude)
            .map(collar => {
              // Buscar la mascota asociada a este collar
              const mascotaAsociada = mascotas.find(pet => pet.collarId === collar.id);
              
              return (
                <Marker
                  key={`collar-${collar.id}`}
                  position={[collar.lastLatitude, collar.lastLongitude]}
                >
                  <Popup>
                    <div style={{ minWidth: '200px' }}>
                      <strong>📡 Collar #{collar.serialNumber}</strong><br />
                      <strong>Modelo:</strong> {collar.model}<br />
                      <strong>ID:</strong> {collar.id}<br />
                      <strong>Usuario:</strong> {collar.username}<br />
                      <strong>Coordenadas:</strong><br />
                      • Lat: {collar.lastLatitude}<br />
                      • Lng: {collar.lastLongitude}<br />
                      {mascotaAsociada ? (
                        <>
                          <hr style={{ margin: '8px 0' }} />
                          <strong>🐾 Mascota Asociada:</strong><br />
                          <strong>Nombre:</strong> {mascotaAsociada.name}<br />
                          <strong>Especie:</strong> {mascotaAsociada.species}<br />
                          <strong>Raza:</strong> {mascotaAsociada.breed}<br />
                          <strong>Edad:</strong> {mascotaAsociada.age} año{mascotaAsociada.age !== 1 ? 's' : ''}
                        </>
                      ) : (
                        <>
                          <hr style={{ margin: '8px 0' }} />
                          <em>Sin mascota asociada</em>
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })
          }
        </MapContainer>
      </div>
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
            renderItem={(dispositivo) => {
              const tieneUbicacion = dispositivo.lastLatitude && dispositivo.lastLongitude;
              const mascotaAsociada = mascotas.find(pet => pet.collarId === dispositivo.id);
              return (
                <li key={dispositivo.id}>
                  📡 #{dispositivo.serialNumber} ({dispositivo.model})
                  {tieneUbicacion ? ' 📍' : ' ❌'}
                  {mascotaAsociada && (
                    <div style={{ fontSize: '0.9em', color: '#666', marginTop: '2px' }}>
                      🐾 {mascotaAsociada.name}
                    </div>
                  )}
                </li>
              );
            }}
            emptyMessage="No tienes dispositivos registrados."
        />
      </div>
    </div>
  );
};

export default Dashboard;