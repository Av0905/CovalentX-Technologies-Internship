/* ==========================================================================
   SkyCast 3D - Atmospheric Weather Logic & Three.js Particle Engine
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. State Management & DOM Elements
// --------------------------------------------------------------------------
const APP_STATE = {
    apiKey: localStorage.getItem('skycast_api_key') || 'd5358a28846bbbfaa2b958595ac3b8f5',
    isDemoMode: localStorage.getItem('skycast_demo_mode') === null ? false : localStorage.getItem('skycast_demo_mode') !== 'false', // Auto-disable demo if this is the first load with a valid key!
    activeTheme: 'sunny', // sunny, cloudy, rainy, stormy, snowy
    currentData: null,
    forecastData: null
};

// DOM Query Selectors
const bodyEl = document.body;
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const geoBtn = document.getElementById('geo-btn');
const settingsToggleBtn = document.getElementById('settings-toggle-btn');
const settingsCloseBtn = document.getElementById('settings-close-btn');
const settingsPanel = document.getElementById('settings-panel');
const sidebarOverlay = document.getElementById('sidebar-overlay');

const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error-msg');
const errorText = document.getElementById('error-text');
const weatherCard = document.getElementById('weather-card');
const demoIndicator = document.getElementById('demo-indicator');

// Weather Metric DOM
const locationName = document.getElementById('location-name');
const localTime = document.getElementById('local-time');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weather-icon');
const weatherDesc = document.getElementById('weather-desc');
const tempMax = document.getElementById('temp-max');
const tempMin = document.getElementById('temp-min');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const forecastContainer = document.getElementById('forecast-container');

// Settings DOM
const demoModeCheckbox = document.getElementById('demo-mode-checkbox');
const demoControlsSection = document.getElementById('demo-controls');
const demoWeatherBtns = document.querySelectorAll('.demo-weather-btn');
const apiKeyInput = document.getElementById('api-key-input');
const toggleKeyVisibilityBtn = document.getElementById('toggle-key-visibility');
const saveApiBtn = document.getElementById('save-api-btn');
const clearApiBtn = document.getElementById('clear-api-btn');
const apiStatusIndicator = document.getElementById('api-status-indicator');
const canvasLoader = document.getElementById('canvas-loader');
const visualizerState = document.getElementById('visualizer-state');

// --------------------------------------------------------------------------
// 2. Three.js 3D Weather Simulation Engine
// --------------------------------------------------------------------------
class Weather3D {
    constructor() {
        this.container = document.getElementById('canvas-container');
        if (!this.container) return;

        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        // Core Properties
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.animationFrameId = null;
        
        // Interactive Camera Control
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Lighting Elements
        this.ambientLight = null;
        this.dirLight = null;
        this.pointLight = null;

        // Active Climatic Elements
        this.activeWeatherType = '';
        this.weatherGroup = new THREE.Group();
        this.particles = null;
        this.particleCount = 250;
        
        // Weather-specific active meshes
        this.clouds = [];
        this.sun = null;
        this.sunRing = null;
        this.ambientParticles = null;

        // Lightning strike trigger for Storm state
        this.lightningFlash = false;
        this.nextLightningFrame = 120;
        this.lightningTimer = 0;

        this.init();
    }

    init() {
        // A. Setup Scene and Camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 0.5, 9); // Pull back slightly for visual safety
        
        // B. Setup Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // C. Setup Lighting
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
        this.scene.add(this.ambientLight);

        this.dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.dirLight.position.set(5, 8, 5);
        this.scene.add(this.dirLight);

        this.pointLight = new THREE.PointLight(0xffffff, 0.5, 30);
        this.pointLight.position.set(0, 0, 2);
        this.scene.add(this.pointLight);

        // Add main interactive weather cluster group
        this.scene.add(this.weatherGroup);

        // D. Setup Window resize listener & Mouse parallax listeners
        window.addEventListener('resize', () => this.onWindowResize());
        this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.container.addEventListener('mouseleave', () => this.onMouseLeave());

        // E. Kickstart Main Loop
        this.animate();
        
        // Hide initial overlay spinner
        if (canvasLoader) {
            canvasLoader.classList.add('hidden');
        }
    }

    onWindowResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.width, this.height);
    }

    onMouseMove(event) {
        const rect = this.container.getBoundingClientRect();
        // Normalize mouse coordinates to [-1, 1] relative to center
        this.mouseX = ((event.clientX - rect.left) / this.width) * 2 - 1;
        this.mouseY = -((event.clientY - rect.top) / this.height) * 2 + 1;
    }

    onMouseLeave() {
        this.mouseX = 0;
        this.mouseY = 0;
    }

    // A. Transition helper between weather states
    transitionTo(weatherType) {
        if (this.activeWeatherType === weatherType) return;
        this.activeWeatherType = weatherType;
        
        // Update live 3D chamber text
        if (visualizerState) {
            visualizerState.textContent = weatherType;
        }

        // 1. Smoothly dispose and clear previous items in our group
        this.clearActiveGroup();

        // 2. Build new climatic visual cluster
        switch (weatherType) {
            case 'sunny':
                this.buildSunnyScene();
                break;
            case 'cloudy':
                this.buildCloudyScene();
                break;
            case 'rainy':
                this.buildRainyScene(false);
                break;
            case 'stormy':
                this.buildRainyScene(true);
                break;
            case 'snowy':
                this.buildSnowyScene();
                break;
            default:
                this.buildSunnyScene();
        }
    }

    clearActiveGroup() {
        // Recursively dispose geometries and materials to avoid webgl memory leaks
        while(this.weatherGroup.children.length > 0){
            const obj = this.weatherGroup.children[0];
            this.weatherGroup.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        }
        
        // Clear references
        this.clouds = [];
        this.sun = null;
        this.sunRing = null;
        this.particles = null;
        this.ambientParticles = null;
        this.lightningFlash = false;
        
        // Reset lights to default state
        if (this.ambientLight) {
            this.ambientLight.color.setHex(0xffffff);
            this.ambientLight.intensity = 0.55;
        }
        if (this.dirLight) {
            this.dirLight.color.setHex(0xffffff);
            this.dirLight.intensity = 0.8;
            this.dirLight.position.set(5, 8, 5);
        }
    }

    // Sunny Visual: Faceted Golden Sun & Orbiting Light Rays
    buildSunnyScene() {
        // Adjust Lighting for Warm Golden glow
        this.ambientLight.color.setHex(0xfff3cd);
        this.ambientLight.intensity = 0.7;
        this.dirLight.color.setHex(0xfffbeb);
        this.dirLight.intensity = 1.0;

        // Core Sun Mesh: Low Poly Faceted Sphere
        const sunGeom = new THREE.SphereGeometry(1.5, 12, 12);
        const sunMat = new THREE.MeshPhongMaterial({
            color: 0xf1c40f,
            emissive: 0xe67e22,
            shininess: 80,
            flatShading: true
        });
        this.sun = new THREE.Mesh(sunGeom, sunMat);
        this.weatherGroup.add(this.sun);

        // Tech Ring orbiting the Sun
        const ringGeom = new THREE.RingGeometry(2.1, 2.15, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xf39c12,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4
        });
        this.sunRing = new THREE.Mesh(ringGeom, ringMat);
        this.sunRing.rotation.x = Math.PI / 3;
        this.sunRing.rotation.y = Math.PI / 4;
        this.weatherGroup.add(this.sunRing);

        // Floating Sunbeam Energy Particles
        const partGeom = new THREE.BufferGeometry();
        const partCount = 40;
        const positions = new Float32Array(partCount * 3);
        const sizes = new Float32Array(partCount);

        for (let i = 0; i < partCount * 3; i += 3) {
            // Distribute spherical coordinates around center sun
            const radius = 2.0 + Math.random() * 2.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i+2] = radius * Math.cos(phi);
        }

        partGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const partMat = new THREE.PointsMaterial({
            color: 0xffd700,
            size: 0.15,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.ambientParticles = new THREE.Points(partGeom, partMat);
        this.weatherGroup.add(this.ambientParticles);
    }

    // Helper to generate cloud structures dynamically (used in Cloudy, Rainy, Snowy)
    createCloudMesh(x, y, z, scale, greyFactor = 1.0) {
        const cloudGroup = new THREE.Group();
        cloudGroup.position.set(x, y, z);
        cloudGroup.scale.set(scale, scale, scale);

        // Mix multiple spheres overlapping to look organic
        const sphereColor = new THREE.Color(
            0.92 * greyFactor, 
            0.94 * greyFactor, 
            0.96 * greyFactor
        );
        const cloudMat = new THREE.MeshPhongMaterial({
            color: sphereColor,
            shininess: 5,
            flatShading: true
        });

        // Main central puff
        const coreGeo = new THREE.SphereGeometry(1.0, 10, 10);
        const core = new THREE.Mesh(coreGeo, cloudMat);
        cloudGroup.add(core);

        // Side puffs
        const leftPuffGeo = new THREE.SphereGeometry(0.7, 8, 8);
        const leftPuff = new THREE.Mesh(leftPuffGeo, cloudMat);
        leftPuff.position.set(-0.8, -0.15, 0.2);
        cloudGroup.add(leftPuff);

        const rightPuffGeo = new THREE.SphereGeometry(0.75, 8, 8);
        const rightPuff = new THREE.Mesh(rightPuffGeo, cloudMat);
        rightPuff.position.set(0.8, -0.1, -0.1);
        cloudGroup.add(rightPuff);

        const topPuffGeo = new THREE.SphereGeometry(0.65, 8, 8);
        const topPuff = new THREE.Mesh(topPuffGeo, cloudMat);
        topPuff.position.set(0.15, 0.6, 0.1);
        cloudGroup.add(topPuff);

        this.weatherGroup.add(cloudGroup);
        this.clouds.push(cloudGroup);
    }

    // Cloudy Visual: Multiple Overlapping Fluffy Clouds Bobbing
    buildCloudyScene() {
        // Deep misty silver lighting
        this.ambientLight.color.setHex(0xb2bec3);
        this.ambientLight.intensity = 0.6;
        this.dirLight.color.setHex(0xdfe6e9);
        this.dirLight.intensity = 0.7;

        // Construct 3 distinct cloud systems drifting at offset layers
        this.createCloudMesh(-1.2, 0.6, -0.5, 1.25, 1.0);  // Deep Cloud
        this.createCloudMesh(1.1, -0.2, 0.5, 1.0, 0.9);   // Foreground Cloud
        this.createCloudMesh(-0.2, -0.8, -0.2, 0.85, 0.95); // Low Cloud
    }

    // Rainy/Stormy Visual: Dark storm clouds and heavy vertical downpours
    buildRainyScene(isStormMode = false) {
        // Adjust Ambient Light for Storm
        if (isStormMode) {
            this.ambientLight.color.setHex(0x3d3d3d);
            this.ambientLight.intensity = 0.35;
            this.dirLight.color.setHex(0x57606f);
            this.dirLight.intensity = 0.4;
            this.dirLight.position.set(-4, 6, -3);
        } else {
            this.ambientLight.color.setHex(0x57606f);
            this.ambientLight.intensity = 0.45;
            this.dirLight.color.setHex(0x747d8c);
            this.dirLight.intensity = 0.5;
        }

        // Add Dark Storm Clouds at top
        const greyFactor = isStormMode ? 0.45 : 0.65;
        this.createCloudMesh(-1.0, 1.6, -0.5, 1.4, greyFactor);
        this.createCloudMesh(1.0, 1.3, 0.2, 1.2, greyFactor * 0.9);
        
        // Rain Particle System using line-based points
        const rainGeom = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const velocities = new Float32Array(this.particleCount);

        for (let i = 0; i < this.particleCount * 3; i += 3) {
            positions[i] = (Math.random() * 7) - 3.5;    // X between -3.5 and 3.5
            positions[i+1] = (Math.random() * 8) - 4;    // Y between -4 and 4
            positions[i+2] = (Math.random() * 4) - 2;    // Z between -2 and 2
            velocities[i/3] = 0.12 + Math.random() * 0.08; // Terminal falling speed
        }

        rainGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const rainMat = new THREE.PointsMaterial({
            color: isStormMode ? 0x9b59b6 : 0x3498db, // Electric purple for storms, water blue for rain
            size: 0.065,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(rainGeom, rainMat);
        this.particles.userData = { velocities };
        this.weatherGroup.add(this.particles);

        // Prep lightning state for Storm
        if (isStormMode) {
            this.nextLightningFrame = 80 + Math.floor(Math.random() * 120);
            this.lightningTimer = 0;
        }
    }

    // Snowy Visual: Soft ice-grey clouds & drifting/fluttering snowflakes
    buildSnowyScene() {
        // Cold crisp ice lighting
        this.ambientLight.color.setHex(0xc7ecee);
        this.ambientLight.intensity = 0.65;
        this.dirLight.color.setHex(0xffffff);
        this.dirLight.intensity = 0.8;

        // Ice clouds
        this.createCloudMesh(-0.8, 1.5, -0.3, 1.2, 0.88);
        this.createCloudMesh(0.9, 1.2, 0.4, 1.0, 0.85);

        // Floating Snow Particles
        const snowGeom = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const data = []; // To save individual sway coordinates

        for (let i = 0; i < this.particleCount * 3; i += 3) {
            positions[i] = (Math.random() * 6) - 3;
            positions[i+1] = (Math.random() * 7) - 3.5;
            positions[i+2] = (Math.random() * 4) - 2;
            
            data.push({
                speedY: 0.02 + Math.random() * 0.02,
                swaySpeed: 1 + Math.random() * 2,
                swayOffset: Math.random() * Math.PI,
                swayRadius: 0.1 + Math.random() * 0.15
            });
        }

        snowGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const snowMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.12,
            transparent: true,
            opacity: 0.85,
            blending: THREE.NormalBlending
        });

        this.particles = new THREE.Points(snowGeom, snowMat);
        this.particles.userData = { customData: data };
        this.weatherGroup.add(this.particles);
    }

    // Frame Core Loop
    animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;

        // 1. Smooth Camera mouse-follow Parallax (buttery interpolation)
        const targetCamX = this.mouseX * 1.8;
        const targetCamY = 0.5 + (this.mouseY * 1.2);
        
        this.camera.position.x += (targetCamX - this.camera.position.x) * 0.05;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 0.05;
        this.camera.lookAt(0, 0, 0);

        // 2. Animate elements based on active climatic state
        
        // SUNNY ANIMATION
        if (this.activeWeatherType === 'sunny') {
            if (this.sun) {
                this.sun.rotation.y += 0.008;
                this.sun.rotation.x += 0.003;
                this.sun.position.y = Math.sin(time) * 0.12; // Gentle floating bob
            }
            if (this.sunRing) {
                this.sunRing.rotation.z -= 0.006;
                this.sunRing.rotation.y += 0.002;
            }
            if (this.ambientParticles) {
                this.ambientParticles.rotation.y += 0.001;
                this.ambientParticles.rotation.x += 0.0005;
            }
        }

        // CLOUDY ANIMATION: Gentle independent floating bob for each cloud
        if (this.clouds.length > 0) {
            this.clouds.forEach((cloud, index) => {
                const offset = index * 2;
                cloud.position.y += Math.sin(time + offset) * 0.0015;
                cloud.position.x += Math.cos(time * 0.5 + offset) * 0.0008;
            });
        }

        // RAINY / STORMY ANIMATION
        if (this.particles && (this.activeWeatherType === 'rainy' || this.activeWeatherType === 'stormy')) {
            const positions = this.particles.geometry.attributes.position.array;
            const velocities = this.particles.userData.velocities;
            const isStorm = this.activeWeatherType === 'stormy';
            const multiplier = isStorm ? 1.5 : 1.0; // Storm falls faster

            for (let i = 0; i < this.particleCount; i++) {
                const index = i * 3;
                // Move down
                positions[index+1] -= velocities[i] * multiplier;

                // Reset particle to top if it goes out of chamber bounds
                if (positions[index+1] < -4) {
                    positions[index+1] = 4;
                    positions[index] = (Math.random() * 7) - 3.5;
                }
            }
            this.particles.geometry.attributes.position.needsUpdate = true;

            // Storm Lightning Strike Logic
            if (isStorm) {
                this.lightningTimer++;
                if (this.lightningTimer >= this.nextLightningFrame) {
                    // Flash trigger
                    this.lightningFlash = true;
                    this.lightningTimer = 0;
                    this.nextLightningFrame = 100 + Math.floor(Math.random() * 150); // Set next strike interval
                }

                if (this.lightningFlash) {
                    // Random flickering intensities
                    const flashValue = Math.random();
                    if (flashValue > 0.4) {
                        this.ambientLight.color.setHex(0xdfe6e9);
                        this.ambientLight.intensity = 2.2;
                        this.dirLight.intensity = 2.8;
                    } else {
                        this.ambientLight.color.setHex(0x3d3d3d);
                        this.ambientLight.intensity = 0.35;
                        this.dirLight.intensity = 0.4;
                        this.lightningFlash = false; // End this flash
                    }
                }
            }
        }

        // SNOWY ANIMATION: Slow drift and side-to-side flutter sway
        if (this.particles && this.activeWeatherType === 'snowy') {
            const positions = this.particles.geometry.attributes.position.array;
            const snowData = this.particles.userData.customData;

            for (let i = 0; i < this.particleCount; i++) {
                const idx = i * 3;
                const data = snowData[i];

                // Flutter down
                positions[idx+1] -= data.speedY;

                // Sway horizontal using sine wave
                positions[idx] += Math.sin((time * data.swaySpeed) + data.swayOffset) * 0.003;

                // Reset boundaries
                if (positions[idx+1] < -4) {
                    positions[idx+1] = 4;
                    positions[idx] = (Math.random() * 6) - 3;
                }
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Instantiate 3D weather variable globally
let visualizer = null;

// --------------------------------------------------------------------------
// 3. Simulated Data Generators (For Offline Demo Mode)
// --------------------------------------------------------------------------
const DEMO_METRICS = {
    sunny: {
        temp: 26, tempMax: 29, tempMin: 22,
        desc: "clear sky", humidity: "42%", windSpeed: "3.2 m/s",
        pressure: "1016 hPa", visibility: "10.0 km",
        icon: "01d", name: "Miami, US"
    },
    cloudy: {
        temp: 18, tempMax: 20, tempMin: 14,
        desc: "broken clouds", humidity: "76%", windSpeed: "4.8 m/s",
        pressure: "1012 hPa", visibility: "8.5 km",
        icon: "04d", name: "London, GB"
    },
    rainy: {
        temp: 15, tempMax: 17, tempMin: 12,
        desc: "moderate rain", humidity: "92%", windSpeed: "6.5 m/s",
        pressure: "1007 hPa", visibility: "5.0 km",
        icon: "10d", name: "Seattle, US"
    },
    stormy: {
        temp: 21, tempMax: 24, tempMin: 18,
        desc: "thunderstorm with heavy rain", humidity: "95%",
        windSpeed: "12.4 m/s", pressure: "1002 hPa", visibility: "3.2 km",
        icon: "11d", name: "Hong Kong, HK"
    },
    snowy: {
        temp: -2, tempMax: 1, tempMin: -5,
        desc: "light snow showers", humidity: "81%", windSpeed: "5.1 m/s",
        pressure: "1018 hPa", visibility: "4.0 km",
        icon: "13d", name: "Oslo, NO"
    }
};

function generateDemoForecast(theme) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayIdx = new Date().getDay();
    const forecast = [];

    const basis = DEMO_METRICS[theme];

    for (let i = 1; i <= 5; i++) {
        const targetDay = days[(currentDayIdx + i) % 7];
        // Introduce small random variations per day relative to basis
        const varianceMax = Math.round(basis.tempMax + (Math.random() * 4 - 2));
        const varianceMin = Math.round(basis.tempMin + (Math.random() * 4 - 2));

        forecast.push({
            day: targetDay,
            maxTemp: varianceMax,
            minTemp: varianceMin,
            icon: basis.icon,
            desc: basis.desc
        });
    }
    return forecast;
}

// --------------------------------------------------------------------------
// 4. Operational Controllers (UI Rendering & Mode Swapping)
// --------------------------------------------------------------------------

// Updates UI Elements with current data
function updateUIElements(current, forecast, isDemo = false) {
    // 1. Set text metrics
    locationName.textContent = isDemo ? current.name : `${current.name}, ${current.sys.country}`;
    
    // Set dynamic local date
    const dateOpts = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    localTime.textContent = new Date().toLocaleString('en-US', dateOpts);

    // Temp displays
    const rawTemp = isDemo ? current.temp : Math.round(current.main.temp);
    temperature.textContent = rawTemp;

    // Conditions
    const desc = isDemo ? current.desc : current.weather[0].description;
    weatherDesc.textContent = desc;

    const code = isDemo ? current.icon : current.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${code}@2x.png`;
    weatherIcon.alt = desc;

    // Ranges
    const maxVal = isDemo ? current.tempMax : Math.round(current.main.temp_max);
    const minVal = isDemo ? current.tempMin : Math.round(current.main.temp_min);
    tempMax.innerHTML = `<i data-lucide="arrow-up"></i> ${maxVal}°C`;
    tempMin.innerHTML = `<i data-lucide="arrow-down"></i> ${minVal}°C`;

    // Metrics grid
    humidity.textContent = isDemo ? current.humidity : `${current.main.humidity}%`;
    
    const windSpeedVal = isDemo ? current.windSpeed : `${current.wind.speed} m/s`;
    windSpeed.textContent = windSpeedVal;
    
    const pressVal = isDemo ? current.pressure : `${current.main.pressure} hPa`;
    pressure.textContent = pressVal;

    const visValue = isDemo ? current.visibility : `${(current.visibility / 1000).toFixed(1)} km`;
    visibility.textContent = visValue;

    // 2. Render 5-day forecast cards
    forecastContainer.innerHTML = '';
    
    if (isDemo) {
        forecast.forEach(item => {
            const card = document.createElement('div');
            card.className = 'forecast-item';
            card.innerHTML = `
                <span class="forecast-day">${item.day}</span>
                <img src="https://openweathermap.org/img/wn/${item.icon}@2x.png" alt="${item.desc}" class="forecast-icon">
                <div class="forecast-temp">
                    <span class="forecast-temp-max">${item.maxTemp}°</span>
                    <span class="forecast-temp-min">${item.minTemp}°</span>
                </div>
            `;
            forecastContainer.appendChild(card);
        });
    } else {
        // Real API data comes in chunks of 3 hours. We grab roughly 1 chunk per day (around 12:00 PM)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const list = forecast.list;
        const dailyForecasts = list.filter(f => f.dt_txt.includes('12:00:00'));

        dailyForecasts.forEach(f => {
            const date = new Date(f.dt * 1000);
            const dayName = days[date.getDay()];
            const fIcon = f.weather[0].icon;
            const fDesc = f.weather[0].description;
            const fMax = Math.round(f.main.temp_max);
            const fMin = Math.round(f.main.temp_min);

            const card = document.createElement('div');
            card.className = 'forecast-item';
            card.innerHTML = `
                <span class="forecast-day">${dayName}</span>
                <img src="https://openweathermap.org/img/wn/${fIcon}@2x.png" alt="${fDesc}" class="forecast-icon">
                <div class="forecast-temp">
                    <span class="forecast-temp-max">${fMax}°</span>
                    <span class="forecast-temp-min">${fMin}°</span>
                </div>
            `;
            forecastContainer.appendChild(card);
        });
    }

    // Refresh Lucide SVGs dynamically
    lucide.createIcons();
}

// Maps OpenWeather API ID to our custom 3D themes
function mapWeatherIdToTheme(id) {
    if (id >= 200 && id < 300) return 'stormy';
    if ((id >= 300 && id < 400) || (id >= 500 && id < 600)) return 'rainy';
    if (id >= 600 && id < 700) return 'snowy';
    if (id >= 700 && id < 800) return 'cloudy';
    if (id === 800) return 'sunny';
    if (id > 800 && id <= 804) return 'cloudy';
    return 'sunny';
}

// Switches dynamic system themes
function changeSystemTheme(theme) {
    APP_STATE.activeTheme = theme;

    // A. Remove existing theme classes from body
    bodyEl.className = '';
    // B. Add new theme class
    bodyEl.classList.add(`theme-${theme}`);

    // C. Transition ThreeJS Visualizer
    if (visualizer) {
        visualizer.transitionTo(theme);
    }
}

// Handle Demo Mode weather switching clicks
function triggerDemoWeather(theme) {
    changeSystemTheme(theme);
    
    // Load matching mock metadata
    const mockCurrent = DEMO_METRICS[theme];
    const mockForecast = generateDemoForecast(theme);
    
    // Render
    updateUIElements(mockCurrent, mockForecast, true);
}

// --------------------------------------------------------------------------
// 5. Asynchronous Data Fetchers (OpenWeatherMap API)
// --------------------------------------------------------------------------
async function fetchWeatherData(queryUrl, forecastUrl) {
    showLoading(true);
    showError(false);

    try {
        // Query both endpoints concurrently to optimize network loading
        const [currentRes, forecastRes] = await Promise.all([
            fetch(queryUrl),
            fetch(forecastUrl)
        ]);

        if (!currentRes.ok) {
            if (currentRes.status === 404) {
                throw new Error("City not found. Please verify spelling.");
            } else if (currentRes.status === 401) {
                throw new Error("Invalid API Key. Check the Settings Panel.");
            } else {
                throw new Error("Unable to connect to weather services.");
            }
        }

        if (!forecastRes.ok) {
            throw new Error("Failed to load forecast parameters.");
        }

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        APP_STATE.currentData = currentData;
        APP_STATE.forecastData = forecastData;

        // Map API Weather condition ID to active theme
        const weatherId = currentData.weather[0].id;
        const targetTheme = mapWeatherIdToTheme(weatherId);
        
        changeSystemTheme(targetTheme);
        updateUIElements(currentData, forecastData, false);

        // Hide stats overlay and reveal card content
        weatherCard.classList.remove('hidden');

    } catch (err) {
        showError(true, err.message);
        weatherCard.classList.add('hidden');
    } finally {
        showLoading(false);
    }
}

// Trigger weather load automatically based on query or GPS coords
function loadWeather(cityName = '', latitude = null, longitude = null) {
    if (APP_STATE.isDemoMode) {
        // Simply simulate
        triggerDemoWeather(APP_STATE.activeTheme);
        return;
    }

    if (!APP_STATE.apiKey) {
        showError(true, "Please configure your API Key in settings or use Demo Mode.");
        weatherCard.classList.add('hidden');
        return;
    }

    let currentUrl = '';
    let forecastUrl = '';
    const base = 'https://api.openweathermap.org/data/2.5';

    if (cityName) {
        const cleanQuery = encodeURIComponent(cityName.trim());
        currentUrl = `${base}/weather?q=${cleanQuery}&units=metric&appid=${APP_STATE.apiKey}`;
        forecastUrl = `${base}/forecast?q=${cleanQuery}&units=metric&appid=${APP_STATE.apiKey}`;
    } else if (latitude !== null && longitude !== null) {
        currentUrl = `${base}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APP_STATE.apiKey}`;
        forecastUrl = `${base}/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${APP_STATE.apiKey}`;
    } else {
        // Default lookup fallback
        currentUrl = `${base}/weather?q=New+York&units=metric&appid=${APP_STATE.apiKey}`;
        forecastUrl = `${base}/forecast?q=New+York&units=metric&appid=${APP_STATE.apiKey}`;
    }

    fetchWeatherData(currentUrl, forecastUrl);
}

// Geolocation GPS fetcher
function initGeolocation() {
    if (!navigator.geolocation) {
        showError(true, "Geolocation is not supported by your browser.");
        return;
    }

    showLoading(true);
    showError(false);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            loadWeather('', latitude, longitude);
        },
        (error) => {
            let msg = "Location access denied. Search city manually.";
            if (error.code === error.POSITION_UNAVAILABLE) {
                msg = "Location info is unavailable.";
            } else if (error.code === error.TIMEOUT) {
                msg = "Location request timed out.";
            }
            showError(true, msg);
            showLoading(false);
            
            // Fallback load default
            if (cityNameInputIsEmpty()) {
                loadWeather('New York');
            }
        },
        { timeout: 8000 }
    );
}

function cityNameInputIsEmpty() {
    return !cityInput.value.trim();
}

// --------------------------------------------------------------------------
// 6. UI Helpers & App Initialize Hook
// --------------------------------------------------------------------------

function showLoading(isLoading) {
    if (isLoading) {
        loadingEl.classList.remove('hidden');
    } else {
        loadingEl.classList.add('hidden');
    }
}

function showError(show, message = '') {
    if (show) {
        errorText.textContent = message;
        errorEl.classList.remove('hidden');
    } else {
        errorEl.classList.add('hidden');
    }
}

// Sync UI status banner with active settings mode
function syncSettingsDrawerStatus() {
    // 1. Toggle visibility of demo controls
    if (APP_STATE.isDemoMode) {
        demoControlsSection.style.display = 'block';
        demoIndicator.classList.remove('hidden');
        apiStatusIndicator.className = 'api-status-banner warning';
        apiStatusIndicator.innerHTML = '<i data-lucide="help-circle"></i><span>Using offline Demo Mode</span>';
    } else {
        demoControlsSection.style.display = 'none';
        demoIndicator.classList.add('hidden');
        
        if (APP_STATE.apiKey) {
            apiStatusIndicator.className = 'api-status-banner success';
            apiStatusIndicator.innerHTML = '<i data-lucide="check-circle2"></i><span>API Key Connected</span>';
        } else {
            apiStatusIndicator.className = 'api-status-banner warning';
            apiStatusIndicator.innerHTML = '<i data-lucide="alert-circle"></i><span>API Key Needed</span>';
        }
    }
    
    // Sync checkbox input
    demoModeCheckbox.checked = APP_STATE.isDemoMode;
    
    // Refresh icon inside banner
    lucide.createIcons();
}

// Open / Close Settings drawer
function toggleSettingsPanel(open) {
    if (open) {
        settingsPanel.classList.add('open');
        sidebarOverlay.classList.remove('hidden');
        syncSettingsDrawerStatus();
    } else {
        settingsPanel.classList.remove('open');
        sidebarOverlay.classList.add('hidden');
    }
}

// Initial Launch Setup
window.addEventListener('DOMContentLoaded', () => {
    // 1. Spin up 3D atmospheric scene
    visualizer = new Weather3D();
    
    // 2. Synchronize saved state
    if (APP_STATE.apiKey) {
        apiKeyInput.value = APP_STATE.apiKey;
    }
    syncSettingsDrawerStatus();

    // 3. Register core button callbacks
    
    // Search
    searchBtn.addEventListener('click', () => {
        const query = cityInput.value.trim();
        if (query) {
            loadWeather(query);
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = cityInput.value.trim();
            if (query) loadWeather(query);
        }
    });

    // Geolocation
    geoBtn.addEventListener('click', initGeolocation);

    // Sidebar openers
    settingsToggleBtn.addEventListener('click', () => toggleSettingsPanel(true));
    settingsCloseBtn.addEventListener('click', () => toggleSettingsPanel(false));
    sidebarOverlay.addEventListener('click', () => toggleSettingsPanel(false));

    // Mode Toggle Box
    demoModeCheckbox.addEventListener('change', (e) => {
        APP_STATE.isDemoMode = e.target.checked;
        localStorage.setItem('skycast_demo_mode', APP_STATE.isDemoMode);
        syncSettingsDrawerStatus();
        
        // Trigger fresh reload of weather under new mode
        const query = cityInput.value.trim();
        if (query) {
            loadWeather(query);
        } else {
            loadWeather();
        }
    });

    // Settings Demo Climatic buttons
    demoWeatherBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active classes
            demoWeatherBtns.forEach(b => b.classList.remove('active'));
            
            const targetBtn = e.currentTarget;
            targetBtn.classList.add('active');
            
            const selectedWeather = targetBtn.dataset.weather;
            triggerDemoWeather(selectedWeather);
        });
    });

    // Save Key Action
    saveApiBtn.addEventListener('click', () => {
        const val = apiKeyInput.value.trim();
        if (!val) {
            showError(true, "Please input a valid key.");
            return;
        }

        APP_STATE.apiKey = val;
        localStorage.setItem('skycast_api_key', val);
        
        // Auto-disable demo mode on key save to create dynamic immediate activation
        APP_STATE.isDemoMode = false;
        localStorage.setItem('skycast_demo_mode', false);
        
        syncSettingsDrawerStatus();
        toggleSettingsPanel(false); // Close panel to reward user
        
        // Fetch fresh API details
        const query = cityInput.value.trim();
        if (query) {
            loadWeather(query);
        } else {
            loadWeather();
        }
    });

    // Clear Key Action
    clearApiBtn.addEventListener('click', () => {
        APP_STATE.apiKey = '';
        apiKeyInput.value = '';
        localStorage.removeItem('skycast_api_key');
        
        // Fall back to offline demo mode
        APP_STATE.isDemoMode = true;
        localStorage.setItem('skycast_demo_mode', true);
        
        syncSettingsDrawerStatus();
        loadWeather();
    });

    // Toggle API password field visibility
    toggleKeyVisibilityBtn.addEventListener('click', () => {
        const type = apiKeyInput.type === 'password' ? 'text' : 'password';
        apiKeyInput.type = type;
        
        const eyeIcon = toggleKeyVisibilityBtn.querySelector('i');
        if (type === 'text') {
            eyeIcon.setAttribute('data-lucide', 'eye-off');
        } else {
            eyeIcon.setAttribute('data-lucide', 'eye');
        }
        lucide.createIcons();
    });

    // 4. Initial content loading
    // If key is present and not explicitly in demo, query geolocation or default weather. Otherwise simulate default sunny
    if (APP_STATE.apiKey && !APP_STATE.isDemoMode) {
        initGeolocation();
    } else {
        triggerDemoWeather('sunny');
    }

    // Bind icons once at launch
    lucide.createIcons();
});