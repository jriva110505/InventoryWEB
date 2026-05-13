'use client';

import { useState } from 'react';

export default function LocationTrackingTable({
  locations = [],
  formatDate = () => '-',
  formatTime = () => '-',
  onStatus = () => {},
  onDelete = () => {},
}) {
  const [selected, setSelected] = useState(null);

   const getStatusClass = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'pending':
      return 'status pending';

    case 'on the way':
      return 'status otw';

    case 'arrived':
      return 'status arrived';

    case 'delivered':
      return 'status delivered';

    default:
      return 'status';
  }
};

  // =========================
  // STATUS UPDATE
  // =========================
  const handleStatus = async (status) => {
    if (!selected) return;

    const confirmed = confirm(
      `Are you sure you want to mark this order as "${status}"?`
    );

    if (!confirmed) return;

    try {
      await onStatus(selected, status);

      // close modal after update
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="table-wrapper">
      <table className="locations-table">
        <thead>
          <tr>
            <th>Location</th>
            <th>Item</th>
            <th>Qty</th>
            <th>From</th>
            <th>To</th>
            <th>Address</th>
            <th>Plate</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {locations?.length === 0 ? (
            <tr>
              <td
                colSpan="12"
                style={{ textAlign: 'center' }}
              >
                No active tracking data
              </td>
            </tr>
          ) : (
            locations.map((item) => (
              <tr key={item.id}>
                <td>{item.location_name}</td>

                <td>{item.item_name}</td>

                <td>{item.quantity}</td>

                <td>{item.source}</td>

                <td>{item.destination}</td>

                <td>{item.address}</td>

                <td>{item.plate}</td>

                <td>
                  {item.departure
                    ? `${formatDate(
                        item.departure
                      )} ${formatTime(item.departure)}`
                    : '-'}
                </td>

                <td>
                  {item.arrival
                    ? `${formatDate(
                        item.arrival
                      )} ${formatTime(item.arrival)}`
                    : '-'}
                </td>

                <td>
                  ₱
                  {Number(
                    item.totalprice || 0
                  ).toLocaleString()}
                </td>

                <td>
  <span className={getStatusClass(item.status)}>
    {item.status}
  </span>
</td>

                <td>
                  <button
                    onClick={() => setSelected(item)}
                  >
                    👁
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ================= MODAL ================= */}
      {/* ================= MODAL ================= */}
{selected && (
  <div
    className="modal-overlay"
    onClick={() => setSelected(null)}
  >
    <div
      className="modal large-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <h2>Delivery Details</h2>

      <div className="details-grid">

        <div className="detail-item">
          <span>Location</span>
          <p>{selected.location_name || '-'}</p>
        </div>

        <div className="detail-item">
          <span>Item</span>
          <p>{selected.item_name || '-'}</p>
        </div>

        <div className="detail-item">
          <span>Quantity</span>
          <p>{selected.quantity || '-'}</p>
        </div>

        <div className="detail-item">
          <span>From</span>
          <p>{selected.source || '-'}</p>
        </div>

        <div className="detail-item">
          <span>To</span>
          <p>{selected.destination || '-'}</p>
        </div>

        <div className="detail-item">
          <span>Address</span>
          <p>{selected.address || '-'}</p>
        </div>

        <div className="detail-item">
          <span>Plate Number</span>
          <p>{selected.plate || '-'}</p>
        </div>

        <div className="detail-item">
          <span>Departure</span>
          <p>
            {selected.departure
              ? `${formatDate(
                  selected.departure
                )} ${formatTime(
                  selected.departure
                )}`
              : '-'}
          </p>
        </div>

        <div className="detail-item">
          <span>Arrival</span>
          <p>
            {selected.arrival
              ? `${formatDate(
                  selected.arrival
                )} ${formatTime(
                  selected.arrival
                )}`
              : '-'}
          </p>
        </div>

        <div className="detail-item">
          <span>Total Price</span>
          <p>
            ₱
            {Number(
              selected.totalprice || 0
            ).toLocaleString()}
          </p>
        </div>

        <div className="detail-item">
          <span>Status</span>
          <p>
  <span
    className={getStatusClass(selected.status)}
  >
    {selected.status || '-'}
  </span>
</p>
        </div>

      </div>

      <div className="modal-actions">

        {/* OTW */}
        <button
          className={
            selected.status !== 'Pending'
              ? 'disabled-btn'
              : ''
          }
          disabled={
            selected.status !== 'Pending'
          }
          onClick={() =>
            handleStatus('On the Way')
          }
        >
          OTW
        </button>

        {/* ARRIVED */}
        <button
          className={
            selected.status !== 'On the Way'
              ? 'disabled-btn'
              : ''
          }
          disabled={
            selected.status !== 'On the Way'
          }
          onClick={() =>
            handleStatus('Arrived')
          }
        >
          Arrived
        </button>

        {/* DELIVERED */}
        <button
          className={
            selected.status !== 'Arrived'
              ? 'disabled-btn'
              : ''
          }
          disabled={
            selected.status !== 'Arrived'
          }
          onClick={() =>
            handleStatus('Delivered')
          }
        >
          Delivered
        </button>

        <button
          onClick={() => setSelected(null)}
        >
          Close
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
}