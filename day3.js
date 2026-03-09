const arsenalItems = [
    { 
        id: 1, 
        icon: 'P', 
        name: 'PLASMA RIFLE X-1', 
        type: 'ENERGY WEAPON', 
        spec: 'CAPACITY: 400MW\nFIRE RATE: 600 RPM\nSTATUS: FULLY OPERATIONAL\n\n> INITIATING COIL DIAGNOSTIC...\n> COILS REALIGNED.\n> TEMPERATURE NORMAL.\n> READY FOR DEPLOYMENT.' 
    },
    { 
        id: 2, 
        icon: 'S', 
        name: 'TACTICAL SHIELD V2', 
        type: 'DEFENSE', 
        spec: 'CAPACITY: 10,000 JOULES\nRECHARGE RATE: 50 J/s\nSTATUS: STANDBY\n\n> CHECKING EMITTERS...\n> ALL INTERNAL EMITTERS ONLINE.\n> BATTERY AT 100%.' 
    },
    { 
        id: 3, 
        icon: 'E', 
        name: 'EMP GRENADE', 
        type: 'TACTICAL', 
        spec: 'RADIUS: 50 METERS\nYIELD: VARIABLE\nSTATUS: ARMED\n\n> CORE STABILIZED...\n> DETONATOR ACTIVE.\n> HANDLE WITH CARE.' 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const btnEnter = document.getElementById('enter-hut');
    const sceneOutside = document.getElementById('scene-outside');
    const sceneInside = document.getElementById('scene-inside');
    const sceneDetail = document.getElementById('scene-detail');
    const app = document.getElementById('app');
    const arsenalGrid = document.getElementById('arsenal-grid');
    const overlay = document.getElementById('fade-overlay');
    const terminalText = document.getElementById('terminal-text');
    const detailItemView = document.getElementById('detail-item-view');
    const backBtn = document.getElementById('back-btn');
    const terminalNode = document.querySelector('.terminal');

    let typingTimeout;

    // Initialize Arsenal
    arsenalItems.forEach((item) => {
        const el = document.createElement('div');
        el.className = 'arsenal-item';
        el.innerHTML = `<div class="item-visual">${item.icon}</div>`;
        el.addEventListener('click', () => openDetailView(item));
        arsenalGrid.appendChild(el);
    });

    // Camera animation entering the hut
    btnEnter.addEventListener('click', () => {
        // Complex transform to simulate walking to corner and entering
        app.style.transformOrigin = 'bottom right';
        app.style.transform = 'scale(5) translate3d(-10vw, -10vh, 200px)';
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 800);

        setTimeout(() => {
            sceneOutside.classList.remove('active');
            sceneOutside.style.display = 'none';
            app.style.transform = 'scale(1) translate3d(0, 0, 0)';
            app.style.transformOrigin = 'center center';
            
            sceneInside.style.display = 'block';
            void sceneInside.offsetWidth; // Force reflow
            sceneInside.classList.add('active');
            
            overlay.style.opacity = '0';
        }, 1600);
    });

    // Opening detailing view
    function openDetailView(item) {
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            sceneInside.classList.remove('active');
            sceneInside.style.display = 'none';
            
            sceneDetail.style.display = 'flex';
            detailItemView.classList.remove('animate-in');
            terminalNode.classList.remove('animate-in');
            
            void sceneDetail.offsetWidth; // Force reflow
            
            sceneDetail.classList.add('active');
            detailItemView.classList.add('animate-in');
            terminalNode.classList.add('animate-in');
            
            detailItemView.innerHTML = `<div class="item-visual">${item.icon}</div>`;
            terminalText.innerHTML = '';
            
            overlay.style.opacity = '0';
            backBtn.classList.remove('hidden');
            
            setTimeout(() => {
                const textToType = `ITEM: ${item.name}\nCLASS: ${item.type}\n\n${item.spec}`;
                typeText(textToType);
            }, 1000);
            
        }, 800);
    }

    // Typing effect using requestAnimationFrame
    function typeText(text) {
        let i = 0;
        let lastTime = 0;
        const speed = 30; // ms per character

        function type(time) {
            if (!lastTime) lastTime = time;
            const progress = time - lastTime;

            if (progress >= speed) {
                terminalText.textContent += text.charAt(i);
                i++;
                lastTime = time;
            }

            if (i < text.length) {
                typingTimeout = requestAnimationFrame(type);
            }
        }
        
        if(typingTimeout) cancelAnimationFrame(typingTimeout);
        typingTimeout = requestAnimationFrame(type);
    }
    
    // Back button functionally returns to Arsenal list
    backBtn.addEventListener('click', () => {
        if(typingTimeout) cancelAnimationFrame(typingTimeout);
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            sceneDetail.classList.remove('active');
            sceneDetail.style.display = 'none';
            
            sceneInside.style.display = 'block';
            void sceneInside.offsetWidth; 
            sceneInside.classList.add('active');
            
            overlay.style.opacity = '0';
            backBtn.classList.add('hidden');
            
            // Cleanup animation classes
            detailItemView.classList.remove('animate-in');
            terminalNode.classList.remove('animate-in');
        }, 800);
    });
    
    // Abstract Ambient Particles Engine
    function initParticles() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        sceneOutside.appendChild(canvas);
        
        const context = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
        
        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            speedX: Math.random() * 0.4 - 0.2,
            speedY: Math.random() * 0.4 - 0.2,
            opacity: Math.random() * 0.5 + 0.1
        }));
        
        function draw() {
            context.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                context.globalAlpha = p.opacity;
                context.fillStyle = '#ffffff';
                context.beginPath();
                context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                context.fill();
                
                p.x += p.speedX;
                p.y += p.speedY;
                
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;
            });
            
            requestAnimationFrame(draw);
        }
        
        draw();
    }
    
    // Start particle engine
    initParticles();
});
