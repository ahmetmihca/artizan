import { StyleSheet,Image, TouchableOpacity, TextInput, ScrollView,SafeAreaView,Dimensions  } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import UploadFile from '../components/UploadFile';
import { Input, ListItem, Divider, Button, ThemeContext} from '@rneui/themed';
import BackButton from '../components/buttons/BackButton';
import collection_services from '../services/collection_serv';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { get_nonce } from '../services/login_serv';
import { login } from '../services/login_serv';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import { useCallback } from 'react';
import { getDocumentAsync } from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutex } from 'react-context-mutex';
import { useTheme } from '../hooks/colorSchemeSingleton';
import { CreateCollectionExplanations } from '../data/pages/createCollection';


const initialValues: any = {
  name: "",
  description: "",
  earning: "",
  uri: undefined,
  banneruri: undefined,
  featureduri: undefined
};
export default function CreateCollectionScreen({ navigation }: RootTabScreenProps<'CreateCollectionScreen'>) {
  const {theme} = useTheme();
  const [formData, setFormData ] = useState(initialValues);
  const [expanded, setExpanded] = useState(false);
  const [nameError,setNameError] = useState<string | undefined>(undefined);
  const [earningError,setEarningError] = useState<string | undefined>(undefined);
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | undefined>(undefined);
  const handleInputChange = (name: string,value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nameRef = React.createRef<any>();
  const earningRef = React.createRef<TextInput | any>();
  const connector = useWalletConnect();

  async function submitHandler(e:any){

    if(!nameRef || !nameRef.current || formData.name == "")
    {
      nameRef!.current!.shake();
      setNameError("You must decide a name!");
    }
  else{
    if(formData.uri == undefined)
      {
        alert("You should choose a logo!");
        setNameError(undefined);
      }
      else{
        // try{
          setIsLoading(true);
          const token = await AsyncStorage.getItem('token')
          
          if(token == null)
          {
            let walletId = connector.accounts[0].toLowerCase();

            let res = await get_nonce(walletId);

            let signature = await connector.signPersonalMessage([res.user.nonce, walletId]);

            let res2 = await login(res.user.nonce, signature);
            
            await AsyncStorage.setItem('token',res2.token);
          }
          
          await collection_services.create_collection(formData.uri,formData.banneruri,formData.featureduri,formData.name,formData.description,formData.earning,token);

          setIsLoading(false);
          navigation.navigate('ProfileScreen');
        // }catch(e){
        //   console.log(e.toString());
            
        // }
        
      }
    } 
  }
  const mimetype = (name:string) => {
    let allow: any = {"png":"image/png","pdf":"application/json","jpeg":"image/jpeg", "jpg":"image/jpg"};
    let extention = name.split(".")[1];
    if (allow[extention] !== undefined){
      return allow[extention]
    }
    else {
      return undefined
    }
  }

  const MutexRunner = useMutex();
  const mutex = new MutexRunner('myUniqueKey1');
  async function handleDocument(val:any){
      mutex.lock();
      try {
      getDocumentAsync(
        {
          type: ["image/*"]
        }
      ).then((response:any) => {
        response.type = mimetype(response.name);
        handleInputChange(val,response);
        mutex.unlock();


      });
      

    } catch (err) {
      console.warn(err);
    mutex.unlock();

    }

  }


  const handleDocumentSelection = useCallback((val) => {
    mutex.run(() => {handleDocument(val);});
    
    
  }, [formData]); 
  const width = Dimensions.get('window').width;  
  return (
    <SafeAreaView style={[styles.exampleStyle,{backgroundColor: theme.backgroundPrimary}]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

            <View style={{marginTop:60}}></View>
            <BackButton></BackButton>

            
            <Text style={[styles.title, {color:theme.text}]}>Create new collection</Text>

            <Divider width={0.3} color={"#ccc"} style={styles.divider}></Divider>

            <Text style={[styles.subtitle, {color:theme.text}]}>Logo image *</Text>
            <Text style={[styles.explanation,{color: theme.textColorNotActive}]}>{CreateCollectionExplanations.logo}</Text>
            
            <View style={{overflow:"hidden", borderColor: theme.backgroundPrimary}}>
              <TouchableOpacity onPress={ () => handleDocumentSelection("uri")} style={[{ borderColor: theme.text},styles.avatar]}>
              {
                formData && formData.uri &&
                  <Image source={{uri: formData.uri.uri}} borderRadius={175} style={[styles.avatarImg,{borderColor: theme.backgroundPrimary,overlayColor:theme.backgroundPrimary}]}></Image>
                
              }
            </TouchableOpacity>
            </View>

            <Text style={[styles.subtitle, {color:theme.text}]}>Featured Image</Text>
            <Text style={[styles.explanation,{color: theme.textColorNotActive}]}>{CreateCollectionExplanations.featured}</Text>

            <View style={{overflow:"hidden" }}>
              <TouchableOpacity onPress={ () => handleDocumentSelection("featureduri")} style={{width:  width*8/10, height: width*16/30,borderRadius: 3, borderColor: theme.text, borderStyle:"dotted", borderWidth:1, marginBottom:10,}}>
              {
                formData.featureduri &&
                  <Image source={{uri: formData.featureduri.uri}} borderRadius={3} style={{width: width*8/10, height: width*16/30,borderRadius: 3, borderColor: theme.text, borderWidth:1,overflow:"hidden", overlayColor:"black"}}></Image>
                
              }
            </TouchableOpacity>
            </View>

            <Text style={[styles.subtitle, {color:theme.text}]}>Banner Image</Text>
            <Text style={[styles.explanation,{color: theme.textColorNotActive}]}>{CreateCollectionExplanations.banner}</Text>

            <View style={{overflow:"hidden"}}>
              <TouchableOpacity onPress={ () => handleDocumentSelection("banneruri")} style={{width: width*8/10, height: width*16/70,borderRadius: 3, borderColor: theme.text, borderStyle:"dotted", borderWidth:1}}>
              {
                formData.banneruri &&
                  <Image source={{uri: formData.banneruri.uri}} borderRadius={3} style={{width: width*8/10, height: width*16/70,borderRadius: 3, borderColor: theme.text, borderWidth:1,overflow:"hidden", overlayColor:"black"}}></Image>
                
              }
            </TouchableOpacity>
            </View>
            <View style={{width:1, height:50}}></View>
            <Divider width={0.3} color={"#ccc"} style={styles.divider}></Divider>

            <Text style={[styles.subtitle, {color:theme.text}]}>Name *</Text>
            <Input ref={nameRef} placeholder="Enter your NFT's name" shake={()=>{}} onChangeText={value => handleInputChange("name",value)} style={{color: theme.text}} errorStyle={{ color: 'red' }} 
            errorMessage={nameError}></Input>
            <Text style={[styles.subtitle, {color:theme.text}]}>Description</Text>
            <Text style={[styles.explanation,{color: theme.textColorNotActive}]}>{CreateCollectionExplanations.description}</Text>
            <Input placeholder="Description" shake={()=>{}} onChangeText={value => handleInputChange("description",value)} style={{color: theme.text}}></Input>
            
            <Divider width={0.3} color={"#ccc"} style={styles.divider}></Divider>


            <Text style={[styles.subtitle, {color:theme.text}]}>Creator Earnings</Text>
            <Text style={[styles.explanation,{color: theme.textColorNotActive}]}>{CreateCollectionExplanations.earnings}</Text>
            <Input ref={earningRef} placeholder="1" shake={()=>{}} onChangeText={value => handleInputChange("earning",value)} style={{color: theme.text}} keyboardType="numeric"></Input>

            <Button
              title="Create!"
              buttonStyle={{
                backgroundColor: 'rgba(244, 244, 244, 1)',
                borderRadius: 3,
              }}
              containerStyle={{
                height: 40,
                marginVertical: 10,
                width: "100%",
                marginBottom: 50

              }}
              titleStyle={{ marginHorizontal: 20, color: 'black' }}
              onPress= {submitHandler}
            />
        </ScrollView>
        

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  exampleStyle: {
    flex: 1,
  },
  scrollView:{
    marginHorizontal:20,
    height: "100%",
  },
  title:{
    fontSize: 32,
    marginBottom: 10,
    marginTop: 30
  },
  subtitle:{
    fontSize: 20,
    marginBottom: 15,
  },
  explanation:{
    fontSize:14,
    marginBottom: 10,
    marginLeft: 5

  },
  divider:{
    marginBottom: 20,
    marginTop: 10
  },
  avatar:{
    width: 175, 
    height: 175,
    borderRadius: 175,
    borderStyle:"dotted", 
    borderWidth:1,
    marginBottom:10
  },
  avatarImg:
  {
    width: 175, 
    height: 175,
    borderRadius: 175,
    borderWidth: 0,
    overflow:"hidden",
    resizeMode: 'contain'
  }
  
});
