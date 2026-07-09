/**
 * One-time localStorage migrations, run as an inline <script> BEFORE React
 * hydration. Each step is guarded so it only ever runs once and never wipes data
 * the users enter later. The active-profile choice and the theme (stored outside
 * the `fos:` namespace) are always preserved.
 *   v1 — first-ever clean slate: full wipe so both profiles start empty.
 *   v2 — workout-only migration: drop orphaned nutrition/water/steps/sleep daily
 *        logs and saved foods (workouts, weights, sessions and settings stay).
 */
const RESET = `
(function () {
  try {
    if (!localStorage.getItem('fos:clean:v1')) {
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf('fos:') === 0 && k !== 'fos:profile') localStorage.removeItem(k);
      });
      if (!localStorage.getItem('fos:profile')) localStorage.setItem('fos:profile', 'me');
      localStorage.setItem('fos:clean:v1', '1');
    }
    if (!localStorage.getItem('fos:clean:v2')) {
      Object.keys(localStorage).forEach(function (k) {
        if (/^fos:(me|partner):(daily:|foods$)/.test(k)) localStorage.removeItem(k);
      });
      localStorage.setItem('fos:clean:v2', '1');
    }
  } catch (e) {}
})();
`;

export function ResetScript() {
  return <script dangerouslySetInnerHTML={{ __html: RESET }} />;
}
