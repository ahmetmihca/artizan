import { StyleSheet,View, TouchableOpacity, Text} from 'react-native';
import { useState, useEffect } from 'react';

import currency from '../../services/currency_serv';
import { useTheme } from "../../hooks/colorSchemeSingleton";
import { FontAwesome } from '@expo/vector-icons';
// Usage: Just call <SwitchCurrency></SwitchCurrency>

export default function SwitchCurrency() {
    const {theme} = useTheme();
    // To get real data
    const [check, setCheck] = useState<string | null>(null);
    // To maintain fast clicks
    const [local, setLocal] = useState<string | null>(null);
    // get data and maintain check
    useEffect(() => {
    async function checkData() {
        const data = await currency.get_user_currency();
        setCheck(data);
        setLocal(data);
    }
    checkData();
    }, [check]);

    
    // currency.change_rate('EUR');
    //             setLocal('EUR');
    return (

    <View style={[styles.chipView,{backgroundColor:theme.backgroundPrimary}]}>
        {
            // Until load, do not show any chips
            check && 
            <TouchableOpacity style={[{backgroundColor: local == "USD"? theme.buttons.checkButton.activeBackground : theme.buttons.checkButton.passiveBackground, borderColor: theme.buttons.checkButton.borderColor},styles.filterStyle]} onPress={() => {
                currency.change_rate('USD');
                setLocal('USD');
            }}>
                <FontAwesome name='dollar' color={local == "USD" ? theme.buttons.checkButton.textColorActive : theme.buttons.checkButton.iconColorPassive} size={18}></FontAwesome>
                <Text style={{color: local !== "USD" ? theme.buttons.checkButton.textColorPassive: theme.buttons.checkButton.textColorActive, paddingLeft: 5}}>USD</Text>
            </TouchableOpacity>
        }
        {
            // Until load, do not show any chips
            check && 
            <TouchableOpacity style={[{backgroundColor: local == "EUR"? theme.buttons.checkButton.activeBackground : theme.buttons.checkButton.passiveBackground, borderColor: theme.buttons.checkButton.borderColor},styles.filterStyle]} onPress={() => {
                currency.change_rate('EUR');
                setLocal('EUR');
            }}>
                <FontAwesome name='euro' color={local == "EUR"? theme.buttons.checkButton.textColorActive : theme.buttons.checkButton.iconColorPassive} size={18}></FontAwesome>
                <Text style={{color: local !== "EUR" ? theme.buttons.checkButton.textColorPassive: theme.buttons.checkButton.textColorActive, paddingLeft: 5}}>EUR</Text>
            </TouchableOpacity>
        }
        {
            // Until load, do not show any chips
            check && 
            <TouchableOpacity style={[{backgroundColor: local == "TRY"? theme.buttons.checkButton.activeBackground : theme.buttons.checkButton.passiveBackground, borderColor: theme.buttons.checkButton.borderColor},styles.filterStyle]} onPress={() => {
                currency.change_rate('TRY');
                setLocal('TRY');
            }}>
                <FontAwesome name='try' color={local == "TRY"? theme.buttons.checkButton.textColorActive : theme.buttons.checkButton.iconColorPassive} size={18}></FontAwesome>
                <Text style={{color: local !== "TRY" ? theme.buttons.checkButton.textColorPassive: theme.buttons.checkButton.textColorActive, paddingLeft: 5}}>TRY</Text>
            </TouchableOpacity>
        }
        
    </View>
    );
}

const styles = StyleSheet.create({
  chipView: {
      flexDirection:'row',
      height:undefined,
      
  },
  filterStyle:{
    height: 40, 
    alignItems: 'center',
    justifyContent:'center', 
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
});
