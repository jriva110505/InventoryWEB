'use client';

import { useEffect, useState } from 'react';

export default function SalesHistoryPage() {

  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);

  // =========================
  // FETCH SALES
  // =========================
  useEffect(() => {

    const fetchSales = async () => {

      try {

        const res = await fetch(
          'https://inventorydb-u5sz.onrender.com/tracking/sales'
        );

        const data = await res.json();

        setSales(data);

      } catch (err) {

        console.log('Error fetching sales:', err);

      }
    };

    fetchSales();

  }, []);

  // =========================
  // TOTALS
  // =========================
  const totalSales = sales.length;

  const totalValue = sales.reduce((sum, sale) => {
    return sum + Number(sale.totalprice || 0);
  }, 0);

  return (
    <div className="sales-container">

      {/* HEADER */}
      <div className="sales-header">

        <h1>Sales History</h1>

        <div className="sales-summary">

  {/* TOTAL ORDERS */}
  <div className="summary-card orders-card">

    <div>
      <span className="summary-label">
        Delivered Orders
      </span>

      <h2>{totalSales}</h2>
    </div>

    <div className="summary-icon">
      📦
    </div>

  </div>

  {/* TOTAL SALES */}
  <div className="summary-card sales-card">

    <div>
      <span className="summary-label">
        Total Sales
      </span>

      <h2>
        ₱{totalValue.toLocaleString()}
      </h2>
    </div>

    <div className="summary-icon">
      💰
    </div>

  </div>

</div>

      </div>

      {/* TABLE */}
      <div className="table-wrapper">

        <table className="sales-table">

          <thead>

            <tr>
              <th>Location</th>
              <th>Item</th>
              <th>Qty</th>
              <th>From</th>
              <th>To</th>
              <th>Address</th>
              <th>Plate</th>
              <th>Total</th>
              <th>Arrival</th>
              <th>Departure</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {sales.length === 0 ? (

              <tr>
                <td
                  colSpan={12}
                  className="no-items"
                >
                  No delivered sales yet
                </td>
              </tr>

            ) : (

              sales.map((sale) => (

                <tr
                  key={sale.id}
                  className="clickable-row"
                >

                  <td>{sale.location_name}</td>

                  <td>{sale.item_name}</td>

                  <td>{sale.quantity}</td>

                  <td>{sale.source}</td>

                  <td>{sale.destination}</td>

                  <td>{sale.address}</td>

                  <td>{sale.plate}</td>

                  <td>
                    ₱{Number(
                      sale.totalprice || 0
                    ).toLocaleString()}
                  </td>

                  <td>
                    {sale.arrival
                      ? new Date(
                          sale.arrival
                        ).toLocaleString()
                      : '-'}
                  </td>

                  <td>
                    {sale.departure
                      ? new Date(
                          sale.departure
                        ).toLocaleString()
                      : '-'}
                  </td>

                  <td>

                    <span
                      className={`status-badge delivered`}
                    >
                      {sale.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="view-btn"
                      onClick={() =>
                        setSelectedSale(sale)
                      }
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* =========================
          MODAL
      ========================= */}

      {selectedSale && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedSale(null)
          }
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h2>Delivery Details</h2>

            <div className="modal-form">
              <div className="detail-item">
              <p>
                <strong>Location:</strong>{' '}
                {selectedSale.location_name}
              </p>
              </div>

              <div className="detail-item">
              <p>
                <strong>Item:</strong>{' '}
                {selectedSale.item_name}
              </p>
              </div>
              <div className="detail-item">
              <p>
                <strong>Quantity:</strong>{' '}
                {selectedSale.quantity}
              </p>
              </div>

              <div className="detail-item">
              <p>
                <strong>Total:</strong>{' '}
                ₱{Number(
                  selectedSale.totalprice || 0
                ).toLocaleString()}
              </p>
              </div>

                <div className="detail-item">
              <p>
                <strong>From:</strong>{' '}
                {selectedSale.source}
              </p>
              </div>

              <div className="detail-item">
              <p>
                <strong>To:</strong>{' '}
                {selectedSale.destination}
              </p>
              </div>

              <div className="detail-item">
              <p>
                <strong>Address:</strong>{' '}
                {selectedSale.address}
              </p>
              </div>

              <div className="detail-item">

              <p>
                <strong>Plate:</strong>{' '}
                {selectedSale.plate}
              </p>
              </div>

                <div className="detail-item">
              <p>
                <strong>Arrival:</strong>{' '}
                {selectedSale.arrival
                  ? new Date(
                      selectedSale.arrival
                    ).toLocaleString()
                  : '-'}
              </p>
              </div>

              <div className="detail-item">

              <p>
                <strong>Departure:</strong>{' '}
                {selectedSale.departure
                  ? new Date(
                      selectedSale.departure
                    ).toLocaleString()
                  : '-'}
              </p>
              </div>

              <div className="detail-item">

              <p>
                <strong>Status:</strong>{' '}
                {selectedSale.status}
              </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setSelectedSale(null)
                }
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