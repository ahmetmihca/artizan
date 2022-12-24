import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../theme/colors';


export const AvatarSkeleton = () => {
	return (
		<View
			style={[
				styles.container,
				{
					width: 100,
					height: 100,
					position: 'absolute',bottom: 5, left:30,
					borderRadius: 100
				},
				
			]}
		>
			{ (
					<MaterialCommunityIcons
						style={[
							styles.icon,
							{
								left: 100 * 0.75,
								top: 100 * 0.02
							}
						]}
						name="circle"
						size={15}
						color={colors.online}
					/>
				)}
			<View
				
				style={{
					width: 100,
					height: 100,
					borderRadius: 50,
					borderWidth: 0.5,
					backgroundColor: '#ccc'
				}}
			></View>
		</View>
	);
}


const Avatar = ({ image, size = 50, online, circle, style }) => {
	return (
		<View
			style={[
				styles.container,
				{
					width: size,
					height: size,
					borderRadius: size
				},
				style
			]}
		>
			{circle &&
				online && (
					<MaterialCommunityIcons
						style={[
							styles.icon,
							{
								left: size * 0.75,
								top: size * 0.02
							}
						]}
						name="circle"
						size={15}
						color={colors.online}
					/>
				)}
			<Image
				key={image}
				source={{ uri: image}}
				style={{
					width: size,
					height: size,
					borderRadius: circle ? size / 2 : size / 5,
					borderWidth: 0.5
				}}
			/>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	icon: {
		position: 'absolute',
		zIndex: 1
	}
});
export default Avatar;

