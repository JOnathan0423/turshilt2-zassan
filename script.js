// Constants for liquids (N/m)
const liquidProperties = {
    water: 0.0728,  // Surface tension of water in N/m
    oil: 0.030,     // Surface tension of oil in N/m
    alcohol: 0.022  // Surface tension of alcohol in N/m
};

// Constants for gravity on different planets (m/s^2)
const planetGravities = {
    earth: 9.8,
    moon: 1.62,
    mars: 3.71
};

// Get input elements and canvas
const dropMassInput = document.getElementById('dropMass');
const radiusInput = document.getElementById('radius');
const dropCountInput = document.getElementById('dropCount');
const liquidSelect = document.getElementById('liquidSelect');
const planetSelect = document.getElementById('planetSelect');
const calculateBtn = document.getElementById('calculateBtn');
const resultText = document.getElementById('result');
const canvas = document.getElementById('experimentCanvas');
const ctx = canvas.getContext('2d');

// Default values
let gravity = planetGravities['earth'];
let surfaceTension = liquidProperties['water'];
let dropMass = parseFloat(dropMassInput.value);
let radius = parseFloat(radiusInput.value);
let dropCount = parseInt(dropCountInput.value);
let dropY = 50;
let dropRadius = 8;
let isDetaching = false;
const dropSpeed = 0.5;
const maxDropY = 350; // Y-coordinate where the drop detaches
const tubeX = 300;
const tubeY = 50;
const tubeWidth = 20;
const tubeHeight = 300;

// Update gravity and surface tension on selection change
liquidSelect.addEventListener('change', () => {
    surfaceTension = liquidProperties[liquidSelect.value];
    console.log(`Selected Liquid: ${liquidSelect.value}, Surface Tension: ${surfaceTension}`);
});

planetSelect.addEventListener('change', () => {
    gravity = planetGravities[planetSelect.value];
    console.log(`Selected Planet: ${planetSelect.value}, Gravity: ${gravity}`);
});

// Update input values on change
dropMassInput.addEventListener('input', () => dropMass = parseFloat(dropMassInput.value));
radiusInput.addEventListener('input', () => radius = parseFloat(radiusInput.value));
dropCountInput.addEventListener('input', () => dropCount = parseInt(dropCountInput.value));

// Calculation logic for surface tension
calculateBtn.addEventListener('click', function() {
    const force = dropMass * gravity;
    const circumference = 2 * Math.PI * radius / 100; // Convert cm to meters
    
    // Incorporate surface tension in the calculation
    const calculatedSurfaceTension = (surfaceTension * (force / circumference)).toFixed(4);

    resultText.innerText = `Гадаргуугийн таталцал (${liquidSelect.options[liquidSelect.selectedIndex].text}): ${calculatedSurfaceTension} Н/м`;
});

// Draw tube and surface elements
function drawStalagmometer() {
    ctx.fillStyle = 'gray';
    ctx.fillRect(tubeX - tubeWidth / 2, tubeY, tubeWidth, tubeHeight);
    ctx.beginPath();
    ctx.moveTo(tubeX - 50, maxDropY);
    ctx.lineTo(tubeX + 50, maxDropY);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Draw droplet with stretching effect
function drawDroplet(y, radius, isStretching) {
    ctx.beginPath();
    const stretchFactor = isStretching ? 1.4 : 1; // Adjust stretching factor for realism
    ctx.ellipse(tubeX, y, radius, radius * stretchFactor, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'skyblue';
    ctx.fill();
    ctx.closePath();
}

// Display gravity force arrow (educational purpose)
function drawGravityArrow() {
    ctx.beginPath();
    ctx.moveTo(tubeX, dropY + dropRadius);
    ctx.lineTo(tubeX, dropY + dropRadius + 30);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tubeX - 5, dropY + dropRadius + 20);
    ctx.lineTo(tubeX, dropY + dropRadius + 30);
    ctx.lineTo(tubeX + 5, dropY + dropRadius + 20);
    ctx.fillStyle = 'red';
    ctx.fill();
}

// Animation logic for droplet movement
function animateVisualLab() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStalagmometer(); // Draw tube and surface
    drawDroplet(dropY, dropRadius, !isDetaching); // Draw droplet
    drawGravityArrow(); // Draw gravity force arrow

    // Droplet movement logic
    if (dropY < maxDropY && !isDetaching) {
        dropY += dropSpeed;
    } else {
        isDetaching = true;
        dropRadius -= 0.1; // Gradual decrease in radius to simulate stretching
        dropY += dropSpeed * 1.5; // Faster movement when detaching
    }

    // Reset droplet after detachment
    if (dropRadius <= 0) {
        dropY = 50;
        dropRadius = 8;
        isDetaching = false;
    }

    requestAnimationFrame(animateVisualLab);
}

// Start the animation
animateVisualLab();
