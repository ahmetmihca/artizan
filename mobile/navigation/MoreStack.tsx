import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import More from '../screens/More';
const Stack = createStackNavigator();
const MoreStack = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen name="More" component={More} />
		</Stack.Navigator>
	);
};
export default MoreStack;
