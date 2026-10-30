import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { PageHeading, LoadingState, ErrorState, EmptyState } from "../components/AdminPrimitives.jsx";
import { formatRupees } from "../models/catalog.js";
import { createCoupon, getCoupons, updateCoupon } from "./operationsApi.js";

export default function Offers({ globalSearch = "", onNotify }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const load = async () => {
    setLoading(true);
    const result = await getCoupons();
    setFailed(!result.success);
    if (result.success) setCoupons(result.data?.data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const submit = async (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setSaving(true);
    const result = await createCoupon({
      code: String(values.get("code")).trim().toUpperCase(),
      type: values.get("type"),
      value: Number(values.get("value")),
      minOrder: Number(values.get("minOrder") || 0),
      usageLimit: values.get("usageLimit") ? Number(values.get("usageLimit")) : null,
      active: true,
    });
    setSaving(false);
    if (!result.success) return onNotify(result.message || "Could not create offer.");
    setModalOpen(false);
    onNotify("Offer created.");
    await load();
  };
  const toggle = async (coupon) => {
    const result = await updateCoupon(coupon.id, { active: !coupon.active });
    if (!result.success) return onNotify(result.message || "Could not update offer.");
    await load();
  };
  if (loading) return <LoadingState label="Loading offers" />;
  if (failed) return <ErrorState retry={load} />;
  const visibleCoupons = coupons.filter((coupon) => `${coupon.code} ${coupon.type} ${coupon.active ? "active" : "inactive"}`.toLowerCase().includes(globalSearch.trim().toLowerCase()));
  return <div className="admin-page-content">
    <PageHeading eyebrow="DISCOUNTS" title="Offers" description="Create and manage discount codes for checkout." action={<button className="admin-button admin-button-dark" onClick={() => setModalOpen(true)}><Plus size={16} /> New offer</button>} />
    <section className="admin-panel admin-table-panel"><div className="admin-panel-heading"><div><h2>Discount offers</h2><p>{coupons.length} offers</p></div></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>CODE</th><th>DISCOUNT</th><th>MINIMUM ORDER</th><th>USES</th><th>STATUS</th><th /></tr></thead><tbody>
        {visibleCoupons.map((coupon) => <tr key={coupon.id}><td><strong>{coupon.code}</strong></td><td>{coupon.type === "percentage" ? `${coupon.value}%` : formatRupees(coupon.value)}</td><td>{formatRupees(coupon.minOrder)}</td><td>{coupon.usedCount || 0}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}</td><td>{coupon.active ? "Active" : "Inactive"}</td><td><button className="admin-button admin-button-secondary" onClick={() => toggle(coupon)}>{coupon.active ? "Deactivate" : "Activate"}</button></td></tr>)}
      </tbody></table>{!visibleCoupons.length && <EmptyState title={coupons.length ? "No matching offers" : "No offers yet"} detail="Create a discount offer to show it here." />}</div>
    </section>
    {modalOpen && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setModalOpen(false)}><form className="admin-modal" onSubmit={submit}>
      <div className="admin-modal-header"><div><span className="admin-eyebrow">CHECKOUT DISCOUNT</span><h2>Create offer</h2></div><button type="button" className="admin-icon-button" onClick={() => setModalOpen(false)} aria-label="Close"><X size={18} /></button></div>
      <label>Offer code<input name="code" required maxLength={40} pattern="[A-Za-z0-9_-]+" placeholder="SUMMER10" /></label>
      <div className="admin-form-row"><label>Discount type<select name="type"><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></select></label><label>Value<input name="value" required type="number" min="0.01" step="0.01" /></label></div>
      <div className="admin-form-row"><label>Minimum order<input name="minOrder" type="number" min="0" step="0.01" defaultValue="0" /></label><label>Usage limit<input name="usageLimit" type="number" min="1" /></label></div>
      <div className="admin-modal-footer"><button type="button" className="admin-button admin-button-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="admin-button admin-button-dark" disabled={saving}>Create offer</button></div>
    </form></div>}
  </div>;
}
