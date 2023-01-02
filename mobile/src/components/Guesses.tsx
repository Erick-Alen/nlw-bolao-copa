import { FlatList, useToast } from 'native-base';
import { useState, useEffect } from 'react';

import { api } from '../services/api';
import { Game, GameProps}  from '../components/Game'
import { Loading } from './Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';


// interface 

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {

  const[isLoading, setIsLoading] = useState(true)
  const[games, setGames] = useState<GameProps[]>([])
  const[firstTeamPoints, setFirstTeamPoints] = useState("")
  const[secondTeamPoints, setSecondTeamPoints] = useState("")
  const toast = useToast()


  async function fetchGames(){
    try {
      setIsLoading(true)
      const response = await api.get(`/pools/${poolId}/games`)
      // console.log(response.data.games)
      setGames(response.data.games)
    } catch (error) {
      console.log(error)
      toast.show({
        placement: 'top',
        title: 'Não foi possível carregar os jogos',
        bg: 'red.500',
      })
    } finally {
          setIsLoading(false)
    }
  }

  async function handleGuessConfirm(gameId:string){
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          placement: 'top',
          title: 'Informe os placares do palpite',
          bg: 'amber.700',
        })
      }
      await api.post(`/pools/${poolId}/games/${gameId}/guesses`,{
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });
      toast.show({
        placement: 'top',
        title: 'Palpite anotado, agora é só torcer!',
        bg: 'green.500',
      })
      fetchGames();

    } catch (error) {
      console.log(error)
      toast.show({
        placement: 'top',
        title: 'Não foi possível enviar o palpite',
        bg: 'red.500',
      })
    }
  }

  useEffect(()=>{
    fetchGames()
  },[poolId])

  if(isLoading){
    return <Loading/>
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item=>item.id}
      renderItem={({item})=>(
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={()=>{handleGuessConfirm(item.id)}}
        />
      )}
      _contentContainerStyle={{pb:10}}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
