import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import Section from "../components/Section.jsx";
import { getBlogPost, submitBlogComment } from "../api/blog.js";
import { resolveImageUrl } from "../utils/image.js";

const inputClass = "w-full rounded-2xl bg-white/80 px-4 py-3 outline-none dark:bg-white/10";

export default function BlogDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => getBlogPost(slug).then((result) => {
    if (result.success) setPost(result.data?.data);
    else setError(result.message || "Blog post not found.");
    setLoading(false);
  });
  useEffect(() => { setLoading(true); setError(""); setPost(null); load(); }, [slug]);

  const comment = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitting(true);
    setNotice("");
    const result = await submitBlogComment(slug, Object.fromEntries(new FormData(formElement).entries()));
    if (result.success) {
      formElement.reset();
      setNotice(result.message || "Your comment is awaiting approval.");
    } else {
      setNotice(result.message || "Could not submit comment.");
    }
    setSubmitting(false);
  };

  if (loading) return <Section eyebrow="Journal" title="Loading story…" />;
  if (error || !post) return <Section eyebrow="Journal" title="Story unavailable"><p role="alert">{error || "Blog post not found."}</p><Link to="/blog">Back to blog</Link></Section>;

  const description = post.metaDescription || post.description;
  return <>
    <Seo title={post.metaTitle || post.title} description={description} keywords={(post.metaTags || []).join(", ")} image={resolveImageUrl(post.bannerImage)} />
    <Section eyebrow={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Velvet Spice Journal"} title={post.title}>
      <article className="mx-auto max-w-4xl">
        <p className="mb-8 text-lg leading-8 opacity-75">{post.description}</p>
        {post.bannerImage && <img src={resolveImageUrl(post.bannerImage)} alt={post.title} className="mb-10 max-h-[560px] w-full rounded-3xl object-cover" />}
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content.replace(/src=(['"])(\/uploads\/[^'"]+)\1/g, (_match, quote, path) => `src=${quote}${resolveImageUrl(path)}${quote}`) }} />
      </article>
      <section className="mx-auto mt-14 grid max-w-4xl gap-8 border-t border-[#D4A373]/25 pt-10">
        <div><h2 className="font-display text-3xl">Comments</h2><p className="mt-2 text-sm opacity-70">Comments appear here after admin approval.</p></div>
        {post.comments?.length ? <div className="grid gap-4">{post.comments.map((item) => <article key={item.id} className="rounded-2xl bg-white/60 p-5 dark:bg-white/5"><strong>{item.name}</strong><p className="mt-1 text-xs opacity-60">{new Date(item.createdAt).toLocaleDateString()}</p><p className="mt-3 whitespace-pre-wrap">{item.comment}</p></article>)}</div> : <p className="text-sm opacity-70">No approved comments yet.</p>}
        <form onSubmit={comment} className="grid gap-4 rounded-3xl bg-white/60 p-6 shadow-xl dark:bg-white/5">
          <h3 className="font-semibold">Leave a comment</h3>
          <label className="grid gap-2">Name<input className={inputClass} name="name" required minLength={2} maxLength={120} /></label>
          <label className="grid gap-2">Email<input className={inputClass} name="email" type="email" required maxLength={254} /></label>
          <label className="grid gap-2">Comment<textarea className={`${inputClass} min-h-32`} name="comment" required minLength={2} maxLength={3000} /></label>
          {notice && <p role="status">{notice}</p>}
          <button disabled={submitting} className="w-fit rounded-full rose-gradient px-6 py-3 font-bold text-[#1A1A1A] disabled:opacity-60">{submitting ? "Submitting…" : "Submit comment"}</button>
        </form>
      </section>
      <div className="mx-auto mt-8 max-w-4xl"><Link to="/blog" className="font-semibold text-[#9A5E36]">← All stories</Link></div>
    </Section>
  </>;
}
