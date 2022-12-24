import { StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Text, View } from '../Themed';
import { ListItem} from '@rneui/themed';
import { useState, useEffect} from 'react';
import { useTheme } from "../../hooks/colorSchemeSingleton";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CurrencyAsText from '../CurrencyAsText';
import getDayDifference from './DayDifference';
import currency from '../../services/currency_serv';


type Listing = {
    from: string,
    quantity: number,
    amount: number,
    expirationDate: Date
}

export default function Listings({props}: {props: Listing[]}) {
    const {theme} = useTheme();
    const notFound = <Icon name='alert' size={50} color={theme.textColorNotActive}></Icon>;
    const [crr, setCurrency] = useState<any>([{'EUR':1},'EUR']);
    useEffect(() => {
        let isMounted = true;
        async function checkData() {
            if(isMounted)
            {
                const tempcrr = await currency.get_current_rate();
                setCurrency(tempcrr);
            }
          
          }
        checkData();
        return () => { isMounted = false };
         

    }, []);
  return (
    <View>
      {props && props.length !== 0 && props.map((val:Listing, index:number) => (
            <SingleListing currency={crr} key={index} props={val}></SingleListing>
        ))}
        {
            !props || props.length === 0 &&
            <View style ={{height: 300,width: '100%', flexDirection:'column', alignItems: 'center', justifyContent:'center'}}>
                {
                    notFound
                }
                <Text style={{color:theme.text, fontSize: 20, fontWeight:'bold'}}>There is no listings</Text>
            </View>
        }
    </View>
  );
}



const etherIcon = <Icon name='ethereum' size={20} color='#444971' style={{paddingRight:5, elevation:5}} />;


/* Today is a new day :) */
const today = new Date();


function SingleListing({props, currency}: {props:Listing, currency:any}){
    const [expanded,setExpanded] = useState(false);
    const {theme} = useTheme();

    return (
    <View>
        <ListItem.Accordion 
            content={
                <>
                {
                <ListItem.Content style={styles.headerView}>
                    <View style={{backgroundColor:'transparent'}}>
                        <ListItem.Title style={[styles.title,{color: theme.text}]}>{props.from}</ListItem.Title>
                        <Text style={[styles.textExpand,{color: theme.textColorNotActive,}]}>{!expanded ? '+ more': '- less'}</Text>
                    </View>
                    <View style={{backgroundColor:'transparent', justifyContent:'flex-end'}}>
                        <View style={{flex:1, flexDirection: "row", justifyContent: 'center', alignItems:'center', backgroundColor:'transparent'}}>
                            {etherIcon}
                            <Text>{props.amount}</Text>
                        </View>
                        
                        {
                            props.amount && currency &&
                            <CurrencyAsText currency={currency[1]} amount={currency[0][currency[1]]*props.amount}></CurrencyAsText>

                        } 
                         
                    </View>
                </ListItem.Content>
                }
                </>
            }
            noIcon
            isExpanded={expanded}
            onPress={() => {
                setExpanded(!expanded);
                
            }}
            containerStyle ={[styles.header,{backgroundColor: theme.backgroundSecondary,}]}
      >
        
        <ListItem containerStyle={[styles.contentView,{backgroundColor: theme.backgroundSecondary}]}>
            <ListItem.Content style={styles.content}>
                <Text style={{color: theme.textColorNotActive}}>USD</Text>
                {
                    props.amount && currency &&
                    <CurrencyAsText currency={currency[1]} amount={currency[0][currency[1]]*props.amount}></CurrencyAsText>

                } 
            </ListItem.Content>
            <ListItem.Content style={styles.content}>
                <Text style={{color: theme.textColorNotActive}}>Quantity</Text>
                <Text>{props.quantity}</Text>
            </ListItem.Content>
            <ListItem.Content style={styles.content}>
                <Text style={{color: theme.textColorNotActive}}>From</Text>
                <TouchableOpacity>
                    <Text style={{color: theme.linkColor}}>{props.from}</Text>

                </TouchableOpacity>
            </ListItem.Content>
            <ListItem.Content style={styles.content}>
                <Text style={{color: theme.textColorNotActive}}>Expires</Text>
                <Text>{getDayDifference(today,props.expirationDate)}</Text>
            </ListItem.Content>
            
        </ListItem>
      </ListItem.Accordion>
      

    </View>
    );
}

const styles = StyleSheet.create({
  header: {
      height: 80,
      marginBottom: 1
  },
  headerView:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between'
  },
  textExpand:{
      fontSize: 12
  },
  contentView:{
      marginBottom:13,
      flex: 1,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center'
  },
  content:{
      justifyContent: 'center',
      alignItems: 'center'
  },
  title:{
      fontWeight: 'bold',
      fontSize: 16
  }
  
});
