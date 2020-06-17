const VertexShader =
`
varying vec2 vUv;
    
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const FragmentShader =
`
varying vec2 vUv;
uniform sampler2D map;
uniform vec3 r;
uniform vec3 g;
uniform vec3 b;

void main() {
    vec4 c = texture2D(map, vUv);
    c = mapTexelToLinear(c);
    
    // colour blind calculation
    vec4 cb = vec4(
        c.r * r[0] + c.g * r[1] + c.b * r[2],
        c.r * g[0] + c.g * g[1] + c.b * g[2],
        c.r * b[0] + c.g * b[1] + c.b * b[2],
        c.a
    );
    
    gl_FragColor = cb;
}
`;

const ColorModeNormal = {
    name: 'Normal',
    r: new THREE.Vector3(1, 0, 0),
    g: new THREE.Vector3(0, 1, 0),
    b: new THREE.Vector3(0, 0, 1)
}

const ColorModeProtanopia = {
    name: 'Protanopia',
    r: new THREE.Vector3(.56667, .43333, 0),
    g: new THREE.Vector3(.55833, .44167, 0),
    b: new THREE.Vector3(0, .24167, .75833)
}

const ColorModeProtanomaly = {
    name: 'Protanomaly',
    r: new THREE.Vector3(.81667, .18333, 0),
    g: new THREE.Vector3(.33333, .66667, 0),
    b: new THREE.Vector3(0, .125, .875)
}

const ColorModeDeuteranopia = {
    name: 'Deuteranopia',
    r: new THREE.Vector3(.625, .375, 0),
    g: new THREE.Vector3(.70, .30, 0),
    b: new THREE.Vector3(0, .30, .70)
}

const ColorModeDeuteranomaly = {
    name: 'Deuteranomaly',
    r: new THREE.Vector3(.80, .20, 0),
    g: new THREE.Vector3(.25833, .74167, 0),
    b: new THREE.Vector3(0, .14167, .85833)
}

const ColorModeTritanopia = {
    name: 'Tritanopia',
    r: new THREE.Vector3(.95, .05, 0),
    g: new THREE.Vector3(0, .43333, .56667),
    b: new THREE.Vector3(0, .475, .525)
}

const ColorModeTritanomaly = {
    name: 'Tritanomaly',
    r: new THREE.Vector3(.96667, .03333, 0),
    g: new THREE.Vector3(0, .73333, .26667),
    b: new THREE.Vector3(0, .18333, .81667)
}

const ColorModeAchromatopsia = {
    name: 'Achromatopsia',
    r: new THREE.Vector3(.299, .587, .114),
    g: new THREE.Vector3(.299, .587, .114),
    b: new THREE.Vector3(.299, .587, .114)
}

const ColorModeAchromatomaly = {
    name: 'Achromatomaly',
    r: new THREE.Vector3(.618, .32, .062),
    g: new THREE.Vector3(.163, .775, .062),
    b: new THREE.Vector3(.163, .320, .516)
}

const materialInstances = [];

const uniforms = {
    map: {value: undefined},
    r: {value: ColorModeNormal.r},
    g: {value: ColorModeNormal.g},
    b: {value: ColorModeNormal.b},
}

const GetBasicColorBlindMaterial = function() {
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: VertexShader,
        fragmentShader: FragmentShader,
    });
    materialInstances.push(material);
    return material;
}

const ToggleColorBlindModes = function(key) {
    
    let colorMode = ColorModeNormal;
    
    switch(key) {
        case "1":
            colorMode = ColorModeNormal;
            break;
        case "2":
            colorMode = ColorModeProtanopia;
            break;
        case "3":
            colorMode = ColorModeProtanomaly;
            break;
        case "4":
            colorMode = ColorModeDeuteranopia;
            break;
        case "5":
            colorMode = ColorModeDeuteranomaly;
            break;
        case "6":
            colorMode = ColorModeTritanopia;
            break;
        case "7":
            colorMode = ColorModeTritanomaly;
            break;
        case "8":
            colorMode = ColorModeAchromatopsia;
            break;
        case "9":
            colorMode = ColorModeAchromatomaly;
            break;
        default:
            return undefined;

    }

    for(let i = 0; i < materialInstances.length; i++) {
        if (!!materialInstances[i]) {
            materialInstances[i].uniforms.r.value = colorMode.r;
            materialInstances[i].uniforms.g.value = colorMode.g;
            materialInstances[i].uniforms.b.value = colorMode.b;
        }
    }

    return colorMode;
}