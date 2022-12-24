import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';
import { ListItem} from '@rneui/themed';
import { useState ,useEffect} from 'react';
import CurrencyAsText from '../CurrencyAsText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {default as FontAwesomeIcon} from 'react-native-vector-icons/FontAwesome';
import currency from '../../services/currency_serv';
import user_services from '../../services/user_serv';
import { useTheme } from "../../hooks/colorSchemeSingleton";
import transaction_serv from '../../services/transaction_serv';
import LoadingIndicator from '../loading/LoadingIndicator';



type ItemActivity = {
    type: string,
    amount?: number,
    quantity?: number
    from?: string,
    date: Date,
    to?: string,
};


export default function ItemActivity({ props, check, id }: { props: ItemActivity[] , check?: boolean | undefined, id?:string | undefined}) {
    const {theme} = useTheme();
    // Icons
    
    const notFound = <Icon name='alert' size={50} color={theme.textColorNotActive}></Icon>;
    const forward = <FontAwesomeIcon name='forward' size={20} color={theme.textColorNotActive}></FontAwesomeIcon>;
    console.log(props);
    const backward = <FontAwesomeIcon name='backward' size={20} color={theme.textColorNotActive}></FontAwesomeIcon>;
    const [crr, setCurrency] = useState<any>([{'EUR':1},'EUR']);
    const [ifUser, setIfUser] = useState<boolean | undefined>(check);
    const [wasThere, setWasThere] = useState<any>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState(props);
    const [page, setPage] = useState(1);
    useEffect(() => {
        let isMounted = true;
        async function checkData() {
            if(isMounted)
            {
                const tempcrr = await currency.get_current_rate();
                setCurrency(tempcrr);
            }
          
          }
        async function getPaginated()
        {
            if(!ifUser)
            {
                transaction_serv.getUserTransactions(id, page).then((val) => {
                      if(isMounted)
                      {
                        setTransactions(val);
                        setIsLoading(false);
                        setWasThere(true);
                      }
                });
                console.log("here");
            }
            else{
                setIsLoading(false);
            }
        }
        checkData();
        getPaginated();
        return () => { isMounted = false };
         
    }, [page]);

    return(
    <View>
        {
            isLoading &&
            <View style={{height: 300, backgroundColor: theme.backgroundPrimary}}>
                <LoadingIndicator></LoadingIndicator>

            </View>    
        }
      {!isLoading && transactions && transactions.length !== 0 && transactions.slice(0).reverse().map((val, index:number) => (
            <SingleItemActivity check={check} currency={crr} key={index} props={val}></SingleItemActivity>
        ))}
        {
            ((transactions && transactions.length !== 0) || (wasThere))&&
            <View style={styles.paginationView}>
                {
                    page != 1 && 
                        <TouchableOpacity style={[styles.pageButton, {backgroundColor: theme.backgroundSecondary}]} onPress={() => {
                        setIsLoading(true);
                        let newPage = page-1 ;
                        setPage(newPage);
                        }}>
                    {
                        backward
                    }
                    </TouchableOpacity>
                    
                }
                {
                    page == 1 &&
                    <View style={[styles.pageButton, {elevation:0}]}></View>
                }
                
                <Text style={styles.pageTitle}>{page}</Text>
                {   (!transactions || transactions.length !== 0) &&
                    <TouchableOpacity style={[styles.pageButton, {backgroundColor: theme.backgroundSecondary}]} onPress={() => {
                    setIsLoading(true);
                    let newPage = page+1 ;
                    setPage(newPage);
                    }}>
                    {
                        forward
                    }
                </TouchableOpacity>
                }
                {
                    (transactions.length == 0 || !transactions) &&
                    <View style={[styles.pageButton, {elevation:0}]}></View>
                }
                
            </View>
        }
        {
            (!transactions || transactions.length === 0) &&(!isLoading) && (!wasThere) &&
            <View style ={{height: 300,width: '100%', flexDirection:'column', alignItems: 'center', justifyContent:'center'}}>
                {
                    notFound
                }
                <Text style={{color:theme.text, fontSize: 20, fontWeight:'bold'}}>There is no item activity</Text>
            </View>
        }
        
    </View>
  );
}

const etherIcon = <Icon name='ethereum' size={20} color='#444971' style={{paddingRight:5, elevation:5}} />;

function SingleItemActivity({props, currency, check = true}: {props:any, currency:any, check: boolean | undefined}){
    const {theme} = useTheme();
    const [expanded,setExpanded] = useState(false);
    const [fromUser, setFromUser] = useState<any>(undefined);
    const [toUser, setToUser] = useState<any>(undefined);
    const [transactionDetails, setTransactionDetails] = useState<any>(undefined);
    const Bid = <FontAwesomeIcon name='hand-paper-o' size={20} color={theme.text}></FontAwesomeIcon>;
    const Sale = <FontAwesomeIcon name='shopping-cart' size={20} color={theme.text}></FontAwesomeIcon>;
    // const Transfer = <Icon name='swap-horizontal' size={20} color={theme.text}></Icon>;
    const List = <FontAwesomeIcon name='tag' size={20} color={theme.text}></FontAwesomeIcon>;
    const Minted = <Icon name='stamper' size={20} color={theme.text}></Icon>;
    const Transfer = <Icon name='transfer' size={20} color={theme.text}></Icon>;
    const Auction = <Icon name='alpha-a' size={20} color={theme.text}></Icon>;
    console.log(transactionDetails)
    useEffect(() => {
        
        let isCancelled = false;
        async function checkFrom() {
        
            if(props.from && parseInt(props.from,16) !== 0)
            {
                user_services.get_user(props.from).then(
                  (val:any) => {
                      if(!isCancelled)
                      {
                        setFromUser(val.user);
                      }
                  }
              )
            }
              
          }
          async function checkTo() {
            if(props.to && parseInt(props.to,16) !== 0)
            {
                user_services.get_user(props.to).then(
                  (val:any) => {
                      if(!isCancelled)
                      {
                        setToUser(val.user);
                      }
                  }
              )
            }
              
          }
          async function getTransaction()
          {
              if(check)
              {
                 transaction_serv.getTransaction(props.tx_hash).then((val) => {
                   setTransactionDetails(val);
                 });
              }
              else{
                  setTransactionDetails(props);
              }
              
          }
        checkFrom();
        checkTo();
        getTransaction()
        return () => { isCancelled =true};
         

    }, []);
  return (
    <View>
        <ListItem.Accordion 
            content={
                <>
                {
                <ListItem.Content style={styles.headerView}>
                    
                    <View style={{backgroundColor:'transparent', flexDirection: 'row', alignItems:'center'}}>
                        {
                            transactionDetails && transactionDetails.type === 'Bidding' && Bid
                        }
                        {
                            transactionDetails && transactionDetails.type === 'Auction' && Auction
                        }
                        {
                           transactionDetails && transactionDetails.type === "Sale" &&
                           Sale
                        }
                        {
                            props.type === 'Transfer' && Transfer
                        } 
                        {
                            transactionDetails && transactionDetails.type === "Listing" && List
                        }
                        {
                            transactionDetails && transactionDetails.type === "Mint" && Minted
                        }
                        
                        <View style={{backgroundColor:'transparent', marginLeft: 10}}>
                            
                            {
                                transactionDetails&&
                                <ListItem.Title style={{color:"white"}}>{transactionDetails.type}
                                </ListItem.Title>
                            }
                           
                            <Text style={[styles.textExpand,{color: theme.textColorNotActive}]}>{!expanded ? '+ more': '- less'}</Text>
                        </View>
                        
                    </View>
                    <View style={{backgroundColor:'transparent', justifyContent:'flex-end'}}>
                        { transactionDetails && transactionDetails.value != 0 &&
                            <View style={{flex:1, flexDirection: "row", justifyContent: 'center', alignItems:'center', backgroundColor:'transparent'}}>
                                 {etherIcon} 
                                 
                                <Text>{transactionDetails.value.toString().length < 10 ? transactionDetails.value: (transactionDetails.value.toString().substring(0,5) + '..' + transactionDetails.value.toString().substring(transactionDetails.value.toString().length -3))}</Text> 
                            </View>
                        }
                        
                        {
                            transactionDetails && transactionDetails.value !=0  && currency &&
                            <CurrencyAsText currency={currency[1]} amount={currency[0][currency[1]]*transactionDetails.value}></CurrencyAsText>

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
            {   transactionDetails && transactionDetails.value != 0 &&
                <ListItem.Content style={styles.content}>
                <Text style={{color: theme.textColorNotActive}}>{currency[1]}</Text>
                {
                    transactionDetails.value && currency &&
                    <CurrencyAsText currency={currency[1]} amount={currency[0][currency[1]]*transactionDetails.value}></CurrencyAsText>

                } 
            </ListItem.Content>
            }
            
            {   
            props.quantity &&
                <ListItem.Content style={styles.content}>
                    <Text style={{color: theme.textColorNotActive}}>Quantity</Text>
                    <Text>{props.quantity}</Text>
                </ListItem.Content>
            }
            {
                props.from && !fromUser&&
                <ListItem.Content style={styles.content}>
                    <Text style={{color: theme.textColorNotActive}}>From</Text>
                    <TouchableOpacity>
                        <Text style={{color: theme.linkColor}} numberOfLines={1}>{props.from}</Text>
                    </TouchableOpacity>
                </ListItem.Content>
            }
            {
                props.from && fromUser &&
                <ListItem.Content style={styles.content}>
                    <Text style={{color: theme.textColorNotActive}} >From</Text>
                    <TouchableOpacity>
                        <Text style={{color: theme.linkColor}} numberOfLines={1}>{fromUser.username}</Text>
                    </TouchableOpacity>
                </ListItem.Content>
            }
            
            {
                props.to && !toUser &&
                <ListItem.Content style={styles.content}>
                <Text style={{color: theme.textColorNotActive}}>To</Text>
                <TouchableOpacity>
                    <Text style={{color: theme.linkColor}} numberOfLines={
                    1
                    }>{props.to}</Text>

                </TouchableOpacity>
            </ListItem.Content>
            }
            {
                props.to && toUser &&
                <ListItem.Content style={styles.content}>
                <Text style={{color: theme.textColorNotActive}}>To</Text>
                <TouchableOpacity>
                    <Text style={{color: theme.linkColor}} numberOfLines={1}>{toUser.username}</Text>

                </TouchableOpacity>
            </ListItem.Content>
            }
            
            
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
      alignItems: 'center',
  },
  content:{
      justifyContent: 'center',
      alignItems: 'center'
  },
  
  title:{
      fontWeight: 'bold',
      fontSize: 16
  },
  pageTitle:{
    marginHorizontal:10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  paginationView: {
      marginVertical:10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems:'center'
  },
  pageButton: {
      width: 50,
      height: 50,
      borderRadius:10,
      elevation: 8,
      alignItems:'center',
      justifyContent:'center'
  }
  
});
