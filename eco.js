/* =========================================================
   CUSTOM CURSOR — dot follows instantly, ring trails (lerp)
   ========================================================= */
(function () {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const invertTargets = 'a.magnetic, .bg-ember';
  document.querySelectorAll('[data-hover]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add(el.matches(invertTargets) ? 'hovered-invert' : 'hovered');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hovered', 'hovered-invert');
    });
  });
})();

/* =========================================================
   MOBILE MENU TOGGLE
   ========================================================= */
(function () {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  const lines = btn.querySelectorAll('.hamburger-line');
  let open = false;

  function setOpen(state) {
    open = state;
    btn.setAttribute('aria-expanded', String(open));
    menu.style.maxHeight = open ? menu.scrollHeight + 'px' : '0px';
    lines[0].style.transform = open ? 'translateY(3px) rotate(45deg)' : 'none';
    lines[1].style.transform = open ? 'translateY(-3px) rotate(-45deg)' : 'none';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', () => setOpen(!open));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && open) setOpen(false);
  });
})();

/* =========================================================
   MAGNETIC BUTTON PULL
   ========================================================= */
(function () {
  const items = document.querySelectorAll('.magnetic');
  items.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
    });
  });
})();

/* =========================================================
   3D TILT ON HOTEL CARDS
   ========================================================= */
(function () {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    const inner = card.querySelector('.tilt-inner');
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateY(0) rotateX(0)';
    });
  });
})();

/* =========================================================
   LIGHTBOX — tap a map card to open a full-size, pannable view
   ========================================================= */
(function () {
  const lightbox = document.getElementById('lightbox');
  const frame = document.getElementById('lightbox-frame');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  if (!lightbox || !img) return;

  let scale = 1;

  function openLightbox(src, cap) {
    img.src = src;
    img.alt = cap || '';
    caption.textContent = (cap || '') + '  ·  tap image to zoom';
    scale = 1;
    img.classList.remove('zoomed');
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    img.src = '';
    img.classList.remove('zoomed');
  }

  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', () => {
      openLightbox(el.dataset.lightbox, el.dataset.caption);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  // Tap the image to toggle between fit-to-screen and full resolution (scroll to pan)
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    img.classList.toggle('zoomed');
    if (img.classList.contains('zoomed')) {
      frame.scrollLeft = 0;
      frame.scrollTop = 0;
    }
  });
})();

/* =========================================================
   SCROLL REVEAL (IntersectionObserver)
   ========================================================= */
(function () {
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => io.observe(el));
})();




// Set the image source to the one clicked

  function openLightbox(imageSrc) {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    // Set the image source to the one clicked
    lightboxImg.src = imageSrc;
    
    // Show the modal
    lightbox.classList.remove('hidden');
    
    // Prevent the background page from scrolling
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    
    // Hide the modal
    lightbox.classList.add('hidden');
    
    // Allow the background page to scroll again
    document.body.style.overflow = 'auto';
    
    // Optional: clear the image src so it doesn't flash the old image next time
    setTimeout(() => {
      document.getElementById('lightbox-img').src = '';
    }, 300);
  }

  /* =========================================================
   MEGA MENU — "UNLOCK TARLAC" full-width dropdown
   ========================================================= */
(function () {
  const btn = document.getElementById('megaMenuBtn');
  const chevron = document.getElementById('megaMenuChevron');
  const menu = document.getElementById('mega-menu');
  const closeBtn = document.getElementById('megaMenuClose');
  const tabs = document.querySelectorAll('.mega-tab');
  const panels = document.querySelectorAll('.mega-panel');
  if (!btn || !menu) return;

  let open = false;

  function setOpen(state) {
    open = state;
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('hidden', !open);
    if (chevron) chevron.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!open);
  });

  closeBtn && closeBtn.addEventListener('click', () => setOpen(false));

  document.addEventListener('click', (e) => {
    if (open && !menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.megaTab;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('text-bone', active);
        t.classList.toggle('font-semibold', active);
        t.classList.toggle('text-smoke', !active);
      });
      panels.forEach((p) => {
        p.classList.toggle('hidden', p.dataset.megaPanel !== target);
      });
    });
  });
})();

/* =========================================================
   MEGA MENU (MOBILE) — tab switching inside slide-down menu
   ========================================================= */
(function () {
  const tabsM = document.querySelectorAll('.mega-tab-m');
  const panelsM = document.querySelectorAll('.mega-panel-m');
  if (!tabsM.length) return;

  tabsM.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.megaTabM;
      tabsM.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('text-bone', active);
        t.classList.toggle('font-semibold', active);
        t.classList.toggle('text-smoke', !active);
      });
      panelsM.forEach((p) => {
        p.classList.toggle('hidden', p.dataset.megaPanelM !== target);
      });

      // recalc mobile menu height since content size just changed
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu && mobileMenu.style.maxHeight !== '0px' && mobileMenu.style.maxHeight !== '') {
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
      }
    });
  });
})();


// type writer front //
document.addEventListener('DOMContentLoaded', async () => {
    
    // Function to TYPE text
    async function typeText(config) {
      const el = document.getElementById(config.id);
      const cursor = document.getElementById(config.cursorId);
      
      if(!el) return;
      
      if(cursor) cursor.classList.remove('opacity-0');
      el.textContent = ''; // Ensure clean start

      for (let i = 0; i < config.text.length; i++) {
        el.textContent += config.text.charAt(i);
        await new Promise(r => setTimeout(r, config.speed));
      }

      // If rich HTML is provided, inject it after the plain text finishes typing
      if (config.richText) el.innerHTML = config.richText;
      
      if(cursor && !config.keepCursor) cursor.classList.add('opacity-0');
    }

    // Function to ERASE text (backspacing)
    async function eraseText(config) {
      const el = document.getElementById(config.id);
      const cursor = document.getElementById(config.cursorId);
      
      if(!el) return;
      
      if(cursor) cursor.classList.remove('opacity-0');
      
      // Revert rich HTML back to plain text before backspacing
      el.textContent = config.text; 
      let currentText = config.text;

      for (let i = currentText.length; i >= 0; i--) {
        el.textContent = currentText.substring(0, i);
        await new Promise(r => setTimeout(r, config.speed / 2)); // Erases 2x faster than it types
      }

      if(cursor) cursor.classList.add('opacity-0');
    }

    // Data configurations for all elements (Updated for Eco-Tourism)
    const elements = {
      eyebrow: { id: 'tw-eyebrow', cursorId: 'cursor-eyebrow', text: 'Unlock Tarlac', speed: 50 },
      h1: { id: 'tw-h1', cursorId: 'cursor-h1', text: 'ECO - TOURISM', richText: 'ECO - <span class="text-ember">TOURISM</span>', speed: 120 },
      p: { id: 'tw-p', cursorId: 'cursor-p', text: 'Nestled in Central Luzon, Tarlac is a hidden eco-tourism gem, boasting lush landscapes, rich biodiversity, and serene natural beauty—from rolling hills and rice fields to peaceful lakes.', speed: 15 },
      b1: { id: 'tw-b1', cursorId: 'cursor-b1', text: 'ACTIVITIES 8', richText: 'ACTIVITIES <b class="text-bone">8</b>', speed: 30 },
      b2: { id: 'tw-b2', cursorId: 'cursor-b2', text: 'SUMMIT MT. PINATUBO', richText: 'SUMMIT <b class="text-bone">MT. PINATUBO</b>', speed: 30 },
      b3: { id: 'tw-b3', cursorId: 'cursor-b3', text: 'RIVER SACOBIA', richText: 'RIVER <b class="text-bone">SACOBIA</b>', speed: 30 },
      b4: { id: 'tw-b4', cursorId: 'cursor-b4', text: 'BASE TOWN CAPAS', richText: 'BASE TOWN <b class="text-bone">CAPAS</b>', speed: 30, keepCursor: true }
    };

    // ==========================================
    // INFINITE LOOP SEQUENCE
    // ==========================================
    while(true) {
      // 1. TYPING PHASE (Sequential)
      await typeText(elements.eyebrow);
      await typeText(elements.h1);
      await typeText(elements.p);
      await typeText(elements.b1);
      await typeText(elements.b2);
      await typeText(elements.b3);
      await typeText(elements.b4);

      // 2. PAUSE (Wait 5 seconds so the user can read the text)
      await new Promise(r => setTimeout(r, 5000));

      // 3. ERASING PHASE (Reverse Order)
      // We erase the 4 bottom items at the exact same time to save time
      const eraseB4 = eraseText({...elements.b4, keepCursor: false});
      const eraseB3 = eraseText(elements.b3);
      const eraseB2 = eraseText(elements.b2);
      const eraseB1 = eraseText(elements.b1);
      
      await Promise.all([eraseB4, eraseB3, eraseB2, eraseB1]); // Execute all 4 bottom erasing animations simultaneously
      
      // Then erase the rest sequentially backwards
      await eraseText(elements.p);
      await eraseText(elements.h1);
      await eraseText(elements.eyebrow);

      // 4. PAUSE (Short wait before restarting the whole sequence)
      await new Promise(r => setTimeout(r, 1000));
    }

  });

  

  document.addEventListener("DOMContentLoaded", () => {
    // Select all sections with the class 'eco-site'
    const ecoSites = Array.from(document.querySelectorAll(".eco-site"));
    const filterButtons = document.querySelectorAll(".municipality-btn");
    
    // Pagination settings
    const itemsPerPage = 5;
    let visibleCount = itemsPerPage;
    let activeFilter = null;

    const viewMoreBtn = document.getElementById("view-more-btn");
    const viewLessBtn = document.getElementById("view-less-btn");
    const paginationControls = document.getElementById("pagination-controls");

    // Main function to update what is visible on the screen
    function updateView() {
      // 1. Determine which sites match the current filter
      let matchingSites = ecoSites;
      if (activeFilter) {
        matchingSites = ecoSites.filter(site => site.getAttribute("data-municipality") === activeFilter);
      }

      // 2. Loop through ALL sites to show/hide them based on filter AND pagination
      ecoSites.forEach(site => {
        const indexInMatching = matchingSites.indexOf(site);
        
        if (indexInMatching !== -1 && indexInMatching < visibleCount) {
          // It's a matching site AND within the visible count limit
          site.style.display = ""; 
        } else {
          // It doesn't match the filter OR it exceeds the visible count
          site.style.display = "none";
        }
      });

      // 3. Update pagination buttons based on the number of matching sites
      paginationControls.style.display = "flex"; // Always keep the container flex

      if (matchingSites.length <= itemsPerPage) {
        viewMoreBtn.style.display = "none";
        viewLessBtn.style.display = "none";
      } else {
        viewMoreBtn.style.display = (visibleCount < matchingSites.length) ? "block" : "none";
        viewLessBtn.style.display = (visibleCount > itemsPerPage) ? "block" : "none";
      }
    }

    // "View More" Click Event
    viewMoreBtn.addEventListener("click", () => {
      visibleCount += 3; // Add 3 more items
      updateView();
    });

    // "View Less" Click Event
    viewLessBtn.addEventListener("click", () => {
      // Subtract 3, but make sure it never goes below the starting number (3)
      visibleCount = Math.max(itemsPerPage, visibleCount - 3); 
      updateView();
      
      // Determine matching sites to scroll to the correct one
      let matchingSites = ecoSites;
      if (activeFilter) {
        matchingSites = ecoSites.filter(site => site.getAttribute("data-municipality") === activeFilter);
      }
      
      // Smoothly scroll slightly up so the user stays oriented when content disappears
      const lastVisibleIndex = visibleCount - 1;
      if(matchingSites[lastVisibleIndex]) {
        // Scrolls to the bottom of the last visible section
        matchingSites[lastVisibleIndex].scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });

    
    

    // Municipality Filter Logic
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        // Convert button text to match the data-municipality attribute format (e.g., "San Jose" -> "san-jose")
        const targetMunicipality = button.textContent.trim().toLowerCase().replace(/\s+/g, '-');

        if (activeFilter === targetMunicipality) {
          // Clicking the same button turns off the filter
          activeFilter = null;
          button.classList.remove("ring-4", "ring-yellow-400");
        } else {
          // Switching to a new filter
          if (activeFilter) {
            // Find the previously active button and remove its highlight ring
            const prevBtn = Array.from(filterButtons).find(b => b.textContent.trim().toLowerCase().replace(/\s+/g, '-') === activeFilter);
            if(prevBtn) prevBtn.classList.remove("ring-4", "ring-yellow-400");
          }
          // Apply new filter
          activeFilter = targetMunicipality;
          button.classList.add("ring-4", "ring-yellow-400");
        }
        
        // Reset the visible count whenever the filter changes, so it goes back to 3 if they clear it
        visibleCount = itemsPerPage; 
        updateView();
      });
    });

    // Run once on page load to set the initial state
    updateView();
  });


  // image slider 
  document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. SLIDER: MOUSE DRAG & MOUSE WHEEL SCROLL
    // ==========================================
    const sliders = document.querySelectorAll('.drag-slider');

    sliders.forEach(slider => {
      let isDown = false;
      let startX;
      let scrollLeft;

      // --- NEW: Mouse Wheel Scrolling ---
      slider.addEventListener('wheel', (e) => {
        e.preventDefault(); // Stops the whole page from scrolling vertically
        slider.scrollLeft += e.deltaY; // Converts vertical wheel movement to horizontal scroll
      }, { passive: false }); // passive: false is required to allow e.preventDefault()

      // --- EXISTING: Mouse Drag Scrolling ---
      slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing'; 
        slider.classList.remove('snap-mandatory'); 
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      });

      slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
        slider.classList.add('snap-mandatory');
      });

      slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
        slider.classList.add('snap-mandatory');
      });

      slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; 
        slider.scrollLeft = scrollLeft - walk;
      });
    });

    // ==========================================
    // 2. LIGHTBOX: BACKSPACE TO CLOSE
    // ==========================================
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Prevent default browser behavior (like navigating to the previous page)
        e.preventDefault(); 
        
        // Trigger the function that closes your lightbox.
        // NOTE: Make sure this matches the actual name of your closing function!
        if (typeof closeLightbox === 'function') {
            closeLightbox(); 
        } else {
            // Fallback: If you don't have a closeLightbox() function, 
            // you can try hiding the lightbox element directly by ID here.
            const lightbox = document.getElementById('lightbox'); // Change ID if necessary
            if (lightbox) {
                lightbox.classList.add('hidden'); // Assumes Tailwind 'hidden' class
            }
        }
      }
    });
  });
  

  //  Filter the Activities and municipal of Sites
document.addEventListener('DOMContentLoaded', () => {
  const sites = Array.from(document.querySelectorAll('.eco-site'));
  const activitySet = new Set();

  const ACTIVITY_MAP = [
    [/4x4|4\s*x\s*4/i, '4x4'],
    [/trek/i, 'Trekking'],
    [/hik/i, 'Hiking'],
    [/camp/i, 'Camping'],
    [/relax/i, 'Relaxing'],
    [/bird/i, 'Bird Watching'],
    [/photo/i, 'Photography'],
    [/swim/i, 'Swimming'],
    [/histor/i, 'Historical'],
    [/nature/i, 'Nature'],
  ];

  // SVG path data per canonical activity (stroke-based, 24x24 viewBox)
  const ACTIVITY_ICONS = {
    '4x4': '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13l1.5-4.5A2 2 0 016.4 7h11.2a2 2 0 011.9 1.5L21 13M3 13h18M3 13v4a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-4M7 17a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"/>',
    'Trekking': '<path stroke-linecap="round" stroke-linejoin="round" d="M13 5l3 3-3 8-2-3-4 6M5 21l4-9 2 2M15 3a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>',
    'Hiking': '<path stroke-linecap="round" stroke-linejoin="round" d="M8 21l4-13 2 4 3-2 2 11M6 21l3-10M13 3a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>',
    'Camping': '<path stroke-linecap="round" stroke-linejoin="round" d="M3 20l9-15 9 15H3zM3 20l6-6M21 20l-6-6M9 20l3-5 3 5"/>',
    'Relaxing': '<path stroke-linecap="round" stroke-linejoin="round" d="M4 18a4 4 0 014-4h8a4 4 0 014 4M8 14V8a4 4 0 118 0v6M2 20h20"/>',
    'Bird Watching': '<path stroke-linecap="round" stroke-linejoin="round" d="M3 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z"/><circle cx="12" cy="12" r="2.2"/>',
    'Photography': '<path stroke-linecap="round" stroke-linejoin="round" d="M4 8h3l2-2h6l2 2h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"/><circle cx="12" cy="13" r="3.2"/>',
    'Swimming': '<path stroke-linecap="round" stroke-linejoin="round" d="M2 17c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0M2 12c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0M13 4l6 5-3 2-5-4z"/>',
    'Historical': '<path stroke-linecap="round" stroke-linejoin="round" d="M4 21h16M5 21V9l7-5 7 5v12M9 21v-6h6v6M4 9h16"/>',
    'Nature': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.5 2 4 4.5 4 7.5A4 4 0 0112 15a4 4 0 01-4-4.5C8 7.5 9.5 5 12 3zM12 15v6"/>',
  };

  const ALL_ICON = '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>';

  function normalizeActivity(raw) {
    for (const [pattern, canonical] of ACTIVITY_MAP) {
      if (pattern.test(raw)) return canonical;
    }
    return null;
  }

  sites.forEach(site => {
    const spans = site.querySelectorAll('#showcase-rooms span');
    const acts = new Set();
    spans.forEach(span => {
      span.textContent
        .split(/&|\/| and /i)
        .map(t => t.trim())
        .filter(Boolean)
        .forEach(t => {
          const canonical = normalizeActivity(t);
          if (canonical) acts.add(canonical);
        });
    });
    site.dataset.activities = Array.from(acts).join('|');
    acts.forEach(a => activitySet.add(a));
  });

  // Populate activity dropdown options with icons
  const activityList = document.getElementById('activity-dropdown-list');
  Array.from(activitySet).sort().forEach(activity => {
    const opt = document.createElement('div');
    opt.className = "dropdown-option flex items-center gap-2 px-4 py-3 hover:bg-[oklch(0.855_0.138_181.071)] hover:text-white cursor-pointer";
    opt.dataset.value = activity;
    opt.innerHTML = `
      <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        ${ACTIVITY_ICONS[activity] || ALL_ICON}
      </svg>
      <span>${activity}</span>
    `;
    activityList.appendChild(opt);
  });

  let selectedActivity = '';
  let selectedMunicipality = '';

  function applyFilters() {
    sites.forEach(site => {
      const siteActs = site.dataset.activities.split('|');
      const matchesActivity = !selectedActivity || siteActs.includes(selectedActivity);
      const matchesMunicipality = !selectedMunicipality || site.getAttribute('data-municipality') === selectedMunicipality;
      site.style.display = (matchesActivity && matchesMunicipality) ? '' : 'none';
    });
  }

  function setupDropdown(btnId, listId, labelId, arrowId, onSelect, iconId) {
    const btn = document.getElementById(btnId);
    const list = document.getElementById(listId);
    const label = document.getElementById(labelId);
    const arrow = document.getElementById(arrowId);
    const icon = iconId ? document.getElementById(iconId) : null;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('[id$="-dropdown-list"]').forEach(l => {
        if (l !== list) l.classList.add('hidden');
      });
      list.classList.toggle('hidden');
      arrow.classList.toggle('rotate-180');
    });

    list.addEventListener('click', (e) => {
      const option = e.target.closest('.dropdown-option');
      if (!option) return;
      label.textContent = option.querySelector('span').textContent;
      if (icon) {
        const optSvg = option.querySelector('svg');
        icon.innerHTML = optSvg ? optSvg.innerHTML : ALL_ICON;
      }
      list.classList.add('hidden');
      arrow.classList.remove('rotate-180');
      onSelect(option.dataset.value);
    });
  }

  setupDropdown('activity-dropdown-btn', 'activity-dropdown-list', 'activity-dropdown-label', 'activity-dropdown-arrow', (value) => {
    selectedActivity = value;
    applyFilters();
  }, 'activity-dropdown-icon');

  setupDropdown('municipality-dropdown-btn', 'municipality-dropdown-list', 'municipality-dropdown-label', 'municipality-dropdown-arrow', (value) => {
    selectedMunicipality = value;
    applyFilters();
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('[id$="-dropdown-list"]').forEach(l => l.classList.add('hidden'));
    document.querySelectorAll('[id$="-dropdown-arrow"]').forEach(a => a.classList.remove('rotate-180'));
  });
});

