'use client'

export default function ProductTable({
  products,
  onEdit,
}) {

  return (
    <div className="table-card">
      
      <table className="table">

        <thead>

          <tr>
            <th>Part Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Model</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {(products || []).length ===
          0 ? (

            <tr>

              <td
                colSpan="8"
                style={{
                  textAlign: 'center',
                  padding: '30px',
                  color: '#888',
                }}
              >
                No motorcycle parts found
              </td>

            </tr>

          ) : (

            products.map((item) => (

              <tr key={item.id}>

                {/* PART NAME */}
                <td>

                  <div className="product-name">

                    

                    <div>

                      <strong>
                        {item.part_name}
                      </strong>

                    </div>

                  </div>

                </td>

                {/* SKU */}
                <td>

                  <span className="sku-badge">
                    {item.sku}
                  </span>

                </td>

                {/* CATEGORY */}
                <td>

                  <span className="category-badge">
                    {item.category}
                  </span>

                </td>

                {/* MODEL */}
                <td>{item.model}</td>

                {/* QUANTITY */}
                <td>

                  <span
                    className={
                      Number(
                        item.quantity
                      ) <= 5
                        ? 'low-stock'
                        : 'ok-stock'
                    }
                  >
                    {item.quantity}
                  </span>

                </td>

                {/* PRICE */}
                <td>
                  ₱{' '}
                  {Number(
                    item.price
                  ).toLocaleString()}
                </td>

                {/* STATUS */}
                <td>

                  {item.status ===
                  'Low Stock' ? (

                    <span className="status danger">
                      Low Stock
                    </span>

                  ) : (

                    <span className="status success">
                      In Stock
                    </span>

                  )}

                </td>

                {/* ACTION */}
                <td>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      onEdit(item)
                    }
                  >
                    Edit
                  </button>

                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  )
}