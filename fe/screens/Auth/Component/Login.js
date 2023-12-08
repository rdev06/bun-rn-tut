import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState, useContext } from 'react';
import { Loader } from '../../../utils/store';
import axios from 'axios';
import { base_url } from '../../../utils/constant';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setLoader] = useContext(Loader);
  const navigation = useNavigation()
  return (
    <View>
      <Text>Login</Text>

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        placeholder='Email'
        onChangeText={setEmail}
        value={email}
      />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        placeholder='Password'
        onChangeText={setPassword}
        value={password}
      />
      <Pressable
        onPress={async () => {
          setLoader(true);
          const toSend = {
            method: 'post',
            url: base_url + '/user/login',
            data : JSON.stringify({
              email: 'rdev.dev06@gmail.com',
              password: 'pass123'
            })
          }
          const resp = await axios(toSend).catch(err => {
            console.error(err);
            setLoader(false);
          })
          localStorage.setItem('authToken', resp.data.token);
          setEmail('');
          setPassword('');
          setLoader(false);
          navigation.navigate('Todo');
        }}
      >
        <Text>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10
  }
});
