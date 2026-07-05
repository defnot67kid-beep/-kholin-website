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

    // ==========================================
    // 3. INFINITE AUTO-DETECT CAROUSEL
    // ==========================================
    
    const track = document.getElementById('cleanTrack');
    const prevBtn = document.getElementById('cleanPrevBtn');
    const nextBtn = document.getElementById('cleanNextBtn');
    const indicators = document.getElementById('cleanIndicators');

    // EDIT THIS LIST to add new images
    const IMAGE_LIST = [
        "natural_disaster.png",
        "draw_it.png",
        "pizza_place.png",
        "copyrighted.png"
    ];

    let gamesData = [];
    let currentIndex = 0;

    // Attempt to load data.txt for extra details
    async function loadMetadata() {
        try {
            const response = await fetch('showcase/DATAIMAGES/data.txt');
            const text = await response.text();
            return parseDataText(text);
        } catch (error) {
            return []; 
        }
    }

    function parseDataText(text) {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        const metaMap = {};
        let currentKey = null;

        for (const line of lines) {
            if (line.endsWith('.png')) {
                currentKey = line;
                metaMap[currentKey] = { file: currentKey, name: currentKey.replace('.png', '').replace(/_/g, ' '), description: "" };
            } else if (line.startsWith('image') && currentKey) {
                if (line.includes('.name="')) {
                    metaMap[currentKey].name = line.split('.name="')[1].replace('"', '');
                } else if (line.includes('.description=')) {
                    metaMap[currentKey].description = line.split('.description="')[1].replace('"', '');
                }
            }
        }
        return metaMap;
    }

    function buildCarousel() {
        track.innerHTML = '';
        indicators.innerHTML = '';
        
        gamesData = IMAGE_LIST.map(filename => {
            if (metadataMap[filename]) {
                return metadataMap[filename];
            } else {
                let autoName = filename.replace('.png', '').replace(/_/g, ' ');
                autoName = autoName.replace(/\b\w/g, l => l.toUpperCase());
                
                return {
                    file: filename,
                    name: autoName,
                    description: ""
                };
            }
        });

        if (gamesData.length === 0) {
            track.innerHTML = '<p style="color: #666; padding: 1rem;">Add images to the showcase folder and update IMAGE_LIST in script.js</p>';
            return;
        }

        gamesData.forEach((game, index) => {
            const div = document.createElement('div');
            div.className = 'clean-item';

            const img = document.createElement('img');
            img.src = `showcase/${encodeURIComponent(game.file)}`;
            img.alt = game.name;
            img.onerror = function() { this.src = 'https://placehold.co/160x160/555/fff?text=Missing+Image'; };

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

    track.addEventListener('scroll', () => {
        const itemWidth = 160 + 19.2;
        const newIndex = Math.round(track.scrollLeft / itemWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < gamesData.length) {
            currentIndex = newIndex;
            updateDots();
        }
        updateArrows();
    });

    let metadataMap = {}; 

    loadMetadata().then(meta => {
        metadataMap = meta;
        buildCarousel();
    });

});