import type { Level, Character, Constraint } from './types';
import {
  busLayout,
  classroomLayout,
  coffeeLayout,
  restaurantLayout,
  theaterLayout,
  airportLayout,
  weddingLayout,
  cruiseLayout,
} from './layouts';

const want = (attr: any): Constraint => ({ type: 'attr', attr });
const beside = (who: string): Constraint => ({ type: 'beside', who });
const notNear = (who: string): Constraint => ({ type: 'notBeside', who });

function ch(
  id: string,
  name: string,
  hue: number,
  trait: string,
  constraints: Constraint[],
): Character {
  return { id, name, hue, trait, constraints };
}

export const LEVELS: Level[] = [
  {
    id: 1, env: 'bus', title: 'Field Trip Frenzy', hostName: 'Mr. Pebble',
    intro: 'First day field trip! Six kids, one wobbly bus. Everybody wants the perfect seat... can you make peace before we hit the road?',
    outro: "Buckle up \u2014 the bus rolls off humming with happy campers. You're a natural seat whisperer!",
    seats: busLayout,
    characters: [
      ch('mika', 'Mika', 200, 'Loves the view', [want('window'), want('front')]),
      ch('lola', 'Lola', 330, 'Mika\u2019s best friend', [beside('mika')]),
      ch('theo', 'Theo', 30, 'Long legs', [want('legroom')]),
      ch('sam', 'Sam', 120, 'On the aisle', [want('aisle')]),
      ch('isa', 'Isa', 270, 'Window dreamer', [want('window')]),
      ch('ben', 'Ben', 90, 'Window dreamer', [want('window')]),
    ],
  },
  {
    id: 2, env: 'classroom', title: 'Pop Quiz Panic', hostName: 'Ms. Quill',
    intro: 'Surprise quiz today! Seat the class so everyone can focus \u2014 quiet kids in the back, window dreamers by the glass.',
    outro: 'Pencils down \u2014 a perfectly peaceful classroom. Ms. Quill gives you a gold star.',
    seats: classroomLayout,
    characters: [
      ch('ada', 'Ada', 280, 'Front-row star', [want('front')]),
      ch('omar', 'Omar', 130, 'Ada\u2019s study buddy', [beside('ada')]),
      ch('zoe', 'Zoe', 320, 'Loves the front', [want('front')]),
      ch('nina', 'Nina', 180, 'Window gazer', [want('window')]),
      ch('pip', 'Pip', 50, 'Back-row buddy', [want('back')]),
      ch('rex', 'Rex', 20, 'Needs quiet', [want('quiet'), want('back')]),
    ],
  },
  {
    id: 3, env: 'coffee', title: 'Coffee Shop Chaos', hostName: 'Barista Bea',
    intro: 'Morning rush at The Cozy Bean! Some crave music, some need quiet, some just want sunlight and a latte.',
    outro: 'Steam rises, jazz plays, everyone sips happily. The Cozy Bean has never been cozier.',
    seats: coffeeLayout,
    characters: [
      ch('milo', 'Milo', 30, 'Sun seeker', [want('sunlight')]),
      ch('ivy', 'Ivy', 150, 'Window watcher', [want('window')]),
      ch('rae', 'Rae', 200, 'Quiet reader', [want('quiet')]),
      ch('vee', 'Vee', 330, 'Rae\u2019s sister', [beside('rae')]),
      ch('dex', 'Dex', 110, 'Music lover', [want('music')]),
      ch('cole', 'Cole', 240, 'Always hungry', [want('food')]),
    ],
  },
  {
    id: 4, env: 'restaurant', title: 'Anniversary Dinner', hostName: 'Chef Romeo',
    intro: 'A big celebration at Bella Trattoria! Romantics want the quiet window booth, foodies want a front-row seat to the kitchen.',
    outro: 'Glasses clink, candles flicker \u2014 a flawless evening. Bravissimo, you seating maestro!',
    seats: restaurantLayout,
    characters: [
      ch('gia', 'Gia', 340, 'Wants romance', [want('quiet'), want('window')]),
      ch('leo', 'Leo', 210, 'Gia\u2019s date', [beside('gia')]),
      ch('max', 'Max', 30, 'Foodie', [want('food')]),
      ch('tom', 'Tom', 90, 'Max\u2019s buddy', [beside('max'), want('aisle')]),
      ch('lia', 'Lia', 280, 'Sun-lover', [want('sunlight'), want('music')]),
      ch('sky', 'Sky', 180, 'Loves live music', [want('music')]),
    ],
  },
  {
    id: 5, env: 'theater', title: 'Movie Night Mayhem', hostName: 'Usher Pip',
    intro: 'Premiere night! Some want the back row, some the front, someone needs the aisle, and someone snuck in popcorn...',
    outro: 'Lights dim, the show begins, and every seat is perfect. Roll credits \u2014 you nailed it!',
    seats: theaterLayout,
    characters: [
      ch('roo', 'Roo', 120, 'Needs an exit', [want('aisle'), want('front')]),
      ch('nox', 'Nox', 250, 'Back-row cool', [want('back'), want('aisle')]),
      ch('dot', 'Dot', 330, 'Close to the screen', [want('front')]),
      ch('mae', 'Mae', 190, 'Dot\u2019s pal', [beside('dot')]),
      ch('finn', 'Finn', 30, 'Brought popcorn', [want('food')]),
      ch('sol', 'Sol', 50, 'Likes it calm', [want('quiet')]),
    ],
  },
  {
    id: 6, env: 'bus', title: 'Last Bus Home', hostName: 'Driver Dot',
    intro: 'Late night, one last bus. Tired travelers, picky preferences. Get everyone settled before the doors close!',
    outro: 'Engine hums, city lights blur past windows. Everyone dozes off happily \u2014 good night!',
    seats: busLayout,
    characters: [
      ch('di', 'Di', 120, 'Up front please', [want('window'), want('front')]),
      ch('art', 'Art', 200, 'Window napper', [want('window')]),
      ch('bee', 'Bee', 330, 'Art\u2019s partner', [beside('art')]),
      ch('cy', 'Cy', 30, 'Tall traveler', [want('legroom')]),
      ch('eli', 'Eli', 270, 'Aisle walker', [want('aisle')]),
      ch('fay', 'Fay', 90, 'Window dreamer', [want('window')]),
    ],
  },
  {
    id: 7, env: 'classroom', title: 'Science Fair Setup', hostName: 'Mr. Bunsen',
    intro: 'Science fair day! Partners stay together, quiet thinkers get their calm corner, builders take the back.',
    outro: 'Volcanoes erupt, robots whir \u2014 a brilliant fair, and not a single squabble. Eureka!',
    seats: classroomLayout,
    characters: [
      ch('uma', 'Uma', 280, 'Window dreamer', [want('window'), want('front')]),
      ch('jo', 'Jo', 130, 'Uma\u2019s partner', [beside('uma')]),
      ch('ned', 'Ned', 320, 'Needs focus', [want('quiet'), want('front')]),
      ch('pia', 'Pia', 50, 'Back-row builder', [want('back'), want('window')]),
      ch('rin', 'Rin', 180, 'Quiet genius', [want('quiet')]),
      ch('koa', 'Koa', 20, 'Loud inventor', [want('back')]),
    ],
  },
  {
    id: 8, env: 'coffee', title: 'Rainy Day Refuge', hostName: 'Barista Bea',
    intro: 'Rain outside, warmth inside. The cafe fills with cozy regulars \u2014 each with very particular tastes.',
    outro: 'Rain taps the glass, mugs steam, and every regular is right where they belong. Bliss.',
    seats: coffeeLayout,
    characters: [
      ch('wen', 'Wen', 30, 'Watches the rain', [want('window')]),
      ch('hal', 'Hal', 200, 'Wen\u2019s friend', [beside('wen')]),
      ch('joy', 'Joy', 110, 'Hums to music', [want('music')]),
      ch('ash', 'Ash', 240, 'Snack attack', [want('food')]),
      ch('kit', 'Kit', 330, 'Quiet knitter', [want('quiet')]),
      ch('bex', 'Bex', 150, 'Quiet reader', [want('quiet')]),
    ],
  },
  {
    id: 9, env: 'airport', title: 'Holiday Airport Rush', hostName: 'Gate Agent Joon',
    intro: 'The holiday rush hits Gate 12! Window-watchers, leg-stretchers, and snackers all need the right spot before boarding.',
    outro: 'Boarding call! Everyone found their perfect seat with time to spare. Safe travels, travelers!',
    seats: airportLayout,
    characters: [
      ch('nia', 'Nia', 200, 'Quiet window watcher', [want('window'), want('quiet')]),
      ch('guy', 'Guy', 330, 'Nia\u2019s travel buddy', [beside('nia')]),
      ch('tex', 'Tex', 30, 'Needs leg room', [want('legroom')]),
      ch('duke', 'Duke', 90, 'Loves a snack & a tune', [want('food'), want('music')]),
      ch('mae2', 'Mae', 280, 'Hungry flyer', [want('food')]),
      ch('pam', 'Pam', 150, 'Afraid of dogs', [want('aisle'), notNear('duke')]),
    ],
  },
  {
    id: 10, env: 'wedding', title: 'Wedding Reception Drama', hostName: 'Planner Posy',
    intro: 'The reception begins! Garden lovers want the window table, dancers want the music, and two cousins must NOT sit together.',
    outro: 'Cake cut, toasts made, not one squabble \u2014 a fairytale reception. You saved the day!',
    seats: weddingLayout,
    characters: [
      ch('rose', 'Rose', 330, 'Quiet garden view', [want('window'), want('quiet')]),
      ch('jack', 'Jack', 210, 'Rose\u2019s partner', [beside('rose')]),
      ch('amy', 'Amy', 110, 'Lives to dance', [want('music')]),
      ch('sol2', 'Sol', 50, 'Loves the sun', [want('sunlight')]),
      ch('nan', 'Nan', 30, 'Here for the cake', [want('food')]),
      ch('pip2', 'Pip', 180, 'Cousin feud', [want('food'), notNear('amy')]),
    ],
  },
  {
    id: 11, env: 'cruise', title: 'Cruise Ship Lounge', hostName: 'Captain Coral',
    intro: 'Welcome aboard! Sun-deck loungers, ocean gazers, pool-bar dancers \u2014 everyone wants their dream chair.',
    outro: 'Waves roll, the band plays, and the whole deck is content. Smooth sailing ahead!',
    seats: cruiseLayout,
    characters: [
      ch('sunny', 'Sunny', 50, 'Sun-deck lounger', [want('sunlight')]),
      ch('wave', 'Wave', 200, 'Ocean gazer', [want('window')]),
      ch('dj', 'DJ', 110, 'Pool-bar dancer', [want('music')]),
      ch('finn2', 'Finn', 30, 'Buffet bound', [want('food')]),
      ch('cal', 'Cal', 280, 'Naps in quiet', [want('quiet')]),
      ch('nora', 'Nora', 330, 'Cal\u2019s friend', [beside('cal')]),
    ],
  },
  {
    id: 12, env: 'airport', title: 'Red-Eye Reshuffle', hostName: 'Gate Agent Joon',
    intro: 'A delayed red-eye means picky passengers. Window nappers, snackers, and one nervous flyer who avoids the loud crowd.',
    outro: 'Wheels up at last \u2014 a cabin full of contented passengers. You\u2019re cleared for takeoff!',
    seats: airportLayout,
    characters: [
      ch('ria', 'Ria', 200, 'Window napper', [want('window')]),
      ch('bo', 'Bo', 330, 'Ria\u2019s seatmate', [beside('ria')]),
      ch('len', 'Len', 30, 'Stretches out', [want('legroom')]),
      ch('dax', 'Dax', 90, 'Snack & beats', [want('food'), want('music')]),
      ch('moe', 'Moe', 280, 'Munchies', [want('food')]),
      ch('val', 'Val', 150, 'Avoids the noisy one', [want('aisle'), notNear('dax')]),
    ],
  },
  {
    id: 13, env: 'wedding', title: 'Garden Vows', hostName: 'Planner Posy',
    intro: 'An outdoor wedding! Quiet aunts by the window, dancers near the band, and the bickering uncles kept apart.',
    outro: 'Petals fall, music swells \u2014 a flawless celebration of love. Truly magical seating!',
    seats: weddingLayout,
    characters: [
      ch('iris', 'Iris', 200, 'Quiet aunt', [want('quiet')]),
      ch('leo2', 'Leo', 130, 'Iris\u2019s partner', [beside('iris')]),
      ch('bea2', 'Bea', 110, 'Dances all night', [want('music')]),
      ch('max2', 'Max', 50, 'Sun & song', [want('sunlight'), want('music')]),
      ch('gus', 'Gus', 30, 'Loves the feast', [want('food')]),
      ch('dot2', 'Dot', 280, 'Uncle feud', [want('food'), notNear('bea2')]),
    ],
  },
  {
    id: 14, env: 'cruise', title: 'Sunset Deck Party', hostName: 'Captain Coral',
    intro: 'Golden hour on the top deck! Ocean lovers, dancers, and a guest who can\u2019t bear to be near the loud DJ.',
    outro: 'The sun melts into the sea as everyone relaxes in the perfect spot. Bon voyage!',
    seats: cruiseLayout,
    characters: [
      ch('pearl', 'Pearl', 200, 'Ocean gazer', [want('window')]),
      ch('shell', 'Shell', 330, 'Pearl\u2019s pal', [beside('pearl')]),
      ch('bay', 'Bay', 110, 'Loud DJ', [want('music')]),
      ch('reef', 'Reef', 30, 'Loves the bar bites', [want('food'), want('music')]),
      ch('moss', 'Moss', 280, 'Hates the noise', [want('quiet'), notNear('bay')]),
      ch('fern', 'Fern', 150, 'Peace & quiet', [want('quiet')]),
    ],
  },
];

export function levelById(id: number): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}
