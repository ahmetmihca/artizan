/* Remaining time of offer, to prevent typescript errors we use 'any' type*/

export default function getDayDifference(tdy:any, expDate:any)  {
    const diffTime = Math.abs(tdy - expDate);
    
    const minutes = 1000 * 60;
    const day = minutes * 60;
    const year = day * 24;

    if((diffTime) / (year * 365) > 1)
    {
        return Math.ceil(diffTime / (year * 365)).toString() + ' years'; 
    }

    if((diffTime / (year)) > 1)
    {
        return Math.ceil(diffTime / (year)).toString() + ' days'; 
    }
    if((diffTime / day) > 1 )
    {
        return Math.ceil(diffTime / (day)).toString() + ' hours';
    }
    return Math.ceil(diffTime / (day)).toString() + ' minutes';
}