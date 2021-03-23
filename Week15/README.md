学习笔记
组件化
1、组件的基本知识
1.1、组件的基本概念
1.2、对象 与 组件 区别
1.3、component（组件）各要素及信息流转
1.4、Attribute 与 Property 区别
1.5、如何设计组件状态
1.6、组件生命周期 Lifecycle
1.7、组件的子组件 Children
2、为组件添加jsx语法
2.1、搭建jsx环境
2.2、jsx的基本使用方法
3、实现轮播组件底层封装
3.1、将识别 jsx 语法的功能封装到底层 frameWork.js 中
3.2、顶层的 main.js 中只保留实际封装的 Carousel 功能
4、轮播动画
4.1、图片排版
4.2、main.js 中的 render 函数增加轮播逻辑，实现自动轮播
4.3、 实现拖拽
5、将 Carousel 类抽离到 jsx 文件夹下新建的 Carousel.js文件，并在 main.js 做引用；
6、动画
之前动画都是 css 写的，现在考虑如何使用 js 实现动画，动画最基础的能力是每帧执行一个什么样的基础事件。

6.1、 js 中几种处理帧的方案
16ms 计时器：正常人眼最高识别的帧是60帧，所以要16ms；
缺点不可控，会发生积压，故会选择以下两种；
setInterval(() => {}, 16);
16ms 延时器：
let tick = () => {
    setTimout(tick, 16);
}
现在浏览器支持的RAM:申请浏览器执行下一帧的时候执行该代码，跟浏览器的帧率相关。
concelAnimationFrame:避免资源浪费；
6.2、建立 Animation类（动画）、Timeline类（时间线） 的能力
建立时间线（Timeline类）
jsx 文件下，新建 animation 文件;
animation 文件中添加 私有tick(时间线)、Timeline类
根据时间线，将动画关联进时间线
animation 文件中添加 Animation 类
6.3、设计时间线中动画的延迟处理
6.4、完善 暂停（pause）、开始（resume） 逻辑
建立暂停/重启的环境

Animation.js 中增加以下逻辑：

Animation 类的 constructor 参数中增加 template；
reciveTime() 中通过 template 设置 css 属性的效果，用法见文件 animation-demo.js 中 tl.add() 的最后一个参数；
Timeline 类增加以下逻辑

pause() 中记录 PAUSE_START 为当前时间；
resume() 中根据 PAUSE_START 记录停止的时间 PAUSE_TIME ；
在 duringTimeCheck 的时间中加上 PAUSE_TIME ；
6.5、完善 延迟（delay）、时间线内动画形态函数（timingFunction/贝塞尔曲线功能） 逻辑
Timeline 类的 satrt() 中处理 delay 逻辑：

在 duringTimeCheck 的时间中减去 delay ；
若 duringTimeCheck 是负数则动画还未开始；
Animation 类的 reciveTime() 中，处理 TimingFunction 逻辑（增加贝塞尔曲线的功能）

增加 progress 进展接受 timingFunction 函数的返回值；
在 animation-demo.js 对 ease 不同的种类进行测试，并与 css 动画的 ease 进行对比；
6.6、为 Timeline 类增加状态管理
constructor 中为初始状态 "Inited";
start 中为状态 "Started"，必须由 "Inited" 状态进入;
pause 中为状态 "paused"，必须由 "Started" 状态进入;
resume 中进入状态 "Started"，必须由 "Paused" 状态进入;
reset 中进入状态 "Inited";
7、手势
7.1、基础手势体系