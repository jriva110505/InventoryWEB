'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = 'https://inventorydb-u5sz.onrender.com'

export default function Dashboard() {
  const router = useRouter()

  const [graphMode, setGraphMode] = useState('sales')

  const [sales, setSales] = useState([])
  const [items, setItems] = useState([])
  const [tracking, setTracking] = useState([])

  // AUTH
  useEffect(() => {
    const auth = localStorage.getItem('auth')
    if (!auth) router.push('/')
  }, [])

  // FETCH
  useEffect(() => {
    fetchSales()
    fetchItems()
    fetchTracking()
  }, [])

  const fetchSales = async () => {
    const res = await fetch(`${API_URL}/tracking/sales`)
    const data = await res.json()
    setSales(Array.isArray(data) ? data : [])
  }

  const fetchItems = async () => {
    const res = await fetch(`${API_URL}/items`)
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }

  const fetchTracking = async () => {
    const res = await fetch(`${API_URL}/tracking`)
    const data = await res.json()
    setTracking(Array.isArray(data) ? data : [])
  }

  // SAFE DATE
  function safeMonth(date) {
    const d = new Date(date)
    if (isNaN(d.getTime())) return null
    return d.getMonth()
  }

  // SALES GROWTH
  function groupByMonthGrowth(data, valueKey = 'totalprice') {
    const months = Array(12).fill(0)

    data.forEach(item => {
      const m = safeMonth(item.createdAt || item.updatedAt)
      if (m === null) return
      months[m] += Number(item[valueKey] || 0)
    })

    return months.map((value, i) => {
      const prev = i === 0 ? 0 : months[i - 1]

      let growth = 0
      if (prev > 0) growth = ((value - prev) / prev) * 100
      else if (value > 0) growth = 100

      return {
        month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
        value,
        growth: Number(growth.toFixed(1))
      }
    })
  }

  // ISSUES
  function groupIssues(tracking) {
    const months = Array(12).fill(0)

    tracking.forEach(t => {
      const m = safeMonth(t.createdAt || t.updatedAt)
      if (m === null) return
      if (t.status === 'Delivered') return
      months[m]++
    })

    return months.map((v, i) => ({
      month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
      value: v
    }))
  }

  // =========================
// COMPUTED SALES INDICATOR
// =========================
function getSalesIndicator(sales) {
  // Group sales by month
  const monthly = Array(12).fill(0)
  sales.forEach(item => {
    const m = safeMonth(item.createdAt || item.updatedAt)
    if (m === null) return
    monthly[m] += Number(item.totalprice || 0)
  })

  const thisMonth = new Date().getMonth()
  const current = monthly[thisMonth] || 0
  const prev = monthly[thisMonth - 1] || 0

  if (prev === 0 && current > 0) return { text: '▲ Good', color: 'green' }
  if (current > prev) return { text: '▲ Good', color: 'green' }
  if (current < prev) return { text: '▼ Bad', color: 'red' }
  return { text: '→ Stable', color: 'gray' }
}

const salesIndicator = getSalesIndicator(sales)

  // COMPUTED
  const totalInventory = items.reduce((sum, i) => sum + Number(i.quantity || 0), 0)
  const lowStock = items.filter(
  i => Number(i.quantity) >= 1 && Number(i.quantity) <= 10
).length
  const outOfStock = items.filter(i => i.quantity === 0).length
  const activeDeliveries = tracking.filter(t => t.status !== 'Delivered').length
  const deliveredOrders = tracking.filter(
  t => t.status === 'Delivered'
).length
  const totalSales = sales.reduce((sum, s) => sum + Number(s.totalprice || 0), 0)

  // TOP CATEGORIES (PERCENTAGE FIX)
  const totalStock = items.reduce((sum, i) => sum + Number(i.quantity || 0), 0)

  const stockData = Object.values(
    items.reduce((acc, item) => {
      const cat = item.category || 'Uncategorized'

      if (!acc[cat]) acc[cat] = { name: cat, value: 0 }

      acc[cat].value += Number(item.quantity || 0)
      return acc
    }, {})
  )
    .map(i => ({
      ...i,
      percent: totalStock ? ((i.value / totalStock) * 100).toFixed(1) : 0
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  // GRAPH DATA
  const monthlySales = groupByMonthGrowth(sales)
  const monthlyIssues = groupIssues(tracking)

  const activeData = graphMode === 'sales' ? monthlySales : monthlyIssues

  const safeData =
    activeData.length > 0
      ? activeData
      : [{ month: 'Jan', value: 0, growth: 0 }]

  const maxGrowth = Math.max(
    ...safeData.map(i => Math.abs(i.growth || 0)),
    1
  )

  return (
    <div className="dashboard-wrapper">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>JRP Warehouse Dashboard</h1>
          <p>Motor Parts Inventory & Logistics Monitoring System</p>
        </div>
      </div>

      {/* CARDS */}
      <div className="card-grid">
        <Card title="Total Motor Parts" value={items.length} color="blue" />
        <Card title="Low Stock Parts" value={lowStock} color="red" />
        <Card title="Out of Stock" value={outOfStock} color="yellow" />
        <Card title="Active Deliveries" value={activeDeliveries} color="green" />
        <Card title="Delivered Orders" value={deliveredOrders} color="purple" />
      </div>

      {/* =========================
          SALES + TOP CATEGORIES (SIDE BY SIDE)
      ========================= */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>

        {/* SALES */}
<div className="chart-card" style={{ flex: 1 }}>
  <h3>
    💰 Total Warehouse Sales{' '}
    <span style={{ color: salesIndicator.color, fontWeight: 'bold' }}>
      {salesIndicator.text}
    </span>
  </h3>
  <div className="big-number">₱{totalSales.toLocaleString()}</div>
</div>

        {/* TOP CATEGORIES (PERCENT) */}
        <div className="chart-card" style={{ flex: 1 }}>
          <h3>📊 Top Categories (%)</h3>

          {stockData.map((item, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.name}</span>
                <strong>{item.percent}%</strong>
              </div>

              <div style={{
                height: 8,
                background: '#eee',
                borderRadius: 5,
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    width: `${item.percent}%`,
                    height: '100%',
                    background: '#4f46e5'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          GRAPH TOGGLE
      ========================= */}
      <div className="graph-toggle">
        <button onClick={() => setGraphMode('sales')}>
          📦 Stock Growth
        </button>
      </div>

      {/* =========================
          BAR GRAPH (KEEPED)
      ========================= */}
      <div className="chart-card">
        <h3>
          {graphMode === 'sales'
            ? 'Monthly Sales Growth (%)'
            : 'Monthly Issues'}
        </h3>

        <div className="bar-chart">
          {safeData.map((item, index) => {
            const height =
              maxGrowth > 0
                ? (Math.abs(item.growth || 0) / maxGrowth) * 100
                : 0

            return (
              <div key={index} className="bar-group">

                <div className="bar-value">
                  {graphMode === 'sales'
                    ? `${item.growth > 0 ? '+' : ''}${item.growth}%`
                    : item.value}
                </div>

                <div className="bar-wrapper">
                  <div
                    className="bar"
                    style={{ height: `${height}%` }}
                  />
                </div>

                <div className="bar-label">
                  {item.month}
                </div>

              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

// CARD
function Card({ title, value, color }) {
  return (
    <div className={`card ${color}`}>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  )
}