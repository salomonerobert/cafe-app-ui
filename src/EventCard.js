import React from "react";
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function EventCard({ title, summary, alert, label, subtitle }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">{title}</h5>
          {label && (
            <span className="border rounded border-secondary bg-danger text-white px-2">
              {label}
            </span>
          )}
        </div>
        {subtitle && <p className="card-title mb-0 text-secondary mt-2">{subtitle}</p>}
        <p className="card-text">{summary}</p>
        {alert && <p className="alert alert-danger"><span><FontAwesomeIcon icon={faExclamationTriangle} style={{color: "#e60000"}} /></span> {alert}</p>}      </div>
    </div>
  );
}
