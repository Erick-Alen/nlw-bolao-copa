import { Row, Text, Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native'


export function EmptyPoolList() {
  const navigation = useNavigation().navigate

  return (
    <Row flexWrap="wrap" justifyContent="center">
      <Text color="white" fontSize="sm" textAlign="center">
        Você ainda não está participando de {'\n'} nenhum bolão, que tal
      </Text>

      <Pressable onPress={()=>navigation('find')}>
          <Text textDecorationLine="underline" color="yellow.500" textDecoration="underline">
            buscar um por código
          </Text>
      </Pressable>

      <Text color="white" fontSize="sm" textAlign="center" mx={1}>
        ou
      </Text>

      <Pressable onPress={()=>navigation('new')}>
        <Text textDecorationLine="underline"  color="yellow.500">
          criar um novo
        </Text>
      </Pressable>

      <Text color="white" fontSize="sm" textAlign="center">
        ?
      </Text>
    </Row>
  );
}