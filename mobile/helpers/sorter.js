class Sorter{

    constructor(initial)
    {
        this.current = initial;
    }
    
    setCurrent(data)
    {
        this.current = data;
    }
    getCurrent(){ return this.current};

    getDeepCopy()
    {
        let temp = Array();
        this.current.forEach(element => {
            temp.push(element);
        });
        return temp;
    }
    newest()
    {
        let list = this.getDeepCopy().sort(function(a, b) {
            return a.token - b.token;
        });
        return list;
    }
}
export default Sorter;