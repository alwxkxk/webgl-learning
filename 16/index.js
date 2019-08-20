const VertexSource = `
attribute vec4 a_position;
attribute vec4 a_color;
varying vec4 v_color;

void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_PointSize = 8.0;
  gl_Position = a_position;
  v_color = a_color;
}
`

const FragmentSource = `
precision mediump float;
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
`

const canvas = document.querySelector("#glcanvas");
const gl = canvas.getContext("webgl");

// Only continue if WebGL is available and working
if (gl === null) {
  alert("Unable to initialize WebGL. Your browser or machine may not support it.");
}

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
// 设置viewport，使正负1对应页面上的坐标
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


// 创建着色器
const vertexShader = createShader(gl, gl.VERTEX_SHADER, VertexSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FragmentSource);

// 连接程序
const program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);


/**
 *创建shader程序
 *
 * @param {*} gl
 * @param {*} type
 * @param {*} source
 * @returns
 */
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

/**
 *将shader程序连接成程序
 *
 * @param {*} gl
 * @param {*} vertexShader
 * @param {*} fragmentShader
 * @returns
 */
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

let colors;
// 随机生成若干颜色，保存到colors。
function getColors(number) {
  const data = [];
  for(let i=0;i<number;i++){
    data.push(255*Math.random(),255*Math.random(),255*Math.random())
  }
  colors = new Uint8Array(data)
  return colors;
}

/**
 * 逐点画
 *
 * @param {array} positionsData 顶点坐标
 * @param {number} vertexSize 每顶点所用的数据量
 * @param {*} primitive 图形
 */
function draw(positionsData,vertexSize,primitive) {
  const positions = positionsData;
  const size = vertexSize || 2;
  const count = positions.length / size;
  const primitiveType = primitive || gl.POINTS;

  // 下面几步，创建buffer，并赋予buffer数值
  // Create a buffer and put three 2d clip space points in it
  const positionBuffer = gl.createBuffer();

  // 将变量赋给WebGL内部全局变量gl.ARRAY_BUFFER
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  //最后一个参数gl.STATIC_DRAW是提示WebGL我们将怎么使用这些数据。WebGL会根据提示做出一些优化。 gl.STATIC_DRAW提示WebGL我们不会经常改变这些数据。
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.clearColor(0, 0, 0, 0);
  // gl.COLOR_BUFFER_BIT用于告诉gl.clear要清楚颜色buffer。
  gl.clear(gl.COLOR_BUFFER_BIT);


  //a_position 在vertex shader程序里定义为attribute vec4 a_position; 后面会定义如何拉取buffer里的数据
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  gl.enableVertexAttribArray(positionAttributeLocation);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const type = gl.FLOAT;   // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)


  // 颜色
  let colorLocation = gl.getAttribLocation(program, "a_color");
  let colorBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  getColors(count); //  colors 已存在随机颜色数据
  gl.bufferData(gl.ARRAY_BUFFER,colors,gl.STATIC_DRAW);
  //传入true 代表序列化 把0-255转成 0-1。gl.UNSIGNED_BYTE代表8位数据类型，即Uint8Array。
  gl.vertexAttribPointer(colorLocation,3,gl.UNSIGNED_BYTE, true, 0, 0);

  // 重新将ARRAY_BUFFER指向positionBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // 逐个顶点进行渲染
  for(let i = 1 ;i<=count;i++){
    setTimeout(() => {
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions.slice(0,i*size)), gl.STATIC_DRAW);
      gl.drawArrays(primitiveType, 0, i);
    }, 1000 * (i-1) );
  }
  showVertexColor(positions,size,count);
}


function getVertexSize() {
  return Number(document.getElementById("select-vertex-size").value);
} 

function getPrimitive() {
  const value = document.getElementById("select-primitive").value;
  switch (value) {
    case "gl.POINTS":
      return gl.POINTS;
    case "gl.LINE_STRIP":
      return gl.LINE_STRIP;
    case "gl.LINE_LOOP":
      return gl.LINE_LOOP;
    case "gl.LINES":
      return gl.LINES;
    case "gl.TRIANGLE_STRIP":
      return gl.TRIANGLE_STRIP;
    case "gl.TRIANGLE_FAN":
      return gl.TRIANGLE_FAN;
    case "gl.TRIANGLES":
      return gl.TRIANGLES;
    default:
      break;
  }
}

function getVertexData(){
  return document.getElementById("vertex").value.split(",").map((v)=>Number(v));
}

function setTips(text) {
  document.getElementById("tips").innerText = text;
}

function setVertex(text) {
  document.getElementById("vertex").value = text;
}

function showVertexColor(vertex,size,count) {

  let content="";
  for(let i =1;i<=count;i++){
    let offset = i*size
    let color = `rgb(${colors[i*3-3]},${colors[i*3-2]},${colors[i*3-1]})` 
    if(size === 2){
      content += `<div style="border-left:1rem solid ${color};"> ${i}: ${vertex[offset-2]} , ${vertex[offset-1]}</div>`
    }
    else if(size === 3){
      content += `<div style="border-left:1rem solid ${color};"> ${i}: ${vertex[offset-3]} ,${vertex[offset-2]} , ${vertex[offset-1]}</div>`
    }
    
  }
  document.getElementById("vertex-color-map").innerHTML = content;

}

function checkVertexArrayThenDraw() {
  let vertexArray = getVertexData()
  if(!vertexArray){
    setTips("异常：位置数据为空")
  }
  else if(vertexArray.length % getVertexSize() !== 0){
    setTips("异常：位置数据数量异常")
  }
  else{
    setTips("")
    // draw 
    draw(getVertexData(),getVertexSize(),getPrimitive());
  }
}

document.getElementById("vertex").onchange= checkVertexArrayThenDraw

document.getElementById("select-vertex-size").onchange = checkVertexArrayThenDraw

document.getElementById("select-primitive").onchange = checkVertexArrayThenDraw

document.getElementById("draw").onclick= checkVertexArrayThenDraw

// 矩形
document.getElementById("rect").onclick=()=>{
  setVertex("-0.5,-0.5,-0.5,0.5,0.5,0.5,0.5,-0.5")
  draw(getVertexData(),getVertexSize(),getPrimitive());
}

// 立方体

draw(getVertexData(),getVertexSize(),getPrimitive());