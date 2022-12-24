import { FlatList, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import React from 'react';
import { Text, View } from '../Themed';
import { useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from "../../hooks/colorSchemeSingleton";

/* TabButton's prop initialization - to prevent TypeScript Errors*/
type TabPropType = {
  name: string,
  icon: string,
  active: boolean,
}
type TabButtonStyle = 
{
  width?:  string | number | undefined
}
/* Button for tabs, do not use this function*/
export function TabButton({props, style}: {props:TabPropType, style?: TabButtonStyle | undefined}){
  const {theme} = useTheme();
  const myIcon = <Icon name={props.icon} size={20} color={props.active ? theme.text : theme.iconColorPrimary}  style={{paddingRight:5, elevation:5}} />;
    return (
      <View style={!props.active ? [styles.tabButtonView,{backgroundColor: theme.backgroundSecondary,width: style && style.width ? style.width: 150}] : [styles.activeTabButton, {backgroundColor: theme.backgroundSecondary,width: style && style.width ? style.width: 150}]}>
        <View style={{backgroundColor: 'transparent', justifyContent:'center', alignItems:'center', flexDirection:'row', flex:1}}>
          {myIcon}
        <Text style={{color: props.active ? theme.text : theme.textColorNotActive}}>{props.name}</Text>
        </View>
        
        {
          props.active &&
          <View style={[styles.indicator,{backgroundColor:theme.blue}]}></View>

        }
      </View>
    );
}
/* To prevent typescript error, a wrapper which will decide buttons' name and icon */
type TabPropWrapper = {
  name: string,
  icon: string
}
type TabBarStyle ={
  width?: string| number | undefined
}
/* Main Tabbar */
/* screens prop example: [<ScreenComponent></ScreenComponent,<ScreenComponent2,/ScreenComponent2> ]*/
export default function TabBar ({tabProps,screens, props, style} : {tabProps: TabPropWrapper[], screens:any[], props?: Object[], style?: TabBarStyle | undefined}) {
  const {theme} = useTheme();
  const [idx, setIdx] = useState(0);
  /* Defines which screen to show, not everything, ofcs*/
  const crrScr = screens[idx];
  return (
    <View>
        {/* Renders buttons automatically */}
        <FlatList
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        
        horizontal
        data={tabProps}
        renderItem={({item,index}) => (
        <TouchableOpacity  onPress={() =>{setIdx(index);}}>
          <TabButton style={style} key={index} props={{name:item.name,icon: item.icon,active: idx === (index)}}></TabButton>
        </TouchableOpacity>
        )
      }
      
      keyExtractor={(item,index) => index.toString()}
      />
    {/* Renders selected screen */}
    { crrScr }
    </View>
    
  );

}


const styles = StyleSheet.create({
  styleExample: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  tabButtonView: {
    alignItems:'center',
    justifyContent:'center',
    height:60,
    width: 150
  },
  activeTabButton: {
    position: 'relative',
    alignItems:'center',
    justifyContent:'center',
    height: 60,
    width: 150,
  },
  indicator:{
    position: 'absolute',
    bottom: 0,
    height: 5,
    width: 130,
    borderTopEndRadius: 3,
    borderTopLeftRadius: 3,
  }
  
});
