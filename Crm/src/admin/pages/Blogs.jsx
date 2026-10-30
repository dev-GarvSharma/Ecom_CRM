import { useEffect, useMemo, useState } from "react";
import JoditEditor from "jodit-react";
import { EmptyState, ErrorState, LoadingState, PageHeading } from "../components/AdminPrimitives.jsx";
import { createBlogPost, deleteBlogPost, getBlogComments, getBlogPost, getBlogPosts, moderateBlogComment, updateBlogPost } from "./blogApi.js";
import { resolveImageUrl } from "../../utils/image.js";

const blankPost = {
  title: "",
  slug: "",
  description: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  metaTags: "",
  status: "draft",
};

export default function Blogs({ globalSearch = "", onNotify }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankPost);
  const [banner, setBanner] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const result = await getBlogPosts();
    setFailed(!result.success);
    if (result.success) setPosts(result.data?.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  const term = globalSearch.trim().toLowerCase();
  const visiblePosts = useMemo(() => posts.filter((post) =>
    `${post.title} ${post.slug} ${post.description}`.toLowerCase().includes(term),
  ), [posts, term]);
  const editorConfig = useMemo(() => ({
    readonly: false,
    height: 360,
    toolbarAdaptive: false,
    buttons: "bold,italic,underline,strikethrough,|,ul,ol,|,paragraph,|,left,center,right,|,link,image,table,hr,|,undo,redo,|,source",
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    uploader: { insertImageAsBase64URI: false, url: "" },
  }), []);

  const openCreate = () => {
    setEditingId(null);
    setForm(blankPost);
    setBanner(null);
    setEditorOpen(true);
  };

  const openEdit = async (post) => {
    const result = await getBlogPost(post.id);
    if (!result.success) return onNotify?.(result.message || "Could not load blog post.");
    const record = result.data?.data;
    setEditingId(post.id);
    setForm({
      title: record.title || "",
      slug: record.slug || "",
      description: record.description || "",
      content: record.content || "",
      metaTitle: record.metaTitle || "",
      metaDescription: record.metaDescription || "",
      metaTags: Array.isArray(record.metaTags) ? record.metaTags.join(", ") : "",
      status: record.status || "draft",
    });
    setBanner(null);
    setEditorOpen(true);
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const data = new FormData(event.currentTarget);
    data.set("content", form.content);
    if (banner) data.set("bannerImage", banner);
    else data.delete("bannerImage");
    const result = editingId ? await updateBlogPost(editingId, data) : await createBlogPost(data);
    if (result.success) {
      setEditorOpen(false);
      await load();
    }
    onNotify?.(result.message || (result.success ? "Blog post saved." : "Could not save blog post."));
    setSaving(false);
  };

  const removePost = async (post) => {
    if (!window.confirm(`Delete “${post.title}” and its comments?`)) return;
    const result = await deleteBlogPost(post.id);
    if (result.success) await load();
    onNotify?.(result.message || (result.success ? "Blog post deleted." : "Could not delete blog post."));
  };

  const openDetails = async (post) => {
    setPreviewPost(post);
    setComments([]);
    setCommentsLoading(true);
    const [postResult, commentsResult] = await Promise.all([
      getBlogPost(post.id),
      getBlogComments(post.id),
    ]);
    if (postResult.success) setPreviewPost(postResult.data?.data);
    else onNotify?.(postResult.message || "Could not load blog details.");
    if (commentsResult.success) setComments(commentsResult.data?.data || []);
    else onNotify?.(commentsResult.message || "Could not load comments for this blog post.");
    setCommentsLoading(false);
  };

  const moderateComment = async (comment, status) => {
    const result = await moderateBlogComment(comment.id, status);
    if (result.success)
      setComments((current) => current.map((item) => item.id === comment.id ? { ...item, status } : item));
    onNotify?.(result.message || (result.success ? "Comment updated." : "Could not update comment."));
  };

  if (loading) return <LoadingState label="Loading blog posts" />;
  if (failed) return <ErrorState retry={load} />;

  return (
    <div className="admin-page-content">
      <PageHeading eyebrow="PUBLISHING" title="Blog" description="Write, optimize, publish, and manage storefront blog posts." action={<button className="admin-button admin-button-dark" onClick={openCreate}>New blog post</button>} />
      <section className="admin-panel admin-table-panel">
        <div className="admin-panel-heading"><div><h2>Blog posts</h2><p>{visiblePosts.length} posts</p></div></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>BANNER</th><th>TITLE</th><th>STATUS</th><th>UPDATED</th><th>ACTIONS</th></tr></thead>
            <tbody>{visiblePosts.map((post) => <tr key={post.id}>
              <td>{post.bannerImage ? <img src={resolveImageUrl(post.bannerImage)} alt="" className="blog-admin-thumb" /> : "—"}</td>
              <td><strong>{post.title}</strong><br /><small>/{post.slug}</small></td>
              <td>{post.status}</td>
              <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
              <td className="blog-admin-actions">
                <button className="admin-button" onClick={() => openEdit(post)}>Edit</button>
                <button className="admin-button" onClick={() => removePost(post)}>Delete</button>
                <button className="admin-button" onClick={() => openDetails(post)}>Details</button>
              </td>
            </tr>)}</tbody>
          </table>
          {!visiblePosts.length && <EmptyState title="No matching blog posts" />}
        </div>
      </section>

      {editorOpen && <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditorOpen(false); }}>
        <form className="admin-modal blog-editor-modal" onSubmit={save}>
          <div className="admin-modal-header"><div><small>{editingId ? "EDIT POST" : "NEW POST"}</small><h2>{editingId ? "Edit blog post" : "Create blog post"}</h2></div><button type="button" className="admin-button" onClick={() => setEditorOpen(false)}>Close</button></div>
          <div className="blog-editor-grid">
            <label className="admin-form-label">Title<input name="title" value={form.title} maxLength={200} required onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
            <label className="admin-form-label">Slug<input name="slug" value={form.slug} placeholder="generated from title if blank" maxLength={220} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
            <label className="admin-form-label blog-editor-wide">Short description<textarea name="description" value={form.description} maxLength={500} required onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
            <label className="admin-form-label">Meta title<input name="metaTitle" value={form.metaTitle} maxLength={200} onChange={(event) => setForm({ ...form, metaTitle: event.target.value })} /></label>
            <label className="admin-form-label">Meta tags / keywords<input name="metaTags" value={form.metaTags} placeholder="jewellery, styling, trends" onChange={(event) => setForm({ ...form, metaTags: event.target.value })} /></label>
            <label className="admin-form-label blog-editor-wide">Meta description<textarea name="metaDescription" value={form.metaDescription} maxLength={320} onChange={(event) => setForm({ ...form, metaDescription: event.target.value })} /></label>
            <label className="admin-form-label">Banner image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setBanner(event.target.files?.[0] || null)} />{editingId && <small>Leave empty to keep the current banner.</small>}</label>
            <label className="admin-form-label">Visibility<select name="status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="draft">Draft</option><option value="published">Published</option></select></label>
            <div className="blog-editor-wide"><label className="admin-form-label">Blog content</label><JoditEditor value={form.content} config={editorConfig} onChange={(content) => setForm((current) => ({ ...current, content }))} /></div>
          </div>
          <div className="admin-modal-footer"><button type="button" className="admin-button" onClick={() => setEditorOpen(false)}>Cancel</button><button className="admin-button admin-button-dark" disabled={saving}>{saving ? "Saving…" : "Save post"}</button></div>
        </form>
      </div>}

      {previewPost && <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewPost(null); }}><section className="admin-modal blog-preview-modal"><div className="admin-modal-header"><div><small>POST DETAILS</small><h2>{previewPost.title}</h2></div><button className="admin-button" onClick={() => setPreviewPost(null)}>Close</button></div>{previewPost.bannerImage && <img src={resolveImageUrl(previewPost.bannerImage)} alt="" className="blog-preview-banner" />}<p>{previewPost.description}</p><p><strong>Slug:</strong> /blog/{previewPost.slug}</p><p><strong>Status:</strong> {previewPost.status}</p><article className="blog-content" dangerouslySetInnerHTML={{ __html: previewPost.content?.replace(/src=(['"])(\/uploads\/[^'"]+)\1/g, (_match, quote, path) => `src=${quote}${resolveImageUrl(path)}${quote}`) || "" }} /><section className="blog-detail-comments"><h3>Comments for this blog</h3><p>Only approved comments are visible publicly. Review each comment below.</p>{commentsLoading ? <p>Loading comments…</p> : comments.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>AUTHOR</th><th>COMMENT</th><th>SUBMITTED</th><th>STATUS</th></tr></thead><tbody>{comments.map((comment) => <tr key={comment.id}><td>{comment.name}<br /><a href={`mailto:${comment.email}`}>{comment.email}</a></td><td className="blog-comment-text">{comment.comment}</td><td>{new Date(comment.createdAt).toLocaleString()}</td><td><select aria-label={`Moderate comment by ${comment.name}`} value={comment.status} onChange={(event) => moderateComment(comment, event.target.value)}><option value="pending">Pending</option><option value="approved">Approve</option><option value="rejected">Reject</option></select></td></tr>)}</tbody></table></div> : <p>No comments have been submitted for this blog post.</p>}</section></section></div>}
    </div>
  );
}
