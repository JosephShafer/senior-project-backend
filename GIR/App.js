import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity
} from 'react-native';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import config from './config.json';
import ApiSend from './ApiSend';

export default class App extends Component {
	constructor(props) {
		super(props);
	}
	state = {
		hasPermission: null,
		type: Camera.Constants.Type.back,
		result: null,
		apiResult: undefined
	}
	// Asks for permissions
	async componentDidMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasPermission: status === 'granted' });
	}
	async callWebCrawler(target) {
		try {
			console.log("Attempting connection to AWS server...");
			let response = await fetch(config.AWS.ip, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					searchTerm: target,
				}),
			});
			var responseJson = await response.json();
			console.log("Connection successfully made.");
		} catch(err) {
			console.log(err);
		}
	}
	takePicture = async () => {
		if (this.Camera) {
			const options = {quality: 0.5, base64: true};
			let photo = await this.Camera.takePictureAsync(options);
			console.log("Took photo");
			// Send pic info to google api function
			this.setState({
				result: photo.base64
			});
			try {
				let res = await this.apiSend.googleVision(photo.base64);
				console.log("API's strongest guess: " + res);
				this.callWebCrawler(res);
			}
			catch(err) {
				console.log(err);
			}
		}
	}
	render() {
		const { hasPermission } = this.state
		if (hasPermission === null) {
			return <View />;
		} else if (hasPermission === false) {
			return <Text>No access to camera</Text>;
		} else {
			return (
				<View style={{ flex: 1 }}>
				<ApiSend ref={ ref=> (this.apiSend = ref) } />
				<Camera style={{ flex: 1 }} type={this.state.cameraType} ref={ref => { this.Camera = ref;}}>
				<View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:20}}>
				<TouchableOpacity
				style={{
					alignSelf: 'flex-end',
						alignItems: 'center',
						backgroundColor: 'transparent',
				}}
				onPress={this.takePicture}
				>
				<FontAwesome
				name="camera"
				style={{ color: "#fff", fontSize: 40}}
				/>
				</TouchableOpacity>
				</View>
				</Camera>
				</View>
			);
		}
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row'
	},
	view: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	capture: {
		flex: 0,
		backgroundColor: 'steelblue',
		borderRadius: 10,
		color: 'red',
		padding: 15,
		margin: 45
	}
});
