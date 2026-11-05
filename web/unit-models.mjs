import {baseRace} from './factions.mjs';
import {modelAssets} from './assets/registry.mjs';

// Variants select their own model; legacy factions still have a family fallback.
export function resolveUnitModel(faction,type){
 return modelAssets[faction+'.'+type] || modelAssets[baseRace(faction)+'.'+type] || null;
}
