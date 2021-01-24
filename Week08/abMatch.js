function state(str){
    for(var i=0;i<str.length;i++){
        if(str[i] =='a'&&str[i+1]=='b'){
            return true
        }
    }
    return false
}

//状态机实现
function state (str){
    let foundA = false
    for(var item of str){
        if(item =='a'){foundA=true}
        else if (foundA&&item=='b'){return true}
        else{foundA=false}
    }
    return false
}
console.log( state('acbc'))