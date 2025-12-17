import { db } from "../config/firebase.js"; // Adjust path if needed
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


// Array of levels
console.log("DB value:", db);

const newLevels = [
  { order:2, levelName:"Sit in silence for 5 min", description:"Practice mindfulness by sitting quietly", instructions:"Find a quiet place and simply sit. No phone, music, reading, or talking.", isActive:true, version:1 },
  { order:3, levelName:"Stretch immediately after waking", description:"Start the day gently", instructions:"Before getting out of bed, do a gentle full-body stretch (e.g., reaching hands and toes).", isActive:true, version:1 },
  { order:4, levelName:"Change wallpaper", description:"Refresh your device", instructions:"Change the background image on your phone or computer.", isActive:true, version:1 },
  { order:5, levelName:"Change lock screen quote", description:"Update your lock screen", instructions:"Update the text/image on your device's lock screen.", isActive:true, version:1 },
  { order:6, levelName:"Open windows fully", description:"Bring fresh air", instructions:"Bring fresh air into the room for a few minutes, even if it's cold.", isActive:true, version:1 },
  { order:7, levelName:"Drink water slowly", description:"Mindful hydration", instructions:"Take smaller sips than usual and notice the taste/sensation.", isActive:true, version:1 },
  { order:8, levelName:"Sit facing wall", description:"Brief focus exercise", instructions:"Turn your chair to face a blank wall for a brief work/study session.", isActive:true, version:1 },
  { order:9, levelName:"Stretch neck slowly", description:"Relieve neck tension", instructions:"Gently tilt your head side to side, then chin to chest, holding each for 5 sec.", isActive:true, version:1 },
  { order:10, levelName:"Reverse spell your name", description:"Cognitive exercise", instructions:"Say your name, then say it backward (e.g., Jane → enaj).", isActive:true, version:1 },
  { order:11, levelName:"Walk without phone", description:"Mindful walking", instructions:"Go for a short walk (5–10 min) and leave your phone behind.", isActive:true, version:1 },
  { order:12, levelName:"Do breathing with eyes closed", description:"Focus on breath", instructions:"Close your eyes and take 5 slow, deep breaths, focusing only on the air.", isActive:true, version:1 },
  { order:13, levelName:"Change plate or cup", description:"Change daily habits", instructions:"Use a color, size, or style of dishware you don't usually use.", isActive:true, version:1 },
  { order:14, levelName:"Light a candle", description:"Create ambient focus", instructions:"Use a candle for ambient light/scent during a quiet activity.", isActive:true, version:1 },
  { order:15, levelName:"Listen to ambient sounds", description:"Auditory mindfulness", instructions:"Close your eyes and focus on the background sounds (traffic, nature, HVAC).", isActive:true, version:1 },
  { order:16, levelName:"Stand while working", description:"Posture and movement", instructions:"Stand up at your desk or counter for 15 minutes while doing a task.", isActive:true, version:1 },
  { order:17, levelName:"Sit on floor instead of chair", description:"Change perspective", instructions:"Choose the floor (cushion is fine) for sitting during reading or a meal.", isActive:true, version:1 },
  { order:18, levelName:"Notice body tension", description:"Body awareness", instructions:"Scan your body and consciously notice where you feel tightness (e.g., shoulders, jaw).", isActive:true, version:1 },
  { order:19, levelName:"Relax jaw", description:"Release tension", instructions:"Let your teeth part slightly and loosen the muscles around your jaw.", isActive:true, version:1 },
  { order:20, levelName:"Relax shoulders", description:"Release tension", instructions:"Roll your shoulders up, back, and down, letting them drop heavily.", isActive:true, version:1 },
  // … continue same pattern up to order:121
];
async function addLevelsToFirestore(levelArray) {
  const levelsCol = collection(db, "levels");
  for (const level of levelArray) {
    try {
      await addDoc(levelsCol, level);
      console.log(`Added level: ${level.levelName}`);
    } catch (err) {
      console.error(`Error adding ${level.levelName}:`, err);
    }
  }
}

// Run the script
addLevelsToFirestore(newLevels);

async function addLevels() {
  const levelsCol = collection(db, "levels");

  for (const level of newLevels) {
    await addDoc(levelsCol, level);
    console.log("Added:", level.levelName);
  }
}

window.addLevels = addLevels; 