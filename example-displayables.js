// UCLA's Graphics Example Code (Javascript and C++ translations available), by Garett Ridge for CS174a.
// example-displayables.js - The subclass definitions here each describe different independent animation processes that you want to fire off each frame, by defining a display
// event and how to react to key and mouse input events.  Make one or two of your own subclasses, and fill them in with all your shape drawing calls and any extra key / mouse controls.

// Now go down to Example_Animation's display() function to see where the sample shapes you see drawn are coded, and a good place to begin filling in your own code.
var N = 1;
var attached_N = 1;
var saved_N = 1;
var model_transform;
var planetX;
var planetY;
var planetZ;

var cameraX;
var cameraY;
var cameraZ;

var stack;

var attach = false;
var originalPosition = null;

var up_down_rotation = 0;
var left_right_rotation = 0;

Declare_Any_Class("Debug_Screen",  // Debug_Screen - An example of a displayable object that our class Canvas_Manager can manage.  Displays a text user interface.
  {
    'construct': function (context) {
      this.define_data_members({ string_map: context.shared_scratchpad.string_map, start_index: 0, tick: 0, visible: false, graphicsState: new Graphics_State() });
      shapes_in_use.debug_text = new Text_Line(35);
    },
    'init_keys': function (controls) {
      controls.add("t", this, function () { this.visible ^= 1; });
      controls.add("up", this, function () { this.start_index = (this.start_index + 1) % Object.keys(this.string_map).length; });
      controls.add("down", this, function () { this.start_index = (this.start_index - 1 + Object.keys(this.string_map).length) % Object.keys(this.string_map).length; });
      this.controls = controls;
    },
    'update_strings': function (debug_screen_object)   // Strings that this displayable object (Debug_Screen) contributes to the UI:
    {
      debug_screen_object.string_map["tick"] = "Frame: " + this.tick++;
      debug_screen_object.string_map["text_scroll_index"] = "Text scroll index: " + this.start_index;
    },
    'display': function (time) {
      if (!this.visible) return;

      shaders_in_use["Default"].activate();
      gl.uniform4fv(g_addrs.shapeColor_loc, Color(.8, .8, .8, 1));

      var font_scale = scale(.02, .04, 1),
        model_transform = mult(translation(-.95, -.9, 0), font_scale),
        strings = Object.keys(this.string_map);

      for (var i = 0, idx = this.start_index; i < 4 && i < strings.length; i++ , idx = (idx + 1) % strings.length) {
        shapes_in_use.debug_text.set_string(this.string_map[strings[idx]]);
        shapes_in_use.debug_text.draw(this.graphicsState, model_transform, true, vec4(0, 0, 0, 1));  // Draw some UI text (strings)
        model_transform = mult(translation(0, .08, 0), model_transform);
      }
      model_transform = mult(translation(.7, .9, 0), font_scale);
      shapes_in_use.debug_text.set_string("Controls:");
      shapes_in_use.debug_text.draw(this.graphicsState, model_transform, true, vec4(0, 0, 0, 1));    // Draw some UI text (controls title)

      for (let k of Object.keys(this.controls.all_shortcuts)) {
        model_transform = mult(translation(0, -0.08, 0), model_transform);
        shapes_in_use.debug_text.set_string(k);
        shapes_in_use.debug_text.draw(this.graphicsState, model_transform, true, vec4(0, 0, 0, 1));  // Draw some UI text (controls)
      }
    }
  }, Animation);

Declare_Any_Class("Example_Camera",     // An example of a displayable object that our class Canvas_Manager can manage.  Adds both first-person and
  {
    'construct': function (context)     // third-person style camera matrix controls to the canvas.
    { // 1st parameter below is our starting camera matrix.  2nd is the projection:  The matrix that determines how depth is treated.  It projects 3D points onto a plane.

      //This initializes the original position of the camera, which I wipe clean.
      context.shared_scratchpad.graphics_state = new Graphics_State(translation(0, 0, 0), perspective(45, canvas.width / canvas.height, .1, 1000), 0);
      this.define_data_members({ graphics_state: context.shared_scratchpad.graphics_state, thrust: vec3(), origin: vec3(0, 5, 0), looking: false });


      //INITIALIZE CAMERA!!!!!!
      //this moves the camera in and rotates it down...
      this.graphics_state.camera_transform = mult(translation(0, -7, -35), this.graphics_state.camera_transform);

      // *** Mouse controls: *** (removed)
      this.mouse = { "from_center": vec2() };
    },

    /*
    Implement a keyboard based navigation system to allow a user to fly around your solar system. The initial (and reset using the 'r' key) 
    camera position should be such that the entire solar system is visible from a position slightly above the ecliptic (out of the orbital plane) - 
    enough that we can see all the planets orbiting. The left and right arrow keys should rotate the heading of the camera by N degrees per keypress. 
    The up and down arrow keys should rotate the pitch of the camera by N degrees per keypress. Each press of the space bar moves the camera forward 
    by N units. The number keys (1-9) should set the value of N. N should initially be 1 (and reset to 1). All motion, changes to heading, pitch 
    and any forward motion, is relative to the current heading and pitch of the camera. – 10 points.
    */

    'init_keys': function (controls)   // init_keys():  Define any extra keyboard shortcuts here
    {

      //Add a navigation system with these key presses. This moves up down left right forward backwards.
      //See the readme to see what these specific controls do.
      controls.add(",", this, function () { this.thrust[1] = -N; }); controls.add(",", this, function () { this.thrust[1] = 0; }, { 'type': 'keyup' });
      controls.add(".", this, function () { this.thrust[1] = N; }); controls.add(".", this, function () { this.thrust[1] = 0; }, { 'type': 'keyup' });
      controls.add("v", this, function () { this.thrust[0] = N; }); controls.add("v", this, function () { this.thrust[0] = 0; }, { 'type': 'keyup' });
      controls.add("n", this, function () { this.thrust[0] = -N; }); controls.add("n", this, function () { this.thrust[0] = 0; }, { 'type': 'keyup' });
      //b to go backwards
      controls.add("b", this, function () { this.thrust[2] = -N; }); controls.add("b", this, function () { this.thrust[2] = 0; }, { 'type': 'keyup' });
      controls.add("i", this, function () { this.thrust[0] = -N; }); controls.add("i", this, function () { this.thrust[0] = 0; }, { 'type': 'keyup' });
      
      controls.add("Space", this, function () { this.thrust[2] = N; }); controls.add("Space", this, function () { this.thrust[2] = 0; }, { 'type': 'keyup' });

      //add N = 1 - 9 to set how much the camera moves per keypress.
      controls.add("1", this, function () { N = 1; attached_N = 1; });
      controls.add("2", this, function () { N = 2; attached_N = 2; });
      controls.add("3", this, function () { N = 3; attached_N = 3; });
      controls.add("4", this, function () { N = 4; attached_N = 4; });
      controls.add("5", this, function () { N = 5; attached_N = 5; });
      controls.add("6", this, function () { N = 6; attached_N = 6; });
      controls.add("7", this, function () { N = 7; attached_N = 7; });
      controls.add("8", this, function () { N = 8; attached_N = 8; });
      controls.add("9", this, function () { N = 9; attached_N = 9; });

      //Rotate the camera up-down or left-right. Also set a variable for rotating when attached. I kept this separate from detached mode.
      controls.add("up", this, function () { 
        this.graphics_state.camera_transform = mult(rotation(N, -1, 0, 0), this.graphics_state.camera_transform);
        if(attach) {
          up_down_rotation += attached_N;
        }

      });
      controls.add("down", this, function () { 
        this.graphics_state.camera_transform = mult(rotation(N, 1, 0, 0), this.graphics_state.camera_transform); 
        if(attach) {
          up_down_rotation -= attached_N;
        }
      });
      controls.add("left", this, function () { 
        this.graphics_state.camera_transform = mult(rotation(N, 0, -1, 0), this.graphics_state.camera_transform); 
        if(attach) {
          left_right_rotation -= attached_N;
        }

      });
      controls.add("right", this, function () { 
        this.graphics_state.camera_transform = mult(rotation(N, 0, 1, 0), this.graphics_state.camera_transform); 
        if(attach) {
          left_right_rotation += attached_N;
        }
      });
      /*
      Remember that you can place your camera in the scene and point it just like you would place and point any 3D shape, like we did by using our matrix variable model_transform.  But once you do that, you have to call invert() on that matrix before camera_transform can use it.
      
      Unless you invert and un-invert the camera matrix for each incremental change that your key presses do, you'll have to pre-multiply all of your incremental changes to the camera and also do the opposite of them.  That's because of the rule that inverting a chain of matrices multiplied together not only inverts each individual matrix but also reverses the order.
      
      To set the camera's value, the full variable name is context.shared_scratchpad.graphics_state.camera_transform, where context is what got passed in to your Animation's construct() function.  Your matrix should eventually make its way to that variable each frame.
      */

      //I added a control that would attach the camera to a planet. I stored previous values so that when I detached, it would restore state.
      controls.add("a", this, function () {
        if(attach == false) {
           originalPosition = this.graphics_state.camera_transform;
           saved_N = N;
           N = 0;
           console.log(originalPosition);
        }
        attach = true;
      })

      controls.add("d", this, function() {
        attach = false;
        if(originalPosition != null) {
          this.graphics_state.camera_transform = originalPosition;
        }
        N = saved_N;
        console.log(originalPosition);
      })

      //reset everything!!!!
      controls.add("r", this, function () {
        this.graphics_state.camera_transform = mat4();
        this.graphics_state.camera_transform = mult(translation(-10, -5, -65), this.graphics_state.camera_transform);
        N = 1;
        attach = false;
        attached_N = 1;
        saved_N = 1;
        up_down_rotation = 0;
        left_right_rotation = 0;
      });
    },
    'update_strings': function (user_interface_string_manager)       // Strings that this displayable object (Animation) contributes to the UI:
    {
      var C_inv = inverse(this.graphics_state.camera_transform), pos = mult_vec(C_inv, vec4(0, 0, 0, 1)),
        z_axis = mult_vec(C_inv, vec4(0, 0, 1, 0));
      user_interface_string_manager.string_map["origin"] = "Center of rotation: " + this.origin[0].toFixed(0) + ", " + this.origin[1].toFixed(0) + ", " + this.origin[2].toFixed(0);
      user_interface_string_manager.string_map["cam_pos"] = "Cam Position: " + pos[0].toFixed(2) + ", " + pos[1].toFixed(2) + ", " + pos[2].toFixed(2);    // The below is affected by left hand rule:
      user_interface_string_manager.string_map["facing"] = "Facing: " + ((z_axis[0] > 0 ? "West " : "East ") + (z_axis[1] > 0 ? "Down " : "Up ") + (z_axis[2] > 0 ? "North" : "South"));
    },
    'display': function (time) {
      var leeway = 70, degrees_per_frame = .0004 * this.graphics_state.animation_delta_time,
        meters_per_frame = .01 * this.graphics_state.animation_delta_time;
      // Third-person camera mode: Is a mouse drag occurring?
      if (this.mouse.anchor) {
        var dragging_vector = subtract(this.mouse.from_center, this.mouse.anchor);            // Arcball camera: Spin the scene around the world origin on a user-determined axis.
        if (length(dragging_vector) > 0)
          this.graphics_state.camera_transform = mult(this.graphics_state.camera_transform,    // Post-multiply so we rotate the scene instead of the camera.
            mult(translation(this.origin),
              mult(rotation(.05 * length(dragging_vector), dragging_vector[1], dragging_vector[0], 0),
                translation(scale_vec(-1, this.origin)))));
      }
      // First-person flyaround mode:  Determine camera rotation movement when the mouse is past a minimum distance (leeway) from the canvas's center.
      var offset_plus = [this.mouse.from_center[0] + leeway, this.mouse.from_center[1] + leeway];
      var offset_minus = [this.mouse.from_center[0] - leeway, this.mouse.from_center[1] - leeway];

      for (var i = 0; this.looking && i < 2; i++)      // Steer according to "mouse_from_center" vector, but don't start increasing until outside a leeway window from the center.
      {
        var velocity = ((offset_minus[i] > 0 && offset_minus[i]) || (offset_plus[i] < 0 && offset_plus[i])) * degrees_per_frame;  // Use movement's quantity unless the &&'s zero it out
        this.graphics_state.camera_transform = mult(rotation(velocity, i, 1 - i, 0), this.graphics_state.camera_transform);     // On X step, rotate around Y axis, and vice versa.
      }     // Now apply translation movement of the camera, in the newest local coordinate frame
      this.graphics_state.camera_transform = mult(translation(scale_vec(meters_per_frame, this.thrust)), this.graphics_state.camera_transform);
    }
  }, Animation);

Declare_Any_Class("Example_Animation",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  {
    'construct': function (context) {
      this.shared_scratchpad = context.shared_scratchpad;

      //Create our spheres (sun, planets, moon)
      shapes_in_use.sun = new Sphere(15, 3.6, true);
      shapes_in_use.planet2 = new Sphere(6, 1.6, true);
      shapes_in_use.planet3 = new Sphere(15, 1, true);
      shapes_in_use.planet4 = new Sphere(8, 1.2, true);
      shapes_in_use.moon = new Sphere(13, .4, true);
      // shapes_in_use.planet1 = new Sphere(5, 1, true);
      shapes_in_use.planet1_flat = Sphere.prototype.auto_flat_shaded_version(5, .7, false);
      //auto animate
      this.shared_scratchpad.animate ^= 1;
    },
    'init_keys': function (controls)   // init_keys():  Define any extra keyboard shortcuts here
    {
      // controls.add("ALT+g", this, function () { this.shared_scratchpad.graphics_state.gouraud ^= 1; });   // Make the keyboard toggle some
      // controls.add("ALT+n", this, function () { this.shared_scratchpad.graphics_state.color_normals ^= 1; });   // GPU flags on and off.
    },
    'update_strings': function (user_interface_string_manager)       // Strings that this displayable object (Animation) contributes to the UI:
    {
      user_interface_string_manager.string_map["time"] = "Animation Time: " + Math.round(this.shared_scratchpad.graphics_state.animation_time) / 1000 + "s";
      user_interface_string_manager.string_map["animate"] = "Animation " + (this.shared_scratchpad.animate ? "on" : "off");
    },
    'display': function (time) {
      var graphics_state = this.shared_scratchpad.graphics_state,
        model_transform = mat4();             // We have to reset model_transform every frame, so that as each begins, our basis starts as the identity.
      shaders_in_use["Default"].activate();

      // *** Lights: *** Values of vector or point lights over time.  Arguments to construct a Light(): position or vector (homogeneous coordinates), color, size
      graphics_state.lights = [];                    // First clear the light list each frame so we can replace & update lights.

      // var t = graphics_state.animation_time / 1000, light_orbit = [Math.cos(t), Math.sin(t)];
      graphics_state.lights.push(new Light(vec4(10, 0, 0, 1), Color(1, 0, 0, 0), 10000));

      // *** Materials: *** Declare new ones as temps when needed; they're just cheap wrappers for some numbers.
      // 1st parameter:  Color (4 floats in RGBA format), 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Texture image.
      
      //Create textures for each planet. I made all colors according to the spec which you can find in the readme.
      var sunTexture = new Material(Color(1, .2, 0, 1), .7, .8, .4, 20),
        planetTexture1 = new Material(Color(.4, .6, .8, 1), .4, .6, .9, 30),
        planetTexture2 = new Material(Color(.13, .71, .66, 1), .5, .4, 1, 10),
        planetTexture3 = new Material(Color(.6, .8, 1, 1), .4, .8, 1, 20),
        planetTexture4 = new Material(Color(.6, .3, 0, 1), .4, .5, .2, 20)


      /**********************************
      Start coding down here!!!!
      **********************************/                                     // From here on down it's just some example shapes drawn for you -- replace them with your own!

      stack = [];

      //Generate sun
      model_transform = mult(model_transform, translation(10, 0, 0));
      shapes_in_use.sun.draw(graphics_state, model_transform, sunTexture)

      //generate planet 1.
      //Push model transform to preserve previous state.
      //Apply a rotation and translation to make the planet rotate. The moon works in a similar way!
      stack.push(model_transform);
      model_transform = mult(model_transform, rotation(.12 * graphics_state.animation_time, 0, 1, 0));   //rotate about the Y axis
      model_transform = mult(model_transform, translation(-10, 0, 2));                                   //translate, aka we're revolving around the sun
      shapes_in_use.planet1_flat.draw(graphics_state, model_transform, planetTexture1);
      //If attached, perform a few model transforms in order to position the camera a small distance away from the planet.
      //Also apply a few rotations in order to face the sun, which is a nice touch. You can use u/d/l/r to turn the camera heading.
      if (attach) {
        //translate and rotate to 
        model_transform = mult(model_transform, translation(-2, 2, 2));
        model_transform = mult(model_transform, rotation(270, 0, 1, 0));
        model_transform = mult(model_transform, rotation(-30, 1, 0, 0));
        model_transform = mult(model_transform, rotation(-left_right_rotation, 0, 1, 0));
        model_transform = mult(model_transform, rotation(up_down_rotation, 1, 0, 0));
        this.shared_scratchpad.graphics_state.camera_transform = inverse(model_transform);    //inverse b/c camera is inverted.
      }

      model_transform = stack.pop();

      //generate planet 2
      stack.push(model_transform);
      this.shared_scratchpad.graphics_state.gouraud ^= 1;                                               //toggle gouraud
      model_transform = mult(model_transform, rotation(.1 * graphics_state.animation_time, 0, 1, 0));   //same as above
      model_transform = mult(model_transform, translation(-15, 0, 0));
      shapes_in_use.planet2.draw(graphics_state, model_transform, planetTexture2);
      this.shared_scratchpad.graphics_state.gouraud ^= 1;                                               //toggle phong
      model_transform = stack.pop();

      //generate planet 3
      stack.push(model_transform);
      model_transform = mult(model_transform, rotation(.07 * graphics_state.animation_time, 0, 1, 0));  //for revolving
      model_transform = mult(model_transform, translation(-20, 0, 0));
      shapes_in_use.planet3.draw(graphics_state, model_transform, planetTexture3);

      //generate moon
      model_transform = mult(model_transform, rotation(.5 * graphics_state.animation_time, 0, 1, 1));   //keep model transform to revolve
      model_transform = mult(model_transform, translation(2, 0, 0));                                    //around planet not sun
      shapes_in_use.moon.draw(graphics_state, model_transform, planetTexture1);
      model_transform = stack.pop();

      //generate planet 4
      stack.push(model_transform);
      model_transform = mult(model_transform, rotation(.02 * graphics_state.animation_time, 0, 1, 0));  //same as other planets
      model_transform = mult(model_transform, translation(-30, 0, 0));
      shapes_in_use.planet4.draw(graphics_state, model_transform, planetTexture4);
      model_transform = stack.pop();
    }
  }, Animation);