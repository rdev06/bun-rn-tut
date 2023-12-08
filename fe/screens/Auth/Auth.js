import { Text } from 'react-native';
import Register from './Component/Register';
import Login from './Component/login';
import { useContext, useLayoutEffect } from 'react';
import { Loader } from '../../utils/store';
import Load from '../../Component/Load';
import { useNavigation } from '@react-navigation/native';
import isLoggedIn from '../../utils/isLoggedIn';

export default function Auth() {
  const [setLoader, loader] = useContext(Loader);
  const navigation = useNavigation();

  useLayoutEffect(()=>{
    if(isLoggedIn()){
      navigation.navigate('Todo');
    }
  }, [])

  return (
    <>
      {loader && <Load />}
      {!loader && (
        <>
          <Register />
          <Text>-------------------------------------</Text>
          <Login />
        </>
      )}
    </>
  );
}
