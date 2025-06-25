import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface CardProps {
  id: number;
  value: string;
  width?: number;
  height?: number;
  onFlipComplete: () => void;
}

export default function Card({ id, value, width = 100, height = 150, onFlipComplete }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const rotation = useSharedValue(0);

  const handleFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true);
    rotation.value = withTiming(180, { duration: 500 });
    onFlipComplete();
  };

  // Anima o container da carta
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value}deg` }],
  }));

  // Controla visibilidade da frente (?)
  const frontFaceStyle = useAnimatedStyle(() => ({
    opacity: interpolate(rotation.value, [0, 90], [1, 0], Extrapolate.CLAMP),
  }));

  // Controla visibilidade da parte de trás (valor)
  const backFaceStyle = useAnimatedStyle(() => ({
    opacity: interpolate(rotation.value, [90, 180], [0, 1], Extrapolate.CLAMP),
  }));

  return (
    
    <Pressable onPress={handleFlip} >
      <Animated.View style={[styles.cardContainer, { width, height }, cardStyle]}>
        {/* Frente da carta: "?" */}
        <Animated.View style={[styles.face, styles.frontFace, frontFaceStyle]}>
          <Text style={styles.faceText}>?</Text>
        </Animated.View>

        {/* Parte de trás da carta: valor */}
        <Animated.View style={[styles.face, styles.backFace, backFaceStyle]}>
          <Text style={styles.faceTextBack}>{value}</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    perspective: '1000',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 500,
    width: '100%'
  },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  frontFace: {
    backgroundColor: '#28a745',
  },
  backFace: {
    backgroundColor: '#fff',
  },
  faceText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  faceTextBack: {
    fontSize: 28,
    color: '#28a745',
    fontWeight: 'bold',
    transform: [{ rotateY: '180deg' }], 
  },
});
