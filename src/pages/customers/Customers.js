import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    type: 0,
    phoneNumber: "",
    remainingBalance: 0,
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
    manegerName: "",
    commercial_register: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Load customers
  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Customers");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      setCustomers(data);
    } catch (err) {
      console.error("Failed to load customers:", err);
      setErrors({ fetch: "فشل في تحميل بيانات العملاء" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = "اسم العميل مطلوب";
    }
    if (formData.phoneNumber && !/^[0-9+\-\s]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "رقم هاتف غير صالح";
    }
    if (formData.tax_number && isNaN(formData.tax_number)) {
      newErrors.tax_number = "رقم الضريبة يجب أن يكون رقماً";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit (add/edit)
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = { ...formData };
      
      if (editingId) {
        await api.put(`/Customers/${editingId}`, payload);
        setSuccessMessage("تم تحديث بيانات العميل بنجاح");
      } else {
        await api.post("/Customers", payload);
        setSuccessMessage("تم إضافة العميل بنجاح");
      }

      // Reset form
      resetForm();
      loadCustomers();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save customer:", err);
      setErrors({ submit: `فشل في الحفظ: ${err.response?.data?.message || err.message}` });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      customerName: "",
      type: 0,
      phoneNumber: "",
      remainingBalance: 0,
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
      manegerName: "",
      commercial_register: 0
    });
    setEditingId(null);
    setErrors({});
  };

  // Handle edit
  const handleEdit = (customer) => {
    setEditingId(customer.customerID);
    setFormData({
      customerName: customer.customerName || "",
      type: customer.type || 0,
      phoneNumber: customer.phoneNumber || "",
      remainingBalance: customer.remainingBalance || 0,
      districtName: customer.districtName || "",
      streetName: customer.streetName || "",
      buildingNumber: customer.buildingNumber || "",
      additionalNumber: customer.additionalNumber || "",
      city: customer.city || "",
      postalCode: customer.postalCode || "",
      notes: customer.notes || "",
      tax_number: customer.tax_number || 0,
      account_Number: customer.account_Number || 0,
      delegateName: customer.delegateName || "",
      manegerName: customer.manegerName || "",
      commercial_register: customer.commercial_register || 0
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا العميل؟")) return;
    
    try {
      await api.delete(`/Customers/${id}`);
      setSuccessMessage("تم حذف العميل بنجاح");
      loadCustomers();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to delete customer:", err);
      setErrors({ delete: "فشل في حذف العميل" });
    }
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber?.includes(searchTerm) ||
    customer.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid">
      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errors.submit}
          <button type="button" className="btn-close" onClick={() => setErrors({})}></button>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">
                  <i className="bi bi-people me-2"></i>
                  إدارة العملاء
                </h5>
                <small className="opacity-75">إضافة وتعديل وحذف العملاء</small>
              </div>
              <div className="d-flex align-items-center">
                <div className="input-group input-group-sm" style={{ width: "250px" }}>
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ابحث باسم أو هاتف أو مدينة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="card-body">
              {/* Form Section */}
              <div className="card mb-4 border-primary">
                <div className="card-header bg-light">
                  <h6 className="mb-0 text-primary">
                    <i className="bi bi-person-plus me-2"></i>
                    {editingId ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {/* Basic Info */}
                    <div className="col-md-4">
                      <label className="form-label">
                        اسم العميل <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.customerName ? "is-invalid" : ""}`}
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                        placeholder="أدخل اسم العميل"
                      />
                      {errors.customerName && (
                        <div className="invalid-feedback">{errors.customerName}</div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">رقم الهاتف</label>
                      <input
                        type="text"
                        className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        placeholder="05XXXXXXXX"
                      />
                      {errors.phoneNumber && (
                        <div className="invalid-feedback">{errors.phoneNumber}</div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">المدينة</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="المدينة"
                      />
                    </div>

                    {/* Address Info */}
                    <div className="col-md-3">
                      <label className="form-label">الحي</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.districtName}
                        onChange={(e) => setFormData({...formData, districtName: e.target.value})}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">الشارع</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.streetName}
                        onChange={(e) => setFormData({...formData, streetName: e.target.value})}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">رقم المبنى</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.buildingNumber}
                        onChange={(e) => setFormData({...formData, buildingNumber: e.target.value})}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">الرقم الإضافي</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.additionalNumber}
                        onChange={(e) => setFormData({...formData, additionalNumber: e.target.value})}
                      />
                    </div>

                    {/* Financial Info */}
                    <div className="col-md-4">
                      <label className="form-label">الرصيد</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          value={formData.remainingBalance}
                          onChange={(e) => setFormData({...formData, remainingBalance: parseFloat(e.target.value) || 0})}
                        />
                        <span className="input-group-text">ر.س</span>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">الرقم الضريبي</label>
                      <input
                        type="number"
                        className={`form-control ${errors.tax_number ? "is-invalid" : ""}`}
                        value={formData.tax_number}
                        onChange={(e) => setFormData({...formData, tax_number: parseInt(e.target.value) || 0})}
                      />
                      {errors.tax_number && (
                        <div className="invalid-feedback">{errors.tax_number}</div>
                      )}
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

                    {/* Notes */}
                    <div className="col-12">
                      <label className="form-label">ملاحظات</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="ملاحظات إضافية..."
                      ></textarea>
                    </div>

                    {/* Form Actions */}
                    <div className="col-12">
                      <div className="d-flex gap-2">
                        <button
                          className={`btn ${editingId ? "btn-warning" : "btn-success"}`}
                          onClick={handleSubmit}
                        >
                          <i className={`bi ${editingId ? "bi-check-circle" : "bi-plus-circle"} me-1`}></i>
                          {editingId ? "حفظ التعديلات" : "إضافة عميل"}
                        </button>
                        
                        {editingId && (
                          <button
                            className="btn btn-secondary"
                            onClick={resetForm}
                          >
                            <i className="bi bi-x-circle me-1"></i>
                            إلغاء التعديل
                          </button>
                        )}
                        
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              type: formData.type === 0 ? 1 : 0
                            });
                          }}
                        >
                          <i className="bi bi-building me-1"></i>
                          {formData.type === 0 ? "تحويل لشركة" : "تحويل لفرد"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customers Table */}
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <div className="table-responsive">
                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">جاري التحميل...</span>
                        </div>
                        <p className="mt-2 text-muted">جاري تحميل بيانات العملاء...</p>
                      </div>
                    ) : filteredCustomers.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-people display-1 text-muted"></i>
                        <p className="mt-3 text-muted">لا توجد عملاء لعرضها</p>
                      </div>
                    ) : (
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>الاسم</th>
                            <th>الهاتف</th>
                            <th>المدينة</th>
                            <th>الرصيد</th>
                            <th>النوع</th>
                            <th>الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCustomers.map((customer, index) => (
                            <tr key={customer.customerID} className={customer.customerID === editingId ? "table-warning" : ""}>
                              <td className="fw-bold">{index + 1}</td>
                              <td>
                                <div>
                                  <strong>{customer.customerName}</strong>
                                  {customer.notes && (
                                    <small className="d-block text-muted">
                                      <i className="bi bi-chat-left-text me-1"></i>
                                      {customer.notes.length > 30 ? customer.notes.substring(0, 30) + "..." : customer.notes}
                                    </small>
                                  )}
                                </div>
                              </td>
                              <td>
                                {customer.phoneNumber ? (
                                  <a href={`tel:${customer.phoneNumber}`} className="text-decoration-none">
                                    <i className="bi bi-telephone me-1"></i>
                                    {customer.phoneNumber}
                                  </a>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td>
                                {customer.city ? (
                                  <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25">
                                    {customer.city}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                <span className={`badge ${customer.remainingBalance >= 0 ? "bg-success" : "bg-danger"} bg-opacity-10 text-dark`}>
                                  {customer.remainingBalance.toLocaleString()} ر.س
                                </span>
                              </td>
                              <td>
                                {customer.type === 1 ? (
                                  <span className="badge bg-primary">شركة</span>
                                ) : (
                                  <span className="badge bg-secondary">فرد</span>
                                )}
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm" role="group">
                                  <button
                                    className="btn btn-outline-primary"
                                    onClick={() => handleEdit(customer)}
                                    title="تعديل"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button
                                    className="btn btn-outline-danger"
                                    onClick={() => handleDelete(customer.customerID)}
                                    title="حذف"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                  <button
                                    className="btn btn-outline-info"
                                    onClick={() => {
                                      // View details - can be expanded
                                      alert(`تفاصيل العميل:\nالاسم: ${customer.customerName}\nالهاتف: ${customer.phoneNumber || "لا يوجد"}\nالمدينة: ${customer.city || "لا يوجد"}`);
                                    }}
                                    title="عرض التفاصيل"
                                  >
                                    <i className="bi bi-eye"></i>
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
                {!loading && filteredCustomers.length > 0 && (
                  <div className="card-footer bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        عرض <strong>{filteredCustomers.length}</strong> من أصل <strong>{customers.length}</strong> عميل
                      </small>
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        انقر على أيقونة القلم للتعديل أو سلة المهملات للحذف
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;