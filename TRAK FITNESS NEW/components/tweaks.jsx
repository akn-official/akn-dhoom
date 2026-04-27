// Theme presets — each maps to CSS custom properties on :root
const THEMES = {
  'ember': {
    label: 'Ember (Warm)',
    vars: {
      '--bg': '#F5EFE4', '--bg-1': '#EFE6D5', '--bg-2': '#E7DCC7',
      '--line': '#D9CCB4', '--line-2': '#B8A784',
      '--ink': '#1C120E', '--ink-dim': '#6B5D51', '--ink-faint': '#9A8E80',
      '--accent': '#E8833A', '--accent-deep': '#B8561F',
      '--accent-rgb': '232,131,58',
      '--burgundy': '#6E1E2B', '--burgundy-rgb': '110,30,43',
      '--charcoal': '#231915',
      '--grain-blend': 'multiply',
    },
  },
  'midnight-lime': {
    label: 'Midnight Lime',
    vars: {
      '--bg': '#0A0A0A', '--bg-1': '#111111', '--bg-2': '#161616',
      '--line': '#1f1f1f', '--line-2': '#2a2a2a',
      '--ink': '#F5F3EE', '--ink-dim': '#8a8a85', '--ink-faint': '#5a5a55',
      '--accent': '#D4FF3A', '--accent-deep': '#A8D42A',
      '--accent-rgb': '212,255,58',
    },
  },
  'blood-orange': {
    label: 'Blood Orange',
    vars: {
      '--bg': '#0A0706', '--bg-1': '#140E0B', '--bg-2': '#1A120E',
      '--line': '#241914', '--line-2': '#33241C',
      '--ink': '#F5EDE6', '--ink-dim': '#8a7f75', '--ink-faint': '#5a5048',
      '--accent': '#FF4A1C', '--accent-deep': '#CC3A16',
      '--accent-rgb': '255,74,28',
    },
  },
  'ice-electric': {
    label: 'Ice Electric',
    vars: {
      '--bg': '#06090F', '--bg-1': '#0C1119', '--bg-2': '#111825',
      '--line': '#1a2130', '--line-2': '#2a3446',
      '--ink': '#EEF3F8', '--ink-dim': '#7f8a98', '--ink-faint': '#4d5668',
      '--accent': '#2AE5FF', '--accent-deep': '#1DB5CC',
      '--accent-rgb': '42,229,255',
    },
  },
  'bone-crimson': {
    label: 'Bone & Crimson',
    vars: {
      '--bg': '#F4F1EB', '--bg-1': '#EAE6DD', '--bg-2': '#E0DACE',
      '--line': '#D2CBBB', '--line-2': '#B8B1A0',
      '--ink': '#141311', '--ink-dim': '#55514a', '--ink-faint': '#8a857b',
      '--accent': '#DC2626', '--accent-deep': '#991B1B',
      '--accent-rgb': '220,38,38',
    },
  },
  'toxic-violet': {
    label: 'Toxic Violet',
    vars: {
      '--bg': '#0B0713', '--bg-1': '#130C1E', '--bg-2': '#1B1129',
      '--line': '#281936', '--line-2': '#3a2550',
      '--ink': '#F3EEFC', '--ink-dim': '#8a7fa0', '--ink-faint': '#5a5068',
      '--accent': '#B4FF00', '--accent-deep': '#8AC200',
      '--accent-rgb': '180,255,0',
    },
  },
  'sand-ink': {
    label: 'Sand & Ink',
    vars: {
      '--bg': '#1A1814', '--bg-1': '#22201B', '--bg-2': '#2A2822',
      '--line': '#363229', '--line-2': '#4a4439',
      '--ink': '#EAE4D5', '--ink-dim': '#8f887a', '--ink-faint': '#5f584d',
      '--accent': '#E8B765', '--accent-deep': '#B88A3E',
      '--accent-rgb': '232,183,101',
    },
  },
};

const DISPLAY_FONTS = ['Anton', 'Archivo Black', 'Bebas Neue', 'Oswald', 'Syne'];
const BODY_FONTS = ['Inter', 'Space Grotesk', 'DM Sans'];
const MONO_FONTS = ['JetBrains Mono', 'Space Mono', 'IBM Plex Mono'];

function applyTheme(key) {
  const t = THEMES[key];
  if (!t) return;
  const root = document.documentElement;
  Object.entries(t.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  if (t.vars['--grain-blend']) {
    document.body.style.setProperty('--grain-blend', t.vars['--grain-blend']);
  } else {
    document.body.style.setProperty('--grain-blend', 'overlay');
  }
}

function applyFonts({ displayFont, bodyFont, monoFont }) {
  const root = document.documentElement;
  root.style.setProperty('--font-display', `'${displayFont}', sans-serif`);
  root.style.setProperty('--font-body', `'${bodyFont}', sans-serif`);
  root.style.setProperty('--font-mono', `'${monoFont}', monospace`);
}

function TweaksRoot() {
  const defaults = window.TWEAK_DEFAULTS || {};
  const [tweaks, setTweaks] = useTweaks(defaults);

  React.useEffect(() => { applyTheme(tweaks.theme); }, [tweaks.theme]);
  React.useEffect(() => { applyFonts(tweaks); }, [tweaks.displayFont, tweaks.bodyFont, tweaks.monoFont]);
  React.useEffect(() => {
    document.body.classList.toggle('no-grain', !tweaks.grain);
  }, [tweaks.grain]);

  return (
    <TweaksPanel title="Tweaks" width={320}>
      <TweakSection title="Theme">
        <TweakRadio
          value={tweaks.theme}
          onChange={(v) => setTweaks({ theme: v })}
          options={Object.entries(THEMES).map(([k, t]) => ({ value: k, label: t.label }))}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginTop: 10 }}>
          {Object.entries(THEMES).map(([k, t]) => (
            <button
              key={k}
              onClick={() => setTweaks({ theme: k })}
              title={t.label}
              style={{
                height: 28, borderRadius: 4, cursor: 'pointer',
                background: t.vars['--bg'],
                border: tweaks.theme === k ? `2px solid ${t.vars['--accent']}` : '1px solid #333',
                position: 'relative',
              }}
            >
              <span style={{ position: 'absolute', inset: 4, borderRadius: 2, background: t.vars['--accent'], width: '30%' }}></span>
            </button>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Display Font">
        <TweakSelect
          value={tweaks.displayFont}
          onChange={(v) => setTweaks({ displayFont: v })}
          options={DISPLAY_FONTS}
        />
      </TweakSection>

      <TweakSection title="Body Font">
        <TweakSelect
          value={tweaks.bodyFont}
          onChange={(v) => setTweaks({ bodyFont: v })}
          options={BODY_FONTS}
        />
      </TweakSection>

      <TweakSection title="Mono Font">
        <TweakSelect
          value={tweaks.monoFont}
          onChange={(v) => setTweaks({ monoFont: v })}
          options={MONO_FONTS}
        />
      </TweakSection>

      <TweakSection title="Effects">
        <TweakToggle
          label="Film grain overlay"
          value={tweaks.grain}
          onChange={(v) => setTweaks({ grain: v })}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// Apply defaults immediately on load so first paint is correct
(function init() {
  const d = window.TWEAK_DEFAULTS || {};
  if (d.theme) applyTheme(d.theme);
  applyFonts(d);
})();

window.TweaksRoot = TweaksRoot;
