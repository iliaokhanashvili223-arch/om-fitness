/**
 * One-time clean slate. Wipes any previously-seeded demo data (and any earlier
 * localStorage state) so both profiles start empty — the users enter their own
 * name, body stats and daily data. Rendered as an inline <script> so it runs
 * BEFORE React hydration, and guarded by `fos:clean:v1` so it only clears ONCE
 * (it never wipes data the users enter later). The active-profile choice and the
 * theme (stored outside the `fos:` namespace) are preserved.
 */
const RESET = `
(function () {
  try {
    if (localStorage.getItem('fos:clean:v1')) return;
    Object.keys(localStorage).forEach(function (k) {
      if (k.indexOf('fos:') === 0 && k !== 'fos:profile') localStorage.removeItem(k);
    });
    if (!localStorage.getItem('fos:profile')) localStorage.setItem('fos:profile', 'me');
    localStorage.setItem('fos:clean:v1', '1');
  } catch (e) {}
})();
`;

export function ResetScript() {
  return <script dangerouslySetInnerHTML={{ __html: RESET }} />;
}
