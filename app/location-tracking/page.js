'use client';

import { useEffect, useState } from 'react';
import LocationTrackingTable from '@/components/LocationTrackingTable';

const API_URL = 'https://inventorydb-u5sz.onrender.com';

export default function Page() {
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);

  const [open, setOpen] = useState(false);
  const [itemModal, setItemModal] = useState(false);
  const [loading, setLoading] = useState(false);
const [stockWarning, setStockWarning] = useState('');
  const [searchItem, setSearchItem] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const [form, setForm] = useState({
    location_name: '',
    source: '',
    destination: '',
    address: '',
    plate: '',
  });

  // =========================
  // FETCH TRACKING
  // =========================
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/tracking`);
      const data = await res.json();

      const list = Array.isArray(data) ? data : [];

      const activeOnly = list.filter((i) => {
        const status = (i.status || '').trim().toLowerCase();
        return (
          status === 'pending' ||
          status === 'on the way' ||
          status === 'arrived'
        );
      });

      setLocations(activeOnly);
    } catch (err) {
      console.error('fetchData error:', err);
      setLocations([]);
    }
  };

  // =========================
  // FETCH ITEMS
  // =========================
  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/items`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchItems();
  }, []);

  // =========================
  // ITEM SELECT
  // =========================
  const toggleItem = (item) => {
  const stock = Number(item.quantity || 0);

  if (stock <= 0) {
    setStockWarning(`${item.part_name} is out of stock`);
    return;
  }

  setSelectedItems((prev) => {
    const exists = prev.find((i) => i.id === item.id);

    if (exists) {
      return prev.filter((i) => i.id !== item.id);
    }

    return [...prev, { ...item, qty: 1 }];
  });
};

  const updateQty = (id, qty) => {
  setSelectedItems((prev) =>
    prev.map((i) => {
      if (i.id !== id) return i;

      const maxStock = Number(i.quantity || 0);

      if (qty > maxStock) {
        setStockWarning(`Only ${maxStock} stock available for ${i.part_name}`);
        qty = maxStock;
      }

      if (qty < 1) qty = 1;

      return { ...i, qty };
    })
  );
};

  const calculateTotal = () => {
    return selectedItems.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.qty || 1),
      0
    );
  };

  const resetForm = () => {
    setForm({
      location_name: '',
      source: '',
      destination: '',
      address: '',
      plate: '',
    });

    setSelectedItems([]);
    setSearchItem('');
  };

  // =========================
  // CREATE ORDER
  // =========================
  const addOrder = async () => {
  try {
    setLoading(true);

    if (selectedItems.length === 0) {
      alert('Please select at least 1 item');
      return;
    }

    const payload = {
      ...form,
      totalprice: calculateTotal(),
      items: selectedItems.map((i) => ({
        id: i.id,
        part_name: i.part_name,
        qty: i.qty,
      })),
    };

    const res = await fetch(`${API_URL}/tracking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.log('Backend error:', data);
      throw new Error(data?.message || 'Failed to save order');
    }

    await fetchData();
    resetForm();
    setOpen(false);
  } catch (err) {
    console.error('addOrder error:', err);
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  // =========================
  // STATUS UPDATE
  // =========================
  const updateStatus = async (item, status) => {
    try {
      await fetch(`${API_URL}/tracking/status/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const deleteItem = async (id) => {
    await fetch(`${API_URL}/tracking/${id}`, {
      method: 'DELETE',
    });

    fetchData();
  };


  // =========================
  // FORMATTERS
  // =========================
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString() : '-';

  const formatTime = (d) =>
    d
      ? new Date(d).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-';

  return (
    <div className="tracking-dashboard">

      {/* HEADER */}
      {/* HEADER */}
<div className="header-bar">
  <h1>🚚 JRP Warehouse Tracking</h1>
</div>

{/* TABLE ACTION BAR (TOP LEFT ABOVE TABLE) */}
<div className="table-actions-bar">
  <button className="add-order-btn" onClick={() => setOpen(true)}>
    + Add Order
  </button>
</div>

{/* TABLE */}
<LocationTrackingTable
  locations={locations}
  formatDate={formatDate}
  formatTime={formatTime}
  onStatus={updateStatus}
  onDelete={deleteItem}
/>

      {/* EMPTY STATE */}
      {locations.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          No active deliveries
        </div>
      )}

     {/* ================= MODAL CREATE ORDER ================= */}
{open && (
  <div
    className="modal-overlay"
    onClick={() => setOpen(false)}
  >
    <div
      className="modal create-order-modal"
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}
      <div className="modal-header">
        <div>
          <h2>Create Order</h2>
          <p>
            Create a new warehouse delivery
          </p>
        </div>

        <button
          className="close-icon"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
      </div>

      {/* FORM */}
      <div className="modal-form-grid">

        {/* LOCATION */}
        <div className="form-group">
          <label>Location</label>

          <input
            placeholder="Enter location"
            value={form.location_name}
            onChange={(e) =>
              setForm({
                ...form,
                location_name:
                  e.target.value,
              })
            }
          />
        </div>

        {/* FROM */}
        <div className="form-group">
          <label>From</label>

          <input
            placeholder="Warehouse source"
            value={form.source}
            onChange={(e) =>
              setForm({
                ...form,
                source: e.target.value,
              })
            }
          />
        </div>

        {/* TO */}
        <div className="form-group">
          <label>To</label>

          <input
            placeholder="Destination"
            value={form.destination}
            onChange={(e) =>
              setForm({
                ...form,
                destination:
                  e.target.value,
              })
            }
          />
        </div>

        {/* ADDRESS */}
        <div className="form-group full-width">
          <label>Address</label>

          <input
            placeholder="Complete address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
          />
        </div>

        {/* PLATE */}
        <div className="form-group">
          <label>Plate Number</label>

          <input
            placeholder="ABC-1234"
            value={form.plate}
            onChange={(e) =>
              setForm({
                ...form,
                plate: e.target.value,
              })
            }
          />
        </div>

        {/* ITEMS */}
        <div className="form-group full-width">

          <label>Items</label>

          <button
            className="select-items-btn"
            onClick={() =>
              setItemModal(true)
            }
          >
            📦 Select Items (
            {selectedItems.length})
          </button>

        </div>

      </div>

      {/* SELECTED ITEMS */}
      {selectedItems.length > 0 && (
        <div className="selected-items-box">

          <h4>Selected Items</h4>

          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="selected-item-row"
            >
              <span>
                {item.part_name}
              </span>

              <span>
                Qty: {item.qty}
              </span>
            </div>
          ))}

        </div>
      )}

      {/* FOOTER */}
      <div className="modal-footer">

        <div className="total-box">
          <span>Total Amount</span>

          <h3>
            ₱
            {calculateTotal().toLocaleString()}
          </h3>
        </div>

        <div className="footer-buttons">

          <button
            className="cancel-btn"
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={addOrder}
            disabled={loading}
          >
            {loading
              ? 'Saving...'
              : 'Save Order'}
          </button>

        </div>

      </div>

    </div>
  </div>
)}

      {/* ================= ITEM MODAL ================= */}
{itemModal && (
  <div
    className="modal-overlay"
    onClick={() => setItemModal(false)}
  >
    <div
      className="modal item-modal"
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}
      <div className="modal-header">
        <div>
          <h2>Select Items</h2>
          <p>
            Search and add warehouse items
          </p>
        </div>

        <button
          className="close-icon"
          onClick={() =>
            setItemModal(false)
          }
        >
          ✕
        </button>
      </div>

      {/* SEARCH */}
      <div className="item-search-box">

        <input
          type="text"
          placeholder="🔍 Search item..."
          value={searchItem}
          onChange={(e) =>
            setSearchItem(
              e.target.value
            )
          }
        />

      </div>

      {stockWarning && (
  <div className="stock-warning">
    ⚠ {stockWarning}
  </div>
)}

      {/* ITEMS LIST */}
      <div className="items-list">

        {items
          .filter((i) =>
            (i.part_name || '')
              .toLowerCase()
              .includes(
                searchItem.toLowerCase()
              )
          )
          .map((item) => {
            const selected =
              selectedItems.find(
                (i) =>
                  i.id === item.id
              );

            return (
              <div
                key={item.id}
                className={`item-card ${
                  selected
                    ? 'active-item'
                    : ''
                }`}
              >

                {/* LEFT */}
                <div className="item-left">

                  <label className="item-checkbox">

                    <input
                      type="checkbox"
                      checked={
                        !!selected
                      }
                      onChange={() =>
                        toggleItem(
                          item
                        )
                      }
                    />

                    <span className="checkmark"></span>

                  </label>

                  <div>
                    <h4>
                      {
                        item.part_name
                      }
                    </h4>

                    <p>₱{Number(item.price || 0).toLocaleString()}</p>
<p className="stock-text">
  Stock: {item.quantity}
</p>
                  </div>

                </div>

                {/* RIGHT */}
                {selected && (
                  <div className="qty-box">

                    <span>Qty</span>

                    <input
                      type="number"
                      min="1"
                      value={
                        selected.qty
                      }
                      onChange={(e) =>
                        updateQty(
                          item.id,
                          Number(
                            e.target
                              .value
                          )
                        )
                      }
                    />

                  </div>
                )}

              </div>
            );
          })}

      </div>

      {/* FOOTER */}
      <div className="item-modal-footer">

        <div className="selected-count">
          Selected:
          <strong>
            {' '}
            {
              selectedItems.length
            }{' '}
          </strong>
          items
        </div>

        <button
          className="done-btn"
          onClick={() =>
            setItemModal(false)
          }
        >
          Done
        </button>

      </div>

    </div>
  </div>
)}
    </div>
  );
}