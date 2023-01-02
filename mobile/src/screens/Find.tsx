import { useState } from 'react'
import { Heading, VStack, useToast } from "native-base";
import { useNavigation } from '@react-navigation/native'


import { api } from "../services/api";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";


export function Find(){
    const [isLoading, setIsLoading] = useState(false)
    const [code, setCode] = useState("")
    const navigation = useNavigation().navigate

    const toast = useToast()

    async function handleJoinPool(){
        try {
            setIsLoading(true)
            if(!code.trim()){
                return toast.show({
                    placement: 'top',
                    title: 'Informe o código do seu bolão!',
                    bg: 'amber.700',
                })
            }
            // 2GCTNY
            await api.post('pools/join', {code})
            toast.show({
                placement: 'top',
                title: 'Boa! Agora você está participando do bolão!',
                bg: 'green.500',
            })
            navigation('pools')

        } catch (error) {
            console.log(error)
            setIsLoading(false)
            if(error.response?.data?.message ==='Pool not found'){
                return toast.show({
                    placement: 'top',
                    title: 'Bolão não encontrado',
                    bg: 'red.500',
                })
            }
            if(error.response?.data?.message ==='Already joined this pool'){
                return toast.show({
                    placement: 'top',
                    title: 'Você já está nesse bolão',
                    bg: 'red.500',
                })
            }
        }
    }
    return(
        <VStack flex={1} bgColor = "gray.900">

            <Header title = "Buscar por Código" showBackButton />
            <VStack mt={8} mx={5} alignItems="center">

                <Heading fontFamily="heading" color="white" mb = {8} fontSize="xl" textAlign="center">
                    Encontrar seu bolão através de{"\n"} seu código único
                </Heading>

                <Input
                mb = {2}
                placeholder="Qual o código do bolão?"
                onChangeText={setCode}
                autoCapitalize="characters"
                />

                <Button
                title = "BUSCAR BOLÃO"
                onPress={handleJoinPool}/>

            </VStack>
        </VStack>
    )
}