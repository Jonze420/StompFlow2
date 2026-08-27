import { motion } from 'framer-motion';

export function Scene5() {
  return (
    <motion.section
      className="scene-layer"
      initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
      animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
      exit={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
      transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}
      style={{ background: 'linear-gradient(135deg, #211710 0%, #17120e 52%, #282319 100%)' }}
    >
      <div className="corner-mark"><b>S</b> keep playing / 005</div>
      <motion.div className="orb drift" style={{ width: '95vw', height: '95vw', left: '-48vw', top: '46%', background: 'rgba(231,119,63,.16)', filter: 'blur(36px)' }} />
      <motion.div className="scene-copy" initial={{ opacity: 0, x: '-12%' }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .22, duration: .75 }} style={{ left: '9%', top: '17%', width: '82%' }}>
        <div className="eyebrow">Your rig, your room, your rules</div>
        <h2 className="display" style={{ fontSize: '18vw', marginTop: '3vw' }}>PLAY<br /><span style={{ color: 'var(--clay-bright)' }}>IT BACK.</span></h2>
        <p className="micro" style={{ maxWidth: '75%', marginTop: '5vw' }}>Presets stay close. Audio stays local. The signal stays yours.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: '20%', rotate: 7 }} animate={{ opacity: 1, y: 0, rotate: 3 }} exit={{ opacity: 0, y: '-15%', scale: 1.1 }} transition={{ delay: .6, duration: .9, ease: [0.16, 1, 0.3, 1] }} className="ui-panel" style={{ position: 'absolute', left: '9%', right: '9%', bottom: '12%', padding: '4.5vw', zIndex: 7 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="ui-label">CURRENT PRESET</div>
            <div className="font-display" style={{ fontSize: '9vw', lineHeight: .95, color: 'var(--cream)' }}>MIDNIGHT ROOM</div>
          </div>
          <motion.div animate={{ rotate: [0, 10, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ width: '12vw', height: '12vw', borderRadius: '50%', border: '1px solid var(--clay)', display: 'grid', placeItems: 'center', color: 'var(--clay-bright)', fontFamily: 'var(--font-display)', fontSize: '6vw' }}>↗</motion.div>
        </div>
        <div className="hairline" style={{ margin: '4vw 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <span className="micro">OVERDRIVE · DELAY · REVERB</span>
          <span className="ui-label" style={{ color: 'var(--sage)' }}>SAVED LOCALLY</span>
        </div>
      </motion.div>
      <motion.div className="scene-number" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 }} style={{ position: 'absolute', left: '9%', bottom: '5.5%' }}>STOMPFLOW / WEB AUDIO / 2025</motion.div>
    </motion.section>
  );
}