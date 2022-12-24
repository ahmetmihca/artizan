import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from "./../hooks/colorSchemeSingleton";



const DollarIcon = <Icon name='dollar' size={20} color='#444971' style={{paddingRight:5, elevation:5}} />;
const EurIcon = <Icon name='eur' size={15} color='#444971' style={{paddingLeft:5, paddingTop:3, elevation:5}} />;



// Usage: <CurrencyAsText amount={AnyAmountOfETH}></CurrencyAsText>
export default function CurrencyAsText({ amount , currency, color }: { amount: number, currency:string, color?:string}) {
    const {theme} = useTheme();
    color = color === undefined ? theme.textColorNotActive: color;
    const icon = currency ==="EUR" ? EurIcon : currency==="USD" ? DollarIcon : <Text> TL</Text>;
    return (
    
        <View style={{backgroundColor:'transparent', justifyContent:'center', alignItems:'center',flex:1, flexDirection:'row'}}>
            {
                <Text style={{textAlign: 'right', color:color,paddingRight:2}}>{amount.toFixed(2)}</Text>
            }
            {
                
                icon
            }
        </View>
    );
}

