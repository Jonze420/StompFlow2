import { motion } from 'framer-motion';

const base = import.meta.env.BASE_URL;

const modules = [
  { name: 'OVERDRIVE', note: 'warm / 40', color: '#e7773f', width: '72%' },
  { name: 'DELAY', note: 'echo / 35', color: '#7aa3a2', width: '58%' },
  { name: 'REVERB', note: 'space / 50', color: '#9fb88c', width: '84%' },
];

export function Scene2() {
  return (
    <motion.section
      className="scene-layer"
      initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
      animate={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
      exit={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
      transition={{ duration: .9, ease: [0.4, 0, 0.2, 1] }}
      style={{ background: 'linear-gradient(160deg, #16120f 0%, #1d1814 55%, #243029 100%)' }}
    >
      <div className="corner-mark"><b>S</b> chain / 002</div>
      <motion.div
        className="orb drift"
        animate={{ x: ['-8%', '9%', '-8%'], y: ['4%', '-6%', '4%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: '78vw', height: '78vw', right: '-42vw', top: '7%', background: 'rgba(159,184,140,.18)', filter: 'blur(40px)' }}
      />
      <motion.img
        src={`${base}assets/stompflow-pedals.png`}
        alt=""
        className="pedal-cutout"
        initial={{ opacity: 0, x: '20%', rotate: 11, scale: .76 }}
        animate={{ opacity: .93, x: '-7%', rotate: -8, scale: 1 }}
        exit={{ opacity: 0, x: '-18%', rotate: -13, scale: 1.08 }}
        transition={{ delay: .2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ right: '-11%', top: '12%', width: '78%', transformOrigin: 'center' }}
      />
      <div className="scene-copy" style={{ left: '9%', top: '11%', width: '83%' }}>
        <motion.div className="eyebrow" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35 }}>Build the chain</motion.div>
        <motion.h2 className="display" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5, duration: .7 }} style={{ fontSize: '17vw', marginTop: '2.5vw' }}>
          SIGNAL<br /><span style={{ color: 'var(--clay-bright)' }}>SHAPED.</span>
        </motion.h2>
      </div>
      <div style={{ position: 'absolute', left: '9%', right: '9%', bottom: '10%', zIndex: 8 }}>
        <motion.div className="micro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .9 }} style={{ marginBottom: '3vw' }}>
          Drag the color into the sound.
        </motion.div>
        <div style={{ display: 'grid', gap: '2.4vw' }}>
          {modules.map((module, index) => (
            <motion.div
              key={module.name}
              className="ui-panel"
              initial={{ opacity: 0, x: '-18%' }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * .16, duration: .58, ease: [0.16, 1, 0.3, 1] }}
              style={{ padding: '3.4vw 3.6vw', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '3vw' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                  <strong className="font-display" style={{ fontSize: '5.5vw', letterSpacing: '.02em' }}>{module.name}</strong>
                  <span className="ui-label">{module.note}</span>
                </div>
                <div className="meter-track" style={{ marginTop: '2.8vw' }}>
                  <motion.div className="meter-fill" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.25 + index * .15, duration: .75 }} style={{ width: module.width, background: module.color }} />
                </div>
              </div>
              <div style={{ width: '5.5vw', height: '5.5vw', borderRadius: '50%', border: `1px solid ${module.color}`, boxShadow: `inset 0 0 0 1vw ${module.color}22` }} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}