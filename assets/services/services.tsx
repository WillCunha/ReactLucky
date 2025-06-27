import TrackPlayer, { Event, Track } from 'react-native-track-player';

const trackPlayerService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });

  // Eventualmente pra mudar faixa ou avançar
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    // implementar se quiser skip
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    // implementar se quiser voltar
  });

  // Opcional: log de mudanças de faixa
  TrackPlayer.addEventListener(Event.PlaybackTrackChanged, ({ nextTrack }: { nextTrack: Track }) => {
    console.log('Tocando agora:', nextTrack?.title);
  });
};


export default trackPlayerService;
