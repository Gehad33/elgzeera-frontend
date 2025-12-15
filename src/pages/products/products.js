import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    productName: "",
    numberOfUnits: 0,
    notes: "",
    price1: 0,
    price2: 0,
    wholeSalePrice: 0,
    purchaseprice: 0,
    productNumber: "",
    unit: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  // Load products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Products");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName.trim()) {
      newErrors.productName = "اسم المنتج مطلوب";
    }
    if (formData.price1 < 0) {
      newErrors.price1 = "السعر يجب أن يكون موجباً";
    }
    if (formData.purchaseprice < 0) {
      newErrors.purchaseprice = "سعر الشراء يجب أن يكون موجباً";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingId) {
        await api.put(`/Products/${editingId}`, formData);
      } else {
        await api.post("/Products", formData);
      }
      
      resetForm();
      loadProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("فشل في حفظ المنتج: " + (err.response?.data?.message || err.message));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      productName: "",
      numberOfUnits: 0,
      notes: "",
      price1: 0,
      price2: 0,
      wholeSalePrice: 0,
      purchaseprice: 0,
      productNumber: "",
      unit: ""
    });
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (product) => {
    setEditingId(product.productID);
    setFormData({
      productName: product.productName || "",
      numberOfUnits: product.numberOfUnits || 0,
      notes: product.notes || "",
      price1: product.price1 || 0,
      price2: product.price2 || 0,
      wholeSalePrice: product.wholeSalePrice || 0,
      purchaseprice: product.purchaseprice || 0,
      productNumber: product.productNumber || "",
      unit: product.unit || ""
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    
    try {
      await api.delete(`/Products/${id}`);
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("فشل في حذف المنتج");
    }
  };

  // Filter products
  const filteredProducts = products.filter(product =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productNumber?.includes(searchTerm) ||
    product.unit?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price1 * (p.numberOfUnits || 0)), 0);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">
                  <i className="bi bi-box-seam me-2"></i>
                  إدارة المنتجات
                </h5>
                <small className="opacity-75">إدارة المخزون والأسعار</small>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="text-white">
                  <small>إجمالي المنتجات: {totalProducts}</small>
                  <br />
                  <small>القيمة الإجمالية: {totalValue.toLocaleString()} ر.س</small>
                </div>
                <div className="input-group input-group-sm" style={{ width: "250px" }}>
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ابحث عن منتج..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Form */}
              <div className="card mb-4 border-success">
                <div className="card-header bg-light">
                  <h6 className="mb-0 text-success">
                    <i className="bi bi-plus-circle me-2"></i>
                    {editingId ? "تعديل المنتج" : "إضافة منتج جديد"}
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">اسم المنتج *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.productName ? "is-invalid" : ""}`}
                        value={formData.productName}
                        onChange={(e) => setFormData({...formData, productName: e.target.value})}
                      />
                      {errors.productName && (
                        <div className="invalid-feedback">{errors.productName}</div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">رقم المنتج</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.productNumber}
                        onChange={(e) => setFormData({...formData, productNumber: e.target.value})}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">الوحدة</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                        placeholder="كجم، قطعة، لتر..."
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">الكمية</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.numberOfUnits}
                        onChange={(e) => setFormData({...formData, numberOfUnits: parseInt(e.target.value) || 0})}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">سعر البيع</label>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control ${errors.price1 ? "is-invalid" : ""}`}
                          value={formData.price1}
                          onChange={(e) => setFormData({...formData, price1: parseFloat(e.target.value) || 0})}
                        />
                        <span className="input-group-text">ر.س</span>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">سعر الجملة</label>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          value={formData.wholeSalePrice}
                          onChange={(e) => setFormData({...formData, wholeSalePrice: parseFloat(e.target.value) || 0})}
                        />
                        <span className="input-group-text">ر.س</span>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">سعر الشراء</label>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control ${errors.purchaseprice ? "is-invalid" : ""}`}
                          value={formData.purchaseprice}
                          onChange={(e) => setFormData({...formData, purchaseprice: parseFloat(e.target.value) || 0})}
                        />
                        <span className="input-group-text">ر.س</span>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label">ملاحظات</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <div className="d-flex gap-2">
                        <button
                          className={`btn ${editingId ? "btn-warning" : "btn-success"}`}
                          onClick={handleSubmit}
                        >
                          <i className={`bi ${editingId ? "bi-check-circle" : "bi-plus-circle"} me-1`}></i>
                          {editingId ? "حفظ التعديلات" : "إضافة منتج"}
                        </button>
                        {editingId && (
                          <button className="btn btn-secondary" onClick={resetForm}>
                            إلغاء
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <div className="table-responsive">
                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                          <span className="visually-hidden">جاري التحميل...</span>
                        </div>
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-box display-1 text-muted"></i>
                        <p className="mt-3 text-muted">لا توجد منتجات لعرضها</p>
                      </div>
                    ) : (
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>المنتج</th>
                            <th>الكمية</th>
                            <th>سعر البيع</th>
                            <th>سعر الجملة</th>
                            <th>سعر الشراء</th>
                            <th>القيمة</th>
                            <th>الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product, index) => {
                            const value = (product.price1 || 0) * (product.numberOfUnits || 0);
                            const profit = (product.price1 || 0) - (product.purchaseprice || 0);
                            
                            return (
                              <tr key={product.productID}>
                                <td>{index + 1}</td>
                                <td>
                                  <div>
                                    <strong>{product.productName}</strong>
                                    {product.unit && (
                                      <small className="text-muted d-block">
                                        {product.unit} {product.productNumber && `| ${product.productNumber}`}
                                      </small>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <span className={`badge ${product.numberOfUnits > 0 ? "bg-success" : "bg-danger"}`}>
                                    {product.numberOfUnits || 0}
                                  </span>
                                </td>
                                <td>
                                  <span className="fw-bold">{product.price1?.toLocaleString()} ر.س</span>
                                </td>
                                <td>
                                  {product.wholeSalePrice > 0 ? (
                                    <span>{product.wholeSalePrice.toLocaleString()} ر.س</span>
                                  ) : (
                                    <span className="text-muted">-</span>
                                  )}
                                </td>
                                <td>
                                  <span className="text-muted">{product.purchaseprice?.toLocaleString()} ر.س</span>
                                </td>
                                <td>
                                  <span className="badge bg-info bg-opacity-10 text-dark">
                                    {value.toLocaleString()} ر.س
                                  </span>
                                  <br />
                                  <small className={`badge ${profit >= 0 ? "bg-success" : "bg-danger"} bg-opacity-10`}>
                                    ربح: {profit.toLocaleString()} ر.س
                                  </small>
                                </td>
                                <td>
                                  <div className="btn-group btn-group-sm">
                                    <button
                                      className="btn btn-outline-primary"
                                      onClick={() => handleEdit(product)}
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </button>
                                    <button
                                      className="btn btn-outline-danger"
                                      onClick={() => handleDelete(product.productID)}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;