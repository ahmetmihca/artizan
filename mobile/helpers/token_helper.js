import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";


class JWT{
    constructor()
    {

    }
    async isJwtExpired()
    {
        try{
            const token = await AsyncStorage.getItem("token");
            console.log(token)
            if(token !== null)
            {
                var decodedToken=jwtDecode(token, {header: true});
                var dateNow = new Date();
                console.log(decodedToken);
                if(decodedToken.exp < dateNow.getTime())
                    return true;
            }
        }catch(e){
            console.log(e);
        }
        return false;
    }
}

export default JWT;