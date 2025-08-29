

export function numToString(nber?:number):string{
    return nber?.toString()?.replace(".",",") ?? "-";
}


export function textToNum(text:string):number | undefined{
    return  parseFloat(text?.replace(",", ".")) || undefined;
}

export function getToDay(){
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

