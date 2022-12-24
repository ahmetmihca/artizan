import { StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Text, View } from '../Themed';
import { ListItem} from '@rneui/themed';
import { useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CurrencyAsText from '../CurrencyAsText';
import getDayDifference from './DayDifference';
import currency from '../../services/currency_serv';
import { useTheme } from "../../hooks/colorSchemeSingleton";
import user_services from "../../services/user_serv";
import { useNavigation } from "@react-navigation/native";
/* An offer type includes: */
type Offer = {
    bidder: string,
    value: string,
}
/* accepty only offer lists*/
export default function Offers({props}:{props:any[]}) {
    const {theme} = useTheme();
    const notFound = <Icon name='alert' size={50} color={theme.textColorNotActive} style={{paddingRight:5, elevation:5}} />;
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
        {props && props.length !== 0 &&  props.map((val:Offer, index:number) => (
            <SingleOffer currency={crr} key={index} props={val}></SingleOffer>
        ))}
        {
            !props || props.length === 0 &&
            <View style ={{height: 300,width: '100%', flexDirection:'column', alignItems: 'center', justifyContent:'center'}}>
                {
                    notFound
                }
                <Text style={{color:theme.text, fontSize: 20, fontWeight:'bold'}}>There is no offers</Text>
            </View>
        }
    </View>
  );
}



const etherIcon = <Icon name='ethereum' size={20} color='#444971' style={{paddingRight:5, elevation:5}} />;

/* Today is a new day :) */
const today = new Date();



function SingleOffer({currency, props}: {props:Offer, currency:any}){
    const navigation = useNavigation();
    const [expanded,setExpanded] = useState(false);
    const [user, setUser] = useState(undefined);
    const [username, setUsername] = useState(props.bidder);
    const {theme} = useTheme();
    useEffect( () => {
        let isCancelled = false;
        async function getBidder(){
            user_services.get_user(props.bidder).then(
                  (val:any) => {
                      if(!isCancelled && val.user)
                      {
                        console.log(val.user);
                        setUser(val.user);
                        setUsername(val.user.name);
                      }
                  }
            );
        }
        getBidder();
    }, [])

    return (
    <View>
        <ListItem.Accordion 
            content={
                <>
                {
                <ListItem.Content style={styles.headerView}>
                    <View style={{backgroundColor:'transparent'}}>
                        <ListItem.Title style={[styles.title,{color: theme.text,}]}>{username.length> 20 ? username.substring(0,5) + '..' + username.substring(username.length-4): username}</ListItem.Title>
                        <Text style={[styles.textExpand,{color: theme.textColorNotActive,}]}>{!expanded ? '+ more': '- less'}</Text>
                    </View>
                    <View style={{backgroundColor:'transparent', justifyContent:'flex-end'}}>
                        <View style={{flex:1, flexDirection: "row", justifyContent: 'center', alignItems:'center', backgroundColor:'transparent'}}>
                            {etherIcon}
                            <Text>{parseInt(props.value)/10**18}</Text>
                        </View>
                        
                        {
                            props.value && currency &&
                            <CurrencyAsText currency={currency[1]} amount={currency[0][currency[1]]*parseInt(props.value)/10**18}></CurrencyAsText>

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
        
        <ListItem containerStyle={[styles.contentView,{backgroundColor: theme.backgroundSecondary,}]}>
            {/* <ListItem.Content style={styles.content}>
                <Text style={{color: theme.textColorNotActive}}>Floor Dif.</Text>
                <Text>17% below</Text>
            </ListItem.Content> */}
            <ListItem.Content style={styles.content}>
                <Text style={{color: theme.textColorNotActive}}>Quantity</Text>
                <Text>{1}</Text>
            </ListItem.Content>
            <ListItem.Content style={styles.content}>
                <Text style={{color: theme.textColorNotActive}}>From</Text>
                <TouchableOpacity onPress={() => {
                    if(user){
                        navigation.navigate('OtherUserProfileScreen',{
                            props: {id:user.id}
                        })
                    }
                }}>
                    <Text style={{color: theme.linkColor}}>{username}</Text>

                </TouchableOpacity>
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