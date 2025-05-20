import { StyleSheet, Image, Platform } from 'react-native';
import ListaPlataformas from '@/src/components/trending/select';
import Congrats from '@/src/components/congrats';

export default function TabTwoScreen() {
  return (
    
   <Congrats /> 
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
