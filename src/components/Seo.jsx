import { useEffect } from 'react';

export default function Seo({ title, description, keywords, image }) {
  useEffect(() => {
    document.title = title ? `${title} | Velvet Spice` : 'Velvet Spice | Luxury Artificial Jewellery Boutique';
    const setMeta = (selector, attribute, value, create) => {
      if (!value) return;
      let meta = document.querySelector(selector);
      if (!meta && create) {
        meta = document.createElement("meta");
        if (attribute === "name") meta.setAttribute("name", create);
        else meta.setAttribute("property", create);
        document.head.append(meta);
      }
      meta?.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', "name", description, "description");
    setMeta('meta[name="keywords"]', "name", keywords, "keywords");
    setMeta('meta[property="og:title"]', "property", title, "og:title");
    setMeta('meta[property="og:description"]', "property", description, "og:description");
    setMeta('meta[property="og:image"]', "property", image, "og:image");
  }, [title, description, keywords, image]);

  return null;
}
