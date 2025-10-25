const container = document.getElementById("blog-container");

async function fetchPost(index) {
  try {
    const res = await fetch(`/blog/posts/post-${index}.json?${Date.now()}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function loadBlogs() {
  container.innerHTML = `
    <div class="blog-loading">
      <div class="spinner"></div>
      <p>Loading latest insights...</p>
    </div>
  `;

  const posts = [];
  let index = 1;

  while (true) {
    const post = await fetchPost(index);
    if (!post) break;
    posts.push(post);
    index++;
  }

  if (!posts.length) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-pen-nib"></i>
        <p>No articles available yet. Check back soon!</p>
      </div>`;
    return;
  }

  // Sort posts by date (latest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Generate cards
  container.innerHTML = posts.map(p => `
    <article class="blog-card" data-aos="fade-up">
      <img src="${p.image}" alt="${p.title}">
      <div class="blog-content">
        <div class="blog-meta">
          <i class="fas fa-calendar-alt"></i>
          <span>${new Date(p.date).toLocaleDateString()}</span>
        </div>
        <h2>${p.title}</h2>
        <p>${p.excerpt || p.content.replace(/<[^>]+>/g, '').substring(0, 150)}...</p>
        <a href="/blog/posts/post-template.html?post=${p.slug}" class="read-more">
          Read More <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </article>
  `).join('');
}

document.addEventListener("DOMContentLoaded", loadBlogs);
