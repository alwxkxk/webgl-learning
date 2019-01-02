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
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main() {
  // Scale the position
  vec2 scaledPosition = a_position * u_scale;

  // Rotate the position
  vec2 rotatedPosition = vec2(
     scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
     scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);

  // Add in the translation.
  vec2 position = rotatedPosition + u_translation;

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
let translationLocation = gl.getUniformLocation(program, "u_translation");
let translation = [0, 250]
let rotationLocation = gl.getUniformLocation(program, "u_rotation");
let rotation = [0, 1]
let scaleLocation = gl.getUniformLocation(program, "u_scale");
let scale = [1, 1]

// 创建 矩形 的 Float32Array
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

    // Set the translation.
    gl.uniform2fv(translationLocation, translation);

    // Set the rotation.
    gl.uniform2fv(rotationLocation, rotation);

    // Set the scale.
    gl.uniform2fv(scaleLocation,scale );
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
    console.log("rotation:",rotation)
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
    if(rotationAngle.value === 0){
        rotation[0]= Math.sin(0)
        rotation[1]= Math.cos(0)
    }
    else{
        rotation[0]= Math.sin(rotationAngle.value*Math.PI/180)
        rotation[1]= Math.cos(rotationAngle.value*Math.PI/180)
    }

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