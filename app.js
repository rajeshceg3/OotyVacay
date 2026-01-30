document.addEventListener('DOMContentLoaded', function () {
    // --- State ---
    let itinerary = [];
    let routingControl = null;
    let lastFocusedElement = null;

    // --- Data ---
    const locations = [
        { id: 'botanical_gardens', lat: 11.4155, lng: 76.7118, title: 'Botanical Gardens', description: 'Sprawling gardens with a vast collection of flora.', image: 'https://placehold.co/400x300/A8D5BA/FFFFFF?text=Gardens', type: 'garden', emoji: '🌳', bestTime: 'Mar-May', timeSpent: '2-3 hours' },
        { id: 'ooty_lake', lat: 11.4087, lng: 76.6917, title: 'Ooty Lake', description: 'An artificial lake with popular boating facilities.', image: 'https://placehold.co/400x300/87CEEB/FFFFFF?text=Ooty+Lake', type: 'lake', emoji: '🛶', bestTime: 'All Year', timeSpent: '1-2 hours' },
        { id: 'doddabetta_peak', lat: 11.4002, lng: 76.7350, title: 'Doddabetta Peak', description: 'The highest point in the Nilgiris with a telescope house.', image: 'https://placehold.co/400x300/C2B280/FFFFFF?text=Doddabetta', type: 'viewpoint', emoji: '⛰️', bestTime: 'Sep-Nov', timeSpent: '1 hour' },
        { id: 'rose_garden', lat: 11.4111, lng: 76.7175, title: 'Rose Garden', description: 'Home to one of the largest collections of roses in India.', image: 'https://placehold.co/400x300/FFC0CB/FFFFFF?text=Rose+Garden', type: 'garden', emoji: '🌹', bestTime: 'Apr-Jun', timeSpent: '1-2 hours' },
        { id: 'tea_factory', lat: 11.4131, lng: 76.7303, title: 'Tea Factory & Museum', description: 'Learn about tea processing and taste fresh Nilgiri tea.', image: 'https://placehold.co/400x300/967969/FFFFFF?text=Tea+Factory', type: 'factory', emoji: '🍵', bestTime: 'Oct-Mar', timeSpent: '1 hour' },
        { id: 'pykara_lake', lat: 11.4556, lng: 76.6083, title: 'Pykara Lake', description: 'A serene lake and waterfall, ideal for picnics.', image: 'https://placehold.co/400x300/B0E0E6/FFFFFF?text=Pykara', type: 'lake', emoji: '🏞️', bestTime: 'Aug-Oct', timeSpent: '2-3 hours' },
        { id: 'avalanche_lake', lat: 11.3325, lng: 76.6267, title: 'Avalanche Lake', description: 'A beautiful lake surrounded by a rolling landscape.', image: 'https://placehold.co/400x300/ADD8E6/FFFFFF?text=Avalanche', type: 'lake', emoji: '🏞️', bestTime: 'Sep-Mar', timeSpent: '3-4 hours' },
        { id: 'st_stephens', lat: 11.4147, lng: 76.7029, title: 'St. Stephen\'s Church', description: 'A colonial-era church with stunning architecture.', image: 'https://placehold.co/400x300/D2B48C/FFFFFF?text=Church', type: 'historical', emoji: '⛪', bestTime: 'All Year', timeSpent: '30 mins' },
        { id: 'mountain_railway', lat: 11.4098, lng: 76.7011, title: 'Nilgiri Mountain Railway', description: 'A UNESCO World Heritage site offering scenic train rides.', image: 'https://placehold.co/400x300/A9A9A9/FFFFFF?text=Railway', type: 'historical', emoji: '🚂', bestTime: 'All Year', timeSpent: '3-4 hours' },
        { id: 'pine_forest', lat: 11.4397, lng: 76.6344, title: 'Pine Forest', description: 'A tranquil and scenic forest of pine trees.', image: 'https://placehold.co/400x300/228B22/FFFFFF?text=Pine+Forest', type: 'viewpoint', emoji: '🌲', bestTime: 'Oct-Mar', timeSpent: '1-2 hours' }
    ];


    // --- Map Initialization ---
    const map = L.map('map', { center: [11.41, 76.70], zoom: 13, zoomControl: false });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: '© <a href="https://carto.com/attributions">CARTO</a>' }).addTo(map);

    // --- Icons ---
    const iconColor = "#059669"; // Emerald 600
    const icons = {
        'viewpoint': `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L2 21h20L12 3zM8.5 14l2.5 3 3-4.5 2.5 3.5"/></svg>`,
        'historical': `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
        'garden': `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.9 10.9c-1.3 3.3-3.3 6.6-6.4 9.3-2.3 2-4.8 3.3-7.5 3.8-1.1.2-2.2-.4-2.7-1.4s-.2-2.3.6-3.1c.9-.9 2.1-1.5 3.4-1.9 2.2-.7 4.5-2 6.5-3.8 2.2-2 4-4.5 5.2-7.4.4-1 .1-2.2-.8-2.8-.9-.6-2.1-.4-2.8.5-1.1 1.4-2.4 3.1-3.7 4.8m-2.1-2.1c-.2.2-.4.4-.6.6"></path></svg>`,
        'factory': `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
        'lake': `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h2l2-6 2 12 2-8 2 8 2-6 2 2h2"/></svg>`
    };

    const locationListEl = document.getElementById('location-list');
    const itineraryListEl = document.getElementById('itinerary-list');
    const itineraryEmptyEl = document.getElementById('itinerary-empty');
    const clearItineraryBtn = document.getElementById('clear-itinerary-btn');
    const toggleRouteBtn = document.getElementById('toggle-route-btn');
    const filterContainer = document.getElementById('filter-container');
    const markers = {};

    // --- Core Functions ---
    const escapeHTML = (str) => {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, (match) => {
            const escape = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return escape[match];
        });
    };

    const renderItinerary = () => {
        const existingIds = Array.from(itineraryListEl.children).map(item => item.dataset.id);
        const countBadge = document.getElementById('itinerary-count');
        const mobileFabCount = document.getElementById('mobile-fab-count');

        // Update Count
        if (itinerary.length > 0) {
            countBadge.textContent = itinerary.length;
            countBadge.classList.remove('hidden');
            if(mobileFabCount) {
                mobileFabCount.textContent = itinerary.length;
                mobileFabCount.classList.remove('hidden');
            }
        } else {
            countBadge.classList.add('hidden');
            if(mobileFabCount) mobileFabCount.classList.add('hidden');
        }

        // Add new items
        itinerary.forEach(locationId => {
            if (!existingIds.includes(locationId)) {
                const location = locations.find(l => l.id === locationId);
                const item = document.createElement('div');
                item.className = 'itinerary-item flex items-center justify-between p-3 rounded-lg adding group';
                item.dataset.id = location.id;
                item.innerHTML = `
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-lg">${location.emoji}</div>
                        <span class="font-medium text-sm text-gray-800 line-clamp-1">${escapeHTML(location.title)}</span>
                    </div>
                    <button type="button" class="remove-btn p-1.5 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" data-id="${location.id}" aria-label="Remove ${location.title} from trip">
                        <i data-feather="x" class="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors"></i>
                    </button>
                `;
                itineraryListEl.appendChild(item);
                // Trigger reflow
                item.offsetHeight;
                setTimeout(() => item.classList.remove('adding'), 500);
            }
        });

        // Remove items that are no longer in the itinerary
        Array.from(itineraryListEl.children).forEach(item => {
            if (!itinerary.includes(item.dataset.id)) {
                item.classList.add('removing');
                setTimeout(() => item.remove(), 300);
            }
        });


        // Update visibility
        itineraryEmptyEl.style.display = itinerary.length === 0 ? 'block' : 'none';
        clearItineraryBtn.style.display = itinerary.length === 0 ? 'none' : 'block';
        // Always show Show Route button (or let it be visible but handle validation on click) to allow feedback
        toggleRouteBtn.style.display = 'block';

        updateButtonStates();
        feather.replace();
    };

    const updateButtonStates = () => {
        document.querySelectorAll('[data-add-id]').forEach(btn => {
            const id = btn.dataset.addId;
            const isAdded = itinerary.includes(id);

            if (btn.classList.contains('add-to-trip-btn')) {
                    // Modal/Popup Button
                btn.textContent = isAdded ? 'Added to Trip' : 'Add to Trip';
                if (isAdded) {
                    btn.classList.add('bg-green-600', 'text-white');
                    btn.classList.remove('bg-gray-900');
                } else {
                    btn.classList.remove('bg-green-600');
                    btn.classList.add('bg-gray-900', 'text-white');
                }
                btn.disabled = isAdded;
            } else if (btn.classList.contains('add-sidebar-btn')) {
                // Sidebar Icon Button
                const icon = isAdded ? 'check' : 'plus';
                const bgClass = isAdded ? 'bg-green-100 text-green-700' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100';

                btn.className = `add-sidebar-btn flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all ${bgClass}`;
                btn.innerHTML = `<i data-feather="${icon}" class="w-4 h-4"></i>`;
            }
        });
        feather.replace();
    };

    const saveItinerary = () => {
        localStorage.setItem('tripItinerary', JSON.stringify(itinerary));
    };

    const loadItinerary = () => {
        const savedItinerary = localStorage.getItem('tripItinerary');
        if (savedItinerary) {
            itinerary = JSON.parse(savedItinerary);
        }
    };

    const showToast = (message, icon = 'check-circle') => {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `<i data-feather="${icon}" class="w-4 h-4 text-green-400"></i> ${message}`;
        document.body.appendChild(toast);
        feather.replace();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, 20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    const animateFlyTo = (startEl, targetEl, callback) => {
        if (!startEl || !targetEl) { if (callback) callback(); return; }
        const startRect = startEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        if (targetRect.width === 0 || targetRect.height === 0) { if (callback) callback(); return; }

        // Wrapper for X-axis motion (Linear)
        const wrapper = document.createElement('div');
        Object.assign(wrapper.style, {
            position: 'fixed', zIndex: '9999', pointerEvents: 'none',
            left: '0', top: '0',
            transform: `translate(${startRect.left + startRect.width/2}px, ${startRect.top + startRect.height/2}px)`,
            transition: 'transform 0.7s linear' // Linear X for parabolic arc
        });

        // Inner for Y-axis motion (Quadratic)
        const inner = document.createElement('div');
        Object.assign(inner.style, {
            width: '24px', height: '24px', borderRadius: '50%',
            background: 'var(--accent-primary)', border: '3px solid white',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            transform: 'translate(-50%, -50%)',
            transition: 'transform 0.7s cubic-bezier(0.55, 0.085, 0.68, 0.53)' // Quadratic-ish
        });

        wrapper.appendChild(inner);
        document.body.appendChild(wrapper);

        // Trigger layout
        wrapper.getBoundingClientRect();

        // Calculate deltas
        const deltaX = (targetRect.left + targetRect.width/2) - (startRect.left + startRect.width/2);
        const deltaY = (targetRect.top + targetRect.height/2) - (startRect.top + startRect.height/2);

        wrapper.style.transform = `translate(${startRect.left + startRect.width/2 + deltaX}px, ${startRect.top + startRect.height/2}px)`;
        inner.style.transform = `translate(-50%, calc(-50% + ${deltaY}px)) scale(0.2)`;

        setTimeout(() => {
            wrapper.remove();
            // Add bump animation to target
            targetEl.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.35)' },
                { transform: 'scale(0.95)' },
                { transform: 'scale(1)' }
            ], { duration: 450, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
            if (callback) callback();
        }, 800);
    };

    const pulseHaptic = () => {
        if (navigator.vibrate) navigator.vibrate(10);
    };

    const addToItinerary = (id, startEl = null) => {
        if (!itinerary.includes(id)) {
            pulseHaptic();
            itinerary.push(id);
            renderItinerary();
            saveItinerary();
            const location = locations.find(l => l.id === id);
            showToast(`Added ${location.title} to your trip`);

            // Fly Animation
            if (startEl) {
                let targetEl;
                if (window.innerWidth <= 768) {
                    targetEl = document.getElementById('mobile-trip-fab');
                } else {
                        targetEl = document.getElementById('itinerary-count');
                        if (!targetEl || targetEl.offsetParent === null) {
                            // If badge hidden, target the header text or icon
                            targetEl = document.querySelector('#toggle-itinerary-mobile i');
                        }
                }
                animateFlyTo(startEl, targetEl);
            }
        }
    };

    const removeFromItinerary = (id) => {
        const item = itineraryListEl.querySelector(`[data-id="${id}"]`);
        if (item) {
            item.classList.add('removing');
            setTimeout(() => {
                itinerary = itinerary.filter(itemId => itemId !== id);
                item.remove();
                renderItinerary();
                saveItinerary();
            }, 300);
        }
    };

    const toggleItinerary = (id, startEl = null) => {
        if (itinerary.includes(id)) {
            pulseHaptic();
            removeFromItinerary(id);
            const location = locations.find(l => l.id === id);
            showToast(`Removed ${location.title} from trip`, 'minus-circle');
        } else {
            addToItinerary(id, startEl);
        }
    };

    const filterLocations = (type) => {
        locations.forEach(loc => {
            const locationItem = document.querySelector(`.location-item[data-id="${loc.id}"]`);
            const marker = markers[loc.id];
            const show = (type === 'all' || loc.type === type);

            if (locationItem) {
                    if (show) {
                    locationItem.style.display = 'flex';
                    setTimeout(() => locationItem.classList.add('fade-in'), 10);
                    } else {
                    locationItem.style.display = 'none';
                    locationItem.classList.remove('fade-in');
                    }
            }
            if (marker) {
                if (show) {
                    if (!map.hasLayer(marker)) map.addLayer(marker);
                } else {
                    if (map.hasLayer(marker)) map.removeLayer(marker);
                }
            }
        });

        // Update active button style
        document.querySelectorAll('.filter-btn').forEach(btn => {
            const isActive = btn.dataset.filter === type;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);

            // Reset inline styles to let CSS classes handle it
            btn.style.backgroundColor = '';
            btn.style.color = '';
        });
    };

    // --- Event Listeners ---
    // Filter Pill Logic
    const filterPill = document.getElementById('filter-pill');
    const updateFilterPill = () => {
        const activeBtn = document.querySelector('.filter-btn.active');
        if (activeBtn && filterPill) {
            const containerRect = filterContainer.getBoundingClientRect();
            const btnRect = activeBtn.getBoundingClientRect();

            filterPill.style.width = `${btnRect.width}px`;
            filterPill.style.height = `${btnRect.height}px`;
            // Calculate relative left/top based on container scroll/position
            filterPill.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
            filterPill.style.opacity = '1';
        }
    };

    // Initialize Pill
    // Wait a tick for layout
    setTimeout(updateFilterPill, 100);
    window.addEventListener('resize', updateFilterPill);

    filterContainer.addEventListener('click', (e) => {
        const filterButton = e.target.closest('.filter-btn');
        if (filterButton) {
            filterLocations(filterButton.dataset.filter);
            // Update Pill
            setTimeout(updateFilterPill, 0); // Next tick after active class toggle
        }
    });

    // Magnetic Button Logic (Desktop Only)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const initMagneticButtons = () => {
            const magneticBtns = document.querySelectorAll('.add-sidebar-btn:not([data-magnetic-init]), .filter-btn:not([data-magnetic-init])');
            magneticBtns.forEach(btn => {
                btn.setAttribute('data-magnetic-init', 'true');
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    // Magnetic strength - Tuned for subtlety
                    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = '';
                });
            });
        };

        // Init on load
        initMagneticButtons();

        // Re-init when DOM changes (renderItinerary/locations) involves adding buttons
        const observer = new MutationObserver((mutations) => {
            // optimization: check if any addedNodes
            let hasNodes = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    hasNodes = true;
                    break;
                }
            }
            if (hasNodes) initMagneticButtons();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    clearItineraryBtn.addEventListener('click', () => {
        itinerary = [];
        // itineraryListEl.innerHTML = ''; // Clear visually immediately - handled by renderItinerary
        renderItinerary();
        saveItinerary();
        if (routingControl) {
            map.removeControl(routingControl);
            routingControl = null;
            toggleRouteBtn.textContent = 'Show Route';
        }
    });

    itineraryListEl.addEventListener('click', (e) => {
        const removeButton = e.target.closest('.remove-btn');
        if (removeButton) {
            removeFromItinerary(removeButton.dataset.id);
                if (routingControl) { // Also remove from route if shown
                map.removeControl(routingControl);
                routingControl = null;
                toggleRouteBtn.textContent = 'Show Route';
            }
        }
    });

    toggleRouteBtn.addEventListener('click', () => {
        if (routingControl) {
            map.removeControl(routingControl);
            routingControl = null;
            toggleRouteBtn.textContent = 'Show Route';
        } else {
            const waypoints = itinerary.map(id => {
                const location = locations.find(l => l.id === id);
                return L.latLng(location.lat, location.lng);
            });

            // Only show route if there are at least two waypoints
            if (waypoints.length >= 2) {
                routingControl = L.Routing.control({
                    waypoints: waypoints,
                    routeWhileDragging: true,
                    show: false // Hide instructions by default
                }).addTo(map);
                toggleRouteBtn.textContent = 'Hide Route';
            } else {
                // Optionally, provide feedback to the user that more locations are needed
                showToast("Add at least two locations to show a route", "alert-circle");
            }
        }
    });

    const modal = document.getElementById('location-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.modal-close-btn');

    const openModal = (location) => {
        lastFocusedElement = document.activeElement;
        modalBody.innerHTML = ''; // Clear previous content
        modalBody.appendChild(createModalContent(location));
        modal.classList.add('show');
        feather.replace();
        updateButtonStates(); // Ensure modal button state is correct

        // Trap focus handling
        setTimeout(() => {
             const firstBtn = modal.querySelector('.modal-close-btn');
             if(firstBtn) firstBtn.focus();
        }, 100);
    };

    const createModalContent = (location) => {
        const isAdded = itinerary.includes(location.id);
        const content = document.createElement('div');
        content.className = 'flex flex-col h-full';
        content.innerHTML = `
            <div class="relative h-72 w-full modal-stagger group flex-shrink-0">
                <img src="${escapeHTML(location.image)}" alt="${escapeHTML(location.title)}" decoding="async" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" onerror="this.onerror=null; this.src='https://placehold.co/600x400?text=Image+Unavailable';">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent"></div>
                <div class="absolute bottom-6 left-8 right-6 text-left">
                    <div class="emoji-icon text-5xl mb-4 drop-shadow-xl origin-left inline-block">${location.emoji}</div>
                    <h2 id="modal-title" class="text-3xl font-bold font-serif text-white leading-tight drop-shadow-md tracking-tight">${escapeHTML(location.title)}</h2>
                </div>
            </div>

            <div class="p-8 pt-6 space-y-8 flex-grow overflow-y-auto">
                <div class="modal-stagger" style="transition-delay: 0.2s">
                        <p class="text-lg text-stone-600 leading-relaxed font-light text-left">${escapeHTML(location.description)}</p>
                </div>

                <div class="grid grid-cols-2 gap-4 text-left modal-stagger" style="transition-delay: 0.3s">
                    <div class="info-card p-4 rounded-2xl flex flex-col gap-1">
                        <div class="flex items-center gap-2 text-stone-500 mb-1">
                            <i data-feather="calendar" class="w-4 h-4"></i>
                            <h4 class="font-bold text-xs uppercase tracking-wider">Best Time</h4>
                        </div>
                        <p class="text-stone-800 font-semibold text-sm">${escapeHTML(location.bestTime)}</p>
                    </div>
                    <div class="info-card p-4 rounded-2xl flex flex-col gap-1">
                        <div class="flex items-center gap-2 text-stone-500 mb-1">
                            <i data-feather="clock" class="w-4 h-4"></i>
                            <h4 class="font-bold text-xs uppercase tracking-wider">Time Spent</h4>
                        </div>
                        <p class="text-stone-800 font-semibold text-sm">${escapeHTML(location.timeSpent)}</p>
                    </div>
                </div>

                <div class="modal-stagger pb-2" style="transition-delay: 0.4s">
                    <button type="button" class="modal-add-btn add-to-trip-btn w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform transition-all flex items-center justify-center gap-3 ${isAdded ? 'bg-emerald-600 text-white' : 'bg-stone-900 text-white hover:-translate-y-1'}" data-add-id="${location.id}" ${isAdded ? 'disabled' : ''}>
                        ${isAdded ? '<span>Added to Trip</span> <i data-feather="check" class="w-5 h-5"></i>' : '<span>Add to Trip</span> <i data-feather="plus" class="w-5 h-5"></i>'}
                    </button>
                </div>
            </div>
        `;

        content.querySelector('.add-to-trip-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            addToItinerary(location.id, e.currentTarget);
        });

        return content;
    };

    const closeModal = () => {
        modal.classList.remove('show');
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    };

    map.on('popupopen', (e) => {
        const popupElement = e.popup.getElement();
        const moreInfoBtn = popupElement.querySelector('.more-info-btn');
        if (moreInfoBtn) {
            moreInfoBtn.addEventListener('click', () => {
                const locationId = moreInfoBtn.dataset.id;
                const location = locations.find(l => l.id === locationId);
                openModal(location);
            });
        }
        const addToTripBtn = popupElement.querySelector('.add-to-trip-btn');
            if (addToTripBtn) {
            addToTripBtn.addEventListener('click', (e) => {
                addToItinerary(addToTripBtn.dataset.addId, e.currentTarget);
            });
        }
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    const handleModalKeydown = (e) => {
        if (!modal.classList.contains('show')) return;

        if (e.key === 'Escape') {
            closeModal();
        }

        if (e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    };
    document.addEventListener('keydown', handleModalKeydown);


    // --- Initial Population ---
    locations.forEach((loc, index) => {
        // Add to sidebar
        const item = document.createElement('div');
        item.className = 'location-item p-4 cursor-pointer fade-in flex gap-5 items-start group';
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View details for ${loc.title}`);
        item.dataset.id = loc.id;
        item.style.animationDelay = `${index * 50}ms`;
        item.innerHTML = `
            <div class="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-500 bg-stone-200 skeleton-shimmer">
                <img src="${escapeHTML(loc.image)}" alt="${escapeHTML(loc.title)}" loading="lazy" decoding="async" class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-0" onload="this.classList.remove('opacity-0'); this.parentElement.classList.remove('skeleton-shimmer');" onerror="this.onerror=null; this.src='https://placehold.co/600x400?text=Image+Unavailable'; this.classList.remove('opacity-0'); this.parentElement.classList.remove('skeleton-shimmer');">
                <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
            </div>
            <div class="flex-grow min-w-0 flex flex-col h-28 justify-between py-0.5">
                <div>
                    <div class="flex justify-between items-start mb-1 gap-2">
                        <h3 class="font-bold text-gray-900 text-lg font-serif leading-tight group-hover:text-emerald-800 transition-colors line-clamp-1">${escapeHTML(loc.title)}</h3>
                        <button type="button" class="add-sidebar-btn flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-all" data-add-id="${loc.id}" aria-label="Add to Trip"></button>
                    </div>
                    <p class="text-sm text-stone-600 line-clamp-2 leading-relaxed font-normal tracking-wide">${escapeHTML(loc.description)}</p>
                </div>

                <div class="flex items-center justify-between mt-auto">
                        <div class="flex gap-2 items-center">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 tracking-wide uppercase border border-stone-200">
                            ${escapeHTML(loc.timeSpent)}
                        </span>
                        </div>
                        <span class="opacity-0 group-hover:opacity-100 transition-all duration-300 text-emerald-600 translate-x-[-10px] group-hover:translate-x-0 flex items-center gap-1 text-xs font-medium">
                        View <i data-feather="arrow-right" class="w-3 h-3"></i>
                        </span>
                </div>
            </div>
        `;

        const handleItemClick = (e) => {
            if (!e.target.closest('.add-sidebar-btn')) {
                let targetLat = loc.lat;
                let targetLng = loc.lng;
                let targetZoom = 15;

                // Smart Map Centering for Mobile
                // Ensures the location is centered in the visible area above the bottom sheet
                if (window.innerWidth <= 768) {
                    const mapHeight = map.getSize().y;
                    // Sheet takes ~40% in half state. Visible area is top 60%.
                    // Center of visible area is 30%. Map center is 50%.
                    // Shift needed: Center is 30% from top (visible area). Map center is 50%.
                    // Shift down by 20%.
                    const offset = mapHeight * 0.20;

                    const point = map.project([loc.lat, loc.lng], targetZoom);
                    const targetPoint = point.add([0, offset]);
                    const targetLatLng = map.unproject(targetPoint, targetZoom);

                    targetLat = targetLatLng.lat;
                    targetLng = targetLatLng.lng;
                }

                map.flyTo([targetLat, targetLng], targetZoom, { duration: 1.5, easeLinearity: 0.25 });

                // Delay popup slightly to allow animation to start
                setTimeout(() => {
                    markers[loc.id].openPopup();
                }, 500);
            }
        };

        // Click on the item card (excluding the button) flies to map
        item.addEventListener('click', handleItemClick);
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleItemClick(e);
            }
        });

        item.querySelector('.add-sidebar-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleItinerary(loc.id, e.currentTarget);
        });
        locationListEl.appendChild(item);

        // Add marker to map
        // Initial state: scaled down
        const markerHtml = `
            <div class="custom-marker-container group">
                    <div class="marker-circle bg-white text-emerald-700 rounded-full p-2 shadow-xl border-2 border-white flex items-center justify-center transform transition-all duration-500 var(--ease-elastic) group-hover:scale-110 group-hover:-translate-y-2 group-hover:bg-emerald-700 group-hover:text-white group-hover:border-emerald-800" style="transform: scale(0) translateY(20px); opacity: 0;">
                    ${icons[loc.type] || icons['historical']}
                </div>
            </div>
        `;
        const customIcon = L.divIcon({ html: markerHtml, className: '', iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -28] });
        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);

        // Animate In Staggered
        setTimeout(() => {
            const iconEl = marker.getElement();
            if (iconEl) {
                const circle = iconEl.querySelector('.marker-circle');
                if (circle) {
                    circle.style.transform = ''; // Clear inline transform to let CSS take over (or set scale(1))
                    circle.style.opacity = '1';
                }
            }
        }, 200 + (index * 100)); // Base delay + stagger

        // Bi-directional Hover Highlighting
        // 1. List Item -> Map Marker
        item.addEventListener('mouseenter', () => {
                const iconEl = marker.getElement();
                if (iconEl) {
                    const container = iconEl.querySelector('.custom-marker-container');
                    if(container) container.classList.add('marker-highlight');
                    // Bring to front
                    marker.setZIndexOffset(1000);
                }
        });
        item.addEventListener('mouseleave', () => {
            const iconEl = marker.getElement();
            if (iconEl) {
                const container = iconEl.querySelector('.custom-marker-container');
                    if(container) container.classList.remove('marker-highlight');
                marker.setZIndexOffset(0);
            }
        });

        // 2. Map Marker -> List Item
        marker.on('mouseover', () => {
            item.classList.add('highlight-from-map');
            // Optional: auto scroll if far away? No, might be annoying.
        });
        marker.on('mouseout', () => {
            item.classList.remove('highlight-from-map');
        });


        marker.bindPopup(L.popup({closeButton: false, className: 'modern-popup'}).setContent(`
            <div class="group">
                <div class="relative h-40 overflow-hidden">
                    <img src="${escapeHTML(loc.image)}" alt="${escapeHTML(loc.title)}" decoding="async" class="popup-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border border-white/50">
                        ${loc.emoji}
                    </div>
                    <div class="absolute bottom-3 left-4 right-4">
                        <h3 class="popup-title text-xl font-serif text-white leading-tight drop-shadow-sm">${escapeHTML(loc.title)}</h3>
                    </div>
                </div>
                <div class="p-5 bg-white">
                    <p class="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed font-light">${escapeHTML(loc.description)}</p>
                    <div class="flex gap-3">
                        <button type="button" class="add-to-trip-btn flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5" data-add-id="${loc.id}">Add to Trip</button>
                        <button type="button" class="more-info-btn py-2.5 px-4 rounded-xl font-semibold text-xs bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all" data-id="${loc.id}">Details</button>
                    </div>
                </div>
            </div>
        `));

        marker.on('click', () => {
            document.querySelectorAll('.location-item').forEach(el => {
                el.classList.remove('active');
                if (el.dataset.id === loc.id) {
                    el.classList.add('active');
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });

        marker.getPopup().on('add', () => {
            updateButtonStates();
        });

        markers[loc.id] = marker;
    });

    // --- Mobile Itinerary Logic ---
    const itineraryPanel = document.getElementById('itinerary-panel');
    const mobileFab = document.getElementById('mobile-trip-fab');
    const mobileBackdrop = document.getElementById('mobile-backdrop');
    const mobilePanelClose = document.getElementById('mobile-panel-close');

    const toggleMobileItinerary = (show) => {
        if (show) {
            itineraryPanel.classList.add('open');
            mobileBackdrop.classList.add('open');
            if (mobileFab) mobileFab.classList.add('hidden-fab');
        } else {
            itineraryPanel.classList.remove('open');
            mobileBackdrop.classList.remove('open');
            if (mobileFab) mobileFab.classList.remove('hidden-fab');
        }
    };

    if (mobileFab) {
        mobileFab.addEventListener('click', () => toggleMobileItinerary(true));
    }
    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', () => toggleMobileItinerary(false));
    }
    if (mobilePanelClose) {
        mobilePanelClose.addEventListener('click', () => toggleMobileItinerary(false));
    }

    // --- Load, Render, and Init ---
    loadItinerary();
    renderItinerary();
    feather.replace();

    // --- Mobile Bottom Sheet Logic ---
    const initMobileSheet = () => {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const header = sidebar.firstElementChild;
        let startY = 0;
        let currentY = 0;
        let startTime = 0;
        let isDragging = false;
        let currentSheetState = 'half'; // 'half' or 'full'

        // Constants
        const getSheetHeight = () => window.innerHeight * 0.85; // 85vh
        const getHalfHeight = () => window.innerHeight * 0.40; // 40vh

        const calculateTransform = (visibleHeight) => {
            const sheetHeight = getSheetHeight();
            return sheetHeight - visibleHeight;
        };

        const updateSheetPosition = (y) => {
            sidebar.style.transform = `translateY(${y}px)`;
        };

        const snapToState = (state) => {
            const sheetHeight = getSheetHeight();
            const halfHeight = getHalfHeight();

            let targetY;
            if (state === 'full') {
                targetY = 0;
            } else { // half
                targetY = calculateTransform(halfHeight);
            }

            // Haptic feedback on snap
            if (currentSheetState !== state) pulseHaptic();

            sidebar.classList.remove('dragging');
            updateSheetPosition(targetY);
            currentSheetState = state;

            // Update toggle icon
            if (sidebarToggle) {
                const icon = sidebarToggle.querySelector('i');
                sidebarToggle.setAttribute('aria-expanded', state === 'full');
                if (state === 'full') {
                    icon.style.transform = 'rotate(180deg)';
                    sidebarToggle.setAttribute('aria-label', 'Collapse sidebar');
                } else {
                    icon.style.transform = 'rotate(0deg)';
                    sidebarToggle.setAttribute('aria-label', 'Expand sidebar');
                }
            }
        };

        // Initialize
        if (window.innerWidth <= 768) {
            snapToState('half');
        }

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                if (currentSheetState === 'half') {
                    snapToState('full');
                } else {
                    snapToState('half');
                }
            });
        }

        header.addEventListener('touchstart', (e) => {
            if (window.innerWidth > 768) return;
            // Only drag if at top of scroll or dragging header
            const scrollContainer = document.getElementById('location-list');
            if (scrollContainer.scrollTop > 0 && !header.contains(e.target)) return;

            isDragging = true;
            startY = e.touches[0].clientY;
            startTime = Date.now();

            // Get current transform value
            const style = window.getComputedStyle(sidebar);
            const matrix = new DOMMatrix(style.transform);
            currentY = matrix.m42;

            sidebar.classList.add('dragging');
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const deltaY = e.touches[0].clientY - startY;
            let newY = currentY + deltaY;

            // Constraints
            const sheetHeight = getSheetHeight();
            const halfHeight = getHalfHeight();
            const minTransform = 0; // Fully expanded
            const maxTransform = calculateTransform(halfHeight); // Half state

            // Resistance at bounds (Stiffer rubber band - iOS feel)
            // Logarithmic decay for resistance
            if (newY < minTransform) {
                    const overscroll = minTransform - newY;
                    newY = minTransform - (10 * Math.log(overscroll + 1));
            }
            if (newY > maxTransform) {
                const overscroll = newY - maxTransform;
                newY = maxTransform + (10 * Math.log(overscroll + 1));
            }

            updateSheetPosition(newY);
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const movedY = e.changedTouches[0].clientY - startY;
            const dt = Date.now() - startTime;
            const velocity = Math.abs(movedY / dt); // px/ms

            const sheetHeight = getSheetHeight();
            const halfHeight = getHalfHeight();
            const threshold = 40; // Even lower threshold for very snappy feel
            const velocityThreshold = 0.2; // Highly sensitive flick

            // Logic to determine snap
            // dragging UP (negative delta) -> wants Full
            // dragging DOWN (positive delta) -> wants Half

            if (currentSheetState === 'half') {
                if (movedY < -threshold || (movedY < -5 && velocity > velocityThreshold)) {
                    snapToState('full');
                } else {
                    snapToState('half');
                }
            } else { // full
                if (movedY > threshold || (movedY > 5 && velocity > velocityThreshold)) {
                    snapToState('half');
                } else {
                    snapToState('full');
                }
            }
        });

        // Handle Resize
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                    snapToState(currentSheetState);
            } else {
                sidebar.style.transform = '';
            }
        });
    };

    initMobileSheet();
});
