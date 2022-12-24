import React from 'react'
import { useState, useEffect } from 'react';
import { View, Text } from '../Themed';
const Timer = ({props, theme}: {props:any, theme: any}) => {
    const [biddingTime, setBiddingTime] = useState(props.time);
    
    useEffect(()=>{
        var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;
        var _day = _hour * 24;

        let bidCounter = setInterval(function () {
            var distance = (props.time * 1000) - Date.now();

            if (distance < 0) 
            {
                clearInterval(bidCounter);
                setBiddingTime('This Auction Ended!');
                return;
            }

            var days = Math.floor(distance / _day);
            var hours = Math.floor((distance % _day) / _hour);
            var minutes = Math.floor((distance % _hour) / _minute);
            var seconds = Math.floor((distance % _minute) / _second);
            if(days != NaN && hours != NaN && minutes != NaN && seconds != NaN)
            {
                setBiddingTime(days + ' days ' + hours + ' hrs ' + minutes + ' mins ' + seconds + ' secs');
            }
            

        }, 1000);
    });

    return (
        <View style={{flexDirection:'row',backgroundColor: theme.backgroundPrimary, justifyContent: 'center'}}>
            <Text style={{color: theme.text, fontSize: 16 }}>{ biddingTime + ' left for auction.'}</Text>
        </View>
    )
}

export default Timer;