1. Implement the assignment in a clean and understandable manner. Your code must be readily understandable for grading including extensive comments. A README.md that explains what you did and anything else the we need to know to run your assignment including the choices you are asked to make when implementing the assignment (i.e. colors, speeds, radius', etc). – 5 points.
#####5 POINTS
I believe I commented everything and made a note of stuff in my readme.


2. Set up a WebGL capable HTML canvas able to display without error. Its size should be at least 960x540 and should have the z-buffer enabled and cleared to a black background. Implement necessary shader codes without error. – 5 points.
#####5 POINTS
The canvas is 1000x600 pixels. z-buffer is enabled and cleared to a black background. You can find this in index.html.


3. Develop a function that generates the geometry for a sphere in a form usable by WebGL. A parameter of the function should define the number of vertices that forms the sphere. – 10 points. 
#####10 POINTS
You can find this function in example-shapes.js. The number of vertices is equivalent to the num_bands^2. Currently, the parameters specifies the number of bands which thus gives you the number of vertices, so technically a parameter is the number of verticies? I can easily change this later too.
`Declare_Any_Class("Sphere",`  


4. Extend the sphere function to generate normal vectors for shading. A parameter should be added to the function specifying the generation of normal vectors for flat, Gouraud or Phong smooth shading. – 15 points.
#####15 POINTS.
The true/false values in example-displayables.js: `shapes_in_use.sphere = new Sphere(5, 1, true);` determine flat vs Gouraud or Phong. Here is my code in example-shapes.js (Declare\_Any\_Class("Sphere")) that show if we're using\_flat\_shading or not: `'populate': function (num_bands, radius, using_flat_shading)`. Normal vectors are generated here: `this_shape.normals.push(vec3(x, y, z));` also in the Declare\_Any\_Class("Sphere"). Flat shading ignores this.


5. You will create a small solar system made of spheres. A sun with four (4) orbiting planets. You choose a location (other than the origin) and diameter of the sun, the radius of each planet’s orbit around the sun (keep the orbits in the same plane), the diameters and how fast each planet orbits around the sun – except that each planet should have a different orbital radius, speed and diameter – 5 points. 
#####5 POINTS
A solar system was constructed. There is a sun at (10, 0, 0) and the radius of the sun is 3.6 (hence diameter is 7.2).
I created 4 different planets and I gave each planet a different orbital radius, speed, and diameter.

6. Implement a point light source at the location of the sun. The sun’s size relative to the four planets should determine its color. Large size, the color should be warmer (reddish), or if smaller, the color should be colder (bluish). Use that color for both the light source and the sun’s geometry. You do not need to light the sun's geometry. – 10 points.
#####10 POINTS
I implemented a point light source at the location of the sun. This was done in example-displayables.js with this line of code:
`graphics_state.lights.push(new Light(vec4(10, 0, 0, 1), Color(1, 0, 0, 0), 10000));`
So the color of the sun is red (because it's large).


7. The first planet from the sun should have a faceted appearance. It has an icy-gray color (you select the specific gray). Use flat shading. The complexity of the planet (number of vertices) should be high enough to look like a sphere but low enough that we can readily see the effect of flat shading. - 15 points.
#####15 POINTS
The first planet from the sun was created with few vertices `shapes_in_use.planet1_flat = Sphere.prototype.auto_flat_shaded_version(5, .7, false);` as well as flat shading.



8. The second planet from the sun should have a swampy, watery blue-green color (you select the specific blue-green). The complexity (number of vertices) of this sphere should be higher than the first planet and be Gouraud shaded with a specular highlight that should be apparent when visible. - 15 points.
#####15 POINTS
The second planet was given a swampy, watery blue-green color with more vertices and Gouraud shading.
The planet was generated in a similar way as planet 1 except without the flat shading. Planets 2-4 are all pretty similar.


9. The third planet from the sun should appear to be covered in calm smooth light blue water (you select the specific light blue). The complexity (number of vertices) of this sphere should be high enough so that when it's Phong shaded and with a specular highlight that should be apparent when visible. The planet appears quite shiny. - 15 points
#####15 POINTS
The third planet was given a calm smooth light blue water with even more vertices and Phong shading.



10. The fourth planet from the sun is a muddy brownish-orange (you select the specific brownish-orange color). With a complexity (number of vertices) somewhere between the second and third planets. It should be Phong shaded and with a specular highlight that should be apparent when visible. The planet appears quite dull. - 5 points
#####5 POINTS
The fourth planet was given a muddy brownish-orange with a complexity between the second and third planets. It is Phone shaded and appears dull. Because it is so dull and has a brown muddy color, it's a bit hard to see the lighting. You'll have to look closely to see it.


11. Add a moon orbiting around one of your planets. You decide on the moon’s orbital radius and speed, diameter, color and appearance (shading model: flat, Gouraud, Phong). The moon's orbit should not interfere with the orbits of planets adjacent to the one the moon is orbiting. – 10 points.
#####10 POINTS
I added a moon around the third planet. This was done in a similar way to the planets orbiting the sun, except the moon orbits a planet. I chose Phong shading and doesn't interfere with any other orbits. Rotates around the (0, 1, 1) axis. Because it is small, it may be hard to see but all the attributes are there.


12. Implement vertex and fragment shading as necessary to light the sun and planets as outlined above. It is up to you to figure out where all or part of the shading is best implemented (i.e. in the application, vertex shader or fragment shader). Where does it make sense to perform lighting calculations, on the CPU or GPU? Vertex or Fragment shader? – 20 points
#####20 POINTS
To be honest, Garret's library he wrote pretty much did all the vertex and fragment shading we needed. All I did was write 2 sets of 2 lines of code for Phong/Gouraud shading, which computed the dot product for lighting. You can find this in `example-shaders.js`.
`float diffuse  = max(dot(L[i], N), 0.0);`
`float specular = pow(max(dot(N, H[i]), 0.0), smoothness);`
That should do the trick.

13. Implement a keyboard based navigation system to allow a user to fly around your solar system. The initial (and reset using the 'r' key) camera position should be such that the entire solar system is visible from a position slightly above the ecliptic (out of the orbital plane) - enough that we can see all the planets orbiting. The left and right arrow keys should rotate the heading of the camera by N degrees per keypress. The up and down arrow keys should rotate the pitch of the camera by N degrees per keypress. Each press of the space bar moves the camera forward by N units. The number keys (1-9) should set the value of N. N should initially be 1 (and reset to 1). All motion, changes to heading, pitch and any forward motion, is relative to the current heading and pitch of the camera. – 10 points.
#####10 POINTS
R resets the camera position to see the whole solar system (same as it is initialized too). Left, right, up, and down change the camera heading by N degrees (N = 1 to 9 given a keypress, N reset to 1 on r keypress). Each press of spacebar (and holding it too) moves camera forward by N units. All movement is relative to camera heading too. 



14. Allow the camera to attach to/detach from, using the 'a' and 'd' keys respectively, one of the orbiting planets (you select which planet). While attached allow only the heading of the camera to be changed interactively by the user. You can place the camera at any radius near the selected planet (the camera does not orbit the planet). The camera's radius cannot interfere with the orbits of planets adjacent to the one the camera is orbiting. When detaching, the camera should return to the position it had before it attached to the planet. – 10 points. 
#####10 POINTS
This was done by toggling a global variable called `attach`. If attached, the camera was changed with this piece of code: `this.shared_scratchpad.graphics_state.camera_transform = inverse(model_transform);` where model_transform is the model transform of the planet it is attaching to. I also implemented a couple more matrix multiplications to factor in up down left and right camera heading changes. I also kept a variable that stored the previous state so pressing 'd' send you right back.
Note: Pressing 'a' attaches you, and pressing it again does nothing. Only when you press 'd' will you detach, and your original position and camera heading right before you pressed 'a' will be restored.


