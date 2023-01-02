import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { VStack, Icon, useToast, FlatList } from 'native-base';

import { Octicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { Loading } from '../components/Loading';
import { api } from '../services/api';
import { EmptyPoolList } from '../components/EmptyPoolList';

export function Pools(){

    const[isLoading, setIsLoading] = useState(true)
    const[Pools, setPools] = useState<PoolCardProps[]>([])

    const navigation = useNavigation().navigate
    const toast = useToast()

    async function fetchPools(){
        try {
            setIsLoading(true)
            const response = await api.get('/pools')
            setPools(response.data.pool)
        } catch (error) {
            toast.show({
                placement: 'top',
                title: 'Não foi possível carregar os bolões',
                bg: 'red.500',
            })
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(()=>{
        fetchPools()
    }, []))

    return (
        <VStack flex={1} bgColor = "gray.900">
            <Header title = "Meus bolões"/>
            <VStack mt={6} mx={5} pb={4} mb={4} borderBottomColor ="gray.600" borderBottomWidth={1}>
                <Button
                title="BUSCAR BOLÃO POR CÓDIGO"
                leftIcon={<Icon as={Octicons}
                name="search" color="black" size="md"/>}
                onPress={()=>navigation('find')}
                />
            </VStack>
            {
                isLoading ? <Loading/> :
                    <FlatList
                    data={Pools}
                    keyExtractor={item=>item.id}
                    renderItem={({item}) => (
                        <PoolCard
                            data={item}
                            onPress={()=>navigation('details', {id:item.id})}    
                        />)
                    }
                    px={5}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{pb:10}}
                    ListEmptyComponent={()=><EmptyPoolList/>}
                    />
            }

        </VStack>
    )
}