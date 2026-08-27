import { motion } from 'framer-motion';

const base = import.meta.env.BASE_URL;

export function Scene1() {
  return (
    <motion.section
      className="scene-layer"
      initial={{ clipPath: 'circle(0% at 50% 60%)', opacity: 0 }}
      animate={{ clipPath: 'circle(78% at 50% 60%)', opacity: 1 }}
      exit={{ clipPath: 'circle(0% at 46% 63%)', opacity: 0 }}
      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      style={{ background: 'linear-gradient(142deg, #18120e 0%, #21150e 52%, #372015 100%)' }}
    >
      <motion.img
        src={`${base}assets/stompflow-waveform.png`}
        alt=""
        className="scene-layer"
        initial={{ opacity: 0, scale: 1.16, x: '8%' }}
        animate={{ opacity: .22, scale: 1, x: '-3%' }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ width: '132%', height: '75%', top: '24%', objectFit: 'cover', mixBlendMode: 'screen' }}
      />
      <motion.div
        className="orb"
        initial={{ scale: .2, opacity: 0 }}
        animate={{ scale: 1, opacity: .8 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '75vw', height: '75vw', left: '-32vw', top: '24%', background: 'rgba(231,119,63,.25)', filter: 'blur(42px)' }}
      />
      <div className="corner-mark"><b>S</b> local signal / 001</div>
      <motion.div
        className="scene-copy"
        initial={{ opacity: 0, x: '-12%', y: '6%' }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, y: '-5%' }}
        transition={{ delay: .32, duration: .8, ease: [0.16, 1, 0.3, 1] }}
        style={{ left: '9%', top: '25%', width: '82%' }}
      >
        <div className="eyebrow">Guitar FX · drums · tuner</div>
        <h1 className="display" style={{ marginTop: '3.5vw', fontSize: '26vw', color: 'var(--cream)' }}>
          STOMP<span style={{ color: 'var(--clay-bright)' }}>FLOW</span>
        </h1>
        <motion.div
          className="hairline"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: .82, duration: .7, ease: 'easeOut' }}
          style={{ width: '63%', marginTop: '7vw' }}
        />
        <motion.p
          className="micro"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: .6 }}
          style={{ marginTop: '4.5vw', maxWidth: '68%' }}
        >
          Turn a browser into a small, serious rig.
        </motion.p>
      </motion.div>
      <motion.div
        className="scene-number"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ position: 'absolute', left: '9%', bottom: '7%' }}
      >
        01 / FIND YOUR FREQUENCY
      </motion.div>
    </motion.section>
  );
}