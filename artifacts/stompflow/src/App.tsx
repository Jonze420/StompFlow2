import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AudioLines,
  ChevronDown,
  ChevronRight,
  CircleDot,
  CircleHelp,
  Cpu,
  Download,
  FileJson,
  FileUp,
  Flame,
  FolderOpen,
  Gauge,
  GripVertical,
  Headphones,
  Mic2,
  MoveDown,
  MoveUp,
  Music2,
  Pause,
  Play,
  Plus,
  Radio,
  RefreshCw,
  RotateCcw,
  Save,
  Settings2,
  Shuffle,
  SlidersHorizontal,
  Trash2,
  Upload,
  Volume2,
  Waves,
  Zap,
} from 'lucide-react';

type View = 'forge' | 'drums' | 'tuner' | 'presets' | 'settings';
type EffectType =
  | 'distortion'
  | 'overdrive'
  | 'delay'
  | 'reverb'
  | 'chorus'
  | 'phaser'
  | 'tremolo'
  | 'eq'
  | 'compressor';

type ParamSpec = { min: number; max: number; default: number; label: string };
type EffectDefinition = {
  name: string;
  color: string;
  params: Record<string, ParamSpec>;
};
type Effect = {
  id: string;
  type: EffectType;
  enabled: boolean;
  expanded: boolean;
  params: Record<string, number>;
};
type Preset = {
  id: string;
  name: string;
  category: string;
  effects: Effect[];
  createdAt: string;
};
type Pattern = {
  kick: boolean[];
  snare: boolean[];
  hat: boolean[];
};
type TunerReadout = {
  note: string;
  octave: number;
  frequency: number;
  cents: number;
} | null;

const effectDefinitions: Record<EffectType, EffectDefinition> = {
  distortion: {
    name: 'Distortion',
    color: '#e85d4a',
    params: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 70, label: 'Level' },
    },
  },
  overdrive: {
    name: 'Overdrive',
    color: '#e8782d',
    params: {
      drive: { min: 0, max: 100, default: 40, label: 'Drive' },
      tone: { min: 0, max: 100, default: 55, label: 'Tone' },
      level: { min: 0, max: 100, default: 65, label: 'Level' },
    },
  },
  delay: {
    name: 'Delay',
    color: '#4d9bba',
    params: {
      time: { min: 0, max: 100, default: 40, label: 'Time' },
      feedback: { min: 0, max: 100, default: 35, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 30, label: 'Mix' },
    },
  },
  reverb: {
    name: 'Reverb',
    color: '#9c6ac8',
    params: {
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      damping: { min: 0, max: 100, default: 50, label: 'Damping' },
      mix: { min: 0, max: 100, default: 35, label: 'Mix' },
    },
  },
  chorus: {
    name: 'Chorus',
    color: '#46af7a',
    params: {
      rate: { min: 0, max: 100, default: 40, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      mix: { min: 0, max: 100, default: 40, label: 'Mix' },
    },
  },
  phaser: {
    name: 'Phaser',
    color: '#45aaa7',
    params: {
      rate: { min: 0, max: 100, default: 35, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      feedback: { min: 0, max: 100, default: 40, label: 'Feedback' },
    },
  },
  tremolo: {
    name: 'Tremolo',
    color: '#d29b42',
    params: {
      speed: { min: 0, max: 100, default: 50, label: 'Speed' },
      depth: { min: 0, max: 100, default: 60, label: 'Depth' },
      wave: { min: 0, max: 100, default: 50, label: 'Wave' },
    },
  },
  eq: {
    name: 'EQ',
    color: '#829aab',
    params: {
      bass: { min: 0, max: 100, default: 50, label: 'Bass' },
      mid: { min: 0, max: 100, default: 50, label: 'Mid' },
      treble: { min: 0, max: 100, default: 50, label: 'Treble' },
    },
  },
  compressor: {
    name: 'Compressor',
    color: '#a08e78',
    params: {
      threshold: { min: 0, max: 100, default: 50, label: 'Thresh' },
      ratio: { min: 0, max: 100, default: 40, label: 'Ratio' },
      attack: { min: 0, max: 100, default: 30, label: 'Attack' },
    },
  },
};

const effectOrder = Object.keys(effectDefinitions) as EffectType[];
const enginePresets = [
  { id: 'default', label: 'Default · interactive' },
  { id: 'low_latency_44', label: 'Low latency · 44.1 kHz' },
  { id: 'low_latency_48', label: 'Low latency · 48 kHz' },
  { id: 'low_latency_96', label: 'Low latency · 96 kHz' },
  { id: 'balanced_48', label: 'Balanced · 48 kHz' },
  { id: 'balanced_44', label: 'Balanced · 44.1 kHz' },
  { id: 'playback_44', label: 'Playback · 44.1 kHz' },
];
const noteNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const tuning = [
  { note: 'E', octave: '2', hz: '82.41' },
  { note: 'A', octave: '2', hz: '110.00' },
  { note: 'D', octave: '3', hz: '146.83' },
  { note: 'G', octave: '3', hz: '196.00' },
  { note: 'B', octave: '3', hz: '246.94' },
  { note: 'E', octave: '4', hz: '329.63' },
];
const STORAGE = {
  effects: 'stompflow-effects-v1',
  presets: 'stompflow-presets-v1',
  pattern: 'stompflow-pattern-v1',
  settings: 'stompflow-settings-v1',
};

function makeId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

function createEffect(type: EffectType): Effect {
  const definition = effectDefinitions[type];
  return {
    id: makeId(type),
    type,
    enabled: true,
    expanded: true,
    params: Object.fromEntries(
      Object.entries(definition.params).map(([key, spec]) => [key, spec.default]),
    ),
  };
}

function defaultPattern(): Pattern {
  return {
    kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    hat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
  };
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function EffectIcon({ type, size = 16 }: { type: EffectType; size?: number }) {
  const props = { size, strokeWidth: 1.7 };
  switch (type) {
    case 'distortion':
      return <Zap {...props} />;
    case 'overdrive':
      return <Flame {...props} />;
    case 'delay':
      return <Radio {...props} />;
    case 'reverb':
      return <Waves {...props} />;
    case 'chorus':
      return <AudioLines {...props} />;
    case 'phaser':
      return <CircleDot {...props} />;
    case 'tremolo':
      return <Activity {...props} />;
    case 'eq':
      return <SlidersHorizontal {...props} />;
    default:
      return <Gauge {...props} />;
  }
}

type EffectNode = {
  input: AudioNode;
  output: AudioNode;
  lfo?: OscillatorNode;
};

class AudioEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  analyser: AnalyserNode | null = null;
  drumGain: GainNode | null = null;
  source: AudioNode | null = null;
  stream: MediaStream | null = null;
  audioElement: HTMLAudioElement | null = null;
  effectNodes: EffectNode[] = [];
  inputMode: 'mic' | 'file' | null = null;
  engineType = 'default';

  ensureContext() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return this.ctx;
    }
    const audioWindow = window as Window & { webkitAudioContext?: typeof AudioContext };
    const Constructor = window.AudioContext || audioWindow.webkitAudioContext;
    if (!Constructor) throw new Error('This browser does not support the Web Audio API.');
    const selected = enginePresets.find((preset) => preset.id === this.engineType);
    const sampleRate = selected?.id.includes('44') ? 44100 : selected?.id.includes('48') ? 48000 : selected?.id.includes('96') ? 96000 : undefined;
    try {
      this.ctx = new Constructor({
        latencyHint: selected?.id.includes('balanced') ? 'balanced' : selected?.id.includes('playback') ? 'playback' : 'interactive',
        ...(sampleRate ? { sampleRate } : {}),
      });
    } catch {
      this.ctx = new Constructor();
    }
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.drumGain = this.ctx.createGain();
    this.drumGain.gain.value = 0.8;
    this.drumGain.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    return this.ctx;
  }

  setMasterVolume(value: number) {
    if (this.masterGain) this.masterGain.gain.value = value;
  }

  setDrumVolume(value: number) {
    if (this.drumGain) this.drumGain.gain.value = value;
  }

  distortionCurve(amount: number) {
    const curve = new Float32Array(44100);
    const k = amount * 4;
    for (let i = 0; i < curve.length; i += 1) {
      const x = (i * 2) / curve.length - 1;
      curve[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  impulse(duration: number, decay: number) {
    if (!this.ctx) throw new Error('Audio context unavailable');
    const length = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
    const buffer = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
    for (let channel = 0; channel < 2; channel += 1) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return buffer;
  }

  createEffectNode(effect: Effect): EffectNode | null {
    if (!this.ctx) return null;
    const ctx = this.ctx;
    const p = effect.params;
    if (effect.type === 'distortion' || effect.type === 'overdrive') {
      const shaper = ctx.createWaveShaper();
      shaper.curve = this.distortionCurve((p.drive / 100) * (effect.type === 'overdrive' ? 0.6 : 1));
      shaper.oversample = '4x';
      const tone = ctx.createBiquadFilter();
      tone.type = 'lowpass';
      tone.frequency.value = (effect.type === 'overdrive' ? 1000 : 800) + (p.tone / 100) * (effect.type === 'overdrive' ? 6000 : 8000);
      const level = ctx.createGain();
      level.gain.value = p.level / 100;
      shaper.connect(tone);
      tone.connect(level);
      return { input: shaper, output: level };
    }
    if (effect.type === 'delay') {
      const delay = ctx.createDelay(2);
      delay.delayTime.value = (p.time / 100) * 1;
      const feedback = ctx.createGain();
      feedback.gain.value = Math.min(0.88, p.feedback / 100);
      const wet = ctx.createGain();
      wet.gain.value = p.mix / 100;
      const dry = ctx.createGain();
      dry.gain.value = 1 - p.mix / 200;
      const merge = ctx.createGain();
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(merge);
      dry.connect(merge);
      const input = ctx.createGain();
      input.connect(delay);
      input.connect(dry);
      return { input, output: merge };
    }
    if (effect.type === 'reverb') {
      const convolver = ctx.createConvolver();
      convolver.buffer = this.impulse(0.5 + (p.decay / 100) * 4.5, 1 + (p.damping / 100) * 5);
      const wet = ctx.createGain();
      wet.gain.value = p.mix / 100;
      const dry = ctx.createGain();
      dry.gain.value = 1 - p.mix / 200;
      const merge = ctx.createGain();
      convolver.connect(wet);
      wet.connect(merge);
      dry.connect(merge);
      const input = ctx.createGain();
      input.connect(convolver);
      input.connect(dry);
      return { input, output: merge };
    }
    if (effect.type === 'chorus') {
      const delay = ctx.createDelay(0.05);
      delay.delayTime.value = 0.02;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.1 + (p.rate / 100) * 5;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = (p.depth / 100) * 0.01;
      lfo.connect(lfoGain);
      lfoGain.connect(delay.delayTime);
      lfo.start();
      const wet = ctx.createGain();
      wet.gain.value = p.mix / 100;
      const dry = ctx.createGain();
      dry.gain.value = 1 - p.mix / 200;
      const merge = ctx.createGain();
      delay.connect(wet);
      wet.connect(merge);
      dry.connect(merge);
      const input = ctx.createGain();
      input.connect(delay);
      input.connect(dry);
      return { input, output: merge, lfo };
    }
    if (effect.type === 'phaser') {
      const filters = Array.from({ length: 4 }, () => {
        const filter = ctx.createBiquadFilter();
        filter.type = 'allpass';
        filter.frequency.value = 1000;
        filter.Q.value = 0.5;
        return filter;
      });
      filters.forEach((filter, index) => {
        if (filters[index + 1]) filter.connect(filters[index + 1]);
      });
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.1 + (p.rate / 100) * 4;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = (p.depth / 100) * 3000;
      lfo.connect(lfoGain);
      filters.forEach((filter) => lfoGain.connect(filter.frequency));
      lfo.start();
      const feedback = ctx.createGain();
      feedback.gain.value = (p.feedback / 100) * 0.65;
      filters[3].connect(feedback);
      feedback.connect(filters[0]);
      const dry = ctx.createGain();
      dry.gain.value = 0.7;
      const merge = ctx.createGain();
      filters[3].connect(merge);
      dry.connect(merge);
      const input = ctx.createGain();
      input.connect(filters[0]);
      input.connect(dry);
      return { input, output: merge, lfo };
    }
    if (effect.type === 'tremolo') {
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      lfo.type = p.wave > 50 ? 'square' : 'sine';
      lfo.frequency.value = 1 + (p.speed / 100) * 15;
      const depth = (p.depth / 100) * 0.42;
      gain.gain.value = 1 - depth;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = depth;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
      return { input: gain, output: gain, lfo };
    }
    if (effect.type === 'eq') {
      const bass = ctx.createBiquadFilter();
      bass.type = 'lowshelf';
      bass.frequency.value = 200;
      bass.gain.value = ((p.bass - 50) / 50) * 15;
      const mid = ctx.createBiquadFilter();
      mid.type = 'peaking';
      mid.frequency.value = 1000;
      mid.Q.value = 1;
      mid.gain.value = ((p.mid - 50) / 50) * 15;
      const treble = ctx.createBiquadFilter();
      treble.type = 'highshelf';
      treble.frequency.value = 4000;
      treble.gain.value = ((p.treble - 50) / 50) * 15;
      bass.connect(mid);
      mid.connect(treble);
      return { input: bass, output: treble };
    }
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -50 + (p.threshold / 100) * 50;
    compressor.ratio.value = 1 + (p.ratio / 100) * 19;
    compressor.attack.value = (p.attack / 100) * 0.1;
    compressor.release.value = 0.25;
    return { input: compressor, output: compressor };
  }

  clearEffectGraph() {
    this.effectNodes.forEach((node) => {
      if (node.lfo) {
        try {
          node.lfo.stop();
        } catch {
          // An oscillator may already be stopped during a rapid edit.
        }
      }
      try {
        node.input.disconnect();
        node.output.disconnect();
      } catch {
        // Disconnecting an already disconnected node is harmless.
      }
    });
    this.effectNodes = [];
  }

  rebuild(effects: Effect[]) {
    if (!this.ctx || !this.source || !this.masterGain) return;
    try {
      this.source.disconnect();
    } catch {
      // Source can be disconnected by a browser when a file ends.
    }
    this.clearEffectGraph();
    let last: AudioNode = this.source;
    effects.filter((effect) => effect.enabled).forEach((effect) => {
      const node = this.createEffectNode(effect);
      if (node) {
        last.connect(node.input);
        last = node.output;
        this.effectNodes.push(node);
      }
    });
    last.connect(this.masterGain);
  }

  async connectMicrophone(deviceId?: string) {
    const ctx = this.ensureContext();
    this.disconnectSource();
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone input is not available in this browser.');
    }
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
      },
    });
    this.source = ctx.createMediaStreamSource(this.stream);
    this.inputMode = 'mic';
  }

  async loadFile(file: File) {
    const ctx = this.ensureContext();
    this.disconnectSource();
    const element = new Audio(URL.createObjectURL(file));
    element.loop = true;
    element.volume = 1;
    this.audioElement = element;
    this.source = ctx.createMediaElementSource(element);
    await element.play();
    this.inputMode = 'file';
  }

  disconnectSource() {
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());
    this.stream = null;
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
    }
    this.audioElement = null;
    if (this.source) {
      try {
        this.source.disconnect();
      } catch {
        // no-op
      }
    }
    this.source = null;
    this.clearEffectGraph();
    this.inputMode = null;
  }

  waveform() {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  timeDomain() {
    if (!this.analyser) return null;
    const data = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(data);
    return data;
  }

  playDrumStep(step: number, pattern: Pattern) {
    const ctx = this.ensureContext();
    if (!this.drumGain) return;
    const when = ctx.currentTime + 0.01;
    const hit = (type: 'kick' | 'snare' | 'hat') => {
      const gain = ctx.createGain();
      gain.connect(this.drumGain as GainNode);
      if (type === 'kick') {
        const oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(150, when);
        oscillator.frequency.exponentialRampToValueAtTime(52, when + 0.16);
        gain.gain.setValueAtTime(0.85, when);
        gain.gain.exponentialRampToValueAtTime(0.001, when + 0.22);
        oscillator.connect(gain);
        oscillator.start(when);
        oscillator.stop(when + 0.24);
      } else {
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = type === 'snare' ? 'bandpass' : 'highpass';
        filter.frequency.value = type === 'snare' ? 1800 : 6000;
        gain.gain.setValueAtTime(type === 'snare' ? 0.4 : 0.18, when);
        gain.gain.exponentialRampToValueAtTime(0.001, when + (type === 'snare' ? 0.16 : 0.06));
        noise.connect(filter);
        filter.connect(gain);
        noise.start(when);
        noise.stop(when + 0.18);
      }
      window.setTimeout(() => {
        try {
          gain.disconnect();
        } catch {
          // no-op
        }
      }, 400);
    };
    if (pattern.kick[step]) hit('kick');
    if (pattern.snare[step]) hit('snare');
    if (pattern.hat[step]) hit('hat');
  }
}

function detectPitch(buffer: Float32Array, sampleRate: number) {
  let rms = 0;
  for (let i = 0; i < buffer.length; i += 1) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.012) return null;
  const minLag = Math.floor(sampleRate / 1000);
  const maxLag = Math.floor(sampleRate / 60);
  let bestLag = -1;
  let bestCorrelation = 0;
  for (let lag = minLag; lag <= Math.min(maxLag, buffer.length - 1); lag += 1) {
    let correlation = 0;
    for (let i = 0; i < buffer.length - lag; i += 1) correlation += buffer[i] * buffer[i + lag];
    correlation /= buffer.length - lag;
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }
  if (bestLag < 0 || bestCorrelation < 0.01) return null;
  return sampleRate / bestLag;
}

function cloneEffects(effects: Effect[]) {
  return effects.map((effect) => ({
    ...effect,
    params: { ...effect.params },
  }));
}

function App() {
  const engineRef = useRef(new AudioEngine());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const patternRef = useRef<Pattern>(defaultPattern());
  const drumVolumeRef = useRef(0.8);
  const [view, setView] = useState<View>('forge');
  const [effects, setEffects] = useState<Effect[]>(() => loadJson(STORAGE.effects, [createEffect('overdrive'), createEffect('delay')]));
  const [presets, setPresets] = useState<Preset[]>(() => loadJson(STORAGE.presets, []));
  const [pattern, setPattern] = useState<Pattern>(() => loadJson(STORAGE.pattern, defaultPattern()));
  const [tempo, setTempo] = useState(() => loadJson<{ tempo: number }>(STORAGE.settings, { tempo: 110 }).tempo);
  const [masterVolume, setMasterVolume] = useState(() => loadJson<{ masterVolume: number }>(STORAGE.settings, { masterVolume: 80 }).masterVolume);
  const [drumVolume, setDrumVolume] = useState(() => loadJson<{ drumVolume: number }>(STORAGE.settings, { drumVolume: 80 }).drumVolume);
  const [engineType, setEngineType] = useState('default');
  const [engineState, setEngineState] = useState<'standby' | 'live' | 'error'>('standby');
  const [engineMessage, setEngineMessage] = useState('Standby');
  const [inputMode, setInputMode] = useState<'mic' | 'file' | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [isDrumPlaying, setIsDrumPlaying] = useState(false);
  const [playingStep, setPlayingStep] = useState(-1);
  const [tuner, setTuner] = useState<TunerReadout>(null);
  const [presetName, setPresetName] = useState('');
  const [presetCategory, setPresetCategory] = useState('custom');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [toast, setToast] = useState('');

  const audioSupported = typeof window !== 'undefined' && Boolean(window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
  const mediaSupported = typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);
  const activeEffects = useMemo(() => effects.filter((effect) => effect.enabled).length, [effects]);
  const currentEngine = enginePresets.find((preset) => preset.id === engineType)?.label ?? 'Default';

  function notify(message: string) {
    setToast(message);
  }

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    localStorage.setItem(STORAGE.effects, JSON.stringify(effects));
    engineRef.current.rebuild(effects);
  }, [effects]);

  useEffect(() => {
    patternRef.current = pattern;
    localStorage.setItem(STORAGE.pattern, JSON.stringify(pattern));
  }, [pattern]);

  useEffect(() => {
    drumVolumeRef.current = drumVolume / 100;
    engineRef.current.setDrumVolume(drumVolume / 100);
    localStorage.setItem(STORAGE.settings, JSON.stringify({ tempo, masterVolume, drumVolume }));
  }, [drumVolume, masterVolume, tempo]);

  useEffect(() => {
    engineRef.current.setMasterVolume(masterVolume / 100);
  }, [masterVolume]);

  useEffect(() => {
    if (!mediaSupported) return;
    void navigator.mediaDevices.enumerateDevices().then((list) => {
      setDevices(list.filter((device) => device.kind === 'audioinput'));
    }).catch(() => undefined);
  }, [mediaSupported]);

  useEffect(() => {
    if (!isDrumPlaying) {
      setPlayingStep(-1);
      return;
    }
    let step = 0;
    const beatMs = (60_000 / tempo) / 4;
    try {
      engineRef.current.playDrumStep(step, patternRef.current);
    } catch (error) {
      setIsDrumPlaying(false);
      notify(error instanceof Error ? error.message : 'Could not start the drum engine.');
      return;
    }
    setPlayingStep(step);
    const interval = window.setInterval(() => {
      step = (step + 1) % 16;
      engineRef.current.playDrumStep(step, patternRef.current);
      setPlayingStep(step);
    }, beatMs);
    return () => window.clearInterval(interval);
  }, [isDrumPlaying, tempo]);

  useEffect(() => {
    if (view !== 'tuner' || !engineRef.current.analyser || !engineRef.current.ctx) return;
    let frame = 0;
    const read = () => {
      const engine = engineRef.current;
      const buffer = engine.timeDomain();
      if (buffer && engine.ctx) {
        const frequency = detectPitch(buffer, engine.ctx.sampleRate);
        if (frequency) {
          const midi = Math.round(69 + 12 * Math.log2(frequency / 440));
          const target = 440 * Math.pow(2, (midi - 69) / 12);
          setTuner({
            note: noteNames[(midi + 120) % 12],
            octave: Math.floor(midi / 12) - 1,
            frequency,
            cents: 1200 * Math.log2(frequency / target),
          });
        } else {
          setTuner(null);
        }
      }
      frame = window.requestAnimationFrame(read);
    };
    frame = window.requestAnimationFrame(read);
    return () => window.cancelAnimationFrame(frame);
  }, [engineState, view]);

  const connectMic = async () => {
    if (!mediaSupported) {
      setEngineState('error');
      setEngineMessage('Microphone unavailable');
      notify('This browser does not expose microphone input.');
      return;
    }
    if (inputMode) {
      engineRef.current.disconnectSource();
      setInputMode(null);
      setEngineState('standby');
      setEngineMessage('Standby');
      notify('Input disconnected.');
      return;
    }
    try {
      await engineRef.current.connectMicrophone(selectedDevice || undefined);
      engineRef.current.setMasterVolume(masterVolume / 100);
      engineRef.current.rebuild(effects);
      setInputMode('mic');
      setEngineState('live');
      setEngineMessage('Mic live');
      const list = await navigator.mediaDevices.enumerateDevices();
      setDevices(list.filter((device) => device.kind === 'audioinput'));
      notify('Microphone connected through your chain.');
    } catch (error) {
      setEngineState('error');
      setEngineMessage('Permission needed');
      notify(error instanceof Error ? error.message : 'Microphone permission was denied.');
    }
  };

  const loadAudio = async (file: File) => {
    try {
      await engineRef.current.loadFile(file);
      engineRef.current.setMasterVolume(masterVolume / 100);
      engineRef.current.rebuild(effects);
      setInputMode('file');
      setEngineState('live');
      setEngineMessage('File looping');
      notify(`${file.name} is looping through the chain.`);
    } catch (error) {
      setEngineState('error');
      setEngineMessage('Playback failed');
      notify(error instanceof Error ? error.message : 'Could not play this audio file.');
    }
  };

  const updateEffect = (id: string, key: string, value: number) => {
    setEffects((current) => current.map((effect) => effect.id === id ? { ...effect, params: { ...effect.params, [key]: value } } : effect));
  };

  const moveEffect = (id: string, direction: -1 | 1) => {
    setEffects((current) => {
      const index = current.findIndex((effect) => effect.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addEffect = (type: EffectType) => {
    setEffects((current) => [...current, createEffect(type)]);
    notify(`${effectDefinitions[type].name} added to the chain.`);
  };

  const savePreset = () => {
    const name = presetName.trim();
    if (!name) {
      notify('Give this chain a name first.');
      return;
    }
    const next: Preset = {
      id: makeId('preset'),
      name,
      category: presetCategory,
      effects: cloneEffects(effects),
      createdAt: new Date().toISOString(),
    };
    setPresets((current) => [next, ...current]);
    setPresetName('');
    setSelectedPreset(next.id);
    notify(`${name} saved locally.`);
  };

  const loadPreset = (preset: Preset) => {
    setEffects(cloneEffects(preset.effects));
    setSelectedPreset(preset.id);
    notify(`${preset.name} loaded into Forge.`);
    setView('forge');
  };

  const deletePreset = (id: string) => {
    const preset = presets.find((item) => item.id === id);
    if (!preset || !window.confirm(`Delete "${preset.name}"?`)) return;
    setPresets((current) => current.filter((item) => item.id !== id));
    if (selectedPreset === id) setSelectedPreset('');
    notify('Preset removed from this browser.');
  };

  const clearPattern = () => {
    setPattern({ kick: Array(16).fill(false), snare: Array(16).fill(false), hat: Array(16).fill(false) });
    notify('Pattern cleared.');
  };

  const randomizePattern = () => {
    const randomTrack = (chance: number) => Array.from({ length: 16 }, (_, index) => index === 0 || Math.random() < chance);
    setPattern({ kick: randomTrack(.25), snare: randomTrack(.16), hat: randomTrack(.54) });
    notify('A new groove is ready.');
  };

  const updateStep = (track: keyof Pattern, index: number) => {
    setPattern((current) => ({
      ...current,
      [track]: current[track].map((value, step) => step === index ? !value : value),
    }));
  };

  const exportData = () => {
    const payload = {
      app: 'StompFlow',
      version: 1,
      exportedAt: new Date().toISOString(),
      effects,
      presets,
      pattern,
      settings: { tempo, masterVolume, drumVolume, engineType },
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `stompflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    notify('StompFlow data exported.');
  };

  const importData = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as Partial<{ effects: Effect[]; presets: Preset[]; pattern: Pattern; settings: { tempo: number; masterVolume: number; drumVolume: number; engineType: string } }>;
      if (Array.isArray(parsed.effects)) setEffects(parsed.effects);
      if (Array.isArray(parsed.presets)) setPresets(parsed.presets);
      if (parsed.pattern?.kick && parsed.pattern?.snare && parsed.pattern?.hat) setPattern(parsed.pattern);
      if (parsed.settings) {
        if (typeof parsed.settings.tempo === 'number') setTempo(Math.max(60, Math.min(200, parsed.settings.tempo)));
        if (typeof parsed.settings.masterVolume === 'number') setMasterVolume(Math.max(0, Math.min(100, parsed.settings.masterVolume)));
        if (typeof parsed.settings.drumVolume === 'number') setDrumVolume(Math.max(0, Math.min(100, parsed.settings.drumVolume)));
        if (typeof parsed.settings.engineType === 'string') setEngineType(parsed.settings.engineType);
      }
      notify('Backup imported into this browser.');
    } catch {
      notify('That file is not a valid StompFlow backup.');
    }
  };

  const resetData = () => {
    if (!window.confirm('Reset presets, pattern, effects, and local settings?')) return;
    Object.values(STORAGE).forEach((key) => localStorage.removeItem(key));
    setEffects([createEffect('overdrive'), createEffect('delay')]);
    setPresets([]);
    setPattern(defaultPattern());
    setTempo(110);
    setMasterVolume(80);
    setDrumVolume(80);
    setEngineType('default');
    notify('Local StompFlow data reset.');
  };

  const statusText = engineState === 'live' ? (inputMode === 'file' ? 'File live' : 'Mic live') : engineMessage;
  const needlePosition = tuner ? Math.max(4, Math.min(96, 50 + tuner.cents / 2)) : 50;
  const inTune = tuner ? Math.abs(tuner.cents) < 7 : false;

  const renderForge = () => (
    <>
      <div className="view-intro">
        <div>
          <div className="eyebrow">Signal workspace / 01</div>
          <h1>Forge your tone.</h1>
          <p>Put a real-time chain between your instrument and the room. Every control stays local, fast, and close to the metal.</p>
        </div>
        <div className={`signal-badge ${engineState === 'standby' ? 'offline' : ''}`} data-testid="status-forge">
          <span className={`status-dot ${engineState === 'live' ? 'live' : engineState === 'error' ? 'warn' : ''}`} />
          {statusText}
        </div>
      </div>
      <div className="workspace-grid">
        <div className="stack">
          <section className="card" data-testid="card-input">
            <div className="section-heading">
              <span className="heading-left"><Headphones size={14} /> Input & output</span>
              <strong>{activeEffects} active</strong>
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="input-device">Input device</label>
                <select id="input-device" className="select" data-testid="select-input-device" value={selectedDevice} onChange={(event) => setSelectedDevice(event.target.value)}>
                  <option value="">Default microphone</option>
                  {devices.map((device, index) => <option key={device.deviceId || index} value={device.deviceId}>{device.label || `Audio input ${index + 1}`}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="engine-preset">DSP engine</label>
                <select id="engine-preset" className="select" data-testid="select-engine-preset" value={engineType} onChange={(event) => { setEngineType(event.target.value); engineRef.current.engineType = event.target.value; notify('Engine preset applies on the next audio start.'); }}>
                  {enginePresets.map((preset) => <option key={preset.id} value={preset.id}>{preset.label}</option>)}
                </select>
              </div>
            </div>
            <div className="action-row" style={{ marginTop: 13 }}>
              <button className={`button primary ${inputMode ? 'live' : ''}`} data-testid="button-connect-mic" onClick={() => void connectMic()}>
                {inputMode ? <Pause size={15} /> : <Mic2 size={15} />}
                {inputMode ? 'Disconnect input' : 'Connect microphone'}
              </button>
              <button className="button" data-testid="button-load-audio" onClick={() => fileInputRef.current?.click()}>
                <Upload size={15} /> Load audio
              </button>
              <input ref={fileInputRef} className="hidden-input" type="file" accept="audio/*" data-testid="input-audio-file" onChange={(event) => { const file = event.target.files?.[0]; if (file) void loadAudio(file); event.currentTarget.value = ''; }} />
            </div>
            <div className="volume-line">
              <Volume2 size={14} />
              <span>Master</span>
              <input className="range" type="range" min="0" max="100" value={masterVolume} data-testid="input-master-volume" onChange={(event) => setMasterVolume(Number(event.target.value))} />
              <span className="range-value" data-testid="text-master-volume">{masterVolume}%</span>
            </div>
            <canvas className="scope" data-testid="canvas-oscilloscope" ref={(canvas) => {
              if (!canvas) return;
              const context = canvas.getContext('2d');
              if (!context) return;
              let frame = 0;
              const draw = () => {
                const ratio = window.devicePixelRatio || 1;
                const width = canvas.clientWidth * ratio;
                const height = canvas.clientHeight * ratio;
                if (canvas.width !== width || canvas.height !== height) {
                  canvas.width = width;
                  canvas.height = height;
                }
                context.clearRect(0, 0, width, height);
                context.strokeStyle = '#302920';
                context.lineWidth = ratio;
                context.beginPath();
                context.moveTo(0, height / 2);
                context.lineTo(width, height / 2);
                context.stroke();
                const data = engineRef.current.waveform();
                context.strokeStyle = engineState === 'live' ? '#e8782d' : '#604c3b';
                context.lineWidth = 1.5 * ratio;
                context.beginPath();
                if (data) {
                  data.forEach((value, index) => {
                    const x = (index / (data.length - 1)) * width;
                    const y = (value / 255) * height;
                    if (index === 0) context.moveTo(x, y);
                    else context.lineTo(x, y);
                  });
                } else {
                  context.moveTo(0, height / 2);
                  context.lineTo(width, height / 2);
                }
                context.stroke();
                frame = window.requestAnimationFrame(draw);
              };
              frame = window.requestAnimationFrame(draw);
              return () => window.cancelAnimationFrame(frame);
            }} />
          </section>
          <section>
            <div className="section-heading"><span className="heading-left"><Waves size={14} /> Signal chain</span><strong>drag order</strong></div>
            <div className="chain-list" data-testid="list-effect-chain">
              {effects.length === 0 ? (
                <div className="chain-empty"><Plus size={20} /><strong>Your chain is clear.</strong><span>Add a pedal below to start shaping the signal.</span></div>
              ) : effects.map((effect, index) => {
                const definition = effectDefinitions[effect.type];
                return (
                  <article className={`effect-card ${effect.enabled ? '' : 'off'}`} key={effect.id} data-testid={`card-effect-${effect.id}`}>
                    <div className="effect-head">
                      <GripVertical size={15} className="drag-handle" />
                      <div className="effect-chip" style={{ background: definition.color }}><EffectIcon type={effect.type} /></div>
                      <div className="effect-name" role="button" tabIndex={0} data-testid={`button-expand-${effect.id}`} onClick={() => setEffects((current) => current.map((item) => item.id === effect.id ? { ...item, expanded: !item.expanded } : item))} onKeyDown={(event) => { if (event.key === 'Enter') setEffects((current) => current.map((item) => item.id === effect.id ? { ...item, expanded: !item.expanded } : item)); }}>
                        <strong>{definition.name}</strong><span>{effect.enabled ? 'In path' : 'Bypassed'}</span>
                      </div>
                      <div className="effect-controls">
                        <button className="mini-button" aria-label="Move effect up" data-testid={`button-move-up-${effect.id}`} onClick={() => moveEffect(effect.id, -1)} disabled={index === 0}><MoveUp size={13} /></button>
                        <button className="mini-button" aria-label="Move effect down" data-testid={`button-move-down-${effect.id}`} onClick={() => moveEffect(effect.id, 1)} disabled={index === effects.length - 1}><MoveDown size={13} /></button>
                        <button className="mini-button" aria-label="Remove effect" data-testid={`button-remove-${effect.id}`} onClick={() => { setEffects((current) => current.filter((item) => item.id !== effect.id)); notify(`${definition.name} removed.`); }}><Trash2 size={13} /></button>
                        <button className={`toggle ${effect.enabled ? 'on' : ''}`} aria-label={`Toggle ${definition.name}`} data-testid={`button-toggle-${effect.id}`} onClick={() => setEffects((current) => current.map((item) => item.id === effect.id ? { ...item, enabled: !item.enabled } : item))} />
                        <button className="mini-button" aria-label="Expand effect controls" data-testid={`button-controls-${effect.id}`} onClick={() => setEffects((current) => current.map((item) => item.id === effect.id ? { ...item, expanded: !item.expanded } : item))}>{effect.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button>
                      </div>
                    </div>
                    {effect.expanded && <div className="effect-params">
                      {Object.entries(definition.params).map(([key, spec]) => <div className="param-line" key={key}>
                        <label htmlFor={`${effect.id}-${key}`}>{spec.label}</label>
                        <input id={`${effect.id}-${key}`} className="range" type="range" min={spec.min} max={spec.max} value={effect.params[key] ?? spec.default} data-testid={`input-${effect.id}-${key}`} onChange={(event) => updateEffect(effect.id, key, Number(event.target.value))} />
                        <output data-testid={`text-${effect.id}-${key}`}>{effect.params[key] ?? spec.default}</output>
                      </div>)}
                    </div>}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
        <aside className="stack">
          <section className="card compact">
            <div className="section-heading"><span className="heading-left"><Cpu size={14} /> Engine monitor</span></div>
            <div className="stat-list">
              <div className="stat-line"><span>Context</span><strong>{engineRef.current.ctx ? engineRef.current.ctx.state : 'not started'}</strong></div>
              <div className="stat-line"><span>Input</span><strong>{inputMode === 'mic' ? 'Microphone' : inputMode === 'file' ? 'Audio file' : 'None'}</strong></div>
              <div className="stat-line"><span>Processing</span><strong>{currentEngine.split(' · ')[0]}</strong></div>
              <div className="stat-line"><span>Active pedals</span><strong>{activeEffects} / {effects.length}</strong></div>
            </div>
            <div className="meter" aria-label="Signal meter">{Array.from({ length: 16 }, (_, index) => <i key={index} className={`${engineState === 'live' && index < 10 ? 'lit' : ''} ${index > 13 ? 'clip' : index > 10 ? 'hot' : ''}`} />)}</div>
            <div className="stat-line"><span>Local audio path</span><strong style={{ color: engineState === 'live' ? 'var(--green)' : 'var(--text-dim)' }}>{engineState === 'live' ? 'Running' : 'Idle'}</strong></div>
          </section>
          <section className="card compact">
            <div className="section-heading"><span className="heading-left"><Plus size={14} /> Add effects</span></div>
            <div className="add-effect-grid" data-testid="grid-add-effects">
              {effectOrder.map((type) => <button className="effect-add" key={type} data-testid={`button-add-${type}`} onClick={() => addEffect(type)}><EffectIcon type={type} size={15} /><span>{effectDefinitions[type].name}</span></button>)}
            </div>
          </section>
        </aside>
      </div>
    </>
  );

  const renderDrums = () => (
    <>
      <div className="view-intro">
        <div><div className="eyebrow">Rhythm section / 02</div><h1>Find the pocket.</h1><p>Build a compact practice loop, then let it run underneath the tone you forged.</p></div>
        <div className="signal-badge"><Activity size={13} /> 16 steps / 3 voices</div>
      </div>
      <div className="drum-layout">
        <div className="stack">
          <section className="card" data-testid="card-drum-controls">
            <div className="action-row">
              <button className={`button primary ${isDrumPlaying ? 'live' : ''}`} style={{ flex: 1 }} data-testid="button-drum-play" onClick={() => setIsDrumPlaying((value) => !value)}>{isDrumPlaying ? <Pause size={15} /> : <Play size={15} />}{isDrumPlaying ? 'Stop pattern' : 'Play pattern'}</button>
              <button className="button" data-testid="button-drum-clear" onClick={clearPattern}><RotateCcw size={14} /> Clear</button>
              <button className="button" data-testid="button-drum-random" onClick={randomizePattern}><Shuffle size={14} /> Randomize</button>
            </div>
            <div className="tempo-line"><span className="eyebrow">Tempo</span><input className="range" type="range" min="60" max="200" value={tempo} data-testid="input-tempo" onChange={(event) => setTempo(Number(event.target.value))} /><span className="tempo-number" data-testid="text-tempo">{tempo} BPM</span></div>
            <div className="volume-line"><Volume2 size={14} /><span>Drum level</span><input className="range" type="range" min="0" max="100" value={drumVolume} data-testid="input-drum-volume" onChange={(event) => setDrumVolume(Number(event.target.value))} /><span className="range-value" data-testid="text-drum-volume">{drumVolume}%</span></div>
          </section>
          <section className="card" data-testid="card-sequencer">
            <div className="section-heading"><span className="heading-left"><Music2 size={14} /> Step sequencer</span><strong>{isDrumPlaying ? `step ${(playingStep + 1).toString().padStart(2, '0')}` : 'ready'}</strong></div>
            <div className="sequencer">
              {(['kick', 'snare', 'hat'] as const).map((track) => <div className="seq-row" key={track}><span className="seq-label">{track}</span><div className="seq-steps">{pattern[track].map((on, index) => <button key={`${track}-${index}`} className={`step ${on ? 'on' : ''} ${playingStep === index ? 'playing' : ''}`} aria-label={`${track} step ${index + 1}`} data-testid={`button-step-${track}-${index + 1}`} onClick={() => updateStep(track, index)} />)}</div></div>)}
            </div>
          </section>
        </div>
        <aside className="stack">
          <section className="card compact"><div className="section-heading"><span className="heading-left"><Radio size={14} /> Groove notes</span></div><p className="info-copy">Kick, snare, and hat are synthesized with the same local Web Audio engine as Forge. No samples or network connection required.</p></section>
          <section className="card compact"><div className="section-heading"><span className="heading-left"><Save size={14} /> Auto-saved</span></div><p className="info-copy">Your pattern and tempo are kept in this browser automatically. Export a backup from Settings when you want to move rigs.</p></section>
        </aside>
      </div>
    </>
  );

  const renderTuner = () => (
    <>
      <div className="view-intro"><div><div className="eyebrow">Pitch utility / 03</div><h1>Lock the note.</h1><p>Connect an input in Forge, then tune against a clean reference. Detection stays in your browser.</p></div><div className={`signal-badge ${inputMode ? '' : 'offline'}`}><span className={`status-dot ${inputMode ? 'live' : ''}`} />{inputMode ? 'Listening' : 'Connect input'}</div></div>
      <div className="workspace-grid">
        <div className="stack">
          <section className="card tuner-card" data-testid="card-tuner">
            <div className="eyebrow">{inputMode ? 'Input connected · pitch detection active' : 'Standby · connect input on Forge'}</div>
            <div className="tuner-note" data-testid="text-tuner-note">{tuner?.note ?? '—'}{tuner && <small>{tuner.octave}</small>}</div>
            <div className="tuner-hz" data-testid="text-tuner-frequency">{tuner ? `${tuner.frequency.toFixed(2)} Hz` : 'Play a note to detect pitch'}</div>
            <div className="tuner-meter"><div className="tuner-center" /><div className="tuner-needle" style={{ left: `${needlePosition}%`, background: inTune ? 'var(--green)' : 'var(--orange)' }} /></div>
            <div className="tuner-status" data-testid="text-tuner-cents">{tuner ? (inTune ? 'In tune' : `${tuner.cents > 0 ? '+' : ''}${tuner.cents.toFixed(1)} cents`) : '—'}</div>
          </section>
          <section className="card"><div className="section-heading"><span className="heading-left"><SlidersHorizontal size={14} /> Standard tuning</span><strong>A = 440 Hz</strong></div><div className="string-grid">{tuning.map((string) => <div className="string-ref" key={`${string.note}${string.octave}`}><strong>{string.note}<sup>{string.octave}</sup></strong><span>{string.hz} Hz</span></div>)}</div></section>
        </div>
        <aside className="stack"><section className="card compact"><div className="section-heading"><span className="heading-left"><CircleHelp size={14} /> How it reads</span></div><p className="info-copy">The needle compares your strongest periodic frequency with the nearest chromatic note. Keep one string ringing at a time for the quickest lock.</p></section></aside>
      </div>
    </>
  );

  const renderPresets = () => (
    <>
      <div className="view-intro"><div><div className="eyebrow">Local library / 04</div><h1>Keep the good ones.</h1><p>Save complete effect chains as local snapshots. Presets never leave this device unless you export them.</p></div><div className="signal-badge"><FolderOpen size={13} /> {presets.length} saved</div></div>
      <div className="workspace-grid">
        <div className="stack">
          <section className="card" data-testid="card-save-preset"><div className="section-heading"><span className="heading-left"><Save size={14} /> Save current chain</span><strong>{effects.length} pedals</strong></div><div className="field-grid"><div className="field"><label htmlFor="preset-name">Preset name</label><input id="preset-name" className="text-input" placeholder="e.g. Glass room" value={presetName} data-testid="input-preset-name" onChange={(event) => setPresetName(event.target.value)} /></div><div className="field"><label htmlFor="preset-category">Character</label><select id="preset-category" className="select" value={presetCategory} data-testid="select-preset-category" onChange={(event) => setPresetCategory(event.target.value)}><option value="clean">Clean</option><option value="crunch">Crunch</option><option value="heavy">Heavy</option><option value="ambient">Ambient</option><option value="custom">Custom</option></select></div></div><button className="button primary" style={{ marginTop: 13 }} data-testid="button-save-preset" onClick={savePreset}><Save size={14} /> Save snapshot</button></section>
          <section><div className="section-heading"><span className="heading-left"><FolderOpen size={14} /> Your presets</span><strong>{presets.length}</strong></div>{presets.length === 0 ? <div className="empty-state" data-testid="empty-presets"><FolderOpen size={20} /><strong>No saved chains yet.</strong><span>Forge a sound, name it above, and it will appear here.</span></div> : <div className="preset-grid" data-testid="list-presets">{presets.map((preset) => <article className="preset-card" key={preset.id} data-testid={`card-preset-${preset.id}`}><div className="preset-card-top"><div className="preset-stripe" style={{ background: preset.category === 'heavy' ? 'var(--red)' : preset.category === 'ambient' ? '#9c6ac8' : preset.category === 'clean' ? 'var(--green)' : 'var(--orange)' }} /><div><h3>{preset.name}</h3><div className="preset-meta">{preset.category} · {preset.effects.length} effects</div></div></div><div className="action-row"><button className="button primary" data-testid={`button-load-preset-${preset.id}`} onClick={() => loadPreset(preset)}>Load</button><button className="button icon-only danger" aria-label={`Delete ${preset.name}`} data-testid={`button-delete-preset-${preset.id}`} onClick={() => deletePreset(preset.id)}><Trash2 size={14} /></button></div></article>)}</div>}</section>
        </div>
        <aside className="stack"><section className="card compact"><div className="section-heading"><span className="heading-left"><Download size={14} /> Quick load</span></div><select className="select" value={selectedPreset} data-testid="select-load-preset" onChange={(event) => setSelectedPreset(event.target.value)}><option value="">Select a saved preset</option>{presets.map((preset) => <option key={preset.id} value={preset.id}>{preset.name}</option>)}</select><button className="button primary" style={{ width: '100%', marginTop: 10 }} disabled={!selectedPreset} data-testid="button-quick-load" onClick={() => { const preset = presets.find((item) => item.id === selectedPreset); if (preset) loadPreset(preset); }}>Load into Forge</button></section></aside>
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <div className="view-intro"><div><div className="eyebrow">Workbench / 05</div><h1>Keep it yours.</h1><p>StompFlow is a standalone browser workstation. Inspect the engine, move your local rig, or start fresh.</p></div><div className="signal-badge"><Settings2 size={13} /> Offline ready</div></div>
      <div className="settings-grid">
        <section className="card wide"><div className="section-heading"><span className="heading-left"><CircleHelp size={14} /> About StompFlow</span><strong>v1 local build</strong></div><p className="info-copy">A focused practice and performance companion for guitarists who want the immediacy of a real pedalboard with the convenience of a browser. Microphone input, file playback, effects, drums, and pitch detection all run locally with the Web Audio API.</p></section>
        <section className="card"><div className="section-heading"><span className="heading-left"><Cpu size={14} /> Engine status</span></div><div className="stat-list"><div className="stat-line"><span>Web Audio API</span><strong style={{ color: audioSupported ? 'var(--green)' : 'var(--red)' }}>{audioSupported ? 'Available' : 'Unsupported'}</strong></div><div className="stat-line"><span>Microphone access</span><strong style={{ color: mediaSupported ? 'var(--green)' : 'var(--red)' }}>{mediaSupported ? 'Available' : 'Unavailable'}</strong></div><div className="stat-line"><span>Context state</span><strong>{engineRef.current.ctx?.state ?? 'not started'}</strong></div><div className="stat-line"><span>Selected engine</span><strong>{currentEngine}</strong></div></div>{!audioSupported && <div className="unsupported" style={{ marginTop: 15 }}><CircleHelp size={15} /> This browser cannot create a Web Audio context. Try a current desktop or mobile browser.</div>}{engineState === 'error' && <div className="unsupported" style={{ marginTop: 15 }}><CircleHelp size={15} /> {engineMessage}. Check browser permissions, then try connecting again.</div>}</section>
        <section className="card"><div className="section-heading"><span className="heading-left"><FileJson size={14} /> Data suitcase</span></div><p className="info-copy" style={{ marginBottom: 14 }}>Move presets, the current chain, and your beat pattern as one readable JSON file.</p><div className="action-row"><button className="button" data-testid="button-export-data" onClick={exportData}><Download size={14} /> Export JSON</button><button className="button" data-testid="button-import-data" onClick={() => importInputRef.current?.click()}><FileUp size={14} /> Import JSON</button><input ref={importInputRef} className="hidden-input" type="file" accept="application/json" data-testid="input-import-data" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importData(file); event.currentTarget.value = ''; }} /></div></section>
        <section className="card wide"><div className="section-heading"><span className="heading-left"><RefreshCw size={14} /> Reset local workspace</span></div><p className="info-copy" style={{ marginBottom: 14 }}>Clear every local preset, chain setting, and saved pattern from this browser. This cannot be undone.</p><button className="button danger" data-testid="button-reset-data" onClick={resetData}><Trash2 size={14} /> Reset all local data</button></section>
      </div>
    </>
  );

  const navItems: Array<{ id: View; label: string; icon: typeof Music2 }> = [
    { id: 'forge', label: 'Forge', icon: Music2 },
    { id: 'drums', label: 'Drums', icon: Activity },
    { id: 'tuner', label: 'Tuner', icon: SlidersHorizontal },
    { id: 'presets', label: 'Presets', icon: FolderOpen },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  const switchView = (next: View) => setView(next);

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <div className="brand-lockup"><div className="brand-mark"><Music2 size={21} /></div><div><div className="brand-name">STOMP<em>FLOW</em></div><div className="brand-sub">Guitar workstation</div></div></div>
        <div className="rail-caption">Workbench</div>
        <nav className="rail-nav" aria-label="Main navigation">{navItems.map(({ id, label, icon: Icon }) => <button className={`nav-button ${view === id ? 'active' : ''}`} key={id} data-testid={`nav-${id}`} onClick={() => switchView(id)}><Icon size={17} />{label}</button>)}</nav>
        <div className="rail-footer"><div className="engine-pip"><span className={`status-dot ${engineState === 'live' ? 'live' : engineState === 'error' ? 'warn' : ''}`} />{statusText}</div><div className="brand-sub" style={{ marginTop: 8 }}>All processing local</div></div>
      </aside>
      <main className="main-area">
        <header className="top-bar"><div className="top-title">{navItems.find((item) => item.id === view)?.label}<small>STOMP / {String(navItems.findIndex((item) => item.id === view) + 1).padStart(2, '0')}</small></div><div className="top-status"><span className={`status-dot ${engineState === 'live' ? 'live' : engineState === 'error' ? 'warn' : ''}`} />{statusText}</div></header>
        <div className="view-wrap" key={view}>{view === 'forge' ? renderForge() : view === 'drums' ? renderDrums() : view === 'tuner' ? renderTuner() : view === 'presets' ? renderPresets() : renderSettings()}</div>
      </main>
      <nav className="mobile-tabs" aria-label="Mobile navigation">{navItems.map(({ id, label, icon: Icon }) => <button className={`mobile-tab ${view === id ? 'active' : ''}`} key={id} data-testid={`mobile-nav-${id}`} onClick={() => switchView(id)}><Icon size={17} />{label}</button>)}</nav>
      <div className={`toast ${toast ? 'show' : ''}`} role="status" data-testid="toast-message">{toast}</div>
    </div>
  );
}

export default App;