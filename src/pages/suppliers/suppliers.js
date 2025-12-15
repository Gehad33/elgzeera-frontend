import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    supplierName: "",
    phoneNumber: "",
    districtName: "",
    streetName: "",
    buildingNumber: "",
    additionalNumber: "",
    city: "",
    postalCode: "",
    notes: "",
    tax_number: 0,
    account_Number: 0,
    delegateName: "",
    delegate_number: 0,
    manegerName: "",
    commercial_register: 0,
    type: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  // Load suppliers
  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Supplier");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      setSuppliers(data);
    } catch (err) {
      console.error("Error loading suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.supplierName.trim()) {
      newErrors.supplierName = "اسم المورد مطلوب";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingId) {
        await api.put(`/Supplier/${editingId}`, formData);
      } else {
        await api.post("/Supplier", formData);
      }
      
      resetForm();
      loadSuppliers();
    } catch (err) {
      console.error("Error saving supplier:", err);
      alert("فشل في حفظ المورد: " + (err.response?.data?.message || err.message));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      supplierName: "",
      phoneNumber: "",
      districtName: "",
      streetName: "",
      buildingNumber: "",
      additionalNumber: "",
      city: "",
      postalCode: "",
      notes: "",
      tax_number: 0,
      account_Number: 0,
      delegateName: "",
      delegate_number: 0,
      manegerName: "",
      commercial_register: 0,
      type: 0
    });
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (supplier) => {
    setEditingId(supplier.supplierID);
    setFormData({
      supplierName: supplier.supplierName || "",
      phoneNumber: supplier.phoneNumber || "",
      districtName: supplier.districtName || "",
      streetName: supplier.streetName || "",
      buildingNumber: supplier.buildingNumber || "",
      additionalNumber: supplier.additionalNumber || "",
      city: supplier.city || "",
      postalCode: supplier.postalCode || "",
      notes: supplier.notes || "",
      tax_number: supplier.tax_number || 0,
      account_Number: supplier.account_Number || 0,
      delegateName: supplier.delegateName || "",
      delegate_number: supplier.delegate_number || 0,
      manegerName: supplier.manegerName || "",
      commercial_register: supplier.commercial_register || 0,
      type: supplier.type || 0
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المورد؟")) return;
    
    try {
      await api.delete(`/Supplier/${id}`);
      loadSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
      alert("فشل في حذف المورد");
    }
  };

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phoneNumber?.includes(searchTerm) ||
    supplier.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">
                  <i className="bi bi-truck me-2"></i>
                  إدارة الموردين
                </h5>
                <small className="opacity-75">إدارة بيانات الموردين والمشتريات</small>
              </div>
              <div className="input-group input-group-sm" style={{ width: "250px" }}>
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ابحث عن مورد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="card-body">
              {/* Form */}
              <div className="card mb-4 border-warning">
                <div className="card-header bg-light">
                  <h6 className="mb-0 text-warning">
                    <i className="bi bi-person-plus me-2"></i>
                    {editingId ? "تعديل بيانات المورد" : "إضافة مورد جديد"}
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">اسم المورد *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.supplierName ? "is-invalid" : ""}`}
                        value={formData.supplierName}
                        onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                      />
                      {errors.supplierName && (
                        <div className="invalid-feedback">{errors.supplierName}</div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">رقم الهاتف</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">المدينة</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">المندوب</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.delegateName}
                        onChange={(e) => setFormData({...formData, delegateName: e.target.value})}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">رقم المندوب</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.delegate_number}
                        onChange={(e) => setFormData({...formData, delegate_number: parseInt(e.target.value) || 0})}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">المدير</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.manegerName}
                        onChange={(e) => setFormData({...formData, manegerName: e.target.value})}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">رقم السجل التجاري</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.commercial_register}
                        onChange={(e) => setFormData({...formData, commercial_register: parseInt(e.target.value) || 0})}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">الرقم الضريبي</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.tax_number}
                        onChange={(e) => setFormData({...formData, tax_number: parseInt(e.target.value) || 0})}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">رقم الحساب</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.account_Number}
                        onChange={(e) => setFormData({...formData, account_Number: parseInt(e.target.value) || 0})}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">النوع</label>
                      <select
                        className="form-control"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: parseInt(e.target.value)})}
                      >
                        <option value={0}>محلي</option>
                        <option value={1}>دولي</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">العنوان التفصيلي</label>
                      <div className="row g-2">
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="الحي"
                            value={formData.districtName}
                            onChange={(e) => setFormData({...formData, districtName: e.target.value})}
                          />
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="الشارع"
                            value={formData.streetName}
                            onChange={(e) => setFormData({...formData, streetName: e.target.value})}
                          />
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="رقم المبنى"
                            value={formData.buildingNumber}
                            onChange={(e) => setFormData({...formData, buildingNumber: e.target.value})}
                          />
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="الرقم الإضافي"
                            value={formData.additionalNumber}
                            onChange={(e) => setFormData({...formData, additionalNumber: e.target.value})}
                          />
                        </div>
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
                          className={`btn ${editingId ? "btn-warning" : "btn-primary"}`}
                          onClick={handleSubmit}
                        >
                          <i className={`bi ${editingId ? "bi-check-circle" : "bi-plus-circle"} me-1`}></i>
                          {editingId ? "حفظ التعديلات" : "إضافة مورد"}
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

              {/* Suppliers Table */}
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <div className="table-responsive">
                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-warning" role="status">
                          <span className="visually-hidden">جاري التحميل...</span>
                        </div>
                      </div>
                    ) : filteredSuppliers.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-truck display-1 text-muted"></i>
                        <p className="mt-3 text-muted">لا توجد موردين لعرضها</p>
                      </div>
                    ) : (
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>اسم المورد</th>
                            <th>الهاتف</th>
                            <th>المدينة</th>
                            <th>المندوب</th>
                            <th>السجل التجاري</th>
                            <th>النوع</th>
                            <th>الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSuppliers.map((supplier, index) => (
                            <tr key={supplier.supplierID}>
                              <td>{index + 1}</td>
                              <td>
                                <strong>{supplier.supplierName}</strong>
                                {supplier.notes && (
                                  <small className="d-block text-muted">
                                    {supplier.notes}
                                  </small>
                                )}
                              </td>
                              <td>
                                {supplier.phoneNumber ? (
                                  <a href={`tel:${supplier.phoneNumber}`} className="text-decoration-none">
                                    <i className="bi bi-telephone me-1"></i>
                                    {supplier.phoneNumber}
                                  </a>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td>
                                {supplier.city ? (
                                  <span className="badge bg-info bg-opacity-10 text-dark">
                                    {supplier.city}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {supplier.delegateName ? (
                                  <div>
                                    <small>{supplier.delegateName}</small>
                                    <br />
                                    <small className="text-muted">{supplier.delegate_number || ""}</small>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {supplier.commercial_register > 0 ? (
                                  <span className="badge bg-dark bg-opacity-10 text-dark">
                                    {supplier.commercial_register}
                                  </span>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td>
                                {supplier.type === 1 ? (
                                  <span className="badge bg-danger">دولي</span>
                                ) : (
                                  <span className="badge bg-success">محلي</span>
                                )}
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-outline-warning"
                                    onClick={() => handleEdit(supplier)}
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button
                                    className="btn btn-outline-danger"
                                    onClick={() => handleDelete(supplier.supplierID)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
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

export default Suppliers;