import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Importamos los servicios que necesitamos
import petService from '../api/petService';
import collarService from '../api/collarService';
import geofenceService from '../api/geofenceService'; 

// Importaciones de Leaflet y su CSS
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'; // <-- NUEVO: Añadir Circle
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importamos el CSS del Dashboard
import './dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  // Estados para guardar los datos
  const [mascotas, setMascotas] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [geocercas, setGeocercas] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [previousPositions, setPreviousPositions] = useState({}); // Para trackear posiciones previas
  

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false); // Para mostrar cuando se está actualizando
  const [lastUpdate, setLastUpdate] = useState(null); // Para mostrar la hora de la última actualización

  // Coordenadas de Lima, Perú
  const limaPosition = [-12.046374, -77.042793];

  // Función para calcular la distancia entre dos puntos usando la fórmula de Haversine
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en metros
  };

  // Función para verificar si una mascota está dentro de una geocerca
  const isInsideGeofence = (petLat, petLon, geofenceLat, geofenceLon, radius) => {
    const distance = calculateDistance(petLat, petLon, geofenceLat, geofenceLon);
    return distance <= radius;
  };

  // Función para agregar notificaciones
  const addNotification = (message, type = 'warning') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Mantener solo las últimas 5
    
    // Auto-remover después de 10 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== newNotification.id));
    }, 10000);
  };

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    }

    // Función para verificar violaciones de geocercas
    const checkGeofenceViolations = (devices, pets, geofences) => {
      if (!geofences.length || !devices.length || !pets.length) return;

      console.log("🔍 Verificando violaciones de geocercas...");

      devices.forEach(collar => {
        if (!collar.lastLatitude || !collar.lastLongitude) return;

        const mascotaAsociada = pets.find(pet => pet.collarId === collar.id);
        if (!mascotaAsociada) return;

        geofences.forEach(geofence => {
          if (!geofence.latitude || !geofence.longitude || !geofence.radius) return;

          const isCurrentlyInside = isInsideGeofence(
            collar.lastLatitude, 
            collar.lastLongitude,
            geofence.latitude,
            geofence.longitude,
            geofence.radius
          );

          const positionKey = `${collar.id}-${geofence.id}`;
          
          setPreviousPositions(prev => {
            const wasInsidePreviously = prev[positionKey];

            // Si era la primera vez que checkeamos, guardamos el estado actual
            if (wasInsidePreviously === undefined) {
              console.log(`📍 Posición inicial para ${mascotaAsociada.name} en geocerca ${geofence.name}: ${isCurrentlyInside ? 'DENTRO' : 'FUERA'}`);
              return {
                ...prev,
                [positionKey]: isCurrentlyInside
              };
            }

            // Si estaba dentro y ahora está fuera, enviar notificación
            if (wasInsidePreviously && !isCurrentlyInside) {
              console.log(`🚨 ALERTA: ${mascotaAsociada.name} ha salido de la geocerca "${geofence.name || 'Sin nombre'}"`);
              addNotification(
                `🚨 ${mascotaAsociada.name} ha salido de la geocerca "${geofence.name || 'Sin nombre'}"`,
                'alert'
              );
            }

            // Si estaba fuera y ahora está dentro (opcional: notificar también)
            if (!wasInsidePreviously && isCurrentlyInside) {
              console.log(`✅ ${mascotaAsociada.name} ha regresado a la geocerca "${geofence.name || 'Sin nombre'}"`);
              addNotification(
                `✅ ${mascotaAsociada.name} ha regresado a la geocerca "${geofence.name || 'Sin nombre'}"`,
                'success'
              );
            }

            // Actualizar el estado previo
            return {
              ...prev,
              [positionKey]: isCurrentlyInside
            };
          });
        });
      });
    };

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      // Función auxiliar para hacer llamadas seguras a la API
      const safeFetch = async (apiCall, errorMessage) => {
        try {
          const response = await apiCall();
          return response.data || [];
        } catch (err) {
          console.warn(errorMessage, err);
          return [];
        }
      };

      try {
        // Hacemos las llamadas de forma independiente para que si una falla, las otras continúen
        const [petsData, devicesData, geofencesData] = await Promise.all([
          safeFetch(
            () => petService.getPetsByUsername(user.username),
            "Error cargando mascotas:"
          ),
          safeFetch(
            () => collarService.getCollarsByUsername(user.username),
            "Error cargando collares:"
          ),
          safeFetch(
            () => geofenceService.getGeofencesByUsername(user.username),
            "Error cargando geocercas:"
          )
        ]);
        
        // Guardamos los datos en sus respectivos estados
        setMascotas(petsData);
        setDispositivos(devicesData);
        setGeocercas(geofencesData);
        setLastUpdate(new Date());

        // Imprimir información de los collares en consola
        console.log("=== INFORMACIÓN DE COLLARES ===");
        console.log("Cantidad de collares encontrados:", devicesData.length);
        console.log("Datos completos de collares:", devicesData);
        
        if (devicesData.length > 0) {
          devicesData.forEach((collar, index) => {
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

        console.log("=== INFORMACIÓN DE GEOCERCAS ===");
        console.log("Cantidad de geocercas encontradas:", geofencesData.length);
        console.log("Datos completos de geocercas:", geofencesData);

        // Verificar geocercas después de cargar los datos iniciales
        if (petsData.length > 0 && devicesData.length > 0 && geofencesData.length > 0) {
          checkGeofenceViolations(devicesData, petsData, geofencesData);
        }

      } catch (err) {
        console.error("Error crítico fetching dashboard data:", err);
        setError("Hubo un problema cargando algunos datos del panel.");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Cargar datos iniciales
    fetchData();
  }, [user]);

  // useEffect separado para el intervalo de actualización
  useEffect(() => {
    if (!user || isLoading) return;

    console.log("🕐 Configurando intervalo de actualización cada 5 segundos...");

    // Función para actualizar solo las posiciones de los dispositivos
    const updateDevicePositions = async () => {
      try {
        setIsUpdating(true);
        console.log("⏰ Ejecutando actualización automática cada 5 segundos...");
        
        const response = await collarService.getCollarsByUsername(user.username);
        const newDevicesData = response.data || [];
        
        console.log("🔄 Actualizando posiciones de dispositivos...");
        console.log("Nuevas posiciones:", newDevicesData);
        
        // Actualizar dispositivos
        setDispositivos(prevDevices => {
          console.log("📍 Dispositivos anteriores:", prevDevices.length);
          console.log("📍 Nuevos dispositivos:", newDevicesData.length);
          
          // Verificar si hubo cambios en las posiciones
          const hasPositionChanges = newDevicesData.some(newDevice => {
            const oldDevice = prevDevices.find(old => old.id === newDevice.id);
            return !oldDevice || 
                   oldDevice.lastLatitude !== newDevice.lastLatitude || 
                   oldDevice.lastLongitude !== newDevice.lastLongitude;
          });

          if (hasPositionChanges) {
            console.log("📍 Se detectaron cambios en las posiciones!");
          } else {
            console.log("📍 No hay cambios en las posiciones.");
          }

          return newDevicesData;
        });
        
        setLastUpdate(new Date());

        // Verificar geocercas con las nuevas posiciones
        setTimeout(() => {
          setMascotas(currentPets => {
            setGeocercas(currentGeofences => {
              if (newDevicesData.length > 0 && currentPets.length > 0 && currentGeofences.length > 0) {
                console.log("🔍 Ejecutando verificación de geocercas con datos actualizados...");
                
                // Verificar violaciones directamente aquí
                newDevicesData.forEach(collar => {
                  if (!collar.lastLatitude || !collar.lastLongitude) return;

                  const mascotaAsociada = currentPets.find(pet => pet.collarId === collar.id);
                  if (!mascotaAsociada) return;

                  currentGeofences.forEach(geofence => {
                    if (!geofence.latitude || !geofence.longitude || !geofence.radius) return;

                    const isCurrentlyInside = isInsideGeofence(
                      collar.lastLatitude, 
                      collar.lastLongitude,
                      geofence.latitude,
                      geofence.longitude,
                      geofence.radius
                    );

                    const positionKey = `${collar.id}-${geofence.id}`;
                    
                    setPreviousPositions(prev => {
                      const wasInsidePreviously = prev[positionKey];

                      // Si era la primera vez que checkeamos, guardamos el estado actual
                      if (wasInsidePreviously === undefined) {
                        console.log(`📍 Posición inicial para ${mascotaAsociada.name} en geocerca ${geofence.name}: ${isCurrentlyInside ? 'DENTRO' : 'FUERA'}`);
                        return {
                          ...prev,
                          [positionKey]: isCurrentlyInside
                        };
                      }

                      // Si estaba dentro y ahora está fuera, enviar notificación
                      if (wasInsidePreviously && !isCurrentlyInside) {
                        console.log(`🚨 ALERTA: ${mascotaAsociada.name} ha salido de la geocerca "${geofence.name || 'Sin nombre'}"`);
                        addNotification(
                          `🚨 ${mascotaAsociada.name} ha salido de la geocerca "${geofence.name || 'Sin nombre'}"`,
                          'alert'
                        );
                      }

                      // Si estaba fuera y ahora está dentro
                      if (!wasInsidePreviously && isCurrentlyInside) {
                        console.log(`✅ ${mascotaAsociada.name} ha regresado a la geocerca "${geofence.name || 'Sin nombre'}"`);
                        addNotification(
                          `✅ ${mascotaAsociada.name} ha regresado a la geocerca "${geofence.name || 'Sin nombre'}"`,
                          'success'
                        );
                      }

                      // Actualizar el estado previo
                      return {
                        ...prev,
                        [positionKey]: isCurrentlyInside
                      };
                    });
                  });
                });
              }
              return currentGeofences;
            });
            return currentPets;
          });
        }, 100);

      } catch (err) {
        console.warn("Error actualizando posiciones:", err);
      } finally {
        setIsUpdating(false);
      }
    };

    // Configurar actualización automática cada 5 segundos para posiciones
    const updateInterval = setInterval(updateDevicePositions, 10000);

    // Limpiar intervalo al desmontar
    return () => {
      console.log("🧹 Limpiando intervalo de actualización...");
      clearInterval(updateInterval);
    };
  }, [user, isLoading]); // Solo depende de user e isLoading

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
      {/* Panel de notificaciones */}
      {notifications.length > 0 && (
        <div className="notifications-panel">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification notification-${notification.type}`}
            >
              <div className="notification-content">
                <span className="notification-message">{notification.message}</span>
                <span className="notification-time">{notification.timestamp}</span>
              </div>
              <button 
                className="notification-close"
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="map-wrapper">
        {/* Indicador de actualización */}
        {isUpdating && (
          <div className="update-indicator">
            <span>🔄 Actualizando posiciones...</span>
          </div>
        )}
        
        <MapContainer center={limaPosition} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Mostrar geocercas */}
          {!isLoading && geocercas && geocercas.length > 0 && geocercas.map(geofence => (
            geofence && geofence.latitude && geofence.longitude && geofence.radius ? (
              <Circle
                key={geofence.id}
                center={[geofence.latitude, geofence.longitude]}
                radius={geofence.radius}
                pathOptions={{ color: 'purple', fillColor: 'purple', fillOpacity: 0.2 }}
              >
                <Popup>
                  <strong>Geocerca:</strong> {geofence.name || 'Sin nombre'} <br />
                  <strong>Radio:</strong> {geofence.radius} metros
                </Popup>
              </Circle>
            ) : null
          ))}

          {/* Mostrar collares como puntos destacados */}
          {!isLoading && dispositivos
            .filter(collar => collar.lastLatitude && collar.lastLongitude)
            .map(collar => {
              // Buscar la mascota asociada a este collar
              const mascotaAsociada = mascotas.find(pet => pet.collarId === collar.id);
              
              // Verificar si está dentro de alguna geocerca
              const isInsideAnyGeofence = geocercas.some(geofence => 
                geofence.latitude && geofence.longitude && geofence.radius &&
                isInsideGeofence(
                  collar.lastLatitude, 
                  collar.lastLongitude,
                  geofence.latitude,
                  geofence.longitude,
                  geofence.radius
                )
              );

              return (
                <Marker
                  key={`collar-${collar.id}`}
                  position={[collar.lastLatitude, collar.lastLongitude]}
                  icon={L.divIcon({
                    html: `<div style="
                      background-color: ${isInsideAnyGeofence ? '#27ae60' : '#e74c3c'};
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      border: 3px solid white;
                      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    "></div>`,
                    className: 'custom-marker',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                  })}
                >
                  <Popup>
                    <div style={{ minWidth: '200px' }}>
                      <strong>📡 Collar #{collar.serialNumber}</strong><br />
                      <strong>Estado:</strong> 
                      <span style={{ 
                        color: isInsideAnyGeofence ? '#27ae60' : '#e74c3c',
                        fontWeight: 'bold',
                        marginLeft: '5px'
                      }}>
                        {isInsideAnyGeofence ? '✅ Dentro de geocerca' : '⚠️ Fuera de geocerca'}
                      </span><br />
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
        {/* Información de actualización */}
        {lastUpdate && !isLoading && (
          <div className="update-info">
            <small>📍 Última actualización: {lastUpdate.toLocaleTimeString()}</small>
          </div>
        )}

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
              
              // Verificar si está dentro de alguna geocerca
              const isInsideAnyGeofence = tieneUbicacion && geocercas.some(geofence => 
                geofence.latitude && geofence.longitude && geofence.radius &&
                isInsideGeofence(
                  dispositivo.lastLatitude, 
                  dispositivo.lastLongitude,
                  geofence.latitude,
                  geofence.longitude,
                  geofence.radius
                )
              );

              return (
                <li key={dispositivo.id}>
                  📡 #{dispositivo.serialNumber} ({dispositivo.model})
                  {tieneUbicacion ? (
                    <span style={{ 
                      color: isInsideAnyGeofence ? '#27ae60' : '#e74c3c',
                      marginLeft: '5px'
                    }}>
                      {isInsideAnyGeofence ? '✅' : '⚠️'}
                    </span>
                  ) : ' ❌'}
                  {mascotaAsociada && (
                    <div style={{ fontSize: '0.9em', color: '#666', marginTop: '2px' }}>
                      🐾 {mascotaAsociada.name}
                      {tieneUbicacion && (
                        <span style={{ 
                          fontSize: '0.8em',
                          color: isInsideAnyGeofence ? '#27ae60' : '#e74c3c',
                          marginLeft: '5px'
                        }}>
                          {isInsideAnyGeofence ? '(Segura)' : '(Fuera de zona)'}
                        </span>
                      )}
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