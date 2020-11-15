class Circle{
    // construct new triangle object 
    constructor(){
        this.type       = 'circle';
        this.position   = [0.0,0.0,0.0];
        this.color      = [1.0,1.0,1.0,1.0];
        this.size       = 5.0;
        this.sides      = 3.0;
    }

    render(){
        var xy   = this.position;                                       // set xy to the ith point's pos field
        var rgba = this.color;                                          // set rgba to the ith point's color field
        var size = this.size;                                           // set size to the ith point's size field
 
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);  // Pass the color of point to u_FragColor
        gl.uniform1f(u_Size, size);                                     // Pass the size of point to u_Size
                                
        var d = this.size/200.0;                                        // side/diameter length
        var r = d/2;                                                    // radius length

        let vertices = [];
        // let verticies = [xy[0], xy[1]+r, xy[0]-r, xy[1]-r, xy[0]+r, xy[1]-r];

        let tp = this.sides;
        for (var i = 0; i <= tp; i++){
            let angle = 2 * Math.PI * i / tp;
            let x     = xy[0] + r * Math.cos(angle);
            let y     = xy[1] + r * Math.sin(angle);
            vertices.push(x, y);
        }

        drawCircle(tp, vertices);                                          // Draw triangle with selected verts
    }
}

function drawCircle(sides, vertices) {
    var n = sides; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
} 