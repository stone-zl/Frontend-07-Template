学习笔记
XML与SGML
使用white-space而不是nbsp
quote , amp, lt, gt
标签语义
参考wiki页面
合法元素
Element

Text

Comment

Document

ProcessingInstruction

CDATA XML继承来

字符引用
&#161; 
&amp;
&lt;
&quot;
浏览器API
DOM

Node
Element
HTMLElement (HTMLAnchorElement ...)
SVGElement
Document
CharacterData
Text
Comment
ProessingInstruction
DocumentFragment
DoumentType
导航类操作
parentNode

childNodes

firstChild

lastChild

nextSibling

previousSibling

parentElement

children

firstElementChild

lastElementChild

nextElementChild

previousElementSibling

修改操作
appendChild
insertBefore
removeChild
replaceChild
高级操作
compareDocumentPosition 用于比较两个节点中关系的函数
contains 检查一个节点是否包含另一个节点的函数
isEqualNode 检查两个节点是否完全相同
isSameNode 检查两个节点是否是同一个节点，可以在js中使用 ===
cloneNode 复制一个节点，传参数true可以做深拷贝
事件
addEventListener(type, listener, [, options])

options

capture 默认不传参数是冒泡
once
passive 阻止默认事件
冒泡与捕获

与事件的监听没有关系，任何一次事件中两者都会发生
先捕获（从外到内找到元素）后冒泡（层层向外触发）
Range
var range = new Range();
range.setStart(element, 9);
range.setEnd(element, 4);
var range = document.getSelection().getRangeAt(0)
对element偏移值是children，对text偏移值是字数

range.setStartBefore
range.setEndBefore
range.setStartAfter
range.setEndAfter
range.selectNode
range.selectNodeContents
var fragment = range.extractContents(); //删
range.insertNode(document.createTextNode('aaaa'));  // 加
CSSOM
document.styleSheets
Rules
document.styleSheets[0].cssRules
document.styleSheets[0].insertRule("p { color: red; }", 0)
document.styleSheets[0].removeRule(0)
CSSStyleRule

document.styleSheets[0].cssRules[0].style.color = 'red';
getComputedStyle
window.getComputedStyle(ele, pseudoEle)

getComputedStyle(document.querySelector('a'), '::before').color;
CSSOM view
window
window.innerHeight window.innerWidth

window.outerWidth window.outerHeight

window.devicePixelRatio

window.screen

window.screen.width
window.screen.height
window.screen.availWidth
window.screen.availHeight
window.open('about:blank', '_blank', 'width=100,height=100,left=100,right=100')

moveTo(x, y)

moveBy(x, y)

resizeTo(x, y)

resizeBy(x, y)

scroll
scrollTop

scrollLeft

scrollWidth

scrollHeight

scroll(x, y)

scrollBy(x, y)

scrollIntoView()

window

scrollX
scrollY
scroll(x, y)
scrollBy(x, y)
layout
getClientRects()
getBoundingClientRect()
其他
标准化组织
khronos
WebGL
ECMA
ECMAScript
WHATWG
HTML
W3C
webaudio
CG/WG