import { CloakPreset, CloakConfig } from '../types';

export const CLOAK_PRESETS: Record<CloakPreset, CloakConfig> = {
  default: {
    title: 'Nexus Arcade - Unblocked Games Hub',
    favicon: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2338bdf8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='6 3 20 12 6 21 6 3'></polygon></svg>`
  },
  classroom: {
    title: 'Classes',
    favicon: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path fill='%231E8E3E' d='M6 10h36v28H6z'/><path fill='%23F9AB00' d='M10 14h28v20H10z'/><circle cx='24' cy='22' r='4' fill='%23FFF'/><path fill='%23FFF' d='M18 31c0-3.3 2.7-6 6-6s6 2.7 6 6z'/></svg>`
  },
  drive: {
    title: 'My Drive - Google Drive',
    favicon: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path fill='%23FFC107' d='M17 6l14 24H17L3 6z'/><path fill='%234CAF50' d='M31 30h14L31 6H17z'/><path fill='%232196F3' d='M31 30L24 42H10l7-12z'/></svg>`
  },
  docs: {
    title: 'Untitled document - Google Docs',
    favicon: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path fill='%234285F4' d='M10 4h20l10 10v30H10z'/><path fill='%23A1C2FA' d='M30 4v10h10z'/><path fill='%23FFF' d='M16 22h16v3H16zm0 6h16v3H16zm0 6h10v3H16z'/></svg>`
  },
  canvas: {
    title: 'Dashboard',
    favicon: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><circle cx='24' cy='24' r='20' fill='%23E02424'/><circle cx='24' cy='24' r='10' fill='%23FFF'/></svg>`
  }
};

export function applyCloak(preset: CloakPreset) {
  const config = CLOAK_PRESETS[preset] || CLOAK_PRESETS.default;
  document.title = config.title;

  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = config.favicon;
  localStorage.setItem('nexus_cloak', preset);
}

export function openAboutBlank(iframeUrl: string, title: string = 'Document') {
  try {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Pop-up blocked. Please allow pop-ups for this site to open about:blank.');
      return;
    }
    const doc = win.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
            iframe { border: none; width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          <iframe src="${window.location.origin}${iframeUrl}" allow="fullscreen; autoplay; gamepad"></iframe>
        </body>
      </html>
    `);
    doc.close();
  } catch (err) {
    console.error('Failed to open about:blank', err);
  }
}
