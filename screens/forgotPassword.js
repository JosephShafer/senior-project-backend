import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

class forgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { email: ''};
  }

  sendEmail = () => {
    const info = { email: this.state.email}
    axios 
      .put(`http://youripaddress:8001/forget_password`, info)
      .then(result => {
        if (result.data.success) {
          alert("A reset passwork email is on the way. Please check your mailbox! Link expires in 24 hours.");
        } else {
          alert("User not found! Please check this is the correct registered email.");
        }
      })
      .catch(err => console.log(err.code));
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.header}>Forgot your password?</Text>
        <Text style={styles.header2}>Please enter your email address. We will send you an email to reset your password.</Text>
        <View style={styles.sendContainer}>
          <TextInput
            value={this.state.email}
            onChangeText={email => this.setState({email})}
            style={[styles.textbox]}
            placeholder={'yours@example.com'}
          />

          <TouchableOpacity onPress={this.sendEmail}>
            <Icon color="#529ef0" name="send" size={35} />
          </TouchableOpacity>  
        </View>  
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    header: {
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold',
      width: 350,
      height: 60
    },
    header2: {
      fontSize: 18,
      textAlign: 'center',
      width: 350
    },
    textbox: {
      borderWidth: 1,
      borderColor: '#529ef0',
      fontSize: 20,
      padding: 10,
      width: 300,
      marginRight: 10
    },
    sendContainer: {
      flexDirection: 'row',
      alignItems: 'center', 
      justifyContent: 'center',
      height: 140
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center', 
      justifyContent: 'center',
    }
});

export default forgotPassword;