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
      latitude: newGeofence.latitude,
      longitude: newGeofence.longitude,
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
  
  const newGeofencePosition = useMemo(() => {
    return newGeofence.latitude ? [newGeofence.latitude, newGeofence.longitude] : null;
  }, [newGeofence.latitude, newGeofence.longitude]);


  return (
    <div className="geofence-page-container">
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
              center={[gf.longitude, gf.latitude]}
              radius={gf.radius}
              pathOptions={{ color: 'blue', fillColor: 'blue' }}
            />
          ))}

          {/* Mostrar la nueva geocerca que se está creando */}
          {newGeofencePosition && (
            <>
              <Marker position={newGeofencePosition}></Marker>
              <Circle
                center={newGeofencePosition}
                radius={parseFloat(newGeofence.radius)}
                pathOptions={{ color: 'green', fillColor: 'green' }}
              />
            </>
          )}
        </MapContainer>
      </div>

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
    </div>
  );
};

export default GeoCercas;