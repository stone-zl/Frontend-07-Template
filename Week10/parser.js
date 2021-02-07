const css = require('css');
const EOF = Symbol('EOF');
const layout = require('./layout');

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [{ type: 'document', children: [] }];

let rules = [];

function addCSSRules (text) {
    let ast = css.parse(text);
    rules.push(...ast.stylesheet.rules);
}

// 没有考虑复合选择器
function match (element, selector) {
    if (!selector || !element.attributes) return false;

    // #id
    if (selector.charAt(0) == '#') {
        let attr = element.attributes.filter(a => a.name === 'id')[0];

        if (attr && attr.value === selector.replace('#', '')) {
            return true;
        }
    } else if (selector.charAt(0) === '.') { // .className
        let attr = element.attributes.filter(a => a.name === 'class')[0];

        if (attr && attr.value === selector.replace('.', '')) {
            return true;
        }
    } else if (element.tagName === selector) { // tag selector
        return true;
    }

    return false;
}

function specificity (selector) {
    let p = [0, 0, 0, 0];
    let selectorParts = selector.split(' ');

    for (let part of selectorParts) {
        if (part.charAt(0) === '#') {
            p[1] += 1;
        } else if (part.charAt(0) === '.') {
            p[2] += 1;
        } else {
            p[3] += 1
        }
    }

    return p;
}

function compare (sp1, sp2) {
    if (sp1[0] - sp1[0]) {
        return sp1[0] - sp1[0];
    }

    if (sp1[1] - sp1[1]) {
        return sp1[1] - sp1[1];
    }

    if (sp1[2] - sp1[2]) {
        return sp1[2] - sp1[2];
    }

    return sp1[3] - sp2[3];
}

function computeCss (element) {
    // console.log(rules)
    // console.log('compute css for element', element)
    // 考虑的简单选择器
    let elements = stack.slice().reverse(); // 获取父元素

    if (!element.computedStyle) {
        element.computedStyle = {};
    }

    for (let rule of rules) {
        let selectorParts = rule.selectors[0].split(' ').reverse(); // 没有考虑带逗号的

        if (!match(element, selectorParts[0])) {
            continue;
        }

        let matched = false;

        let j = 1; // 当前选择器的位置
        // i 当前元素的位置
        for (let i = 0; i < elements.length; i += 1) {
            if (match(elements[i], selectorParts[j])) {
                j += 1;
            }
        }

        if (j >= selectorParts.length) {
            matched = true;
        }

        if (matched) {
            // console.log('element', element, 'matched rule', rule);
            const sp = specificity(rule.selectors[0]);

            let computedStyle = element.computedStyle;
            for (let declaration of rule.declarations) {
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {}
                }

                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) { // 覆盖
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }
            }

            console.log(element.computedStyle)
        }

    }
}

function emit (token) {
    let top = stack[stack.length - 1];

    if (token.type === 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        };

        element.tagName = token.tagName;

        for (let p in token) {
            if (p !== 'type' && p != 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }

        computeCss(element);

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        }

        currentTextNode = null;
    } else if (token.type === 'endTag') {
        if (top.tagName !== token.tagName) {
            throw new Error("tag start end doesn't match");
        } else {
            if (top.tagName === 'style') {
                addCSSRules(top.children[0].content);
            }
            layout(top);
            stack.pop();
        }

        currentTextNode = null;
    } else if (token.type === 'text') {
        if (currentTextNode === null) {
            currentTextNode = {
                type: 'text',
                content: ''
            };

            top.children.push(currentTextNode);
        }

        currentTextNode.content += token.content;
    }
}

function data (c) {
    if (c == '<') {
        return tagOpen; // 标签开始
    } else if (c == EOF) {
        emit({
            type: 'EOF'
        });
        return;
    } else {
        emit({
            type: 'text',
            content: c
        });
        return data;
    }
}

function tagOpen (c) {
    if (c == '/') {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c);
    } else {
        return;
    }
}

function endTagOpen (c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c);
    } else if (c === '>') {

    } else if (c == EOF) {

    } else {

    }
}

// 左箭头开始 空格结束
// <div class="class-name"></div>
function tagName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == '/') {
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c == '>') {
        emit(currentToken);
        return data;
    } else {
        return tagName;
    }
}

function beforeAttributeName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === '>' || c === '/' || c === EOF) {
        return afterAttributeName;
    } else if (c === '=') {

    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c);
    }
}

function selfClosingStartTag (c) {
    if (c === '>') {
        currentToken.isSelfClosing = true;
        return data;
    } else if (c == EOF) {

    } else {

    }
}

function attributeName (c) {
    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c);
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (c === '\u0000') { // 空字符串

    } else if (c === '\"' || c === "'" || c === '<') {

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function beforeAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return beforeAttributeName;
    } else if (c === '"') {
        return doubleQuotedAttributeValue;
    } else if (c === "'") {
        return singleQuotedAttributeValue;
    } else if (c === '>') {

    } else {
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue (c) {
    if (c === "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue (c) {
    if (c === "'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}

function UnquotedAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === '\u0000') {

    } else if (c === '"' || c === "'" || c === '<' || c === '=' || c === "`") {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}

function afterQuotedAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}


function afterAttributeName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c);
    }
}


module.exports.parseHTML = function parseHTML (html) {
    let state = data;

    for (let c of html) {
        state = state(c);
    }

    state = state(EOF);
    return stack[0];
}