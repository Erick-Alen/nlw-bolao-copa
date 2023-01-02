import { Icon, Center, Text } from 'native-base';
import { Button } from '../components/Button';
import { Fontisto } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

import Logo from '../assets/logo.svg';

export function SignIn(){

  const {signIn, isUserLoading} = useAuth();
  
  return (
      <Center flex = {1} bgColor="gray.900" p={7}>
        {/* <Text color ="yellow.500" fontSize={24} >Tela de SignIn!!</Text> */}
        <Logo width = {212} height = {40}/>
        <Button
        title = "ENTRAR COM GOOGLE"
        type = "SECONDARY"
        leftIcon={<Icon as = {Fontisto} name = "google" color = "white" size = "md" />}
        mt={12}
        onPress = {signIn}
        isLoading = {isUserLoading}
        _loading = {{_spinner: {color: "white"}}}
        />
        <Text color = 'white' textAlign='center' m={4}>
          Não utilizamos nenhuma informação além{'\n'} do seu e-mail para criação de sua conta.
        </Text>
      </Center>
  );
}