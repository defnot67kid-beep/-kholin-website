document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Active State
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 2. "View Changes" Button
    document.querySelector('.btn-view-changes').addEventListener('click', () => {
        alert('Changelog feature coming soon!');
    });

    // 3. "Show More Features" Toggle
    document.querySelectorAll('.btn-features').forEach(btn => {
        btn.addEventListener('click', function() {
            this.innerText = this.innerText === "Show More Features" ? "Show Less" : "Show More Features";
        });
    });

    // 4. Subscription Buttons
    document.querySelectorAll('.btn-subscribe').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Redirecting to subscription checkout...');
        });
    });

    // ==========================================
    // 5. THE CAROUSEL LOGIC
    // ==========================================
    
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('indicators');

    // =========================================================================
    // 🔥 EDIT YOUR IMAGE NAMES HERE! (They just need to be in the showcase/ folder)
    // =========================================================================
    const gamesData = [
        { name: "Natural Disaster", file: "natural_disaster.png" },
        { name: "Draw it!", file: "draw_it.png" },
        { name: "Work at a Pizza", file: "pizza_place.png" },
        { name: "Copyrighted...", file: "copyrighted.png" }
    ];
    // =========================================================================

    let currentIndex = 0;

    // BUILD THE CAROUSEL HTML
    function buildCarousel() {
        track.innerHTML = ''; 
        indicatorsContainer.innerHTML = ''; // Clear old dots

        gamesData.forEach((game, index) => {
            // Create List Item
            const li = document.createElement('li');
            li.className = 'carousel-slide';

            // Create Image
            const img = document.createElement('img');
            // IMPORTANT: encodeURIComponent handles spaces in filenames safely
            img.src = `showcase/${encodeURIComponent(game.file)}`;
            img.alt = game.name;
            img.draggable = false;

            // Create Text
            const p = document.createElement('p');
            p.textContent = game.name;

            li.appendChild(img);
            li.appendChild(p);
            track.appendChild(li);

            // Create Dot Indicator
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            indicatorsContainer.appendChild(dot);
        });

        updateCarousel();
    }

    // ANIMATION LOGIC
    function updateCarousel() {
        // If no images exist, stop the script
        if (gamesData.length === 0) return;

        const slideWidth = 160 + 24; // 160px width + 24px gap (1.5rem)
        const containerWidth = document.querySelector('.carousel-track-container').offsetWidth;
        
        // Calculate how many items fit on screen
        const visibleItems = Math.floor(containerWidth / slideWidth);
        const maxIndex = gamesData.length - visibleItems;

        // Clamp index so we don't go past the start or end
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        // Move the track
        const amountToMove = -(currentIndex * slideWidth);
        track.style.transform = `translateX(${amountToMove}px)`;

        // Update Dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // BUTTON EVENTS
    nextBtn.addEventListener('click', () => {
        // If we are at the end, loop back to start
        const containerWidth = document.querySelector('.carousel-track-container').offsetWidth;
        const slideWidth = 160 + 24;
        const visibleItems = Math.floor(containerWidth / slideWidth);
        const maxIndex = gamesData.length - visibleItems;

        if (currentIndex >= maxIndex) {
            currentIndex = 0; // Loop back to start
        } else {
            currentIndex++;
        }
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        const containerWidth = document.querySelector('.carousel-track-container').offsetWidth;
        const slideWidth = 160 + 24;
        const visibleItems = Math.floor(containerWidth / slideWidth);
        const maxIndex = gamesData.length - visibleItems;

        if (currentIndex <= 0) {
            currentIndex = maxIndex; // Loop to end
        } else {
            currentIndex--;
        }
        updateCarousel();
    });

    // Handle resizing the window (recalculate visible items)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateCarousel, 250);
    });

    // START THE CAROUSEL
    buildCarousel();

});