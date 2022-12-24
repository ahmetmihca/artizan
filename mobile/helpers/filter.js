import asset_services from "../services/asset_serv";
import { useMutex } from 'react-context-mutex';



export default class Filter{
    
    async handleCollection(data)
    {
        
        this.mutex.lock();

        for(let i = 0 ; i < data.length ; i++)
        {
            await asset_services.get_asset_collection(data[i].contract, data[i].token).then(
                (val) =>
                {
                    this.collections.push(val);
                }
            )
        }

        
        this.mutex.unlock();
    }   
    constructor(rawArray)
    {
        this.rawArray = rawArray;
        this.currentArray = rawArray;
        this.afterSearch = rawArray;

        this.MutexRunner = useMutex();
        this.mutex = new this.MutexRunner("filter");

        this.collections =[];
        this.activeCategoryFilters = [];
        
    }
    categoryFilterHelper(item)
    {
        return this.activeCategoryFilters.includes(item.category.toLowerCase());
    }
    searchHandler(rawArray,filterWord)
    {
        let list = [];
        this.mutex.lock();
        

        for(let i = 0  ; i < rawArray.length ; i++)
        {
            if(
                rawArray[i].asset.name.toLowerCase().includes(filterWord.toLowerCase())&& this.collections[i] && this.collections[i].category && this.categoryFilterHelper(this.collections[i])
            )
                {
                    list.push(rawArray[i])
                }
        }
        this.mutex.unlock();

        return list;
    }
    addSearchFilter(data, filterWord)
    {
        
        if(filterWord.trim().length === 0)
        {
            return data;
        }
        let list =[];
        if(this.activeCategoryFilters.length === 0)
        {
            list = data.filter(
            function(s){
            
            return s.asset.name.toLowerCase().includes(filterWord.toLowerCase());
            });
        }
        else{
            this.mutex.lock();
            list = this.searchHandler(data, filterWord);
            this.mutex.unlock();
            
        }
        
        this.currentArray = list;
        this.afterSearch = this.currentArray;

        return this.currentArray;
    }
    
    

    async handleCategoryFilter(data)
    {
        this.mutex.lock();
        let newArray =[];
        console.log("data")
        console.log(data)
        if(this.collections.length ==0){
            await this.handleCollection(data);
        }
        console.log("collections");
        console.log(this.collections)
        for(let i = 0 ; i < this.collections.length; i++)
        {
            if(this.collections[i]._id != "" && this.collections[i].category && this.categoryFilterHelper(this.collections[i]))
            {
                newArray.push(data[i]);
            }
        }
        console.log("newarra")
        console.log(newArray)
        this.currentArray = newArray;
        this.mutex.unlock();
    }

    addCategoryFilter(data, whichCategory){
        this.activeCategoryFilters.push(whichCategory.toLowerCase());
        this.handleCategoryFilter(data,this.collections);
        return this.currentArray;
    }

    removeItem(array, item) {
    var i = array.length;

        while (i--) {
        if (array[i] === item) {
            array.splice(array.indexOf(item), 1);
        }
        }
    return array;
    }
    removeCategoryFilter(whichCategory,data)
    {
        const index = this.activeCategoryFilters.indexOf(whichCategory.toLowerCase());
        if(index <= -1)
        {
            return data;
        }
        this.activeCategoryFilters = this.removeItem(this.activeCategoryFilters, whichCategory.toLowerCase());
        console.log(this.activeCategoryFilters)
        if(this.activeCategoryFilters.length === 0)
        {
            this.currentArray = data;
            console.log("bcs of ?");
            return this.currentArray;
        }
        else{
            this.handleCategoryFilter(data);
            return this.currentArray;
        }
    }
}