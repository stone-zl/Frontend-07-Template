function match(str){
    var state = start
    var index =0
    for(var item of str){
        state=state(item)
    }
    return state===end
    function start(item){
        if(item =='a'){
            return foundA
        }
        else{
            index=0
            return start
        }
    }
    function foundA(item){
        if(item=='b')return foundB
        else return start(item)
    }
    function foundB(item){
        index++
        if(item =='x'&&index>=3) return end
        else return start(item)
    }
    function end(item){
        return end
    }
}

console.log(match('abxababxdef'))