import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Avatar from '../Avatar';
import user_services from '../../services/user_serv';
import { useNavigation } from "@react-navigation/native";
type InputAccounts = {
    owners: string | string[] | undefined,
}



export default function AccountList({ props, theme }: { props: InputAccounts, theme: any }) {
  return (
    <View style={[{backgroundColor: theme.backgroundSecondary}, styles.listWrapper]}>
        {
            props.owners && typeof props.owners == "string" &&
            <SingleAccount wallet_id={props.owners} theme={theme}></SingleAccount>
        }
        {
            props.owners && typeof props.owners != "string" &&
            props.owners.map((item,index) => <SingleAccount key={item + index.toString() + 'list'} wallet_id={item} theme={theme}></SingleAccount> )
        }
    </View>
  );
}

type SingleAccount = {
    id: string,
    _id: string,
    username: string,
    avatar: string
}


function SingleAccount({wallet_id, theme}:{wallet_id:string,theme: any})
{
    const [user, setUser] = useState<SingleAccount>({
        id: wallet_id,
        username: wallet_id,
        avatar: 'https://i.pinimg.com/564x/9d/8f/ea/9d8fea7abc8f27364d0d37a4bc6f7a94.jpg',
        _id: ''
    });
    const navigation = useNavigation();
    useEffect(() => {
        async function getAccount()
        {
            if(wallet_id.toLocaleLowerCase().includes("0x5e27327"))
            {
                setUser(
                    {
                        avatar: 'https://im.ge/i/ul88Zq',
                        id: wallet_id,
                        username: 'Artizane Market',
                        _id: wallet_id

                    }
                )
                return;
            }
            try{
                user_services.get_user(wallet_id).then(
                (val) =>
                {
                    console.log(val);
                    let avatar = 'http://10.50.116.36:3001/public/users/'+val.user.id + "_avatar.png";
                    setUser({
                        avatar: avatar,
                        username: val.user.username,
                        _id: val.user._id,
                        id: wallet_id
                    });
                }
            )
            }catch(e)
            {

            }
            
        }
        getAccount();
    },[])
    return (
        <TouchableOpacity style={[styles.ownerWrapper]} onPress={() => {
                navigation.navigate('OtherUserProfileScreen',{
                props: {id:user.id}
                })
            }}>
            <Avatar image={user.avatar} size={50} circle={true} ></Avatar>
            <Text style={[{color: theme.text}, styles.username]}>{user.username == "" ? user.id.substring(0,5) + ".."+ user.id.substring(user.id.length-3): user.username}</Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
  ownerWrapper: {
    flexDirection:'row',
    alignItems:'center',
    paddingBottom: 10
  },
  listWrapper: {
    paddingTop: 10,
    paddingHorizontal: 5
  },
  username:{
    fontSize: 16,
    paddingLeft: 5
  }
});
