import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '.././Themed';
import trade_services from '../../services/market_serv';
import SellButton from '../buttons/SellButton';
import AuctionButton from '../buttons/AuctionButton';
// This is a component prototype to develop faster, used for copy-paste

export default function SellNft({ props }: { props: any }) {
  return (
    <View style={[styles.view,{backgroundColor: props.theme.backgroundSecondary}]}>
      <View style={[styles.wrapper,{backgroundColor: props.theme.backgroundSecondary}]}>
        <AuctionButton contract={props.contract} token={props.tokenID}></AuctionButton>
        <SellButton contract={props.contract} token={props.tokenID}></SellButton>
      </View>
      
    </View>
  );
}



const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    bottom: 0,
    height: 75,
    right: 0,
    width: '100%',
    zIndex: 3,
    flexDirection: 'row',
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  wrapper:{
    width: 120,
    justifyContent: 'space-between',
    flexDirection: 'row',

  }
  
});
