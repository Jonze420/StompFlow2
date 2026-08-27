import { motion } from 'framer-motion';

export function Scene4() {
  return (
    <motion.section
      className="scene-layer"
      initial={{ clipPath: 'circle(0% at 50% 42%)', opacity: 0 }}
      animate={{ clipPath: 'circle(79% at 50% 42%)', opacity: 1 }}
      exit={{ clipPath: 'circle(0% at 50% 42%)', opacity: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ background: 'linear-gradient(145deg, #142018 0%, #1d2d22 55%, #26382b 100%)' }}
    >
      <div className="corner-mark"><b>S</b> tuning / 004</div>
      <motion.div className="orb" animate={{ rotate: 360, scale: [1, 1.08, 1] }} transition={{ rotate: { duration: 18, repeat: Infinity, ease: 'linear' }, scale: { duration: 5, repeat: Infinity } }} style={{ width: '110vw', height: '110vw', top: '2%', left: '-26vw', border: '1px solid rgba(159,184,140,.22)', boxShadow: '0 0 0 11vw rgba(159,184,140,.025), 0 0 0 23vw rgba(159,184,140,.025)' }} />
      <div className="scene-copy" style={{ left: '9%', top: '13%', width: '82%' }}>
        <motion.div className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35 }}>No guesswork</motion.div>
        <motion.h2 className="display" initial={{ opacity: 0, y: 23 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5, duration: .7 }} style={{ fontSize: '16vw', marginTop: '3vw' }}>HIT THE<br /><span style={{ color: 'var(--sage)' }}>CENTER.</span></motion.h2>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: .66 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.28 }}
        transition={{ delay: .55, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'absolute', left: '13%', right: '13%', top: '39%', aspectRatio: '1', borderRadius: '50%', border: '1px solid rgba(241,223,195,.25)', zIndex: 5 }}
      >
        <motion.div animate={{ rotate: [0, 4, -2, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', inset: '11%', borderRadius: '50%', border: '1px solid rgba(159,184,140,.4)', background: 'radial-gradient(circle at 35% 30%, rgba(159,184,140,.24), rgba(14,24,17,.45) 59%)', display: 'grid', placeItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 1.7, repeat: Infinity }} className="font-display" style={{ fontSize: '32vw', lineHeight: .75, color: 'var(--cream)' }}>E<small style={{ color: 'var(--sage)', fontSize: '.34em', verticalAlign: 'top' }}>2</small></motion.div>
            <div className="ui-label" style={{ marginTop: '5vw', color: 'var(--sage)' }}>IN TUNE</div>
          </div>
        </motion.div>
        <motion.div animate={{ rotate: [0, 4, -2, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', left: '49.5%', top: '-4%', width: '1%', height: '55%', background: 'var(--clay-bright)', transformOrigin: '50% 100%', borderRadius: 99, boxShadow: '0 0 18px rgba(242,155,99,.65)' }} />
      </motion.div>
      <motion.div className="micro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ position: 'absolute', left: '9%', bottom: '9%', width: '82%', display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
        <span>STANDARD TUNING</span><span>82.41 HZ</span><span style={{ color: 'var(--sage)' }}>+0.3 CENTS</span>
      </motion.div>
    </motion.section>
  );
}