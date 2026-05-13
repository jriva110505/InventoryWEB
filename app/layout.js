import './globals.css'
import LayoutClient from '@/components/LayoutClient'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={styles.body}>

        <div style={styles.frame}>
          <LayoutClient>
            {children}
          </LayoutClient>
        </div>

      </body>
    </html>
  )
}

const styles = {
  body: {
    margin: 0,
    padding: 0,
    background: '#0b1220',
  },

  frame: {
    width: '100vw',
    height: '100vh',
    padding: 0,
    boxSizing: 'border-box',
    background: '#0b1220',
  }
}