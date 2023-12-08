import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState, useContext } from 'react';
import axios from 'axios';
import { Loader } from '../../../utils/store';
import { base_url } from '../../../utils/constant';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setLoader] = useContext(Loader)
  return (
    <View>
      <Text>Register</Text>
      <Text>Name</Text>
      <TextInput
        placeholder='Name'
        style={styles.input}
        onChangeText={setName}
        value={name}
      />

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
        onPress={() => {
          setLoader(true);
          const toSend = {
            method: 'post',
            url: base_url + '/user',
            data : JSON.stringify({
              name,
              email,
              password
            })
          }
          axios(toSend).then(resp => {
            console.log(resp.data);
            setEmail('');
            setPassword('');
            setName('');
            setLoader(false);
          }).catch(console.error)
        }}
      >
        <Text>Register</Text>
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
