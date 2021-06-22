# webgl-learning
WebGL个人学习代码记录

除了需要加载图片的需要运行http-server，其它的直接点击打开网页即可。
## 参考学习资料
- [MDN WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [webglfundamentals](https://webglfundamentals.org/webgl/lessons/zh_cn/)
## 目录
- 1 创建WebGL环境
- 2 MDN第二个例子，最好了解一些3D 矩阵的基本知识，才能搞明白。 其中`index2.html`验证了alpha 以及 Z坐标的作用。
- 3 画一个三角形
[例子来源](https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html)
- 4 传入两次 顶点数据(WebGL How It Works 第二个例子)
- 5 用TS自行重写一次3，并写好对应步骤，方便回忆。
- 6 加载图片作为纹理，由于跨域问题所以必须以http服务运行：`http-server . -p 8000`
- 7 未完成，图片处理，多纹理效果共同作用，暂时跳过。
- 8 2D矩形:可输入 坐标、宽高。
- 9 2D矩形：将网页坐标转换成投影坐标(注意，转换之后，canvas里的Y轴就跟网页一样是向下的。)
- 10 2D矩形：平移、旋转、缩放。 注意初始坐标与平移的区别，旋转是依据初始坐标来变化。改变初始坐标会影响旋转效果，改变平移不会影响旋转效果。
- 11 2D矩形：使用矩阵实现 平移、旋转、缩放。使用矩阵能简化复杂的运算。
- 12 2D矩形：围绕中心旋转（向中心偏移）
- 13 3D矩形：只画了两面，实现旋转。
- 14 3D矩形：六面，实现旋转。（特别注意，当不使用开启`gl.enable(gl.CULL_FACE);`时，后画的图形会覆盖旧画的图形，所以与正真的3D不一样，不是依赖前面挡住后面的，背面的灰色不管怎么旋转都是看不到的。开启`gl.enable(gl.CULL_FACE);`，不渲染背面图形，特别地3D矩形绘点时要顺时针，这样旋转过来的时候才能看到背面。同时开启`gl.enable(gl.DEPTH_TEST);`，绘点时会判断深度，至此真3D的效果出来了。）
- 15 复制星球例子，用于学习 坐标矩阵。
- 16 个人制作小演示:逐步渲染点。