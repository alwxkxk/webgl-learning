// 第一步，获取canvas元素并创建webgl上下文

const canvas:HTMLCanvasElement = document.querySelector("#glcanvas")
const gl = canvas.getContext("webgl")

if(!gl){
  alert("浏览器不支持webgl。")
}

gl.viewport(0,0,gl.canvas.width,gl.canvas.height)
gl.clearColor(0.0,0.0,0.0,1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

//第二步，创建vertex shader与fragment shader程序，连接起来并使用
// gl_Position 代表最终得到的点位置
// gl_FragColor 代码最终渲染的颜色

const VertexSource = `
attribute vec4 a_position;

void main(){
  gl_Position = a_position;
}

`

const FragmentSource = `
void main(){
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`
//创建vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader,VertexSource)
gl.compileShader(vertexShader)
//gl.COMPILE_STATUS ：GL常量，返回 是否编译成功
if(! gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
  alert("vertexShader 创建失败。")
}
//创建fragmentShader shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader,FragmentSource)
gl.compileShader(fragmentShader)
if(! gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
  alert("fragmentShader 创建失败。")
}

//创建并使用shader程序
const program = gl.createProgram()
gl.attachShader(program,vertexShader)
gl.attachShader(program,fragmentShader) //经测试，可attach多个shader。
gl.linkProgram(program)
if(! gl.getProgramParameter(program,gl.LINK_STATUS)){
  alert("shader 程序 创建失败")
}

gl.useProgram(program)

//第三步，传入顶点数据
//生成buffer数据（要使用gl内部创建的buffer，然后再将属于JS的数组数据转换放进去）
let positionBuffer = gl.createBuffer()
let position = [
  0,0,
  0,0.5,
  0.7,0,
]
// gl.ARRAY_BUFFER: Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
// 所有数据都是放到ARRAY_BUFFER里，再通过指针来确定位置来使用，这里先把数据放到ARRAY_BUFFER里。
gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer)
// gl.STATIC_DRAW: GL常量，提示这个buffer数据是经常用到并且不会经常改变
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(position),gl.STATIC_DRAW)
//得到attribute的位置 index值，当没找到时返回-1，找到指针指向a_positiion的位置index（由于是position数据是第一个放的，所以这里返回的是0。）。（GLint 32位的数据）
let positionAttribute = gl.getAttribLocation(program,"a_position")
// GPU维护 attribute列表，默认不使用，需要先开启才能继续调用其它相关API
gl.enableVertexAttribArray(positionAttribute)
// 设置如何读取attrib

//告诉显卡从当前绑定的缓冲区（ARRAY_BUFFER）中读取数据，通过指针确定开始位置，通过大小确定要读多少个，而不会读到属于其它变量的ARRAY_BUFFER数据。 
// https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
// void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
gl.vertexAttribPointer(positionAttribute,2,gl.FLOAT,false,0,0)
// 渲染图形 renders primitives from array data
gl.drawArrays(gl.TRIANGLES,0,3)
