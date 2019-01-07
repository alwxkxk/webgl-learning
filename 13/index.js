// 第一步，获取canvas元素并创建webgl上下文
const canvas = document.querySelector("#glcanvas");
const gl = canvas.getContext("webgl");
if (!gl) {
    alert("浏览器不支持webgl。");
}
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
//第二步，创建vertex shader与fragment shader程序，连接起来并使用
const VertexSource = `
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;
const FragmentSource = `
precision mediump float;

// Passed in from the vertex shader.
varying vec4 v_color;

void main() {
   gl_FragColor = v_color;
}
`;
//创建vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, VertexSource);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert("vertexShader 创建失败。");
}
//创建fragmentShader shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, FragmentSource);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert("fragmentShader 创建失败。");
}
//创建并使用shader程序
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert("shader 程序 创建失败");
}
gl.useProgram(program);

//弧度（radian） 转成 角度 
function radToDeg(r) {
    return r * 180 / Math.PI;
}

//角度 转成 弧度 
function degToRad(d) {
    return d * Math.PI / 180;
}

let positionAttribute = gl.getAttribLocation(program, "a_position");
let colorLocation = gl.getAttribLocation(program, "a_color");

let matrixLocation = gl.getUniformLocation(program, "u_matrix");
let translation = [100, 250,0]
// let angleInRadians = 0
let rotation = [degToRad(10), degToRad(10), degToRad(10)];
let scale = [1, 1 , 1]
// let color = [Math.random(), Math.random(), Math.random(), 1];


// 矩阵
let m4 = {

    projection: function(width, height, depth) {
      // Note: This matrix flips the Y axis so 0 is at the top.
      return [
         2 / width, 0, 0, 0,
         0, -2 / height, 0, 0,
         0, 0, 2 / depth, 0,
        -1, 1, 0, 1,
      ];
    },
  
    multiply: function(a, b) {
      let a00 = a[0 * 4 + 0];
      let a01 = a[0 * 4 + 1];
      let a02 = a[0 * 4 + 2];
      let a03 = a[0 * 4 + 3];
      let a10 = a[1 * 4 + 0];
      let a11 = a[1 * 4 + 1];
      let a12 = a[1 * 4 + 2];
      let a13 = a[1 * 4 + 3];
      let a20 = a[2 * 4 + 0];
      let a21 = a[2 * 4 + 1];
      let a22 = a[2 * 4 + 2];
      let a23 = a[2 * 4 + 3];
      let a30 = a[3 * 4 + 0];
      let a31 = a[3 * 4 + 1];
      let a32 = a[3 * 4 + 2];
      let a33 = a[3 * 4 + 3];
      let b00 = b[0 * 4 + 0];
      let b01 = b[0 * 4 + 1];
      let b02 = b[0 * 4 + 2];
      let b03 = b[0 * 4 + 3];
      let b10 = b[1 * 4 + 0];
      let b11 = b[1 * 4 + 1];
      let b12 = b[1 * 4 + 2];
      let b13 = b[1 * 4 + 3];
      let b20 = b[2 * 4 + 0];
      let b21 = b[2 * 4 + 1];
      let b22 = b[2 * 4 + 2];
      let b23 = b[2 * 4 + 3];
      let b30 = b[3 * 4 + 0];
      let b31 = b[3 * 4 + 1];
      let b32 = b[3 * 4 + 2];
      let b33 = b[3 * 4 + 3];
      return [
        b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
        b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
        b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
        b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
        b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
        b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
        b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
        b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
        b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
        b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
        b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
        b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
        b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
        b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
        b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
      ];
    },
  
    translation: function(tx, ty, tz) {
      return [
         1,  0,  0,  0,
         0,  1,  0,  0,
         0,  0,  1,  0,
         tx, ty, tz, 1,
      ];
    },
  
    xRotation: function(angleInRadians) {
      let c = Math.cos(angleInRadians);
      let s = Math.sin(angleInRadians);
  
      return [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1,
      ];
    },
  
    yRotation: function(angleInRadians) {
      let c = Math.cos(angleInRadians);
      let s = Math.sin(angleInRadians);
  
      return [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1,
      ];
    },
  
    zRotation: function(angleInRadians) {
      let c = Math.cos(angleInRadians);
      let s = Math.sin(angleInRadians);
  
      return [
         c, s, 0, 0,
        -s, c, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1,
      ];
    },
  
    scaling: function(sx, sy, sz) {
      return [
        sx, 0,  0,  0,
        0, sy,  0,  0,
        0,  0, sz,  0,
        0,  0,  0,  1,
      ];
    },
  
    translate: function(m, tx, ty, tz) {
      return m4.multiply(m, m4.translation(tx, ty, tz));
    },
  
    xRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.xRotation(angleInRadians));
    },
  
    yRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.yRotation(angleInRadians));
    },
  
    zRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.zRotation(angleInRadians));
    },
  
    scale: function(m, sx, sy, sz) {
      return m4.multiply(m, m4.scaling(sx, sy, sz));
    },
  
  };

function getColors() {
    return new Uint8Array([
        100,100,100,
        100,100,100,
        100,100,100,

        0,250,0,
        0,250,0,
        0,250,0,

        0,0,250,
        0,0,250,
        0,0,250,

        250,0,0,
        250,0,0,
        250,0,0
    ]);
}


function rectangle(x,y,z,width,height,deep) {
    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;
    let z1 = z;
    let z2 = z+ deep;
    let data = new Float32Array([
        x1,y1,z1,
        x2,y1,z1,
        x1,y2,z1,

        x1,y2,z1,
        x2,y1,z1,
        x2,y2,z1,

        x1,y2,z1,
        x2,y2,z1,
        x2,y2,z2,

        x1,y2,z1,
        x2,y2,z2,
        x1,y2,z2
    ])
    return data;
}

function drawRectangle(x,y,z,width,height,deep) {
    //必须clear,否则背景色会异常。
    gl.clear(gl.COLOR_BUFFER_BIT);


    // Compute the matrices
    let matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    //第三步，传入顶点数据
    //生成buffer数据
    let positionBuffer = gl.createBuffer();

    //转换成attribute
    gl.enableVertexAttribArray(positionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rectangle(x,y,z,width,height,deep), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);

    // Create a buffer to put colors in
    let colorBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = colorBuffer)

    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,getColors(),gl.STATIC_DRAW)
    //传入true 代表序列化 把0-255转成 0-1。gl.UNSIGNED_BYTE代表8位数据类型，即Uint8Array。
    gl.vertexAttribPointer(colorLocation,3,gl.UNSIGNED_BYTE, true, 0, 0);

    // 画
    gl.drawArrays(gl.TRIANGLES, 0, 12);
}

// 获取 input DOM对象，并设置初始值与改变值时的事件回调
let rectangleX = document.getElementById('rectangle-x')
rectangleX.value = 0
let rectangleY = document.getElementById('rectangle-y')
rectangleY.value = 0
let rectangleWidth = document.getElementById('rectangle-width')
rectangleWidth.value = 50
let rectangleHeight = document.getElementById('rectangle-height')
rectangleHeight.value = 50
let translationX = document.getElementById('translation-x')
translationX.value = translation[0]
let translationY = document.getElementById('translation-y')
translationY.value = translation[1]

let rotationAngleX = document.getElementById('rotation-angle-x')
rotationAngleX.value = radToDeg(rotation[0])
let rotationAngleY = document.getElementById('rotation-angle-y')
rotationAngleY.value = radToDeg(rotation[1])
let rotationAngleZ = document.getElementById('rotation-angle-z')
rotationAngleZ.value = radToDeg(rotation[2])

let scaleX = document.getElementById('scale-x')
scaleX.value = scale[0]
let scaleY = document.getElementById('scale-y')
scaleY.value = scale[1]

function drawRectangle2() {
    console.log("drawRectangle2:",rectangleX.value, rectangleY.value, rectangleWidth.value, rectangleHeight.value)
    drawRectangle(Number(rectangleX.value), Number(rectangleY.value), 0,Number(rectangleWidth.value), Number(rectangleHeight.value),50)
}

drawRectangle2() 

rectangleX.onchange=(event)=>{
    drawRectangle2()  
}

rectangleY.onchange=(event)=>{
    drawRectangle2() 
}

rectangleWidth.onchange=(event)=>{
    drawRectangle2() 
}

rectangleHeight.onchange=(event)=>{
    drawRectangle2() 
}

translationX.onchange=()=>{
    translation[0]=translationX.value
    drawRectangle2() 
}

translationY.onchange=()=>{
    translation[1]=translationY.value
    drawRectangle2() 
}

rotationAngleX.onchange=()=>{
    rotation[0] = degToRad(rotationAngleX.value)
    drawRectangle2() 
}

rotationAngleY.onchange=()=>{
    rotation[1] = degToRad(rotationAngleY.value)
    drawRectangle2() 
}

rotationAngleZ.onchange=()=>{
    rotation[2] = degToRad(rotationAngleZ.value)
    drawRectangle2() 
}

scaleX.onchange=()=>{
    scale[0]=scaleX.value
    drawRectangle2() 
}

scaleY.onchange=()=>{
    scale[1]=scaleY.value
    drawRectangle2() 
}