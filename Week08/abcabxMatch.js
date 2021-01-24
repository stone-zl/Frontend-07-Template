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
function foundA (item){
    if(item =='b')return foundB
    else return start(item)
}
function foundB (item){
    if(item =='c')return foundC
    else return start(item)
}
function foundC(item){
    if(item=='a')return foundAA
    else start(item)
}
function foundAA(item){
    if(item =='b') return foundBB
    else return start(item)
}
function foundBB(item){
    if(item=='x') return end
    else return foundB(item)
}
function end(item){
    return end
}

console.log(match('abcabcabx'))