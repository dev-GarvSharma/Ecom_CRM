import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import Section from "../components/Section.jsx";
import { getBlogPosts } from "../api/blog.js";
import { resolveImageUrl } from "../utils/image.js";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBlogPosts().then((result) => {
      if (result.success) setPosts(result.data?.data || []);
      else setError(result.message || "Unable to load blog posts.");
      setLoading(false);
    });
  }, []);

  return <>
    <Seo title="Blog" description="Read the latest jewellery styling ideas, care guides, and stories from Velvet Spice." />
    <Section eyebrow="Stories and styling" title="The Velvet Spice Journal">
      {loading && <p>Loading stories…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && posts.length === 0 && <p>New stories are coming soon.</p>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => <article key={post.id} className="overflow-hidden rounded-3xl border border-[#D4A373]/20 bg-white/60 shadow-xl dark:bg-white/5">
          {post.bannerImage && <Link to={`/blog/${post.slug}`}><img className="h-56 w-full object-cover" src={resolveImageUrl(post.bannerImage)} alt="" loading="lazy" /></Link>}
          <div className="grid gap-3 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D4A373]">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Journal"}</p>
            <h2 className="font-display text-2xl"><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
            <p className="text-sm leading-6 opacity-75">{post.description}</p>
            <Link className="font-semibold text-[#9A5E36]" to={`/blog/${post.slug}`}>Read story →</Link>
          </div>
        </article>)}
      </div>
    </Section>
  </>;
}
