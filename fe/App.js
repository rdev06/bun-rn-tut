import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from './screens/Auth/Auth';
import Todo from './screens/Todo';
import TodoItem from './screens/TodoItem';
import { useState } from 'react';
import { Loader } from './utils/store';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loader, setLoader] = useState(false);
  return (
    <NavigationContainer>
      <Loader.Provider value={[setLoader, loader]}>
        <Stack.Navigator initialRouteName='Auth'>
          <Stack.Screen name='Auth' component={Auth} />
          <Stack.Screen name='Todo' component={Todo} />
          <Stack.Screen name='TodoItem' component={TodoItem} />
        </Stack.Navigator>
      </Loader.Provider>
    </NavigationContainer>
  );
}
