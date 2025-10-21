// ====== EBOOK DATA ======
const ebooks = [
  {
    id: 1,
    title: "Modern Web Development Mastery",
    description: "Anyone can create a functional and beautiful website, and this guide shows you exactly how. You will learn how to plan your site, pick the right CMS, install themes or templates, customize layouts, and add practical functionality such as forms, SEO basics, and mobile friendly design. The lessons are project based, with screenshots, checklists, and short exercises that let you practice as you go. By the end you will have a live, editable website you can update and grow without hunting through scattered tutorials.",
    cover: "/images/Learn-Web-Design.jpg",
    price: 199,
    file: "/ebooks/pdfs/Your-First-Website.pdf"
  },
{
  id: 2,
  title: "60 Skills to Level Up Your Skills or Business. Know all Master a few!",
  description: "The world is changing fast — new opportunities are created every day for those who can adapt and learn. 60 Skills for the Future is your ultimate roadmap to mastering the digital age. Inside, you’ll find curated learning paths, trusted tools, and practical exercises covering 100 in-demand skills across design, technology, business, and creativity.",
  cover: "/images/skill-boost.jpg ",
  price: 699,
  file: "/ebooks/pdfs/60-skills-for-the-future.pdf"
},
{
  id: 3,
  title: "50 Tools to Level Up Your Skills or Business",
  description: "A curated collection of 50 powerful tools designed to elevate your skills, streamline your workflow, and accelerate business growth. Inside, you'll find carefully selected platforms that help you learn faster, create stunning visuals, manage projects efficiently, and market your brand with confidence. From AI-powered writing assistants and design generators to social media planners, analytics dashboards, and business automation apps — this guide gives you everything you need to work smarter, not harder.",
  cover: "/images/bizzy-boost.jpg",
  price: 300,
  file: "/ebooks/pdfs/50_Tools_to_Level_Up_Your_Skills_or_Business.pdf"
}


];


// ====== ELEMENTS ======
const ebookModal = document.getElementById("ebookModal");
const ebookClose = ebookModal.querySelector(".close-modal");
const formModal = document.getElementById("formModal");
const formClose = formModal.querySelector(".close-modal");

const modalCover = document.getElementById("modal-cover");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-description");
const modalPrice = document.getElementById("modal-price");
const getEbookBtn = document.getElementById("getEbookBtn");

const ebookForm = document.getElementById("ebookForm");
const formEbookTitle = document.getElementById("formEbookTitle");

let currentEbook = null;

// ====== MODAL HELPERS ======
function openModal(modal) {
  modal.classList.add("show");
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("visible"), 10);
}

function closeModal(modal) {
  modal.classList.remove("visible");
  setTimeout(() => {
    modal.classList.remove("show");
    modal.style.display = "none";
  }, 200);
}

// ====== OPEN EBOOK MODAL ======
document.querySelectorAll(".ebook-card .quick-view").forEach(btn => {
  btn.addEventListener("click", e => {
    const card = e.target.closest(".ebook-card");
    const title = card.querySelector(".ebook-title").textContent.trim();
    const ebook = ebooks.find(b => b.title === title);
    if (!ebook) return;

    currentEbook = ebook;
    modalCover.src = ebook.cover;
    modalTitle.textContent = ebook.title;
    modalDesc.textContent = ebook.description;
    modalPrice.textContent = ebook.price > 0 ? `KES ${ebook.price.toLocaleString()}` : "Free";
    getEbookBtn.textContent = ebook.price > 0 ? "Buy Now" : "Download Free";

    openModal(ebookModal);
  });
});

// ====== CLOSE EVENTS ======
[ebookClose, formClose].forEach(btn => {
  btn.addEventListener("click", () => {
    closeModal(ebookModal);
    closeModal(formModal);
  });
});

window.addEventListener("click", e => {
  if (e.target.classList.contains("ebook-modal") || e.target.classList.contains("form-modal")) {
    closeModal(ebookModal);
    closeModal(formModal);
  }
});


window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal(ebookModal);
    closeModal(formModal);
  }
});

// ====== HANDLE GET EBOOK BUTTON ======
getEbookBtn.addEventListener("click", () => {
  if (!currentEbook) return;

  if (currentEbook.price === 0) {
    // Free download
    window.location.href = currentEbook.file;
  } else {
    // Paid version
    closeModal(ebookModal);
    formEbookTitle.value = currentEbook.title;
    openModal(formModal);
  }
});

// ====== FEATURED / CTA BUTTONS for the BIG SECTION OF EBOOK======
document.querySelectorAll(".showcase-content .quick-view").forEach(btn => {
  btn.addEventListener("click", () => {
    const ebookId = parseInt(btn.dataset.ebookId);
    const ebook = ebooks.find(b => b.id === ebookId);
    if (!ebook) return;

    currentEbook = ebook;
    modalCover.src = ebook.cover;
    modalTitle.textContent = ebook.title;
    modalDesc.textContent = ebook.description;
    modalPrice.textContent = ebook.price > 0 ? `KES ${ebook.price.toLocaleString()}` : "Free";
    getEbookBtn.textContent = ebook.price > 0 ? "Buy Now" : "Download Free";

    openModal(ebookModal);
  });
});

// ====== FORM SUBMISSION ======
ebookForm.addEventListener("submit", e => {
  e.preventDefault();

  // Reset previous errors
  document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");

  const name = ebookForm.querySelector("#name").value.trim();
  const email = ebookForm.querySelector("#email").value.trim().toLowerCase();
  const phone = ebookForm.querySelector("#phone").value.trim();
  let hasError = false;

  // --- Email validation ---
  if (!email.endsWith("@gmail.com")) {
    document.getElementById("emailError").textContent = "Please use a valid Gmail address (e.g. yourname@gmail.com).";
    hasError = true;
  }

  // --- Universal phone validation ---
  const phonePattern = /^\+\d{7,15}$/; // + followed by 7 to 15 digits
  if (!phonePattern.test(phone)) {
    document.getElementById("phoneError").textContent =
      "Please enter a valid phone number with your country code (e.g. +254 712 345 678 ).";
    hasError = true;
  }

  // Stop submission if there are errors
  if (hasError) return;

  // Disable submit button during submission
  const submitBtn = ebookForm.querySelector("button[type='submit']");
  submitBtn.textContent = "Submitting...";
  submitBtn.disabled = true;

  // --- Proceed with submission ---
  fetch("https://formsubmit.co/ajax/ephraimmutwiri01@gmail.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      phone,
      email,
      ebook: currentEbook.title,
      price: `KES ${currentEbook.price}`
    })
  })
  .then(res => res.ok ? res.json() : Promise.reject(res))
  .then(() => {
    closeModal(formModal);
    payWithPaystack(currentEbook, email);
  })
  .catch(() => {
    document.getElementById("emailError").textContent = "Error submitting form. Please try again.";
  })
  .finally(() => {
    submitBtn.textContent = "Continue to Payment";
    submitBtn.disabled = false;
  });
});



// ====== PAYSTACK PAYMENT ======
function payWithPaystack(ebook, email) {
  const handler = PaystackPop.setup({
    key: "pk_live_6eb7455360264ea608205af666c8cc0a73f0046e",
    email,
    amount: ebook.price * 100,
    currency: "KES",
    ref: "ebook-" + Date.now(),
    callback: response => {
      alert(`Payment successful! Reference: ${response.reference}`);
      window.location.href = ebook.file;
    },
    onClose: () => alert("Payment cancelled.")
  });
  handler.openIframe();
}
