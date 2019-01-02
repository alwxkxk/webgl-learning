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
attribute vec2 a_position;

uniform vec2 u_resolution;
uniform mat3 u_matrix;

void main() {
  // Multiply the position by the matrix.
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;

  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;
const FragmentSource = `
void main(){
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
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

// 全局变量：设置canvas高宽，以进行坐标转换。
let resolutionLocation = gl.getUniformLocation(program, "u_resolution");
// set the resolution
gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
var matrixLocation = gl.getUniformLocation(program, "u_matrix");
let translation = [0, 250]
let angleInRadians = 0
let scale = [1, 1]

// 矩阵
let m3 = {
    translation: function(tx, ty) {
      return [
        1, 0, 0,
        0, 1, 0,
        tx, ty, 1,
      ];
    },
  
    rotation: function(angleInRadians) {
      let c = Math.cos(angleInRadians);
      let s = Math.sin(angleInRadians);
      return [
        c,-s, 0,
        s, c, 0,
        0, 0, 1,
      ];
    },
  
    scaling: function(sx, sy) {
      return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1,
      ];
    },
  
    multiply: function(a, b) {
      let a00 = a[0 * 3 + 0];
      let a01 = a[0 * 3 + 1];
      let a02 = a[0 * 3 + 2];
      let a10 = a[1 * 3 + 0];
      let a11 = a[1 * 3 + 1];
      let a12 = a[1 * 3 + 2];
      let a20 = a[2 * 3 + 0];
      let a21 = a[2 * 3 + 1];
      let a22 = a[2 * 3 + 2];
      let b00 = b[0 * 3 + 0];
      let b01 = b[0 * 3 + 1];
      let b02 = b[0 * 3 + 2];
      let b10 = b[1 * 3 + 0];
      let b11 = b[1 * 3 + 1];
      let b12 = b[1 * 3 + 2];
      let b20 = b[2 * 3 + 0];
      let b21 = b[2 * 3 + 1];
      let b22 = b[2 * 3 + 2];
      return [
        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
        b10 * a00 + b11 * a10 + b12 * a20,
        b10 * a01 + b11 * a11 + b12 * a21,
        b10 * a02 + b11 * a12 + b12 * a22,
        b20 * a00 + b21 * a10 + b22 * a20,
        b20 * a01 + b21 * a11 + b22 * a21,
        b20 * a02 + b21 * a12 + b22 * a22,
      ];
    },
  };


function rectangle(x,y,width,height) {
    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;
    let data = new Float32Array([
        x1,y1,
        x2,y1,
        x1,y2,
        x1,y2,
        x2,y1,
        x2,y2,
    ])
    return data;
}

function drawRectangle(x,y,width,height) {
    //必须clear,否则背景色会异常。
    gl.clear(gl.COLOR_BUFFER_BIT);


    // Compute the matrices
    var translationMatrix = m3.translation(translation[0], translation[1]);
    var rotationMatrix = m3.rotation(angleInRadians);
    var scaleMatrix = m3.scaling(scale[0], scale[1]);

    // Multiply the matrices.
    var matrix = m3.multiply(translationMatrix, rotationMatrix);
    matrix = m3.multiply(matrix,scaleMatrix);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);
    //第三步，传入顶点数据
    //生成buffer数据
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rectangle(x,y,width,height), gl.STATIC_DRAW);
    //转换成attribute
    let positionAttribute = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
    // 画
    gl.drawArrays(gl.TRIANGLES, 0, 6);
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
let rotationAngle = document.getElementById('rotation-angle')
rotationAngle.value = 0
let scaleX = document.getElementById('scale-x')
scaleX.value = scale[0]
let scaleY = document.getElementById('scale-y')
scaleY.value = scale[1]

function drawRectangle2() {
    console.log("drawRectangle2:",rectangleX.value, rectangleY.value, rectangleWidth.value, rectangleHeight.value)
    drawRectangle(Number(rectangleX.value), Number(rectangleY.value), Number(rectangleWidth.value), Number(rectangleHeight.value))
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

rotationAngle.onchange=()=>{
    angleInRadians = rotationAngle.value*Math.PI/180
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