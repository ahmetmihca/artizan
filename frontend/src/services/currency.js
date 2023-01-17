import axios from "axios";

function get_user_currency()
{
    let currency = localStorage.getItem("currency");
    if(currency == null)
    {
        localStorage.setItem("currency", "matic");
    }
    else{
        return currency;
    }
}

function change_rate(unit)
{
    localStorage.setItem("currency",unit)
}

async function get_current_rate()
{
    let rates = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=MATIC&tsyms=USD,TRY');
    console.log(rates);
    return rates.data;
}
async function convert_rate(money)
{
    let unit = get_user_currency();
    let rate = await get_current_rate();
    if(unit == 'usd'){
        money = money * rate.USD;    
    }
    else if(unit == 'try'){
        money = money * rate.TRY;
    }
    else if(unit == 'MATIC'){
        money = money;
    }
    return money;
}

const currency = {
    get_user_currency, change_rate, convert_rate, get_current_rate
}

export default currency;