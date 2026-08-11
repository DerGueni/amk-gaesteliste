/* ============================================================
   seatmaps.js  —  AMK Gästeliste PRO (DEMO-Saalpläne)
   Klassisches Skript (kein Modul, kein fetch): file://-fähig.
   Von gaesteliste.html UND gast.html per <script src> geladen.
   Alle Pläne sind DEMO — nicht die echten Bestuhlungspläne.
   Schema je Venue: siehe PLAN_PAKET 4.2.
   ============================================================ */
(function (root) {
  'use strict';

  /* Slug identisch zur App (Key = slug(stadt)) */
  function _slug(s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  /* ---- Saalplan-Daten (12 Shows) ---------------------------- */
  var SEATMAPS = {

    /* ===== GA / Open-Air (freie Platzwahl, keine Blöcke) ===== */
    'dortmund': {
      venue: 'Westfalenpark', typ: 'ga', demo: true,
      kategorien: [
        { id: 'ga',  name: 'Innenraum Stehplatz', preis: 64.95, farbe: '#64A85C', stehplatz: true },
        { id: 'gc',  name: 'Golden Circle',        preis: 84.95, farbe: '#FFD23F', stehplatz: true }
      ],
      bloecke: []
    },
    'neu-ulm': {
      venue: 'Wiley Sportpark', typ: 'ga', demo: true,
      kategorien: [
        { id: 'ga', name: 'Innenraum Stehplatz', preis: 62.95, farbe: '#64A85C', stehplatz: true }
      ],
      bloecke: []
    },
    'moenchengladbach': {
      venue: 'Sparkassenpark', typ: 'ga', demo: true,
      kategorien: [
        { id: 'ga', name: 'Innenraum Stehplatz', preis: 64.95, farbe: '#64A85C', stehplatz: true },
        { id: 'gc', name: 'Golden Circle',        preis: 84.95, farbe: '#FFD23F', stehplatz: true }
      ],
      bloecke: []
    },
    'ludwigsburg': {
      venue: 'KSK Music Open', typ: 'ga', demo: true,
      kategorien: [
        { id: 'ga', name: 'Innenraum Stehplatz', preis: 64.95, farbe: '#64A85C', stehplatz: true }
      ],
      bloecke: []
    },
    'berlin': {
      venue: 'Parkbühne Wuhlheide', typ: 'ga', demo: true,
      kategorien: [
        { id: 'ga', name: 'Innenraum Stehplatz', preis: 64.95, farbe: '#64A85C', stehplatz: true },
        { id: 'gc', name: 'Golden Circle',        preis: 84.95, farbe: '#FFD23F', stehplatz: true }
      ],
      bloecke: []
    },
    'hamburg': {
      venue: 'Trabrennbahn Bahrenfeld', typ: 'ga', demo: true,
      kategorien: [
        { id: 'ga', name: 'Innenraum Stehplatz', preis: 64.95, farbe: '#64A85C', stehplatz: true }
      ],
      bloecke: []
    },

    /* ===== seated (Innenraum-Steh + Sitzblöcke) ============== */
    'frankfurt': {
      venue: 'Festhalle', typ: 'seated', demo: true,
      kategorien: [
        { id: 'steh', name: 'Innenraum Stehplatz', preis: 64.95, farbe: '#64A85C', stehplatz: true },
        { id: 'unter', name: 'Unterrang',           preis: 74.95, farbe: '#4098D7' },
        { id: 'ober',  name: 'Oberrang',            preis: 59.95, farbe: '#C25CA8' }
      ],
      bloecke: [
        { name: 'Unterrang Block 1', kategorieId: 'unter', reihen: 8,  plaetzeProReihe: 14 },
        { name: 'Unterrang Block 2', kategorieId: 'unter', reihen: 8,  plaetzeProReihe: 14 },
        { name: 'Oberrang Block 1',  kategorieId: 'ober',  reihen: 10, plaetzeProReihe: 16 },
        { name: 'Oberrang Block 2',  kategorieId: 'ober',  reihen: 10, plaetzeProReihe: 16 }
      ]
    },
    'hannover': {
      venue: 'ZAG Arena', typ: 'seated', demo: true,
      kategorien: [
        { id: 'steh', name: 'Innenraum Stehplatz', preis: 64.95, farbe: '#64A85C', stehplatz: true },
        { id: 'unter', name: 'Unterrang',           preis: 74.95, farbe: '#4098D7' },
        { id: 'ober',  name: 'Oberrang',            preis: 59.95, farbe: '#C25CA8' }
      ],
      bloecke: [
        { name: 'Unterrang Nord', kategorieId: 'unter', reihen: 8,  plaetzeProReihe: 15 },
        { name: 'Unterrang Süd',  kategorieId: 'unter', reihen: 8,  plaetzeProReihe: 15 },
        { name: 'Oberrang Nord',  kategorieId: 'ober',  reihen: 9,  plaetzeProReihe: 16 }
      ]
    },
    'leipzig': {
      venue: 'Quarterback Immobilien Arena', typ: 'seated', demo: true,
      kategorien: [
        { id: 'steh', name: 'Innenraum Stehplatz', preis: 64.95, farbe: '#64A85C', stehplatz: true },
        { id: 'unter', name: 'Unterrang',           preis: 74.95, farbe: '#4098D7' },
        { id: 'ober',  name: 'Oberrang',            preis: 59.95, farbe: '#C25CA8' }
      ],
      bloecke: [
        { name: 'Unterrang Block A', kategorieId: 'unter', reihen: 7,  plaetzeProReihe: 14 },
        { name: 'Unterrang Block B', kategorieId: 'unter', reihen: 7,  plaetzeProReihe: 14 },
        { name: 'Oberrang Block C',  kategorieId: 'ober',  reihen: 10, plaetzeProReihe: 16 }
      ]
    },
    'muenchen': {
      venue: 'Olympiahalle', typ: 'seated', demo: true,
      kategorien: [
        { id: 'steh', name: 'Innenraum Stehplatz', preis: 69.95, farbe: '#64A85C', stehplatz: true },
        { id: 'unter', name: 'Unterrang',           preis: 79.95, farbe: '#4098D7' },
        { id: 'ober',  name: 'Oberrang',            preis: 62.95, farbe: '#C25CA8' }
      ],
      bloecke: [
        { name: 'Unterrang West', kategorieId: 'unter', reihen: 8,  plaetzeProReihe: 15 },
        { name: 'Unterrang Ost',  kategorieId: 'unter', reihen: 8,  plaetzeProReihe: 15 },
        { name: 'Oberrang West',  kategorieId: 'ober',  reihen: 10, plaetzeProReihe: 16 },
        { name: 'Oberrang Ost',   kategorieId: 'ober',  reihen: 10, plaetzeProReihe: 16 }
      ]
    },
    'zuerich': {
      venue: 'Hallenstadion', typ: 'seated', demo: true,
      kategorien: [
        { id: 'steh', name: 'Innenraum Stehplatz', preis: 74.95, farbe: '#64A85C', stehplatz: true },
        { id: 'unter', name: 'Unterrang',           preis: 84.95, farbe: '#4098D7' },
        { id: 'ober',  name: 'Oberrang',            preis: 69.95, farbe: '#C25CA8' }
      ],
      bloecke: [
        { name: 'Unterrang Sektor A', kategorieId: 'unter', reihen: 8, plaetzeProReihe: 14 },
        { name: 'Unterrang Sektor B', kategorieId: 'unter', reihen: 8, plaetzeProReihe: 14 },
        { name: 'Oberrang Sektor C',  kategorieId: 'ober',  reihen: 9, plaetzeProReihe: 16 }
      ]
    },

    /* ===== Stadion-Mischform (Steh-Innenraum + Tribüne) ====== */
    'koeln': {
      venue: 'RheinEnergieStadion', typ: 'seated', demo: true,
      kategorien: [
        { id: 'steh',  name: 'Innenraum Stehplatz', preis: 69.95, farbe: '#64A85C', stehplatz: true },
        { id: 'trib',  name: 'Tribüne Sitzplatz',   preis: 79.95, farbe: '#4098D7' }
      ],
      bloecke: [
        { name: 'Tribüne Nord', kategorieId: 'trib', reihen: 10, plaetzeProReihe: 16 },
        { name: 'Tribüne Süd',  kategorieId: 'trib', reihen: 10, plaetzeProReihe: 16 }
      ]
    }
  };

  /* Key in jede Map spiegeln (für gtHeader/seatOccupied) */
  for (var _k in SEATMAPS) { if (SEATMAPS.hasOwnProperty(_k)) SEATMAPS[_k].key = _k; }

  /* ---- Helfer ---------------------------------------------- */

  /* Saalplan zu Show finden: Key = slug(stadt), Fallback venue-Substring */
  function seatmapForShow(stadt, venue) {
    var key = _slug(stadt);
    if (SEATMAPS[key]) return SEATMAPS[key];
    if (venue) {
      var vl = String(venue).toLowerCase();
      for (var k in SEATMAPS) {
        if (!SEATMAPS.hasOwnProperty(k)) continue;
        var vn = String(SEATMAPS[k].venue || '').toLowerCase();
        if (vn && (vl.indexOf(vn) >= 0 || vn.indexOf(vl) >= 0)) return SEATMAPS[k];
      }
    }
    return null;
  }

  /* Deterministischer Hash (FNV-1a) — KEIN Math.random */
  function _hash(s) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }

  /* ~25 % belegt, bei jedem Laden gleich */
  function seatOccupied(venueKey, block, reihe, sitz) {
    return (_hash(String(venueKey) + '|' + String(block) + '|' + reihe + '|' + sitz) % 100) < 25;
  }

  /* ---- Export an window ------------------------------------ */
  root.SEATMAPS = SEATMAPS;
  root.seatmapForShow = seatmapForShow;
  root.seatOccupied = seatOccupied;
  root.seatSlug = _slug;

})(typeof window !== 'undefined' ? window : this);
