import { motion } from 'framer-motion';

const steps = Array.from({ length: 16 }, (_, index) => index);
const activeRows = [
  { label: 'KICK', active: [0, 4, 8, 12], color: '#e7773f' },
  { label: 'SNARE', active: [4, 12], color: '#9fb88c' },
  { label: 'HAT', active: [0, 2, 4, 6, 8, 10, 12, 14], color: '#d7b78f' },
];

export function Scene3() {
  return (
    <motion.section
      className="scene-layer"
      initial={{ clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)', opacity: 0 }}
      animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', opacity: 1 }}
      exit={{ clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)', opacity: 0 }}
      transition={{ duration: .85, ease: [0.4, 0, 0.2, 1] }}
      style={{ background: 'linear-gradient(135deg, #1a1410, #32251b 64%, #19251d)' }}
    >
      <div className="corner-mark"><b>S</b> rhythm / 003</div>
      <motion.div
        className="scene-layer"
        animate={{ rotate: [0, 2, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ opacity: .13, backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 8.8%, rgba(241,223,195,.2) 8.95%, transparent 9.1%)', transformOrigin: '50% 50%' }}
      />
      <motion.div className="scene-copy" initial={{ opacity: 0, x: '-12%' }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3, duration: .75 }} style={{ left: '9%', top: '15%', width: '83%' }}>
        <div className="eyebrow">A beat in the browser</div>
        <h2 className="display" style={{ fontSize: '21vw', marginTop: '3.2vw' }}>
          JAM<br /><span style={{ color: 'var(--sage)' }}>LOCAL.</span>
        </h2>
        <p className="micro" style={{ marginTop: '5vw', maxWidth: '68%' }}>A small sequencer. A big excuse to keep playing.</p>
      </motion.div>
      <motion.div
        className="ui-panel"
        initial={{ opacity: 0, y: '12%', rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, scale: .9, y: '-8%' }}
        transition={{ delay: .65, duration: .9, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'absolute', left: '9%', right: '9%', bottom: '11%', padding: '4vw', zIndex: 7 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4vw' }}>
          <span className="ui-label">DRUM GRID / 16 STEP</span>
          <span className="font-display" style={{ fontSize: '7vw', color: 'var(--clay-bright)' }}>110 <small style={{ fontFamily: 'var(--font-body)', fontSize: '2.3vw', color: 'var(--muted)' }}>BPM</small></span>
        </div>
        <div style={{ display: 'grid', gap: '2.4vw' }}>
          {activeRows.map((row, rowIndex) => (
            <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '15% 1fr', gap: '3vw', alignItems: 'center' }}>
              <span className="ui-label" style={{ color: row.color }}>{row.label}</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '1vw' }}>
                {steps.map((step) => (
                  <motion.i
                    key={step}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: .95 + rowIndex * .08 + step * .025, type: 'spring', stiffness: 500, damping: 25 }}
                    style={{ aspectRatio: '1', borderRadius: '1vw', background: row.active.includes(step) ? row.color : 'rgba(243,234,219,.12)', boxShadow: row.active.includes(step) ? `0 0 10px ${row.color}55` : 'none' }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="scan-line" />
      </motion.div>
    </motion.section>
  );
}