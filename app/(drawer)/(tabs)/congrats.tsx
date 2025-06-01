import Congrats from '@/src/components/congrats';
import { StyleSheet } from 'react-native';

export default function CongratsScreen() {
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
