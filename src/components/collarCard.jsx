import React from 'react';
import { GiSpikedCollar } from "react-icons/gi";
import './collarCard.css';

const CollarCard = ({ collar }) => {
  return (
    <div className="collar-card">
      <div className="collar-card-header">
        <GiSpikedCollar className="collar-card-icon" />
        <h3 className="collar-card-serial">ID: {collar.serialNumber}</h3>
      </div>
      <div className="collar-card-body">
        <p><strong>Modelo:</strong> {collar.model}</p>
        <p><strong>ID Interno:</strong> {collar.id}</p> 
      </div>
    </div>
  );
};

export default CollarCard;