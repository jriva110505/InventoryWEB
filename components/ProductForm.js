'use client'

import { useState } from 'react'

export default function ProductForm({
  onAddProduct,
}) {

  const [form, setForm] = useState({
    part_name: '',
    sku: '',
    category: '',
    model: '',
    quantity: '',
    price: '',
  })

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // SUBMIT FORM
  const handleSubmit = (e) => {

    e.preventDefault()

    // VALIDATION
    if (
      !form.part_name ||
      !form.sku ||
      !form.category ||
      !form.model ||
      !form.quantity ||
      !form.price
    ) {
      alert('Please fill all fields')
      return
    }

    // ADD PRODUCT
    onAddProduct(form)

    // RESET FORM
    setForm({
      part_name: '',
      sku: '',
      category: '',
      model: '',
      quantity: '',
      price: '',
    })

    alert(
      'Motorcycle part added successfully!'
    )
  }

  return (
    <div className="form-card">

      <form
        onSubmit={handleSubmit}
        className="product-form"
      >

        {/* PART NAME */}
        <div className="form-group">

          <label>Part Name</label>

          <input
            type="text"
            name="part_name"
            placeholder="Enter part name"
            value={form.part_name}
            onChange={handleChange}
          />

        </div>

        {/* SKU */}
        <div className="form-group">

          <label>
            SKU / Part Number
          </label>

          <input
            type="text"
            name="sku"
            placeholder="Enter SKU"
            value={form.sku}
            onChange={handleChange}
          />

        </div>

        {/* CATEGORY */}
        <div className="form-group">

          <label>Category</label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >

            <option value="">
              Select Category
            </option>

            <option value="Brake Parts">
              Brake Parts
            </option>

            <option value="Engine Parts">
              Engine Parts
            </option>

            <option value="Electrical">
              Electrical
            </option>

            <option value="Accessories">
              Accessories
            </option>

            <option value="Tires">
              Tires
            </option>

            <option value="Oils">
              Oils
            </option>

          </select>

        </div>

        {/* MODEL */}
        <div className="form-group">

          <label>
            Compatible Model
          </label>

          <input
            type="text"
            name="model"
            placeholder="Ex: Mio 125"
            value={form.model}
            onChange={handleChange}
          />

        </div>

        {/* QUANTITY */}
        <div className="form-group">

          <label>Quantity</label>

          <input
            type="number"
            name="quantity"
            placeholder="Enter quantity"
            value={form.quantity}
            onChange={handleChange}
          />

        </div>

        {/* PRICE */}
        <div className="form-group">

          <label>Price</label>

          <input
            type="number"
            name="price"
            placeholder="Enter price"
            value={form.price}
            onChange={handleChange}
          />

        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="submit-btn"
        >
          + Add Motorcycle Part
        </button>

      </form>

    </div>
  )
}