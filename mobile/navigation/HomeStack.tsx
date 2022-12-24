import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Category from '../screens/Category';
import UserProfile from '../screens/UserProfile';
import NFTDetails from '../screens/NFTDetails';
const Stack = createStackNavigator();
const HomeStack = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen name="Home" component={Home} />
			<Stack.Screen name="Category" component={Category} />
			<Stack.Screen name="UserProfile" component={UserProfile} />
			<Stack.Screen name="NFTDetails" component={NFTDetails} />
		</Stack.Navigator>
	);
};
export default HomeStack;
