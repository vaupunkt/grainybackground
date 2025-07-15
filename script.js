
const color1Input = document.getElementById('color1');
const color2Input = document.getElementById('color2');
const color3Input = document.getElementById('color3');
const grainVisibilitySlider = document.getElementById('grain-visibility-slider');
const grainVisibilityValueSpan = document.getElementById('grain-visibility-value');
const grainSizeSlider = document.getElementById('grain-size-slider');
const grainSizeValueSpan = document.getElementById('grain-size-value');
const feTurbulenceNoise = document.getElementById('feTurbulence-noise');

const gradientTypeSelect = document.getElementById('gradient-type');
const gradientAngleInput = document.getElementById('gradient-angle');
const angleValueSpan = document.getElementById('angle-value');
const gradientAngleContainer = document.getElementById('gradient-angle-container');
const gradientXPositionInput = document.getElementById('gradient-x-position');
const xPositionValueSpan = document.getElementById('x-position-value');
const gradientYPositionInput = document.getElementById('gradient-y-position');
const yPositionValueSpan = document.getElementById('y-position-value');
const gradientPositionContainer = document.getElementById('gradient-position-container');

const gradientBackground = document.getElementById('gradient-background');
const grainOverlay = document.getElementById('grain-overlay');
const randomizeButton = document.getElementById('randomize-button');
const showCssButton = document.getElementById('show-css-button');
const cssModal = document.getElementById('css-modal');
const closeModalButton = document.getElementById('close-modal-button');
const cssCodeDisplay = document.getElementById('css-code-display');
const copyCssButton = document.getElementById('copy-css-button');
const settingsPanel = document.getElementById('settings-panel');
const settingsContentWrapper = document.getElementById('settings-content-wrapper');
const toggleSettingsButton = document.getElementById('toggle-settings-button');

function updateBackground() {
    const color1 = color1Input.value;
    const color2 = color2Input.value;
    const color3 = color3Input.value;
    const grainVisibility = grainVisibilitySlider.value;
    const grainSize = grainSizeSlider.value;
    const gradientType = gradientTypeSelect.value;
    const gradientAngle = gradientAngleInput.value;
    const gradientX = gradientXPositionInput.value;
    const gradientY = gradientYPositionInput.value;

    grainVisibilityValueSpan.textContent = `${grainVisibility}%`;
    grainOverlay.style.opacity = (grainVisibility / 200);

    grainSizeValueSpan.textContent = `${(grainSize / 10).toFixed(1)}`;
    feTurbulenceNoise.setAttribute('baseFrequency', (grainSize / 10));

    let gradientCssString;
    let backgroundPositionCssString = '';

    if (gradientType === 'linear') {
        gradientAngleContainer.classList.remove('hidden');
        gradientPositionContainer.classList.add('hidden');
        angleValueSpan.textContent = `${gradientAngle}°`;
        if (color3 && color3 !== '#000000') {
            gradientCssString = `linear-gradient(${gradientAngle}deg, ${color1}, ${color2}, ${color3})`;
        } else {
            gradientCssString = `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`;
        }
        backgroundPositionCssString = `50% 50%`;
    } else if (gradientType === 'radial') {
        gradientAngleContainer.classList.add('hidden');
        gradientPositionContainer.classList.remove('hidden');
        if (color3 && color3 !== '#000000') {
            gradientCssString = `radial-gradient(circle at ${gradientX}% ${gradientY}%, ${color1}, ${color2}, ${color3})`;
        } else {
            gradientCssString = `radial-gradient(circle at ${gradientX}% ${gradientY}%, ${color1}, ${color2})`;
        }
        backgroundPositionCssString = `${gradientX}% ${gradientY}%`;
    }
    gradientBackground.style.background = gradientCssString;
    gradientBackground.style.backgroundPosition = backgroundPositionCssString;
    xPositionValueSpan.textContent = `${gradientX}%`;
    yPositionValueSpan.textContent = `${gradientY}%`;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

color1Input.addEventListener('input', updateBackground);
color2Input.addEventListener('input', updateBackground);
color3Input.addEventListener('input', updateBackground);
grainVisibilitySlider.addEventListener('input', updateBackground);
grainSizeSlider.addEventListener('input', updateBackground);
gradientTypeSelect.addEventListener('change', updateBackground);
gradientAngleInput.addEventListener('input', updateBackground);
gradientXPositionInput.addEventListener('input', updateBackground);
gradientYPositionInput.addEventListener('input', updateBackground);

randomizeButton.addEventListener('click', () => {
    color1Input.value = getRandomColor();
    color2Input.value = getRandomColor();
    color3Input.value = getRandomColor();
    grainVisibilitySlider.value = Math.floor(Math.random() * 201);
    grainSizeSlider.value = Math.floor(Math.random() * 50) + 1;

    const gradientTypes = ['linear', 'radial'];
    gradientTypeSelect.value = gradientTypes[Math.floor(Math.random() * gradientTypes.length)];

    gradientAngleInput.value = Math.floor(Math.random() * 361);

    gradientXPositionInput.value = Math.floor(Math.random() * 101);
    gradientYPositionInput.value = Math.floor(Math.random() * 101);
    
    updateBackground();
});

showCssButton.addEventListener('click', () => {
    const currentBackground = gradientBackground.style.background;
    const currentGrainOpacity = grainOverlay.style.opacity;
    const currentBackgroundPosition = gradientBackground.style.backgroundPosition;
    const currentBaseFrequency = feTurbulenceNoise.getAttribute('baseFrequency');

    let backgroundPositionCss = '';
    if (gradientTypeSelect.value === 'radial') {
        backgroundPositionCss = `  background-position: ${currentBackgroundPosition};\n`;
    }

    const cssOutput = `/* CSS for the background gradient */
#gradient-background {
  background: ${currentBackground};
${backgroundPositionCss}  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  transition: all 0.5s ease-in-out;
}

/* CSS for the grain effect overlay */
#grain-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  filter: url(#noise); /* Refers to the SVG filter with id="noise" */
  opacity: ${currentGrainOpacity};
  z-index: 10;
}

/* IMPORTANT: Insert this SVG code into your HTML,
   typically right after the opening <body> tag.
   It defines the 'noise' filter required for the grain effect. */
<svg style="position: absolute; width: 0; height: 0; overflow: hidden;">
    <defs>
        <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="${currentBaseFrequency}" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend mode="multiply" in="SourceGraphic" />
        </filter>
    </defs>
</svg>
`;
    cssCodeDisplay.textContent = cssOutput;
    cssModal.style.display = 'flex';
});

closeModalButton.addEventListener('click', () => {
    cssModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == cssModal) {
        cssModal.style.display = 'none';
    }
});

copyCssButton.addEventListener('click', () => {
    const cssText = cssCodeDisplay.textContent;
    const textArea = document.createElement("textarea");
    textArea.value = cssText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    alert('CSS code copied to clipboard!');
});

toggleSettingsButton.addEventListener('click', () => {
    settingsContentWrapper.classList.toggle('collapsed');
    if (settingsContentWrapper.classList.contains('collapsed')) {
        toggleSettingsButton.textContent = 'Show';
        toggleSettingsButton.setAttribute('title', 'Show');
    } else {
        toggleSettingsButton.textContent = 'Hide';
        toggleSettingsButton.setAttribute('title', 'Hide');
    }
});

updateBackground();
