import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Stats from '../screens/Stats';
const Stack = createStackNavigator();
const StatsStack = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen name="Stats" component={Stats} />
		</Stack.Navigator>
	);
};
export default StatsStack;
