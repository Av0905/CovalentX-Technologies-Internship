document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ============================================================
  // PATH-BASED ACTIVE NAVIGATION LINK SYNC
  // ============================================================
  const navLinks = document.querySelectorAll(".nav-link");
  const mobLinks = document.querySelectorAll(".mob-link");
  
  // Get current page filename (e.g., 'about.html')
  let currentFile = window.location.pathname.split("/").pop();
  if (currentFile === "" || currentFile === "/" || !currentFile) {
    currentFile = "index.html"; // default to home
  }

  const syncActiveLink = (links) => {
    links.forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentFile) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  syncActiveLink(navLinks);
  syncActiveLink(mobLinks);

  // ============================================================
  // NAVBAR SCROLL TRANSITION & TOP PROGRESS BAR
  // ============================================================
  const navbar = document.getElementById("navbar");
  
  // Create and inject scroll progress bar
  const scrollBar = document.createElement("div");
  scrollBar.id = "scrollBar";
  document.body.prepend(scrollBar);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // Toggle scrolled state
    if (scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Update progress bar width
    scrollBar.style.width = `${progress}%`;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Run once initially

  // ============================================================
  // MOBILE HAMBURGER DRAWER
  // ============================================================
  const hamburger = document.getElementById("hamburger");
  const mobileDrawer = document.getElementById("mobileDrawer");

  if (hamburger && mobileDrawer) {
    const toggleMobileMenu = () => {
      const isOpen = mobileDrawer.classList.toggle("open");
      hamburger.classList.toggle("open");
      
      if (isOpen) {
        document.body.style.overflow = "hidden";
        hamburger.setAttribute("aria-expanded", "true");
      } else {
        document.body.style.overflow = "";
        hamburger.setAttribute("aria-expanded", "false");
      }
    };

    const closeMobileMenu = () => {
      mobileDrawer.classList.remove("open");
      hamburger.classList.remove("open");
      document.body.style.overflow = "";
      hamburger.setAttribute("aria-expanded", "false");
    };

    hamburger.addEventListener("click", toggleMobileMenu);

    // Close when clicking links
    mobLinks.forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });

    // Close when hitting escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileDrawer.classList.contains("open")) {
        closeMobileMenu();
      }
    });
  }

  // ============================================================
  // 3D NAV LINK HOVER TILT
  // ============================================================
  navLinks.forEach(link => {
    link.addEventListener("mousemove", (e) => {
      const rect = link.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2); // -1 to 1
      const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1
      const rotX = -dy * 12; // rotate degrees
      const rotY = dx * 12;

      link.style.transform = `
        perspective(400px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        translateZ(8px)
        translateY(-2px)
      `;
    });

    link.addEventListener("mouseleave", () => {
      link.style.transform = "";
    });
  });

  // ============================================================
  // 3D CARD HOVER TILTS
  // ============================================================
  const setupCardTilts = () => {
    const tiltCards = document.querySelectorAll(".service-card, .port-item, .services-tabs");
    
    tiltCards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2); // -1 to 1
        const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1

        card.style.transform = `
          perspective(800px)
          rotateX(${-dy * 10}deg)
          rotateY(${dx * 10}deg)
          translateZ(15px)
          translateY(-6px)
        `;
        card.style.boxShadow = `
          ${-dx * 12}px ${-dy * 12}px 40px rgba(0, 245, 255, 0.15),
          0 8px 60px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(0, 245, 255, 0.3)
        `;

        // Support mouse glow spotlight
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.boxShadow = "";
      });
    });
  };

  setupCardTilts();

  // ============================================================
  // RIPPLE CLICK EFFECT ON BUTTONS
  // ============================================================
  const createRipple = (e, button) => {
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 50%;
      pointer-events: none;
      transform: scale(0);
      animation: ripple-effect 0.6s linear;
      z-index: 10;
    `;
    
    button.style.position = "relative";
    button.style.overflow = "hidden";
    button.appendChild(ripple);
    
    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
  };

  // Inject ripple keyframes
  const rippleStyle = document.createElement("style");
  rippleStyle.textContent = `
    @keyframes ripple-effect {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  const interactiveButtons = document.querySelectorAll(".btn-primary, .btn-secondary, .nav-cta");
  interactiveButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      createRipple(e, btn);
    });
  });

  // ============================================================
  // GENERIC CONTAINER-SCOPED TABS SYSTEM
  // ============================================================
  const setupTabs = () => {
    const tabContainers = document.querySelectorAll(".about-tabs, .services-tabs");
    
    tabContainers.forEach(container => {
      const btns = container.querySelectorAll(".tab-btn");
      const panes = container.querySelectorAll(".tab-pane");
      
      btns.forEach(btn => {
        btn.addEventListener("click", () => {
          const targetTab = btn.getAttribute("data-tab");
          
          btns.forEach(b => b.classList.remove("active"));
          panes.forEach(p => p.classList.remove("active"));
          
          btn.classList.add("active");
          const targetPane = container.querySelector(`#tab-${targetTab}`);
          if (targetPane) {
            targetPane.classList.add("active");
          }
        });
      });
    });
  };

  setupTabs();

  // ============================================================
  // PORTFOLIO CASE STUDY MODAL SYSTEM
  // ============================================================
  const projectData = {
    aether: {
      title: 'Aether VR',
      tag: 'Spatial Interface',
      lead: 'Spatial headset environments rendered in real-time inside the browser.',
      about: 'Aether VR reimagines how users configure virtual reality setups. Built with low-level WebGL architectures and custom procedural environment models, it allows prospective buyers to experience virtual rooms, calibrate lenses, and select strap systems directly on their browser canvas in 60fps.',
      challenge: 'Optimizing high-polygon headset assets to run flawlessly across mobile viewports while keeping assets light enough for immediate load.',
      solution: 'Implemented dynamic Level of Detail (LoD) mesh loading, customized normal maps to reduce face counts, and wrote hardware-accelerated shaders that render premium ambient occlusion effects programmatically.',
      features: [
        'Dynamic mesh Level-of-Detail (LoD) switching',
        'Hardware-accelerated custom pixel/vertex shaders',
        'Real-time ambient occlusion and dynamic shadowing',
        'Full gyro and touch-responsive gesture controls'
      ],
      client: 'Aether Technologies Inc.',
      year: '2025',
      role: 'Lead Spatial Engineering',
      techStack: 'WebGL / Three.js / GLSL Shaders',
      ctaLink: 'contact.html'
    },
    synthetix: {
      title: 'Synthetix AI',
      tag: 'AI / Neural Nets',
      lead: 'High-throughput real-time diagnostic neural net visualization dashboard.',
      about: 'Synthetix AI is a custom analytical command center built for multi-cluster AI inference networks. The platform tracks dynamic token routing, active node temperature, memory bandwidth, and visualizes synaptic pathways as millions of floating glowing coordinates.',
      challenge: 'Managing and updating over 50,000 active particles at 60 FPS while keeping the UI responsive to user filter queries.',
      solution: 'Leveraged instanced buffer attributes in WebGL, offloading the physical calculations of particle paths to a custom GPU computation shader (GPGPU).',
      features: [
        'Over 50k interactive particles simulated on GPU',
        'Real-time neural routing diagnostics',
        'Custom HSL-gradient color mapping based on server load',
        'Low-latency WebSocket streaming metrics feeds'
      ],
      client: 'Synthetix Labs Corp.',
      year: '2026',
      role: 'Technical Architecture & Creative Dev',
      techStack: 'Next.js / WebSockets / GPU Shaders',
      ctaLink: 'contact.html'
    },
    krypton: {
      title: 'Krypton DEX',
      tag: 'Fintech / Web3',
      lead: 'Decentralized multi-chain liquidity visualization with low-latency updates.',
      about: 'Krypton DEX bridges deep-liquidity decentralized financial ecosystems with an interface designed to convey mathematical depth. It converts raw block telemetry into interactive three-dimensional waterfalls representing market depth, buy/sell orders, and chain state.',
      challenge: 'Streaming real-time block executions from multiple RPC providers and processing data feeds with zero UI stutter.',
      solution: 'Offloaded complex message sorting and serialization to dedicated Web Workers, ensuring that the main rendering thread focuses solely on user input and animation cycles.',
      features: [
        'Dedicated Web Worker data serialization pipeline',
        'Real-time WebGL financial waterfall depth charts',
        'Holographic dark-mode design system with neon cues',
        'Instant multi-wallet integration portal'
      ],
      client: 'Krypton Foundation',
      year: '2025',
      role: 'Frontend Engineering Lead',
      techStack: 'React / WebGL / Web Workers',
      ctaLink: 'contact.html'
    },
    chronos: {
      title: 'Chronos SaaS',
      tag: 'SaaS / Productivity',
      lead: 'Advanced developer calendar and team-flow automation pipeline platform.',
      about: 'Chronos is a productivity platform designed to cure time fragmentation for remote developer teams. Using predictive heuristics, it aligns calendar bookings, blocks deep work intervals, and auto-dispatches asynchronous summaries of daily code pushes.',
      challenge: 'Designing a highly complex, calendar interaction state machine that accommodates drag-and-drop actions across dynamic time zones.',
      solution: 'Wrote a custom context-aware coordinate mapping algorithm combined with transitions to yield completely elastic and satisfying slot positioning transitions.',
      features: [
        'Heuristic-based timezone alignment grid',
        'Elastic drag-and-drop slots with spring dynamics',
        'Custom developer analytics integration dashboards',
        'Adaptive workspace light/dark glassmorphic theme'
      ],
      client: 'Chronos Inc.',
      year: '2026',
      role: 'UI/UX & Frontend Development',
      techStack: 'TypeScript / Canvas / Next.js',
      ctaLink: 'contact.html'
    }
  };

  const projectModal = document.getElementById("projectModal");
  const modalClose = document.getElementById("modalClose");
  const modalContent = document.getElementById("modalContent");
  const portItems = document.querySelectorAll(".port-item");

  if (projectModal && modalContent) {
    const openProjectModal = (key) => {
      const data = projectData[key];
      if (!data) return;

      const featuresHTML = data.features.map(f => `<li>${f}</li>`).join("");

      modalContent.innerHTML = `
        <div class="modal-project-header">
          <span class="modal-tag">${data.tag}</span>
          <h2>${data.title}</h2>
          <p class="modal-lead">${data.lead}</p>
        </div>
        <div class="modal-project-body">
          <div class="modal-body-left">
            <h3>The Context & Initiative</h3>
            <p>${data.about}</p>
            
            <h3>The Engineering Challenge</h3>
            <p>${data.challenge}</p>
  
            <h3>Our Dynamic Solution</h3>
            <p>${data.solution}</p>
  
            <h3>Core Architecture Deliverables</h3>
            <ul class="modal-features-list">
              ${featuresHTML}
            </ul>
          </div>
          <div class="modal-body-right">
            <div class="modal-meta-card">
              <div class="meta-item">
                <span>Client Partner</span>
                <span>${data.client}</span>
              </div>
              <div class="meta-item">
                <span>Year Released</span>
                <span>${data.year}</span>
              </div>
              <div class="meta-item">
                <span>Role / Mandate</span>
                <span>${data.role}</span>
              </div>
              <div class="meta-item">
                <span>Technology Stack</span>
                <span>${data.techStack}</span>
              </div>
            </div>
            <div class="modal-actions">
              <a href="${data.ctaLink}" class="btn-primary" id="modalCta">Initiate Briefing ✉</a>
            </div>
          </div>
        </div>
      `;

      projectModal.classList.add("active");
      projectModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      
      const modalCta = document.getElementById("modalCta");
      if (modalCta) {
        modalCta.addEventListener("click", () => {
          closeProjectModal();
        });
      }
    };

    const closeProjectModal = () => {
      projectModal.classList.remove("active");
      projectModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    portItems.forEach(item => {
      item.addEventListener("click", () => {
        const projectKey = item.getAttribute("data-project");
        if (projectKey) {
          openProjectModal(projectKey);
        }
      });
    });

    if (modalClose) {
      modalClose.addEventListener("click", closeProjectModal);
    }

    projectModal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop") || e.target === projectModal) {
        closeProjectModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && projectModal.classList.contains("active")) {
        closeProjectModal();
      }
    });
  }

  // ============================================================
  // TOAST ALERT INJECTOR
  // ============================================================
  const showToast = (message) => {
    // Check if toast element exists
    let toast = document.querySelector(".toast-notice");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast-notice";
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add("show");
    
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  };

  const navCta = document.getElementById("navCta");
  if (navCta) {
    navCta.addEventListener("click", () => {
      showToast("🚀 Nexus App Environment Initiating...");
    });
  }

  // ============================================================
  // CONTACT FORM VALIDATION & INTERACTIVE TOAST
  // ============================================================
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    const contactBtn = contactForm.querySelector(".btn-primary");
    
    if (contactBtn) {
      contactBtn.addEventListener("click", (e) => {
        const inputs = contactForm.querySelectorAll(".form-input");
        let allValid = true;
        
        inputs.forEach(input => {
          if (!input.value.trim()) {
            input.style.borderColor = "#ef4444";
            allValid = false;
          } else {
            input.style.borderColor = "";
          }
        });
        
        if (allValid) {
          e.preventDefault();
          showToast("✉ Inquiry transmitted! Connection established.");
          inputs.forEach(input => { input.value = ""; });
        } else {
          showToast("⚠ Please provide all parameters.");
        }
      });
    }
  }

  // ============================================================
  // 3D HOLOGRAM DASHBOARD CONTROLLER (HOME ONLY)
  // ============================================================
  const screen = document.getElementById("hologramScreen");
  let isManualControl = false;

  if (screen) {
    // 1. Mousemove viewport tilt
    document.addEventListener("mousemove", (e) => {
      if (isManualControl) return;

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 to 1
      const dy = (e.clientY - cy) / cy; // -1 to 1

      // Hover offsets centered around rotateX(6deg) rotateY(-10deg)
      const rx = -dy * 15 + 6;
      const ry = dx * 15 - 10;

      screen.style.setProperty("--rx", `${rx}deg`);
      screen.style.setProperty("--ry", `${ry}deg`);
    });

    // 2. Manual Sliders Adjustments
    const sliderX = document.getElementById("sliderX");
    const sliderY = document.getElementById("sliderY");
    const sliderZ = document.getElementById("sliderZ");
    const sliderP = document.getElementById("sliderP");

    const valX = document.getElementById("valX");
    const valY = document.getElementById("valY");
    const valZ = document.getElementById("valZ");
    const valP = document.getElementById("valP");

    const btnAuto = document.getElementById("btnAuto");
    const btnManual = document.getElementById("btnManual");

    const updateFromSliders = () => {
      isManualControl = true;
      if (btnAuto) btnAuto.classList.remove("active");
      if (btnManual) btnManual.classList.add("active");

      const rx = sliderX.value;
      const ry = sliderY.value;
      const rz = sliderZ.value;
      const p = sliderP.value;

      screen.style.setProperty("--rx", `${rx}deg`);
      screen.style.setProperty("--ry", `${ry}deg`);
      screen.style.setProperty("--rz", `${rz}deg`);
      screen.style.setProperty("--p", `${p}px`);

      if (valX) valX.textContent = `${rx}°`;
      if (valY) valY.textContent = `${ry}°`;
      if (valZ) valZ.textContent = `${rz}°`;
      if (valP) valP.textContent = `${p}px`;
    };

    [sliderX, sliderY, sliderZ, sliderP].forEach(slider => {
      if (slider) {
        slider.addEventListener("input", updateFromSliders);
      }
    });

    // 3. Grid Toggle
    const btnGrid = document.getElementById("btnGrid");
    if (btnGrid) {
      btnGrid.addEventListener("click", () => {
        const active = document.body.classList.toggle("grid-active");
        btnGrid.classList.toggle("active", active);
        showToast(active ? "✓ Cyber-Grid Overlays Enabled" : "✗ Cyber-Grid Overlays Disabled");
      });
    }

    // 4. Auto / Manual Mode Switches
    if (btnAuto && btnManual) {
      btnAuto.addEventListener("click", () => {
        isManualControl = false;
        btnAuto.classList.add("active");
        btnManual.classList.remove("active");
        showToast("✓ Gyro Auto-Tilt Enabled");
      });

      btnManual.addEventListener("click", () => {
        isManualControl = true;
        btnAuto.classList.remove("active");
        btnManual.classList.add("active");
        showToast("✓ Sliders Mode Locked");
        updateFromSliders();
      });
    }

    // 5. Neon Theme Switcher
    const themeDots = document.querySelectorAll(".theme-dot");
    themeDots.forEach(dot => {
      dot.addEventListener("click", () => {
        themeDots.forEach(d => d.classList.remove("selected"));
        dot.classList.add("selected");

        const theme = dot.getAttribute("data-theme");
        document.body.classList.remove("theme-cyan", "theme-green", "theme-purple", "theme-pink");
        document.body.classList.add(`theme-${theme}`);
        showToast(`✓ Active theme updated: ${theme.toUpperCase()}`);
      });
    });

    // 6. Simulated Diagnostic Terminal Log Stream
    const terminal = document.getElementById("terminalWindow");
    if (terminal) {
      const logs = [
        "Initializing neural handshake protocols...",
        "Establishing connection tunnels over SSL-V3...",
        "Resolving server nodes: Matrix operational.",
        "Verifying structural matrix density indices...",
        "System telemetry synced with 3D viewport matrix.",
        "Compiling local context configurations...",
        "Bandwidth rate stabilized at 92.4 Gb/s.",
        "Active cores status: 16/16. Heat stabilized.",
        "Decrypting diagnostic stream payload logs...",
        "Secure connection verified with port 8042.",
        "Memory buffers cleaned. Thread sync stable."
      ];

      let logIndex = 0;
      const getFormattedTime = () => {
        const d = new Date();
        return d.toTimeString().split(' ')[0];
      };

      const addTerminalLine = () => {
        const line = document.createElement("div");
        line.className = "terminal-line";

        const prefix = document.createElement("span");
        prefix.className = "terminal-prefix";
        prefix.textContent = `[${getFormattedTime()}]`;

        line.appendChild(prefix);
        line.appendChild(document.createTextNode(` ${logs[logIndex]}`));

        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;

        logIndex = (logIndex + 1) % logs.length;
      };

      // Add first lines
      for (let i = 0; i < 3; i++) {
        addTerminalLine();
      }

      // Interval stream
      setInterval(addTerminalLine, 2200);
    }
  }

});
