import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import { useAuth } from '../context/AuthContext.jsx';
import geofenceService from '../api/geofenceService';
import './geocercas.css';

const MapEventsHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const GeoCercas = () => {
  const { user } = useAuth();
  const [existingGeofences, setExistingGeofences] = useState([]);
  const [newGeofence, setNewGeofence] = useState({
    name: '',
    latitude: null,
    longitude: null,
    radius: 500, // Radio inicial en metros
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingGeofenceId, setDeletingGeofenceId] = useState(null);
  const limaPosition = [-12.046374, -77.042793];

  useEffect(() => {
    if (user) {
      geofenceService.getGeofencesByUsername(user.username)
        .then(response => {
          setExistingGeofences(response.data || []);
        })
        .catch(err => {
          console.error("Error fetching geofences:", err);
          setExistingGeofences([]); // Si hay error o no hay, es una lista vacio
        });
    }
  }, [user]);

  const handleMapClick = (latlng) => {
    setNewGeofence(prev => ({ ...prev, latitude: latlng.lat, longitude: latlng.lng }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewGeofence(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newGeofence.name || !newGeofence.latitude) {
      alert("Por favor, ponle un nombre a la geocerca y seleccióna un punto en el mapa.");
      return;
    }
    setIsSubmitting(true);

    const geofenceData = {
      name: newGeofence.name,
      latitude: newGeofence.longitude,
      longitude: newGeofence.latitude,
      radius: parseFloat(newGeofence.radius),
      username: user.username,
    };
    
    console.log("Sending geofence data:", geofenceData);
    
    try {
      const response = await geofenceService.createGeofence(geofenceData);
      setExistingGeofences(prev => [...prev, response.data]);
      // Resetear el formulario
      setNewGeofence({ name: '', latitude: null, longitude: null, radius: 500 });
    } catch (err) {
      console.error("Error creating geofence:", err);
      alert("No se pudo crear la geocerca. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGeofence = async (geofenceId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta geocerca? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeletingGeofenceId(geofenceId);
    try {
      await geofenceService.deleteGeofence(geofenceId);
      setExistingGeofences(prev => prev.filter(gf => gf.id !== geofenceId));
      alert("Geocerca eliminada exitosamente");
    } catch (err) {
      console.error("Error deleting geofence:", err);
      alert("No se pudo eliminar la geocerca. Inténtalo de nuevo.");
    } finally {
      setDeletingGeofenceId(null);
    }
  };
  
  const newGeofencePosition = useMemo(() => {
    return newGeofence.latitude ? [newGeofence.latitude, newGeofence.longitude] : null;
  }, [newGeofence.latitude, newGeofence.longitude]);


  return (
    <div className="geofence-page-container">
      <div className="geofence-content-layout">
        {/* Mapa - Izquierda */}
        <div className="geofence-map-container">
          <MapContainer center={limaPosition} zoom={13} scrollWheelZoom={true}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <MapEventsHandler onMapClick={handleMapClick} />
            
            {/* Mostrar geocercas existentes */}
            {existingGeofences.map(gf => (
              <Circle
                key={gf.id}
                center={[gf.latitude, gf.longitude]}
                radius={gf.radius}
                pathOptions={{ 
                  color: 'blue', 
                  fillColor: 'blue', 
                  fillOpacity: 0.2,
                  weight: 2 
                }}
              />
            ))}

            {/* Mostrar la nueva geocerca que se está creando */}
            {newGeofencePosition && (
              <>
                <Marker position={newGeofencePosition}></Marker>
                <Circle
                  center={newGeofencePosition}
                  radius={parseFloat(newGeofence.radius)}
                  pathOptions={{ 
                    color: 'green', 
                    fillColor: 'green', 
                    fillOpacity: 0.3,
                    weight: 2 
                  }}
                />
              </>
            )}
          </MapContainer>
        </div>

        {/* Formulario de crear nueva geocerca - Centro */}
        <div className="geofence-form-container">
          <h2>Crear Nueva Geocerca</h2>
          <p>1. Haz clic en el mapa para ubicar el centro.</p>
          <p>2. Completa los datos y guarda.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Nombre de la Geocerca</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newGeofence.name}
                onChange={handleFormChange}
                placeholder="Ej: Casa, Parque del barrio"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="radius">Radio (en metros)</label>
              <input
                type="range"
                id="radius"
                name="radius"
                min="50"
                max="2000"
                step="50"
                value={newGeofence.radius}
                onChange={handleFormChange}
              />
              <div className="radius-display">{newGeofence.radius} metros</div>
            </div>
            <button type="submit" className="submit-btn" disabled={isSubmitting || !newGeofence.latitude}>
              {isSubmitting ? 'Guardando...' : 'Guardar Geocerca'}
            </button>
          </form>
        </div>

        {/* Lista de geocercas existentes - Derecha */}
        <div className="existing-geofences-container">
          <h2>Geocercas Existentes</h2>
          {existingGeofences.length > 0 ? (
            <div className="existing-geofences">
              <div className="geofences-count">
                Total: {existingGeofences.length} geocerca{existingGeofences.length > 1 ? 's' : ''}
              </div>
              <div className="geofences-list">
                {existingGeofences.map(gf => (
                  <div key={gf.id} className="geofence-item">
                    <div className="geofence-info">
                      <strong>{gf.name}</strong>
                      <span className="geofence-details">
                        Radio: {gf.radius}m<br />
                        Lat: {gf.latitude?.toFixed(4)}<br />
                        Lng: {gf.longitude?.toFixed(4)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteGeofence(gf.id)}
                      disabled={deletingGeofenceId === gf.id}
                      className="delete-btn"
                      title="Eliminar geocerca"
                    >
                      {deletingGeofenceId === gf.id ? '🔄' : '🗑️'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-geofences">
              <p>No tienes geocercas configuradas</p>
              <p>👈 Usa el formulario para crear tu primera geocerca</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeoCercas;