import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Connect from '../screens/Connect';
const Stack = createStackNavigator();
const ProfileStack = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen name="Connect" component={Connect} />
		</Stack.Navigator>
	);
};
export default ProfileStack;
