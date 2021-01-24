//状态机
function match(str){
    var state = start
    for(var item of str){
        state = state(item)
    }
    return state===end
}

function start(item){
    if(item =='a')return foundA
    else return start
}
function foundA(item){
    if(item =='b')return foundB
    else return start(item)
}
function foundB(item){
    if(item =='c')return foundC
    else return start(item)
}
function foundC(item){
    if(item =='d')return foundD
    else return start(item)
}
function foundD(item){
    if(item =='e')return foundE
    else return start(item)
}
function foundE(item){
    if(item =='f')return end
    else return start(item)
}
function end(item){
    return end
}

console.log(match('ababcdefss'))