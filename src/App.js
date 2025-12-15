import { HashRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Customers from "./pages/customers/Customers";
import Products from "./pages/products/products";
import Suppliers from "./pages/suppliers/suppliers";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-shop me-2"></i>
            Elgzeera System
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/customers">
                  <i className="bi bi-people me-1"></i>
                  العملاء
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">
                  <i className="bi bi-box-seam me-1"></i>
                  المنتجات
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/suppliers">
                  <i className="bi bi-truck me-1"></i>
                  الموردين
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/customers" />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/suppliers" element={<Suppliers />} />
        </Routes>
      </div>

      <footer className="mt-5 py-3 bg-light border-top">
        <div className="container text-center">
          <small className="text-muted">
            © 2024 نظام إدارة السندات - مؤسسة زهرة الجزيرة
          </small>
        </div>
      </footer>
    </Router>
  );
}

export default App;