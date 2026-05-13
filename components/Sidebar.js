export default function Sidebar() {
  const handleLogout = () => {
    // For testing, just reload the page or go to /login
    window.location.href = '/'; // you can create a dummy login page
    // or just reload:
    // window.location.reload();
  };

  return (
    <div className="sidebar">
      {/* HEADER */}
      <div className="sidebar-header">
        <div className="sidebar-logo">JRP</div>
        <div className="sidebar-title">
          JRP<br />Warehouse
        </div>
      </div>

      {/* LINKS */}
      <div className="sidebar-links">
        <a href="/dashboard">Dashboard</a>
        <a href="/products">Products</a>
        <a href="/location-tracking">Track Item Locations</a>
        <a href="/sales-history">Sales & Stock History</a>
      </div>

      {/* LOGOUT BUTTON */}
      <div className="sidebar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}