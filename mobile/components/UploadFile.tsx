import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState,useCallback } from 'react';
import { Text, View, } from './Themed';
import { getDocumentAsync } from 'expo-document-picker';
import { Video } from 'expo-av';
import { Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function UploadFile({ path, buttonText, props }: { path: string, buttonText:string, props:any}) {

  const mimetype = (name:string) => {
    let allow =  {"png":"image/png","pdf":"application/json","jpeg":"image/jpeg", "jpg":"image/jpg"};
    let extention = name.split(".")[1];
    if (allow[extention] !== undefined){
      return allow[extention]
    }
    else {
      return undefined
    }
  }
  const [fileResponse, setFileResponse] = useState(null);
  const handleDocumentSelection = useCallback(async () => {
    try {
      
      let response = await getDocumentAsync(
        {
          type: props.acceptedTypes
        }
      );
      response.type = await mimetype(response.name);
      props.setParentData.handleFile(response);
      setFileResponse(response);

    } catch (err) {
      console.warn(err);
    }
  }, []);       
  return (
    <View style={styles.viewStyle}>
      
      {!props.width && fileResponse && fileResponse.type != "cancel" &&
        fileResponse.mimeType.includes('image') &&
        <View>
          <Image source={{uri: fileResponse.uri}} style={styles.img}></Image>

        </View>
      }
      {
        !props.width && fileResponse && fileResponse.type != "cancel" &&
          fileResponse.mimeType.includes('video') &&
          <Video
                source={{ uri: fileResponse.uri }}
                rate={1.0}
                volume={1.0}
                isMuted={true}
                resizeMode="cover"
                shouldPlay
                isLooping
                style={styles.video}
                /> 
      }
      {
        !props.width && fileResponse && fileResponse.type != "cancel" &&
          fileResponse.mimeType.includes("audio") &&
          <Text style={{marginBottom:20}}>Your audio is: {fileResponse.name}</Text>
      }
      {
        props.width && 
        <View style={{overflow:"hidden"}}>
          <TouchableOpacity onPress={handleDocumentSelection} style={{width: props.width, height: props.height,borderRadius: props.borderRadius, borderColor: "#fff", borderStyle:"dotted", borderWidth:1}}>
          {
            fileResponse &&
              <Image source={{uri: fileResponse.uri}} borderRadius={175} style={{width: props.width, height: props.height,borderRadius: props.borderRadius, borderColor: "#fff", borderWidth:1,overflow:"hidden", overlayColor:"black"}}></Image>
            
          }
        </TouchableOpacity>
        </View>
      }
        
      {
        !props.width && 
        <Button
              title={buttonText}
              buttonStyle={{
                backgroundColor: 'rgba(244, 244, 244, 1)',
                borderRadius: 3,
              }}
              containerStyle={{
                height: 40,
                marginVertical: 10,
                width: "100%"

              }}
              titleStyle={{ marginHorizontal: 20, color: 'black' }}
              onPress= {handleDocumentSelection}
            />
      }
      
      
    </View>
  );
}



const styles = StyleSheet.create({
  viewStyle: {
    width:"100%"
  },
  img:{
    width: "100%",
    height: 300,
    marginBottom: 20
  },
  video:{
    width:"100%",
    height: 300,
    marginBottom: 20
  },
  
  
});
