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
import config from './config';

export default class ApiSend extends Component {
	constructor(props) {
		super(props);
	}

	state = {
		loading: false,
		apiResult: undefined,
	}

	googleVision = async (base64) => {
                this.setState({ loading: true });
		try {
                        let body = JSON.stringify({
                                requests: [
                                        {
                                                features: [
                                                        { type: 'LABEL_DETECTION', maxResults: 5 },
                                                        //{ type: 'LANDMARK_DETECTION', maxResults: 5 },
                                                        //{ type: 'FACE_DETECTION', maxResults: 5 },
                                                        { type: 'LOGO_DETECTION', maxResults: 5 },
                                                        { type: 'TEXT_DETECTION', maxResults: 5 },
                                                        //{ type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
                                                        //{ type: 'SAFE_SEARCH_DETECTION', maxResults: 5 },
                                                        { type: 'IMAGE_PROPERTIES', maxResults: 5 },
                                                        //{ type: 'CROP_HINTS', maxResults: 5 },
                                                        //{ type: 'WEB_DETECTION', maxResults: 5 }
                                                ],
                                                image: {
                                                        content: base64
                                                }
                                        }
                                ]
                        });
                        console.log("Sending json...");
                        let response = await fetch(
                                'https://vision.googleapis.com/v1/images:annotate?key=' +
                                        config.googleCloud.apiKey,
                                {
                                        headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json'
                                        },
                                        method: 'POST',
                                        body: body
                                }
                        );
                        console.log("Received response");
                        let responseJson = await response.json();
                        this.setState({
                                apiResult: responseJson.responses[0].labelAnnotations[0].description,
                        });
                } catch (error) {
                        console.log(error);
                }
		this.setState({ loading: false });
		return this.state.apiResult;
        }
	render() {
		return null;
	}
}
