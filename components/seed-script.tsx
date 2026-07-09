/**
 * Seeds realistic demo data for BOTH profiles into localStorage on first load.
 * Rendered as a plain inline <script> so it runs BEFORE React hydration — that
 * way the storage hooks read seeded values on their first pass. Runs once
 * (guarded by `fos:seeded:v3`); also clears any legacy un-namespaced keys.
 */
const SEED = `
(function () {
  try {
    if (localStorage.getItem('fos:seeded:v3')) return;
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var key = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
    var today = new Date();
    var daysAgo = function (n) { var d = new Date(today); d.setDate(d.getDate() - n); return d; };

    // Clear legacy (pre-profile) keys so nothing stale lingers.
    Object.keys(localStorage).forEach(function (k) {
      if (/^fos:(settings|weights|workouts|daily:|session:|seeded$)/.test(k)) localStorage.removeItem(k);
    });
    // Drop stored per-profile settings so refreshed profile defaults (Eva's name,
    // spec targets) apply. Body stats/targets are re-derived from lib/profiles.ts.
    ['me', 'partner'].forEach(function (p) { localStorage.removeItem('fos:' + p + ':settings'); });

    if (!localStorage.getItem('fos:profile')) localStorage.setItem('fos:profile', 'me');

    // --- Weights (oldest -> newest, last 7 days) ---
    var seedWeights = function (profile, vals) {
      var arr = [];
      for (var i = 0; i < vals.length; i++) {
        arr.push({ date: key(daysAgo(vals.length - 1 - i)), kg: vals[i] });
      }
      localStorage.setItem('fos:' + profile + ':weights', JSON.stringify(arr));
    };
    seedWeights('me', [79.4, 78.9, 78.7, 78.6, 78.5, 78.5, 78.2]);
    seedWeights('partner', [50.5, 50.4, 50.3, 50.3, 50.2, 50.2, 50.0]);

    // --- Workout history ---
    var meIds = ['pull', 'push', 'legs-core', 'upper-volume', 'conditioning'];
    var meTitles = ['Pull', 'Push', 'Legs + Core', 'Upper Volume', 'Conditioning'];
    var meWorkouts = [];
    for (var j = 1; j <= 9; j++) {
      var wd = daysAgo(j);
      var mi = (wd.getDay() + 6) % 7;
      var id = mi < 5 ? meIds[mi] : 'conditioning';
      var tt = mi < 5 ? meTitles[mi] : 'Conditioning';
      meWorkouts.push({ date: key(wd), dayId: id, title: tt });
    }
    localStorage.setItem('fos:me:workouts', JSON.stringify(meWorkouts));

    var pIds = ['p-core', 'p-flow', 'p-mobility', 'p-lower', 'p-full'];
    var pTitles = ['Pilates Core', 'Pilates Flow', 'Mobility Flow', 'Lower Body Pilates', 'Full Body Flow'];
    var pWorkouts = [];
    for (var w = 1; w <= 6; w++) {
      var pd = daysAgo(w);
      var pi = (pd.getDay() + 6) % 7;
      if (pi < 5) pWorkouts.push({ date: key(pd), dayId: pIds[pi], title: pTitles[pi] });
    }
    localStorage.setItem('fos:partner:workouts', JSON.stringify(pWorkouts));

    // --- Today's partial progress ---
    localStorage.setItem('fos:me:daily:' + key(today), JSON.stringify({
      waterMl: 1700, sleepHours: 7.2, steps: 7842, caloriesIn: 560, proteinIn: 72, mealsDone: {}
    }));
    localStorage.setItem('fos:partner:daily:' + key(today), JSON.stringify({
      waterMl: 1600, sleepHours: 7.67, steps: 5200, caloriesIn: 0, proteinIn: 0, mealsDone: {}
    }));

    localStorage.setItem('fos:seeded:v3', '1');
  } catch (e) {}
})();
`;

export function SeedScript() {
  return <script dangerouslySetInnerHTML={{ __html: SEED }} />;
}
