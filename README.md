# three-colorblind

The three-colorblind utility provides basic functionality to help you visualise objects in your [three.js](https://github.com/mrdoob/three.js/) scene that utilise maps to determine if they will be suitable with users with vision impairment.

## Why Use three-colorblind?
1. You want to visualise your three.js application from the perspective of someone with a vision impairment.
2. You are not able to use the built in colorblind modes in Chrome.
3. You want access to more colorblind modes than are available in Chrome.

## What Modes Are Available?
1. Normal
2. Protanopia
3. Protanomaly
4. Deuteranopia
5. Deuteranomaly
6. Tritanopia
7. Tritanomaly
8. Achromatopsia
9. Achromatomaly

## Installation
1. Clone or download this repository
2. Copy the file `/src/three-colorblind.js` into your application.

## Usage
three-colorblind is designed to be lightweight and flexible and used during development of three.js experiences to help with visual accessibility. With that in mind I've attempted to add a few utilies to cut down on writing boilerplate. You will, regardless of usage, need to make sure that `three-colorblind.js` is available in your webpage.

Insert a link to `three-colorblind.js` in your application **AFTER** you include your `three.js` library.

*e.g* `<script type="text/javascript" src="../src/three-colorblind.js"></script>`

### Simple Usage
If you intend to remove this code or you have a simple scene you might want to use some of the helper functions and objects provided in `three-colorblind.js`. You can do this by.

1. Find instances where you create materials.
```
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
    });
``` 
2. Temporarily (or though another code solution) replace with a call to `GetBasicColorBlindMaterial`. This will return an instance of a new `THREE.ShaderMaterial` with the appropriate shaders set up. Make sure you set the map value.
```
    const material = GetBasicColorBlindMaterial();
    material.uniforms.map.value = texture;
    // add any optional material configuration
    material.transparent = true;
```

3. Optionally add an eventlistener for `keydown` so you can change colorblind modes through use of the number keys.
```
    window.addEventListener('keydown', function(event) {
        const colourMode = ToggleColorBlindModes(event.key);
    });
```

When utilising the `GetBasicColorBlindMaterial` method a reference to the material is stored in an array. Calls to `ToggleColorBlindModes` will then go and update any material instance when the mode changes. This saves you needing the track the materials and write code to change the color mode yourself. The number keys are mapped to the same ordered list as in the "What Modes Are Available?" secion.

### Custom Usage
1. Find instances where you create materials.
```
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
    });
``` 
2. Temporarily (or though another code solution) replace with a new `THREE.ShaderMaterial`. Setting the `vertexShader` and `fragmentShader` properties as described below. These variables are made available from `three-colorblind.js`. Additionally provide an object called `uniforms` that takes the follow paramaters `map`, `r`, `g` and `b`.
```
    const uniforms = {
        map: {value: texture},
        r: {value: ColorModeNormal.r},
        g: {value: ColorModeNormal.g},
        b: {value: ColorModeNormal.b},
    }

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: VertexShader,
        fragmentShader: FragmentShader,
        // any other material set up
        transparent = true
    });
```
3. Track the instances of these materials as required. Also implement required code to handle changing colorblind modes. You may use the example code in `three-colorblind.js` used for `ToggleColorBlindModes`.
4. For each tracked material update the `r`, `g` and `b` values of the uniform based on the desired colour mode.
```
    material.uniforms.r.value = colorMode.r;
    material.uniforms.g.value = colorMode.g;
    material.uniforms.b.value = colorMode.b;
```

### Credit
Credit goes to Alan Zucconi for his [original Unity Tutorial](https://www.alanzucconi.com/2015/12/16/color-blindness/) of which this is a port which I hope can be expanded upon in future.
