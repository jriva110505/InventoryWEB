'use client'

import { useEffect, useState } from 'react'

import ProductTable from '@/components/ProductTable'
import ProductForm from '@/components/ProductForm'

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')

  // ADD MODAL
  const [open, setOpen] = useState(false)

  // EDIT MODAL
  const [editOpen, setEditOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // STOCK MODALS
  const [lowStockOpen, setLowStockOpen] = useState(false)
  const [outStockOpen, setOutStockOpen] = useState(false)

  // FILTER
  const [selectedCategory, setSelectedCategory] = useState('All')

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://inventorydb-u5sz.onrender.com/items')
      const data = await response.json()

      // ✅ SAFE ARRAY FIX
      const list = Array.isArray(data)
        ? data
        : data?.items || data?.data || []

      setProducts(list)
    } catch (error) {
      console.log(error)
      setProducts([])
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // =========================
  // ADD PRODUCT
  // =========================
  const addProduct = async (product) => {
    try {
      const response = await fetch('https://inventorydb-u5sz.onrender.com/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          part_name: product.part_name,
          sku: product.sku,
          category: product.category,
          model: product.model,
          quantity: Number(product.quantity),
          price: Number(product.price),
        }),
      })

      if (!response.ok) throw new Error('Failed to add product')

      fetchProducts()
      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  // =========================
  // OPEN EDIT
  // =========================
  const editProduct = (product) => {
    setEditingProduct(product)
    setEditOpen(true)
  }

  // =========================
  // CLOSE EDIT
  // =========================
  const closeEditModal = () => {
    setEditOpen(false)
    setEditingProduct(null)
  }

  // =========================
  // UPDATE PRODUCT
  // =========================
  const updateProduct = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        `https://inventorydb-u5sz.onrender.com/items/${editingProduct.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            part_name: editingProduct.part_name,
            sku: editingProduct.sku,
            category: editingProduct.category,
            model: editingProduct.model,
            quantity: Number(editingProduct.quantity),
            price: Number(editingProduct.price),
          }),
        }
      )

      if (!response.ok) throw new Error('Failed to update')

      fetchProducts()
      closeEditModal()
    } catch (error) {
      console.log(error)
    }
  }

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async () => {
    const confirmDelete = window.confirm('Delete this product?')
    if (!confirmDelete) return

    try {
      await fetch(
        `https://inventorydb-u5sz.onrender.com/items/${editingProduct.id}`,
        { method: 'DELETE' }
      )

      fetchProducts()
      closeEditModal()
    } catch (error) {
      console.log(error)
    }
  }

  // =========================
  // SAFE ARRAY CHECK
  // =========================
  const safeProducts = Array.isArray(products) ? products : []

  // =========================
  // CATEGORY LIST
  // =========================
  const categories = [
    'All',
    ...new Set(safeProducts.map((p) => p.category).filter(Boolean)),
  ]

  // =========================
  // FILTER PRODUCTS
  // =========================
  const filteredProducts = safeProducts.filter((product) => {
    const keyword = search.toLowerCase()

    const matchSearch =
      product.part_name?.toLowerCase().includes(keyword) ||
      product.sku?.toLowerCase().includes(keyword)

    const matchCategory =
      selectedCategory === 'All' ||
      product.category === selectedCategory

    return matchSearch && matchCategory
  })

  // =========================
  // STATS (SAFE FIX)
  // =========================
  const totalItems = safeProducts.length

  const lowStockList = safeProducts.filter(
    (p) => Number(p.quantity) > 0 && Number(p.quantity) <= 5
  )

  const outStockList = safeProducts.filter(
    (p) => Number(p.quantity) === 0
  )

  const totalValue = safeProducts.reduce(
    (total, p) =>
      total + Number(p.quantity) * Number(p.price),
    0
  )

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header-bar">
        <div>
          <h1 className="main-title">
            Motorcycle Parts Inventory
          </h1>
          <p className="subtitle">
            Manage your motorcycle parts and stocks
          </p>
        </div>

        <button
          className="add-order-btn"
          onClick={() => setOpen(true)}
        >
          + Add Product
        </button>
      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card info">
          <h3>🛒 Total Items</h3>
          <p>{totalItems}</p>
          <span>All products in inventory</span>
        </div>

        <div
          className="stat-card warning clickable"
          onClick={() => setLowStockOpen(true)}
        >
          <h3>⚠ Low Stock</h3>
          <p>{lowStockList.length}</p>
          <span>Click to view items</span>
        </div>

        <div
          className="stat-card danger clickable"
          onClick={() => setOutStockOpen(true)}
        >
          <h3>❌ Out of Stock</h3>
          <p>{outStockList.length}</p>
          <span>Click to view items</span>
        </div>

        <div className="stat-card success">
          <h3>💰 Inventory Value</h3>
          <p>₱ {totalValue.toLocaleString()}</p>
          <span>Total inventory worth</span>
        </div>

      </div>

      {/* SEARCH */}
      <input
        className="search-input"
        placeholder="Search parts or SKU..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CATEGORY */}
      <div className="filter-section">
        <h3>Select Parts Category</h3>

        <div className="select-box">
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
            className="dropdown-select"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <ProductTable
          products={filteredProducts}
          onEdit={editProduct}
        />
      </div>

      {/* ADD MODAL */}
      {open && (
        <div
          className="modal-overlay"
          onClick={() => setOpen(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-top">
              <h2>Add Motorcycle Part</h2>

              <button
                className="close-btn"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <ProductForm onAddProduct={addProduct} />
          </div>
        </div>
      )}

 {/* EDIT MODAL */}
{editOpen && editingProduct && (
  <div
    className="modal-overlay"
    onClick={closeEditModal}
  >
    <div
      className="modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-top">
        <h2>Edit Motorcycle Part</h2>

        <button
          className="close-btn"
          onClick={closeEditModal}
        >
          ✕
        </button>
      </div>

      <form
        className="product-form"
        onSubmit={updateProduct}
      >

        {/* INPUTS RESTORED */}
        <div className="form-group">
          <label>Part Name</label>
          <input
            value={editingProduct?.part_name || ''}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                part_name: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>SKU</label>
          <input
            value={editingProduct?.sku || ''}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                sku: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            value={editingProduct?.category || ''}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                category: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Model</label>
          <input
            value={editingProduct?.model || ''}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                model: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            value={editingProduct?.quantity || ''}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                quantity: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={editingProduct?.price || ''}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                price: e.target.value,
              })
            }
          />
        </div>

        {/* ACTION BUTTONS (KEPT SAME) */}
        <div className="modal-actions">
          <button type="submit" className="submit-btn">
            Save Changes
          </button>

          <button
            type="button"
            className="delete-modal-btn"
            onClick={deleteProduct}
          >
            Delete
          </button>
        </div>

      </form>
    </div>
  </div>
)}

      {/* LOW STOCK MODAL */}
      {lowStockOpen && (
  <div
    className="modal-overlay"
    onClick={() => setLowStockOpen(false)}
  >
    <div
      className="modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2>⚠ Low Stock Items</h2>
      </div>

      {lowStockList.length === 0 ? (
        <p>No low stock items</p>
      ) : (
        <div className="modal-list">
          {lowStockList.map((item) => (
            <div key={item.id} className="modal-item">
              <div>
                <strong>{item.part_name}</strong>
                <p>SKU: {item.sku}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p>Stock: <b style={{ color: 'orange' }}>{item.quantity}</b></p>
                <p>Price: ₱{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="modal-close-btn" onClick={() => setLowStockOpen(false)}>
        Close
      </button>
    </div>
  </div>
)}

      {/* OUT OF STOCK MODAL */}
      {outStockOpen && (
  <div
    className="modal-overlay"
    onClick={() => setOutStockOpen(false)}
  >
    <div
      className="modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2>❌ Out of Stock Items</h2>
      </div>

      {outStockList.length === 0 ? (
        <p>No out of stock items</p>
      ) : (
        <div className="modal-list">
          {outStockList.map((item) => (
            <div key={item.id} className="modal-item">
              <div>
                <strong>{item.part_name}</strong>
                <p>SKU: {item.sku}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p>
                  Stock: <b style={{ color: 'red' }}>0</b>
                </p>
                <p>Price: ₱{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="modal-close-btn" onClick={() => setOutStockOpen(false)}>
        Close
      </button>
    </div>
  </div>
)}

    </div>
  )
}