import { useState } from "react";
import { Heading, VStack, Text, useToast, Toast } from "native-base";
import { useNavigation } from '@react-navigation/native'


import { api } from "../services/api";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Header } from "../components/Header";

import Logo from '../assets/logo.svg';


export function New(){
    const [title, setTitle] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const toast = useToast();
    const navigation = useNavigation().navigate

    async function handlePoolCreate(){
        if(!title.trim()){
            return toast.show({
                placement: "top", 
                title: "Informe o título que você que dar para seu bolão",
                bg: "red.500"
            })
        }
        try {
            setIsLoading(true)
            await api.post('/pools', {title})
            toast.show({
                placement: "top", 
                title: "Bolão criado!",
                bg: "green.500"
            })
            setTitle("")
            navigation('pools')
        } catch (error) {
            console.log(error)
            toast.show({
                placement: "top", 
                title: "Não foi possível criar teu bolão",
                bg: "red.500"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <VStack flex={1} bgColor = "gray.900">
            <Header title = "Criar novo bolão" />
            <VStack mt={8} mx={5} alignItems="center">
                <Logo/>
                <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
                    Crie seu próprio bolão da copa e compartilhe entre amigos!
                </Heading>

                <Input
                mb = {2}
                placeholder="Qual o nome do seu bolão?"
                onChangeText={setTitle}
                value={title}
                />

                <Button
                title = "CRIAR MEU BOLÃO"
                onPress={handlePoolCreate}
                isLoading={isLoading}
                
                />
                <Text color = "gray.200" textAlign="center" fontSize = "sm" px ={10} mt={4}>
                    Após criar seu bolão, você receberá um código único
                    que poderá usar para convidar outras pessoas.
                </Text>
            </VStack>
        </VStack>
    )
}