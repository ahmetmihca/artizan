import { StyleSheet, TouchableOpacity, TextInput, ScrollView,SafeAreaView,Image } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import UploadFile from '../components/UploadFile';
import { Input, ListItem, Divider, Button} from '@rneui/themed';
import BackButton from '../components/buttons/BackButton';
import mint_services from '../services/mint_serv';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDocumentAsync } from 'expo-document-picker';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useTheme } from '../hooks/colorSchemeSingleton';
import LoadingIndicator from '../components/loading/LoadingIndicator';
import { Linking } from 'react-native';
import ShareButton from '../components/buttons/ShareButton';
import NavigatorButton from '../components/buttons/NavigatorButton';
import { categoriesWithIcons } from '../data/categoriesList';

const initialValues = {
  name: "",
  description: "",
  collection: "",
  mintCount: "",
  uri: {uri: undefined},
};
export default function CreateArtScreen({ navigation }: RootTabScreenProps<'CreateArtScreen'>) {

  const {theme} = useTheme();

  
  const connector = useWalletConnect();
  
  const [formData, setFormData ] = useState(initialValues);
  const [expanded, setExpanded] = useState<boolean>(false);
  
  const [uri, setUri] = useState("");
  
  const [category, setCategory] = useState("");

  const [nameError,setNameError] = useState<string | undefined>(undefined);
  const [supplyError,setSupplyError] = useState<string | undefined>(undefined);

  // end states
  const [loading, setLoading] = useState<boolean>(false);
  const [minted, setMinted] = useState<boolean>(false);
  const [transactionLink, setTransactionLink] = useState<string>('https://ropsten.etherscan.io/tx/');

  const handleInputChange = (name:any,value:any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const mimetype = (name:string) => {
    let allow : any = {"png":"image/png","pdf":"application/json","jpeg":"image/jpeg", "jpg":"image/jpg"};
    let extention = name.split(".")[1];
    if (allow[extention] !== undefined){
      return allow[extention]
    }
    else {
      return undefined
    }
  }
  const handleDocumentSelection = useCallback(async (val) => {
    try {
      
      let response :any = await getDocumentAsync(
        {
          type: ["image/*"],
        }
      );
      if(response !== null)
      {

        response.type = mimetype(response.name);
        handleInputChange(val,response);

      }
    } catch (err) {
      console.warn(err);
    }
  }, []); 
  const nameRef :any = React.createRef<typeof Input>();
  const supplyRef :any = React.createRef<TextInput>();

  async function submitHandler(){

    if(!nameRef || !nameRef.current || formData.name == "")
    {
      nameRef!.current!.shake();
      
      setNameError("You must decide a name!");
    }
  else{
    
        if(formData.mintCount == "")
        {
          supplyRef!.current!.shake();
          setNameError(undefined);
          setSupplyError("You must decide mint count!");
        }
        else if(formData.mintCount.includes(",") ||formData.mintCount.includes("."))
        {
          supplyRef!.current!.shake();
          setNameError(undefined);
          setSupplyError("Supply should be integer!");
        }
        else{
          setNameError(undefined);
          setSupplyError(undefined);
          setLoading(true);

          if(category == '')
          {
            setCategory('a');
          }

          const token = await AsyncStorage.getItem("token");
          let premint = await mint_services.pre_mint(formData.uri,formData.name,formData.description,category,token,formData.mintCount);
          while(premint.fail)
          {
            premint = await mint_services.pre_mint(formData.uri,formData.name,formData.description,category,token,formData.mintCount);
          }
          try {
          const transactionRes = await connector.sendTransaction({
            data: premint.data,
            from: premint.from,
            to: premint.to,
          });

          setLoading(false);
          setMinted(true);
          setTransactionLink(transactionLink +transactionRes);
        } catch (e) {
          console.error(e);
        }
        
        }
    } 
  }

  return (
    <SafeAreaView style={[styles.exampleStyle, {backgroundColor: theme.backgroundPrimary}]}>

        {
          (loading || minted) &&
          <View style={styles.loading}>
            {
              loading && 
              <LoadingIndicator explanation={'Minting your NFT...'} style={ [styles.loadingIndicator,{backgroundColor: theme.backgroundSecondary}]} explanationStyle={[styles.loadingExplanation, {color:theme.text}]}></LoadingIndicator>
            }
            {
              minted &&
              <View style={[styles.loadingIndicator,{backgroundColor: theme.backgroundSecondary, justifyContent: 'flex-start'}]}>

                
                <Text style={[styles.loadingExplanation,{color: theme.text}]}>Check your transaction at etherscan:</Text>
                <TouchableOpacity onPress={() => Linking.openURL(transactionLink)}>
                  <Text numberOfLines={1} style={{marginVertical:15, color: theme.blue}}>{transactionLink}</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', backgroundColor: theme.backgroundSecondary, alignItems: 'center'}}>
                  <ShareButton props={{msg: transactionLink}}></ShareButton>
                  <NavigatorButton screen={'ProfileScreen'} message={'Go to your profile'} theme={theme}></NavigatorButton>
                </View>
                
                
              </View>
            }
            
          </View>
        }
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

            <View style={{marginTop:60}}></View>
            <BackButton></BackButton>


            <Text style={[styles.title,{color: theme.text}]}>Create new item</Text>

            <Divider width={0.3} color={"#ccc"} style={styles.divider}></Divider>

            <Text style={[styles.subtitle, {color: theme.text}]}>Image, Video, Audio, or 3D Model.</Text>
            <Text  style={[styles.explanation,{color:theme.textColorNotActive}]}>File types supported: JPG, PNG, MP4, GIF. Max Size: 40MB</Text>
            {/* Does not work, fix it */}
            <View style={{overflow:"hidden", backgroundColor: theme.backgroundPrimary}}>
              <TouchableOpacity onPress={ () => handleDocumentSelection("uri")} style={[{borderRadius: formData.uri.uri  ? 0 :  175, borderWidth: formData.uri.uri  ? 0:1, backgroundColor:theme.backgroundPrimary},styles.nftImageButton]}>
              {
                formData && formData.uri && typeof formData.uri !== typeof "" &&
                  <Image source={{uri: formData.uri.uri}}  style={[styles.nftImage,{overlayColor:theme.backgroundPrimary}]}></Image>
                
              } 
            </TouchableOpacity>
            </View>
            <Divider width={0.3} color={"#ccc"} style={styles.divider}></Divider>


            <Text style={[styles.subtitle, {color: theme.text}]}>Name *</Text>
            <Input ref={nameRef} placeholder="Enter your NFT's name" shake={()=>{}} onChangeText={value => handleInputChange("name",value)} style={{color: theme.text}} errorStyle={{ color: 'red' }} 
            errorMessage={nameError}></Input>
            <Text style={[styles.subtitle, {color: theme.text}]}>Description</Text>
            <Text style={[styles.explanation,{color:theme.textColorNotActive}]}>The description will be included on the item's detail page.</Text>
            <Input placeholder="Description" shake={()=>{}} onChangeText={value => handleInputChange("description",value)} style={{color: theme.text}}></Input>
            <Text style={styles.subtitle}>Category</Text>
            <Text style={styles.explanation}>This is the category where your item will appear.</Text>
            <ListItem.Accordion 
              content={
                  <>
               
                    
                  <ListItem.Content >
                      <ListItem.Title>{category}</ListItem.Title>
                  </ListItem.Content>
                  
                  
                  
                  </>
              }
              isExpanded={expanded}
              onPress={() => {
                  setExpanded(!expanded);
              }}
              
              >
                {categoriesWithIcons.map((l, i) => (
                  <ListItem  key={i} onPress={() =>{setCategory(categoriesWithIcons[i].title); setExpanded(false)}} bottomDivider >
                    <ListItem.Content  >
                      <ListItem.Title >{l.title}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                ))}
                

            </ListItem.Accordion> 
            <Divider width={0.3} color={"#ccc"} style={styles.divider}></Divider>
            <Text style={[styles.subtitle, {color: theme.text}]}>Supply *</Text>
            <Text style={[styles.explanation,{color:theme.textColorNotActive}]}>The number of copies that can be minted</Text>
            <Input ref={supplyRef} placeholder="1" shake={()=>{}} onChangeText={value => handleInputChange("mintCount",value)} style={{color: theme.text}} errorMessage={supplyError} keyboardType="numeric"></Input>

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
              titleStyle={{ marginHorizontal: 20, borderColor:theme.blue, color: theme.blue }}
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
  loading:{
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'transparent',
    elevation: 8
  },
  loadingIndicator:
  {
    width: '70%', 
    borderRadius: 20, 
    height: 250, 
    paddingTop: 0,
    justifyContent:'center',
    alignItems: 'center'
    
  },
  loadingExplanation: {
    marginTop: 25,
    fontWeight: '600',
    fontSize:20
  },
  nftImageButton: {
    width: 300, 
    height: 300,
    marginBottom:10,
    borderColor: "#fff", 
    borderStyle:"dotted",
  },
  nftImage:{
    width: 300, 
    height: undefined, 
    resizeMode: 'contain', 
    flex:1,           
    borderWidth:1,
    overflow:"hidden"
  }
  
});
