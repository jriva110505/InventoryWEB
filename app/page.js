'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [aboutOpen, setAboutOpen] = useState(false)

  const tempAccount = {
    username: 'admin',
    password: '1234',
  }

  const handleLogin = (e) => {
    e.preventDefault()

    if (
      username === tempAccount.username &&
      password === tempAccount.password
    ) {
      localStorage.setItem('auth', 'true')
      router.push('/dashboard')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div style={styles.page}>

      {/* INFO BUTTON */}
      <button onClick={() => setAboutOpen(true)} style={styles.aboutBtn}>
        i
      </button>

      {/* LEFT */}
      <div style={styles.leftSide}>
        <div style={styles.logoRow}>
          <Image
            src="/jrp.jpg"
            alt="logo"
            width={120}
            height={55}
            style={styles.logoImg}
          />

          <span style={styles.brand}>
            Racing Product Thailand Warehouse
          </span>
        </div>

        <h2 style={styles.heading}>
          Inventory <br />
          Management System
        </h2>

        <p style={styles.description}>
          Manage products, monitor stocks, track deliveries,
          and control warehouse operations in one dashboard.
        </p>

        <div style={styles.badgeBox}>
          <div style={styles.badgeTitle}>Demo Account</div>
          <div style={styles.badgeText}>Username: <b>admin</b></div>
          <div style={styles.badgeText}>Password: <b>1234</b></div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={styles.rightSide}>
        <form style={styles.card} onSubmit={handleLogin}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your account</p>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button}>
            Login
          </button>

          <p style={styles.footerText}>
            Secure Admin Access Only
          </p>
        </form>
      </div>

      {/* ================= ABOUT MODAL ================= */}
      {aboutOpen && (
        <div style={styles.modalOverlay} onClick={() => setAboutOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

            {/* HEADER */}
            <div style={styles.modalHeader}>
              <h2>About the System</h2>
              <button onClick={() => setAboutOpen(false)} style={styles.closeX}>
                ✕
              </button>
            </div>

            {/* DESCRIPTION */}
            <div style={styles.section}>
              <p>
                This Inventory Management System was developed to improve warehouse
                operations, tracking accuracy, and stock control for motorcycle parts
                and logistics workflow.
              </p>
            </div>

            {/* PURPOSE */}
            <div style={styles.section}>
              <h3>Purpose</h3>
              <ul>
                <li>Real-time inventory tracking</li>
                <li>Delivery monitoring system</li>
                <li>Reduce manual encoding errors</li>
                <li>Improve warehouse efficiency</li>
              </ul>
            </div>

            {/* MEMBERS */}
            <div style={styles.section}>
              <h3>Members</h3>

              <div style={styles.memberGrid}>
                <div style={styles.memberCard}>Frontend : Riva, Jerome</div>
                <div style={styles.memberCard}>Backend : Castaneda, John Paul</div>
                <div style={styles.memberCard}>UI/UX : Cano, Cy Wency</div>
                <div style={styles.memberCard}>Documentation : Palmones, Joyce Ann</div>
                <div style={styles.memberCard}>Documentation : Bulawan, James Herald</div>
              </div>
            </div>

            <button onClick={() => setAboutOpen(false)} style={styles.closeBtn}>
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  )
}

/* ================= STYLES ================= */
const styles = {

  page: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    fontFamily: 'Inter, Arial',
    background: '#0b1220',
    overflow: 'hidden',
    position: 'relative',
  },

  /* INFO BUTTON */
  aboutBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },

  leftSide: {
    flex: 1,
    padding: '90px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '25px',
  },

  logoImg: {
    borderRadius: '12px',
  },

  brand: {
    color: '#f59e0b',
    fontSize: '28px',
    fontWeight: '800',
  },

  heading: {
    color: 'white',
    fontSize: '52px',
    fontWeight: '900',
    lineHeight: '1.05',
    marginBottom: '20px',
  },

  description: {
    color: '#cbd5e1',
    fontSize: '17px',
    maxWidth: '520px',
    lineHeight: '1.7',
    marginBottom: '35px',
  },

  badgeBox: {
    padding: '16px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    width: '280px',
  },

  badgeTitle: {
    color: '#fbbf24',
    fontWeight: '700',
    marginBottom: '6px',
  },

  badgeText: {
    color: '#e2e8f0',
    fontSize: '14px',
  },

  rightSide: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '400px',
    padding: '45px',
    borderRadius: '22px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.14)',
    backdropFilter: 'blur(22px)',
    display: 'flex',
    flexDirection: 'column',
  },

  title: {
    color: 'white',
    fontSize: '28px',
    fontWeight: '800',
    textAlign: 'center',
  },

  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 25,
  },

  input: {
    padding: '14px',
    marginBottom: 14,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    outline: 'none',
  },

  button: {
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(90deg, #f59e0b, #f97316)',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },

  error: {
    color: '#f87171',
    textAlign: 'center',
    marginBottom: 10,
  },

  footerText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
  },

  /* MODAL */
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: 500,
    background: 'rgba(17,24,39,0.95)',
    padding: 25,
    borderRadius: 18,
    color: 'white',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
    backdropFilter: 'blur(20px)',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  closeX: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: 18,
    cursor: 'pointer',
  },

  section: {
    marginBottom: 15,
    color: '#cbd5e1',
    lineHeight: 1.6,
  },

  memberCard: {
    padding: 10,
    gap: 10,
    marginTop: 5,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: 13,
    textAlign: 'center',
  },

  closeBtn: {
    marginTop: 10,
    width: '100%',
    padding: 12,
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(90deg, #f59e0b, #f97316)',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
}