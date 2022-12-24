import { TabButton } from "./TabBar";
import {useState} from 'react';
import { View } from "../Themed";
import { useTheme } from "../../hooks/colorSchemeSingleton";
import { TouchableOpacity } from "react-native";


type TabPropWrapper = {
  name: string,
  icon: string
}
type TabBarStyle ={
  width?: string| number | undefined
}
/* Main Tabbar */
/* screens prop example: [<ScreenComponent></ScreenComponent,<ScreenComponent2,/ScreenComponent2> ]*/
export default function TabBarConstant ({tabProps,screens, props, style} : {tabProps: TabPropWrapper[], screens:any[], props?: Object[], style?: TabBarStyle | undefined}) {
  const {theme} = useTheme();
  const [idx, setIdx] = useState(0);
  /* Defines which screen to show, not everything, ofcs*/
  const crrScr = screens[idx];
  return (
    <View style={{flex:1}}>
        <View style={{flexDirection:'row'}}>
        {/* Renders buttons automatically */}
        {
            tabProps.map((item, index) => {
                return (
                <TouchableOpacity key={index.toString() +'press'} onPress={() => setIdx(index)} style={{width: style?.width}}  >
                    <TabButton key={index.toString() + 'button'} style={style}  props={{name: item.name, icon: item.icon, active: idx === index ? true: false}}></TabButton>
                </TouchableOpacity>
                );
            })
        }
        {/* Renders selected screen */}
        </View>
        { crrScr }

    </View>
    
    
  );

}