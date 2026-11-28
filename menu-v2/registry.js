/* AuraMenu 2.0 design registry — shared by builder.js, menu.js and Studio (generated from menu-v2/designs.js).
   Server IDs: std-01…std-15 (standard) and pre-16…pre-30 (premium). Readable aliases map to the same IDs. */
window.AURAMENU_V2 = Object.freeze({
  names: Object.freeze({"std-01":"Sofra","std-02":"Simit","std-03":"Kahve","std-04":"Pazar","std-05":"Smash Club","std-06":"Bahçe","std-07":"Medina","std-08":"Lokanta","std-09":"Tatlı","std-10":"Taş Fırın","std-11":"Bistro","std-12":"Taze Lab","std-13":"Meyhane","std-14":"Kantin","std-15":"Aura Classic","pre-16":"Noir","pre-17":"Kor","pre-18":"Lumière","pre-19":"Orbit","pre-20":"Neon","pre-21":"Saray","pre-22":"Katman","pre-23":"Riviera","pre-24":"Atelier","pre-25":"Karnaval","pre-26":"Mermer","pre-27":"Velvet","pre-28":"Boğaziçi","pre-29":"Kuro","pre-30":"Ivory"}),
  tiers: Object.freeze({"std-01":"standard","std-02":"standard","std-03":"standard","std-04":"standard","std-05":"standard","std-06":"standard","std-07":"standard","std-08":"standard","std-09":"standard","std-10":"standard","std-11":"standard","std-12":"standard","std-13":"standard","std-14":"standard","std-15":"standard","pre-16":"premium","pre-17":"premium","pre-18":"premium","pre-19":"premium","pre-20":"premium","pre-21":"premium","pre-22":"premium","pre-23":"premium","pre-24":"premium","pre-25":"premium","pre-26":"premium","pre-27":"premium","pre-28":"premium","pre-29":"premium","pre-30":"premium"}),
  aliases: Object.freeze({"sofra":"std-01","simit":"std-02","kahve":"std-03","pazar":"std-04","smash":"std-05","bahce":"std-06","medina":"std-07","lokanta":"std-08","tatli":"std-09","tasfirin":"std-10","bistro":"std-11","taze":"std-12","meyhane":"std-13","kantin":"std-14","aura":"std-15","noir":"pre-16","kor":"pre-17","lumiere":"pre-18","orbit":"pre-19","neon":"pre-20","saray":"pre-21","katman":"pre-22","riviera":"pre-23","atelier":"pre-24","karnaval":"pre-25","mermer":"pre-26","velvet":"pre-27","bogazici":"pre-28","kuro":"pre-29","ivory":"pre-30"}),
  code(id) {
    if (Object.hasOwn(this.names, id)) return id;
    return Object.hasOwn(this.aliases, id) ? this.aliases[id] : "";
  },
  isV2(id) { return Boolean(this.code(id)); },
  src(id, root) { return (root || "") + "menu-v2.html?design=" + encodeURIComponent(this.code(id) || id) + "&embedded=1"; },
});
