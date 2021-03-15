import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, 
    KeyboardAvoidingView, Linking} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

class resetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '', email: '', password: '', rePassword: '', token: '', };  
  }

  componentDidMount = () => {
    Linking
      .getInitialURL()
      .then(url => {
        const token = url.slice(44);
        axios
          .get(`http://youripaddress:8001/reset_password?token=${token}`)
          .then(result => {
            if (!result.data.success) {
              alert(`${result.data.msg}`);
              this.props.navigation.navigate("SendEmail");
            } else {
              this.setState({username: result.data.username, email: result.data.email, token });
            }
          })
          .catch(err => console.log("Error when validating reset token: " + err)); 
      });  
  }

  resetPW = () => {
    if (!this.state.password || !this.state.rePassword) {
      alert('All fields are required');
      return;
    }

    if (this.state.password !== this.state.rePassword) {
      alert('Passwords do not match. Please try again.');
    } else {
      const info = {
        token: this.state.token,
        newPW: this.state.password,
      };

      axios
        .put(`http://youripaddress:8001/reset_password`, info)
        .then(result => {
          if (result.data.resetPW) {
            alert("Congrats! You have successfully reset your password. Please sign in with the new password!");
            this.props.navigation.navigate("Login");
          } else {
            alert("Sorry! Some thing wrong when saving the new password. Please retry.");
          }
        })
        .catch(err => console.log("Error when saving the new password: " + err));
      }  
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View>
          <Text style={styles.header}>Hello, {this.state.username}:</Text>
          <Text style={{fontSize: 21}}>Please reset your password here.</Text>
        </View>
        
        <View style={styles.sendContainer}>
          <TextInput
            placeholder="Password"
            value={this.state.password}
            onChangeText={password => this.setState({password})}
            style={[styles.textbox]}
          />

          <TextInput
            placeholder="Retype Password"
            value={this.state.rePassword}
            onChangeText={rePassword => this.setState({rePassword})}
            style={[styles.textbox]}
          />

          <TouchableOpacity onPress={this.resetPW} style={[styles.submit]}>
            <Icon color="#fff" name="send" size={35} style={styles.shadow}/>
          </TouchableOpacity>    
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center', 
      justifyContent: 'center',
    },
    header: {
      fontSize: 21, 
      fontWeight: 'bold',
      marginBottom: 10,
    },
    sendContainer: {
      alignItems: 'center', 
      justifyContent: 'center',
      height: 300,
    },
    textbox: {
      borderWidth: 1,
      borderColor: '#529ef0',
      fontSize: 20,
      padding: 10,
      width: 300,
      marginBottom: 10
    },
    submit: {
      width: 300,
      padding: 5,
      marginTop: 30,
      borderRadius: 5,
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#529ef0'
    }
});

export default resetPassword;