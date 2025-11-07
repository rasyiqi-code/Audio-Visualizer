import React from 'react';
import { Theme, VisualEffects } from '../../types';
import AnimatedBackground from './AnimatedBackground';
import WaveBackground from './WaveBackground';
import GridBackground from './GridBackground';
import AuroraEffect from './AuroraEffect';
import FloatingOrbs from './FloatingOrbs';
import CornerSpotlights from './CornerSpotlights';
import EdgeGlow from './EdgeGlow';
import LightRays from './LightRays';
import LensFlare from './LensFlare';
import FloatingParticles from './FloatingParticles';
import MusicNotation from './MusicNotation';
import OrbitingShapes from './OrbitingShapes';
import ScanLines from './ScanLines';
import FlashEffects from './FlashEffects';
import VignetteEffect from './VignetteEffect';
import ChromaticAberration from './ChromaticAberration';
import ReactiveBorder from './ReactiveBorder';
import ScreenShakeWrapper from './ScreenShakeWrapper';

interface EffectsLayerProps {
  theme: Theme;
  effects: VisualEffects;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  mainContainerRef?: React.RefObject<HTMLDivElement>;
}

const EffectsLayer: React.FC<EffectsLayerProps> = ({ theme, effects, analyser, isPlaying, mainContainerRef }) => {
  return (
    <>
      {/* Background Effects - Layer 0 */}
      {effects.gridBackground.enabled && (
        <GridBackground theme={theme} intensity={effects.gridBackground.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}
      {effects.waveBackground.enabled && (
        <WaveBackground theme={theme} intensity={effects.waveBackground.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}
      {effects.floatingOrbs.enabled && (
        <FloatingOrbs theme={theme} intensity={effects.floatingOrbs.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}
      {effects.auroraEffect.enabled && (
        <AuroraEffect theme={theme} intensity={effects.auroraEffect.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}
      {effects.animatedBackground.enabled && (
        <AnimatedBackground theme={theme} intensity={effects.animatedBackground.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}

      {/* Light Effects - Layer 1-2 */}
      {effects.cornerSpotlights.enabled && (
        <CornerSpotlights theme={theme} intensity={effects.cornerSpotlights.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}
      {effects.lightRays.enabled && (
        <LightRays theme={theme} intensity={effects.lightRays.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}

      {/* Main Visualizer is at Layer 2 */}

      {/* Frame Effects - Layer 3 */}
      {effects.edgeGlow.enabled && (
        <EdgeGlow theme={theme} intensity={effects.edgeGlow.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}
      {effects.reactiveBorder.enabled && (
        <ReactiveBorder theme={theme} intensity={effects.reactiveBorder.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}

      {/* Overlay Effects - Layer 4 */}
      {effects.floatingParticles.enabled && (
        <FloatingParticles theme={theme} intensity={effects.floatingParticles.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}
      {effects.orbitingShapes.enabled && (
        <OrbitingShapes theme={theme} intensity={effects.orbitingShapes.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}
      {effects.musicNotation.enabled && (
        <MusicNotation theme={theme} intensity={effects.musicNotation.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}
      {effects.lensFlare.enabled && (
        <LensFlare theme={theme} intensity={effects.lensFlare.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}

      {/* Top Layer Effects - Layer 5-7 */}
      {effects.flashEffects.enabled && (
        <FlashEffects intensity={effects.flashEffects.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}
      {effects.scanLines.enabled && (
        <ScanLines 
          intensity={effects.scanLines.intensity} 
          analyser={analyser}
          isPlaying={isPlaying}
        />
      )}
      {effects.vignetteEffect.enabled && (
        <VignetteEffect intensity={effects.vignetteEffect.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}
      {effects.chromaticAberration.enabled && (
        <ChromaticAberration intensity={effects.chromaticAberration.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}
      {effects.screenShake.enabled && (
        <ScreenShakeWrapper intensity={effects.screenShake.intensity} analyser={analyser} isPlaying={isPlaying} />
      )}
    </>
  );
};

export default EffectsLayer;

