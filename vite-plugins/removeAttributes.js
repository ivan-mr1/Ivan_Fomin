export const removeAttributes = () => ({
  transformIndexHtml(html) {
    return html
      .replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, (tag) =>
        tag.replace(/\s*crossorigin(=["'][^"']*["'])?/i, ''),
      )
      .replace(/<script\b[^>]*>/gi, (tag) =>
        tag.replace(/\s*crossorigin(=["'][^"']*["'])?/i, ''),
      );
  },
});
