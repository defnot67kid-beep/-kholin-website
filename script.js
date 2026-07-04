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
    // 5. INFINITE DATA.TXT READER
    // ==========================================
    
    const track = document.getElementById('cleanTrack');
    const prevBtn = document.getElementById('cleanPrevBtn');
    const nextBtn = document.getElementById('cleanNextBtn');
    const indicators = document.getElementById('cleanIndicators');

    async function loadGameData() {
        try {
            const response = await fetch('showcase/DATAIMAGES/data.txt');
            const text = await response.text();
            return parseDataText(text);
        } catch (error) {
            console.warn("data.txt not found. Using auto-generation.");
            return []; 
        }
    }

    // Parse text file into array
    function parseDataText(text) {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        const games = [];
        let currentGame = null;

        for (const line of lines) {
            if (line.endsWith('.png')) {
                if (currentGame) games.push(currentGame);
                currentGame = { file: line, name: line.replace('.png', ''), description: "" };
            } else if (line.startsWith('image') && currentGame) {
                if (line.includes('.name="')) {
                    currentGame.name = line.split('.name="')[1].replace('"', '');
                } else if (line.includes('.description=')) {
                    currentGame.description = line.split('.description="')[1].replace('"', '');
                }
            }
        }
        if (currentGame) games.push(currentGame);
        return games;
    }

    let gamesData = [];
    let currentIndex = 0;

    // Build the visual carousel
    function buildCarousel(data) {
        track.innerHTML = '';
        indicators.innerHTML = '';
        gamesData = data;

        if (data.length === 0) {
            track.innerHTML = '<p style="color: #666; padding: 1rem;">Drop images into the showcase folder to see them here!</p>';
            return;
        }

        data.forEach((game, index) => {
            const div = document.createElement('div');
            div.className = 'clean-item';

            const img = document.createElement('img');
            img.src = `showcase/${encodeURIComponent(game.file)}`;
            img.alt = game.name;
            img.onerror = function() { this.src = 'https://placehold.co/160x160/333/fff?text=Image+Missing'; };

            const nameP = document.createElement('p');
            nameP.className = 'name';
            nameP.textContent = game.name;

            const descP = document.createElement('p');
            descP.className = 'desc';
            descP.textContent = game.description;

            div.appendChild(img);
            div.appendChild(nameP);
            div.appendChild(descP);
            track.appendChild(div);

            // Infinite Dots
            const dot = document.createElement('div');
            dot.className = 'clean-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = index;
                scrollToIndex();
            });
            indicators.appendChild(dot);
        });

        updateArrows();
    }

    // Scroll smoothly
    function scrollToIndex() {
        if(gamesData.length === 0) return;
        const itemWidth = 160 + 19.2; 
        const target = Math.min(currentIndex, gamesData.length - 1);
        track.scrollTo({ left: target * itemWidth, behavior: 'smooth' });
        updateDots();
        updateArrows();
    }

    function updateDots() {
        document.querySelectorAll('.clean-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function updateArrows() {
        const maxScroll = track.scrollWidth - track.clientWidth;
        prevBtn.style.opacity = track.scrollLeft <= 0 ? '0.5' : '1';
        nextBtn.style.opacity = track.scrollLeft >= maxScroll - 5 ? '0.5' : '1';
    }

    // Arrow Listeners (Infinite safe)
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            scrollToIndex();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < gamesData.length - 1) {
            currentIndex++;
            scrollToIndex();
        }
    });

    // Sync dots/arrows with manual scrolling
    track.addEventListener('scroll', () => {
        const itemWidth = 160 + 19.2;
        const newIndex = Math.round(track.scrollLeft / itemWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < gamesData.length) {
            currentIndex = newIndex;
            updateDots();
        }
        updateArrows();
    });

    // INIT: Read data.txt then build
    loadGameData().then(data => {
        // If data.txt is empty, auto-generate from showcase folder (optional future update)
        // For now, just build what we read
        if(data.length === 0) {
            // Fallback if no data.txt
            data = [
                { file: "image1.png", name: "Image 1", description: "" },
                { file: "image2.png", name: "Image 2", description: "" }
            ];
        }
        buildCarousel(data);
    });

});