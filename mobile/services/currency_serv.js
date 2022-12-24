import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function get_user_currency() 
{
    let currency = await AsyncStorage.getItem("currency");
    // let currency = localStorage.getItem("currency");
    if(currency == null)
    {
        AsyncStorage.setItem("currency","USD");
        return "USD";
        // localStorage.setItem("currency", "eth");
    }
    else{
        if(currency === "USD" || currency === "EUR" || currency === "TRY")
        {
            return currency;

        }
        AsyncStorage.setItem("currency","USD");
        return "USD";
    }
}

async function change_rate(unit) 
{
    await AsyncStorage.setItem("currency",unit);
    // localStorage.setItem("currency",unit);
}

async function get_current_rate()
{
    let userCrr = await get_user_currency();
    let rates = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms='+userCrr);
    while(rates === NaN)
    {
        rates = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms='+userCrr);
    }
    return [rates.data,userCrr];
}




async function convert_rate(money) 
{
    let rate = await get_current_rate();

    let new_money = money * rate[0][rate[1]];
    return [new_money, rate[1]];
}

const currency = {
    get_user_currency, change_rate, convert_rate, get_current_rate
}

export default currency;