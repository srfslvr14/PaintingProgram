// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform float u_Size;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = u_Size;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +  // uniform
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSides = 3;
var g_selectedBook;

var g_shapesList = [];

function setupCanvas(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", {preseveDrawingBuffer: true}); // gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

// set up js actions for html elements
function addActionForHtmlUI(){
    // Clear the canvas
    document.getElementById('clear').onclick = function() { 
        g_shapesList = []; 
        renderAllShapes(); 
    }; 

    // Buttons that change cursor shape directly
    document.getElementById('pointButton').onclick = function() { g_selectedType = POINT; }; 
    document.getElementById('triglButton').onclick = function() { g_selectedType = TRIANGLE; };
    document.getElementById('circlButton').onclick = function() { g_selectedType = CIRCLE; };

    document.getElementById('bgButton').onclick    = function() { 
         // Specify the color for clearing <canvas> and clear it
        gl.clearColor(g_selectedColor[0], g_selectedColor[1], g_selectedColor[2], g_selectedColor[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        renderAllShapes();
    };

    // Slider color change of shape
    document.getElementById('redSlide').addEventListener('mouseup', 
        function() { g_selectedColor[0] = this.value/100; });
    document.getElementById('greSlide').addEventListener('mouseup', 
        function() { g_selectedColor[1] = this.value/100; });
    document.getElementById('bluSlide').addEventListener('mouseup', 
        function() { g_selectedColor[2] = this.value/100; });
    document.getElementById('alpSlide').addEventListener('mouseup', 
        function() { g_selectedColor[3] = this.value/100; });

    // Slider to change the size of our shape
    document.getElementById('sizeSlide').addEventListener('mouseup',
        function() { g_selectedSize = this.value; });

    // Slider to change the size of our shape
    document.getElementById('sideSlide').addEventListener('mouseup',
        function() { g_selectedSides = this.value; });

    // Drop down menu and select button for coloring book set
    // document.getElementById('bookButton').onclick = function() { 
    //     g_selectedBook = document.getElementById("colorBook").value; 
    //     console.log(g_selectedBook); 
    //     coloringBook();
    // };
}

function main() {
    setupCanvas();              // set global canvas webGL 
    connectVariablesToGLSL();   // Initialize shaders

    // Change the selected color of points
    addActionForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if(ev.buttons==1) {click(ev)} }; 

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function convertCoordEventToWebGL(ev){
    var x = ev.clientX;                                         // x coordinate of a mouse pointer
    var y = ev.clientY;                                         // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return ([x,y]);
}

function renderAllShapes(){
    var startTime = performance.now();

    gl.clear(gl.COLOR_BUFFER_BIT);                                      // Clear <canvas>

    var len = g_shapesList.length;                                      // for every point on the canvas 
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }

    // var duration = performance.now() - startTime;
    // sendTextToHTML("numdot " + len + 
    //                " ms: " + Math.floor(duration) + 
    //                " fps: " + Math.floor(10000/duration), 
    //                "numdot");

    sendTextToHTML(g_selectedSides, 
                   "numside");
}

function sendTextToHTML(text, htmlID){ 
    var htmlElement = document.getElementById(htmlID);
    if(!htmlElement){
        console.log("failed to get " + htmlID + "from HTML");
        return;
    }
    htmlElement.innerHTML = text;
}

function click(ev) {
    let [x, y] = convertCoordEventToWebGL(ev);  // take the event information and return the coord points 

    let point;
    if(g_selectedType == POINT){
        point = new Point();
    }
    else if(g_selectedType == TRIANGLE){
        point = new Triangle();
    }
    else{
        point = new Circle();
        point.sides = g_selectedSides;
    }

    point.position  = [x, y];
    point.color     = g_selectedColor.slice();
    point.size      = g_selectedSize;
    g_shapesList.push(point);

    renderAllShapes();                             // draw every shape that is supposed to be on canvas
}

// function coloringBook(){
//     var colorVerts = [];
//     if(g_selectedBook == "none"){  
        
//     }
//     else if(g_selectedBook == "happ"){               
//         colorVerts.push(0.0, 0.0);
//         colorVerts.push(1.0, 1.0);
//     }
//     else if(g_selectedBook == "bear"){               
        
//     }
//     else if(g_selectedBook == "sand"){                                           

//     }
//     drawBook(colorVerts);
// }

// function drawBook(colorVerts){
//     console.log("in drawBook");
//     console.log(colorVerts);

//     // renderAllShapes();

//     var n = colorVerts.length; // The number of vertices
//     console.log(n);

//     let vertexBuffer = gl.createBuffer();
//     if (!vertexBuffer) {
//         console.log('Failed to create the buffer object');
//         return -1;
//     }

//     // Bind the buffer object to target
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//     // Write date into the buffer object
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorVerts), gl.DYNAMIC_DRAW);
    
//     // Assign the buffer object to a_Position variable
//     gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

//     // Enable the assignment to a_Position variable
//     gl.enableVertexAttribArray(a_Position);

//     gl.drawArrays(gl.LINES, 0, n/2);

//     // gl.disableVertexAttribArray(colorVerts);

// }