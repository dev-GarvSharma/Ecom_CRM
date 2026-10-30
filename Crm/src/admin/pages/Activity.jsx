import { useEffect, useMemo, useState } from "react";
import { PageHeading, LoadingState, ErrorState, EmptyState } from "../components/AdminPrimitives.jsx";
import { getAbandonedCarts, getAuditHistory } from "./operationsApi.js";

export default function Activity({ globalSearch = "" }) {
  const [abandoned, setAbandoned] = useState([]);
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const load = async () => {
    setLoading(true);
    const [carts, history] = await Promise.all([getAbandonedCarts(), getAuditHistory()]);
    setFailed(!carts.success || !history.success);
    if (carts.success) setAbandoned(carts.data?.data || []);
    if (history.success) setAudit(history.data?.data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const term = globalSearch.trim().toLowerCase();
  const visibleAudit = useMemo(() => audit.filter((entry) => `${entry.actor?.name || ""} ${entry.actorUserId || ""} ${entry.action || ""} ${entry.resourceType || ""} ${entry.resourceId || ""}`.toLowerCase().includes(term)), [audit, term]);
  const visibleCarts = useMemo(() => abandoned.filter((session) => {
    const cart = session.Cart || session.cart || {};
    const user = cart.user || {};
    return `${user.name || ""} ${user.phone || ""} ${session.abandonmentReason || ""} ${session.abandonmentComment || ""}`.toLowerCase().includes(term);
  }), [abandoned, term]);
  if (loading) return <LoadingState label="Loading store activity" />;
  if (failed) return <ErrorState retry={load} />;
  return <div className="admin-page-content">
    <PageHeading eyebrow="CUSTOMER AND ADMIN HISTORY" title="Activity history" description="Review abandoned carts, customer feedback, and administrative changes." />
    <section className="admin-panel admin-table-panel"><div className="admin-panel-heading"><div><h2>Abandoned carts</h2><p>{visibleCarts.length} carts inactive for 24 hours</p></div></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>CUSTOMER</th><th>PHONE</th><th>ITEMS</th><th>REASON</th><th>COMMENT</th><th>ABANDONED</th></tr></thead><tbody>
        {visibleCarts.map((session) => { const cart = session.Cart || session.cart || {}; const customer = cart.user || {}; return <tr key={session.id}><td>{customer.name || "Account"}</td><td>{customer.phone || "—"}</td><td>{cart.items?.length || 0}</td><td>{session.abandonmentReason || "Automatic"}</td><td>{session.abandonmentComment || "—"}</td><td>{session.abandonedAt ? new Date(session.abandonedAt).toLocaleString() : "—"}</td></tr>; })}
      </tbody></table>{!visibleCarts.length && <EmptyState title="No matching abandoned carts" />}</div>
    </section>
    <section className="admin-panel admin-table-panel"><div className="admin-panel-heading"><div><h2>Administrative history</h2><p>{visibleAudit.length} recorded changes</p></div></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>TIME</th><th>ACTOR</th><th>ACTION</th><th>RESOURCE</th><th>CHANGES</th></tr></thead><tbody>
        {visibleAudit.map((entry) => <tr key={entry.id}><td>{new Date(entry.createdAt).toLocaleString()}</td><td>{entry.actor?.name || entry.actorUserId || "System"}</td><td>{entry.action}</td><td>{entry.resourceType} {entry.resourceId || ""}</td><td><code>{JSON.stringify(entry.changes || {})}</code></td></tr>)}
      </tbody></table>{!visibleAudit.length && <EmptyState title="No matching activity" />}</div>
    </section>
  </div>;
}
