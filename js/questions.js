/* ============================================
   Aarya's Learning Star — Questions Bank
   Abeka Grade 3–4 Level
   ============================================ */

/**
 * Question format:
 * {
 *   id: string,
 *   type: 'multiple-choice' | 'true-false' | 'fill-blank',
 *   difficulty: 'easy' | 'medium' | 'hard',
 *   question: string,
 *   options: string[] (for MC/TF),
 *   answer: string (correct answer text),
 *   explanation: string (kid-friendly explanation)
 * }
 */

const QUESTIONS_BANK = {
  // ============================================
  // MATH — Multiplication, division, fractions, place value, word problems
  // ============================================
  math: [
    // --- EASY ---
    {
      id: 'm1', type: 'multiple-choice', difficulty: 'easy',
      question: 'What is 6 × 3?',
      options: ['15', '18', '21', '12'],
      answer: '18',
      explanation: '6 × 3 means 6 + 6 + 6, which equals 18!'
    },
    {
      id: 'm2', type: 'multiple-choice', difficulty: 'easy',
      question: 'What is 24 ÷ 6?',
      options: ['3', '4', '5', '6'],
      answer: '4',
      explanation: '24 divided by 6 equals 4 because 6 × 4 = 24.'
    },
    {
      id: 'm3', type: 'true-false', difficulty: 'easy',
      question: '5 × 4 = 20',
      options: ['True', 'False'],
      answer: 'True',
      explanation: 'That\'s right! 5 × 4 = 20. You can count by fives: 5, 10, 15, 20!'
    },
    {
      id: 'm4', type: 'fill-blank', difficulty: 'easy',
      question: 'What is 7 × 2? Type your answer.',
      answer: '14',
      explanation: '7 × 2 = 14. That\'s like having 2 groups of 7!'
    },
    {
      id: 'm5', type: 'multiple-choice', difficulty: 'easy',
      question: 'Which fraction is bigger: ½ or ¼?',
      options: ['½', '¼', 'They are equal'],
      answer: '½',
      explanation: '½ is bigger than ¼. If you cut a pizza in 2 pieces, each piece is bigger than if you cut it in 4 pieces!'
    },
    // --- MEDIUM ---
    {
      id: 'm6', type: 'multiple-choice', difficulty: 'medium',
      question: 'What is 8 × 7?',
      options: ['54', '56', '48', '63'],
      answer: '56',
      explanation: '8 × 7 = 56. A good trick: 8 × 7 = "five, six" → 56!'
    },
    {
      id: 'm7', type: 'multiple-choice', difficulty: 'medium',
      question: 'Aarya has 36 stickers. She shares them equally with 3 friends (4 people total). How many does each person get?',
      options: ['12', '9', '8', '6'],
      answer: '9',
      explanation: '36 ÷ 4 = 9. Each person gets 9 stickers!'
    },
    {
      id: 'm8', type: 'fill-blank', difficulty: 'medium',
      question: 'In the number 4,582, what digit is in the hundreds place?',
      answer: '5',
      explanation: 'In 4,582: 4 is in thousands, 5 is in hundreds, 8 is in tens, 2 is in ones.'
    },
    {
      id: 'm9', type: 'multiple-choice', difficulty: 'medium',
      question: 'What is ¾ of 12?',
      options: ['6', '8', '9', '10'],
      answer: '9',
      explanation: 'To find ¾ of 12: first find ¼ of 12, which is 3. Then multiply: 3 × 3 = 9!'
    },
    {
      id: 'm10', type: 'true-false', difficulty: 'medium',
      question: '⅓ + ⅓ = ⅔',
      options: ['True', 'False'],
      answer: 'True',
      explanation: 'When fractions have the same bottom number, just add the top numbers: 1 + 1 = 2, so ⅓ + ⅓ = ⅔!'
    },
    // --- HARD ---
    {
      id: 'm11', type: 'multiple-choice', difficulty: 'hard',
      question: 'A baker made 144 cupcakes and put them in boxes of 12. How many boxes did she fill?',
      options: ['10', '11', '12', '13'],
      answer: '12',
      explanation: '144 ÷ 12 = 12. She filled 12 boxes! Fun fact: 12 × 12 = 144.'
    },
    {
      id: 'm12', type: 'fill-blank', difficulty: 'hard',
      question: 'What is 9 × 11?',
      answer: '99',
      explanation: '9 × 11 = 99. A neat trick: 9 × 11 is just 99!'
    },
    {
      id: 'm13', type: 'multiple-choice', difficulty: 'hard',
      question: 'Round 3,678 to the nearest hundred.',
      options: ['3,600', '3,700', '3,680', '4,000'],
      answer: '3,700',
      explanation: 'Look at the tens digit (7). Since 7 ≥ 5, round up: 3,678 rounds to 3,700!'
    },
    {
      id: 'm14', type: 'multiple-choice', difficulty: 'hard',
      question: 'What is ½ + ¼?',
      options: ['¾', '¼', '²⁄₄', '1'],
      answer: '¾',
      explanation: 'Change ½ to ²⁄₄, then add: ²⁄₄ + ¼ = ¾!'
    },
    {
      id: 'm15', type: 'multiple-choice', difficulty: 'hard',
      question: 'Aarya reads 15 pages each day. How many pages will she read in 2 weeks?',
      options: ['150', '180', '210', '200'],
      answer: '210',
      explanation: '2 weeks = 14 days. 15 × 14 = 210 pages. That\'s a lot of reading!'
    }
  ],

  // ============================================
  // ENGLISH — Spelling, grammar, punctuation, parts of speech
  // ============================================
  english: [
    // --- EASY ---
    {
      id: 'e1', type: 'multiple-choice', difficulty: 'easy',
      question: 'Which word is a noun?',
      options: ['Run', 'Beautiful', 'Dog', 'Quickly'],
      answer: 'Dog',
      explanation: 'A noun is a person, place, or thing. "Dog" is a thing, so it\'s a noun!'
    },
    {
      id: 'e2', type: 'multiple-choice', difficulty: 'easy',
      question: 'Which sentence has correct punctuation?',
      options: ['i like ice cream.', 'I like ice cream.', 'I like ice cream', 'i like Ice cream.'],
      answer: 'I like ice cream.',
      explanation: 'A sentence starts with a capital letter and ends with a period!'
    },
    {
      id: 'e3', type: 'true-false', difficulty: 'easy',
      question: '"Happy" is an adjective.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: 'An adjective describes a noun. "Happy" describes how someone feels!'
    },
    {
      id: 'e4', type: 'fill-blank', difficulty: 'easy',
      question: 'The plural of "cat" is ____. (Type the answer)',
      answer: 'cats',
      explanation: 'To make most words plural, just add "s": cat → cats!'
    },
    {
      id: 'e5', type: 'multiple-choice', difficulty: 'easy',
      question: 'Which word is spelled correctly?',
      options: ['Frend', 'Freind', 'Friend', 'Frende'],
      answer: 'Friend',
      explanation: 'Remember: "I" before "E" except after "C" — F-R-I-E-N-D!'
    },
    // --- MEDIUM ---
    {
      id: 'e6', type: 'multiple-choice', difficulty: 'medium',
      question: 'Choose the correct word: "Aarya ___ to school every day."',
      options: ['go', 'goes', 'going', 'gone'],
      answer: 'goes',
      explanation: 'Because Aarya is one person (she), we use "goes" — she goes.'
    },
    {
      id: 'e7', type: 'multiple-choice', difficulty: 'medium',
      question: 'What is the verb in this sentence: "The bird sings a pretty song."?',
      options: ['bird', 'sings', 'pretty', 'song'],
      answer: 'sings',
      explanation: 'A verb is an action word. The bird is doing the singing, so "sings" is the verb!'
    },
    {
      id: 'e8', type: 'multiple-choice', difficulty: 'medium',
      question: 'Which word is an adverb? "She ran quickly to the store."',
      options: ['She', 'ran', 'quickly', 'store'],
      answer: 'quickly',
      explanation: 'An adverb tells how something is done. "Quickly" tells us how she ran!'
    },
    {
      id: 'e9', type: 'fill-blank', difficulty: 'medium',
      question: 'What is the past tense of "run"?',
      answer: 'ran',
      explanation: '"Run" becomes "ran" in the past tense. Today I run, yesterday I ran!'
    },
    {
      id: 'e10', type: 'true-false', difficulty: 'medium',
      question: 'A comma should go here: "I bought apples oranges and bananas."',
      options: ['True', 'False'],
      answer: 'True',
      explanation: 'When listing items, use commas: "I bought apples, oranges, and bananas."'
    },
    // --- HARD ---
    {
      id: 'e11', type: 'multiple-choice', difficulty: 'hard',
      question: 'Which sentence uses an apostrophe correctly?',
      options: ["The dog's bone is big.", "The dogs' is big.", "The dog bone's is big.", "The dogs bone is big."],
      answer: "The dog's bone is big.",
      explanation: 'The apostrophe + s shows the bone belongs to the dog: the dog\'s bone.'
    },
    {
      id: 'e12', type: 'multiple-choice', difficulty: 'hard',
      question: 'What type of sentence is this: "What time is lunch?"',
      options: ['Declarative', 'Interrogative', 'Exclamatory', 'Imperative'],
      answer: 'Interrogative',
      explanation: 'An interrogative sentence asks a question and ends with a question mark!'
    },
    {
      id: 'e13', type: 'fill-blank', difficulty: 'hard',
      question: 'The opposite of "generous" is ____.',
      answer: 'selfish',
      explanation: '"Generous" means giving and sharing. The opposite is "selfish" — keeping everything for yourself.'
    },
    {
      id: 'e14', type: 'multiple-choice', difficulty: 'hard',
      question: 'Which word is a conjunction?',
      options: ['Happy', 'And', 'Quickly', 'Jump'],
      answer: 'And',
      explanation: 'A conjunction joins words or parts of a sentence together. "And," "but," and "or" are conjunctions!'
    },
    {
      id: 'e15', type: 'multiple-choice', difficulty: 'hard',
      question: 'Which sentence is written correctly?',
      options: [
        'Their going to the park.',
        'They\'re going to the park.',
        'There going to the park.',
        'Theyre going to the park.'
      ],
      answer: 'They\'re going to the park.',
      explanation: '"They\'re" = "they are." "Their" shows ownership. "There" is a place!'
    }
  ],

  // ============================================
  // SCIENCE — Plants, animals, weather, human body, earth science
  // ============================================
  science: [
    // --- EASY ---
    {
      id: 's1', type: 'multiple-choice', difficulty: 'easy',
      question: 'What do plants need to make food?',
      options: ['Sunlight and water', 'Rocks and sand', 'Darkness', 'Only soil'],
      answer: 'Sunlight and water',
      explanation: 'Plants use sunlight, water, and carbon dioxide to make their own food. This is called photosynthesis!'
    },
    {
      id: 's2', type: 'true-false', difficulty: 'easy',
      question: 'Fish are mammals.',
      options: ['True', 'False'],
      answer: 'False',
      explanation: 'Fish are not mammals — they breathe through gills and live in water. Mammals breathe with lungs!'
    },
    {
      id: 's3', type: 'multiple-choice', difficulty: 'easy',
      question: 'What is the largest organ in the human body?',
      options: ['Heart', 'Brain', 'Skin', 'Liver'],
      answer: 'Skin',
      explanation: 'Your skin is your largest organ! It covers and protects your whole body.'
    },
    {
      id: 's4', type: 'multiple-choice', difficulty: 'easy',
      question: 'What type of animal has feathers?',
      options: ['Mammals', 'Birds', 'Reptiles', 'Fish'],
      answer: 'Birds',
      explanation: 'Only birds have feathers. Feathers help them fly and stay warm!'
    },
    {
      id: 's5', type: 'fill-blank', difficulty: 'easy',
      question: 'Water that falls from clouds is called ____.',
      answer: 'rain',
      explanation: 'When water droplets in clouds get heavy enough, they fall as rain!'
    },
    // --- MEDIUM ---
    {
      id: 's6', type: 'multiple-choice', difficulty: 'medium',
      question: 'What part of the plant takes in water from the soil?',
      options: ['Leaves', 'Stem', 'Roots', 'Flowers'],
      answer: 'Roots',
      explanation: 'Roots grow underground and soak up water and nutrients from the soil!'
    },
    {
      id: 's7', type: 'multiple-choice', difficulty: 'medium',
      question: 'What makes up most of the air we breathe?',
      options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
      answer: 'Nitrogen',
      explanation: 'About 78% of the air is nitrogen! Only about 21% is oxygen.'
    },
    {
      id: 's8', type: 'true-false', difficulty: 'medium',
      question: 'The Earth revolves around the Sun.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: 'Yes! Earth travels around the Sun once every 365 days — that\'s one year!'
    },
    {
      id: 's9', type: 'multiple-choice', difficulty: 'medium',
      question: 'Which body system helps you breathe?',
      options: ['Digestive system', 'Respiratory system', 'Skeletal system', 'Nervous system'],
      answer: 'Respiratory system',
      explanation: 'The respiratory system includes your lungs, nose, and windpipe — it helps you breathe!'
    },
    {
      id: 's10', type: 'fill-blank', difficulty: 'medium',
      question: 'Animals that eat only plants are called ____vores.',
      answer: 'herbi',
      explanation: 'Herbivores eat only plants. "Herbi" comes from "herba" meaning plant!'
    },
    // --- HARD ---
    {
      id: 's11', type: 'multiple-choice', difficulty: 'hard',
      question: 'What is the process called when liquid water turns into a gas?',
      options: ['Condensation', 'Evaporation', 'Precipitation', 'Freezing'],
      answer: 'Evaporation',
      explanation: 'Evaporation is when liquid water heats up and turns into water vapor (gas)!'
    },
    {
      id: 's12', type: 'multiple-choice', difficulty: 'hard',
      question: 'Which layer of the Earth is the hottest?',
      options: ['Crust', 'Mantle', 'Outer core', 'Inner core'],
      answer: 'Inner core',
      explanation: 'The inner core is the hottest part of Earth — it can reach over 5,000°C!'
    },
    {
      id: 's13', type: 'true-false', difficulty: 'hard',
      question: 'Spiders are insects.',
      options: ['True', 'False'],
      answer: 'False',
      explanation: 'Spiders are arachnids, not insects! Spiders have 8 legs, while insects have 6.'
    },
    {
      id: 's14', type: 'multiple-choice', difficulty: 'hard',
      question: 'What type of cloud is tall, puffy, and can bring thunderstorms?',
      options: ['Cirrus', 'Stratus', 'Cumulonimbus', 'Fog'],
      answer: 'Cumulonimbus',
      explanation: 'Cumulonimbus clouds are huge, towering clouds that can bring thunder, lightning, and heavy rain!'
    },
    {
      id: 's15', type: 'fill-blank', difficulty: 'hard',
      question: 'The force that pulls everything toward Earth is called ____.',
      answer: 'gravity',
      explanation: 'Gravity is the force that keeps us on the ground and makes things fall when we drop them!'
    }
  ],

  // ============================================
  // HISTORY / SOCIAL STUDIES — Jamaica-based
  // ============================================
  history: [
    // --- EASY ---
    {
      id: 'h1', type: 'multiple-choice', difficulty: 'easy',
      question: 'What are the colours of the Jamaican flag?',
      options: ['Red, white, and blue', 'Black, green, and gold', 'Red, black, and green', 'Blue, gold, and white'],
      answer: 'Black, green, and gold',
      explanation: 'The Jamaican flag has black (strength), green (hope and nature), and gold (sunshine)!'
    },
    {
      id: 'h2', type: 'true-false', difficulty: 'easy',
      question: 'Jamaica is an island in the Caribbean Sea.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: 'Jamaica is a beautiful island in the Caribbean Sea, south of Cuba!'
    },
    {
      id: 'h3', type: 'multiple-choice', difficulty: 'easy',
      question: 'What is Jamaica\'s national fruit?',
      options: ['Mango', 'Ackee', 'Banana', 'Breadfruit'],
      answer: 'Ackee',
      explanation: 'Ackee is Jamaica\'s national fruit! It\'s used in the famous dish "ackee and saltfish."'
    },
    {
      id: 'h4', type: 'multiple-choice', difficulty: 'easy',
      question: 'What is the capital city of Jamaica?',
      options: ['Montego Bay', 'Kingston', 'Mandeville', 'Ocho Rios'],
      answer: 'Kingston',
      explanation: 'Kingston is Jamaica\'s capital city. It\'s the largest city on the island!'
    },
    {
      id: 'h5', type: 'fill-blank', difficulty: 'easy',
      question: 'Jamaica\'s motto is "Out of Many, ____ People."',
      answer: 'One',
      explanation: '"Out of Many, One People" means that even though Jamaicans come from many backgrounds, they are one united people!'
    },
    // --- MEDIUM ---
    {
      id: 'h6', type: 'multiple-choice', difficulty: 'medium',
      question: 'In what year did Jamaica gain independence?',
      options: ['1948', '1962', '1975', '1834'],
      answer: '1962',
      explanation: 'Jamaica became an independent country on August 6, 1962! Before that, it was ruled by Britain.'
    },
    {
      id: 'h7', type: 'multiple-choice', difficulty: 'medium',
      question: 'Who was Nanny of the Maroons?',
      options: [
        'A Jamaican singer',
        'A brave leader who fought against the British',
        'Jamaica\'s first prime minister',
        'A famous teacher'
      ],
      answer: 'A brave leader who fought against the British',
      explanation: 'Nanny of the Maroons was a fearless leader who helped enslaved Africans escape and fight for freedom in the mountains of Jamaica!'
    },
    {
      id: 'h8', type: 'multiple-choice', difficulty: 'medium',
      question: 'Marcus Garvey is famous for:',
      options: [
        'Discovering Jamaica',
        'Teaching Black pride and starting a worldwide movement',
        'Being Jamaica\'s first king',
        'Building the first school in Jamaica'
      ],
      answer: 'Teaching Black pride and starting a worldwide movement',
      explanation: 'Marcus Garvey was Jamaica\'s first National Hero. He taught Black people everywhere to be proud of their heritage!'
    },
    {
      id: 'h9', type: 'true-false', difficulty: 'medium',
      question: 'Jamaica has 14 parishes.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: 'Jamaica has 14 parishes. They are like counties or states. Examples include Kingston, St. Andrew, and St. James!'
    },
    {
      id: 'h10', type: 'fill-blank', difficulty: 'medium',
      question: 'The indigenous people who first lived in Jamaica were the ____ people.',
      answer: 'Taino',
      explanation: 'The Taino (also called Arawak) were the first people to live in Jamaica. They called the island "Xaymaca" meaning "Land of Wood and Water."'
    },
    // --- HARD ---
    {
      id: 'h11', type: 'multiple-choice', difficulty: 'hard',
      question: 'Paul Bogle led the Morant Bay Rebellion in what year?',
      options: ['1831', '1865', '1912', '1938'],
      answer: '1865',
      explanation: 'Paul Bogle led the Morant Bay Rebellion in 1865 to fight for the rights of poor Jamaicans. He is a National Hero!'
    },
    {
      id: 'h12', type: 'multiple-choice', difficulty: 'hard',
      question: 'What does CARICOM stand for?',
      options: [
        'Caribbean Community',
        'Caribbean Communication',
        'Central American Region of Commerce',
        'Caribbean Commission'
      ],
      answer: 'Caribbean Community',
      explanation: 'CARICOM stands for Caribbean Community. It helps Caribbean countries work together on trade, education, and more!'
    },
    {
      id: 'h13', type: 'multiple-choice', difficulty: 'hard',
      question: 'Which animal is on the Jamaican coat of arms?',
      options: ['Parrot', 'Crocodile', 'Hummingbird', 'Iguana'],
      answer: 'Crocodile',
      explanation: 'The Jamaican coat of arms shows a male and female Taino standing beside a shield, with a crocodile on top!'
    },
    {
      id: 'h14', type: 'true-false', difficulty: 'hard',
      question: 'Sam Sharpe led the Christmas Rebellion of 1831.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: 'Sam Sharpe led the Christmas Rebellion (also called the Baptist War) in 1831. He fought against slavery and is a National Hero!'
    },
    {
      id: 'h15', type: 'multiple-choice', difficulty: 'hard',
      question: 'Jamaica\'s national bird is the:',
      options: ['Blue Jay', 'Doctor Bird (Swallow-tail Hummingbird)', 'Pelican', 'Parrot'],
      answer: 'Doctor Bird (Swallow-tail Hummingbird)',
      explanation: 'The Doctor Bird, a beautiful swallow-tail hummingbird, is Jamaica\'s national bird. It\'s found only in Jamaica!'
    }
  ],

  // ============================================
  // READING — Comprehension passages with questions
  // Each question has a `passage` field shown above the question
  // ============================================
  reading: [
    // --- EASY ---
    {
      id: 'r1', type: 'multiple-choice', difficulty: 'easy',
      passage: 'Butterflies start their lives as tiny eggs on leaves. When the egg hatches, a caterpillar comes out. The caterpillar eats and eats until it is big and fat. Then it makes a chrysalis around itself. Inside the chrysalis, something amazing happens — the caterpillar changes into a beautiful butterfly!',
      question: 'What comes out of the egg first?',
      options: ['A butterfly', 'A caterpillar', 'A chrysalis', 'A moth'],
      answer: 'A caterpillar',
      explanation: 'The passage says "When the egg hatches, a caterpillar comes out." The butterfly comes later!'
    },
    {
      id: 'r2', type: 'true-false', difficulty: 'easy',
      passage: 'Butterflies start their lives as tiny eggs on leaves. When the egg hatches, a caterpillar comes out. The caterpillar eats and eats until it is big and fat. Then it makes a chrysalis around itself. Inside the chrysalis, something amazing happens — the caterpillar changes into a beautiful butterfly!',
      question: 'The caterpillar changes into a butterfly inside a chrysalis.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: 'That\'s right! The passage tells us the caterpillar makes a chrysalis and changes into a butterfly inside it.'
    },
    {
      id: 'r3', type: 'multiple-choice', difficulty: 'easy',
      passage: 'Maya loved her garden. Every morning, she watered her tomato plants and pulled out the weeds. One day, she noticed tiny green tomatoes growing on the vine. "They\'re coming!" she shouted with joy. Her grandmother smiled and said, "Patience, Maya. They need more sun before they turn red."',
      question: 'What colour were the tomatoes when Maya first saw them?',
      options: ['Red', 'Yellow', 'Green', 'Orange'],
      answer: 'Green',
      explanation: 'The story says Maya noticed "tiny green tomatoes" growing on the vine!'
    },
    {
      id: 'r4', type: 'fill-blank', difficulty: 'easy',
      passage: 'Maya loved her garden. Every morning, she watered her tomato plants and pulled out the weeds. One day, she noticed tiny green tomatoes growing on the vine. "They\'re coming!" she shouted with joy. Her grandmother smiled and said, "Patience, Maya. They need more sun before they turn red."',
      question: 'Maya watered her plants every ____.',
      answer: 'morning',
      explanation: 'The story says "Every morning, she watered her tomato plants."'
    },
    {
      id: 'r5', type: 'multiple-choice', difficulty: 'easy',
      passage: 'The library was Kai\'s favourite place. He loved the smell of old books and the quiet reading corners. Every Saturday, he would pick three books to take home. His favourite kinds were adventure stories about pirates and explorers.',
      question: 'How many books did Kai take home each Saturday?',
      options: ['One', 'Two', 'Three', 'Four'],
      answer: 'Three',
      explanation: 'The passage says "he would pick three books to take home" every Saturday.'
    },
    // --- MEDIUM ---
    {
      id: 'r6', type: 'multiple-choice', difficulty: 'medium',
      passage: 'Long ago, people used pigeons to send messages. A letter was tied to the pigeon\'s leg, and the bird would fly home to deliver it. These birds were called "carrier pigeons." During wars, carrier pigeons saved many lives by delivering important messages when radios didn\'t work. One famous pigeon named Cher Ami flew through enemy fire and delivered a message that saved 194 soldiers!',
      question: 'Why were carrier pigeons important during wars?',
      options: [
        'They were good pets for soldiers',
        'They delivered messages when radios didn\'t work',
        'They could fight the enemy',
        'They carried food to soldiers'
      ],
      answer: 'They delivered messages when radios didn\'t work',
      explanation: 'The passage says carrier pigeons "saved many lives by delivering important messages when radios didn\'t work."'
    },
    {
      id: 'r7', type: 'fill-blank', difficulty: 'medium',
      passage: 'Long ago, people used pigeons to send messages. A letter was tied to the pigeon\'s leg, and the bird would fly home to deliver it. These birds were called "carrier pigeons." During wars, carrier pigeons saved many lives by delivering important messages when radios didn\'t work. One famous pigeon named Cher Ami flew through enemy fire and delivered a message that saved 194 soldiers!',
      question: 'The famous pigeon\'s name was Cher ____.',
      answer: 'Ami',
      explanation: 'The passage mentions a famous pigeon named "Cher Ami" who saved 194 soldiers!'
    },
    {
      id: 'r8', type: 'multiple-choice', difficulty: 'medium',
      passage: 'Amara looked out the window and frowned. The sky was grey, and rain was pouring down. "No football today," she sighed. Her brother Jayden grabbed a deck of cards from the shelf. "How about a card game instead?" he asked. Amara thought for a moment, then smiled. "Only if I get to shuffle!" she said. They played three rounds, and Amara won two of them. By the time they finished, the sun was peeking through the clouds.',
      question: 'Why couldn\'t Amara play football?',
      options: ['She was sick', 'It was raining', 'She had homework', 'It was too dark'],
      answer: 'It was raining',
      explanation: 'The story says "rain was pouring down" and Amara said "No football today" — the rain stopped her from playing outside!'
    },
    {
      id: 'r9', type: 'multiple-choice', difficulty: 'medium',
      passage: 'Amara looked out the window and frowned. The sky was grey, and rain was pouring down. "No football today," she sighed. Her brother Jayden grabbed a deck of cards from the shelf. "How about a card game instead?" he asked. Amara thought for a moment, then smiled. "Only if I get to shuffle!" she said. They played three rounds, and Amara won two of them. By the time they finished, the sun was peeking through the clouds.',
      question: 'What can you tell about Amara from this story?',
      options: [
        'She doesn\'t like her brother',
        'She is competitive and likes to win',
        'She doesn\'t like rain',
        'She is very shy'
      ],
      answer: 'She is competitive and likes to win',
      explanation: 'Amara insisted on shuffling the cards and won 2 out of 3 games. This tells us she is competitive and enjoys winning!'
    },
    {
      id: 'r10', type: 'true-false', difficulty: 'medium',
      passage: 'Coral reefs are sometimes called "rainforests of the sea" because so many different creatures live there. Fish, sea turtles, octopuses, and thousands of other animals make their homes in coral reefs. The coral itself is actually made up of tiny living animals called polyps. Sadly, coral reefs around the world are in danger because of pollution and warming oceans.',
      question: 'Coral is made of tiny living animals called polyps.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: 'The passage says "The coral itself is actually made up of tiny living animals called polyps." Coral may look like a rock, but it\'s alive!'
    },
    // --- HARD ---
    {
      id: 'r11', type: 'multiple-choice', difficulty: 'hard',
      passage: 'In 1928, a scientist named Alexander Fleming came back from holiday to find mould growing on one of his experiment dishes. Most people would have thrown it away, but Fleming noticed something curious — the bacteria around the mould had died. He realised the mould was making a substance that killed bacteria. He called it penicillin. This accidental discovery became one of the most important medicines in history, saving millions of lives by fighting infections.',
      question: 'What is the main idea of this passage?',
      options: [
        'Mould is dangerous and should be thrown away',
        'An accidental discovery led to a life-saving medicine',
        'Scientists should always clean their dishes',
        'Bacteria cannot be killed'
      ],
      answer: 'An accidental discovery led to a life-saving medicine',
      explanation: 'The whole passage is about how Fleming accidentally discovered penicillin, which "became one of the most important medicines in history."'
    },
    {
      id: 'r12', type: 'multiple-choice', difficulty: 'hard',
      passage: 'In 1928, a scientist named Alexander Fleming came back from holiday to find mould growing on one of his experiment dishes. Most people would have thrown it away, but Fleming noticed something curious — the bacteria around the mould had died. He realised the mould was making a substance that killed bacteria. He called it penicillin. This accidental discovery became one of the most important medicines in history, saving millions of lives by fighting infections.',
      question: 'The passage says "Most people would have thrown it away." What does this tell us about Fleming?',
      options: [
        'He was messy and lazy',
        'He was curious and observant',
        'He didn\'t like cleaning',
        'He was on holiday too long'
      ],
      answer: 'He was curious and observant',
      explanation: 'Instead of throwing the mouldy dish away like most people, Fleming noticed something special. This shows he was curious and paid close attention!'
    },
    {
      id: 'r13', type: 'fill-blank', difficulty: 'hard',
      passage: 'The octopus is one of the smartest animals in the ocean. It can solve puzzles, open jars, and even escape from tanks! An octopus has three hearts and blue blood. When it is scared, it can change colour in less than a second to blend in with rocks and coral. Some octopuses even squirt ink to confuse predators while they swim away.',
      question: 'An octopus has ____ hearts.',
      answer: 'three',
      explanation: 'The passage says "An octopus has three hearts and blue blood." Three hearts!'
    },
    {
      id: 'r14', type: 'multiple-choice', difficulty: 'hard',
      passage: 'The octopus is one of the smartest animals in the ocean. It can solve puzzles, open jars, and even escape from tanks! An octopus has three hearts and blue blood. When it is scared, it can change colour in less than a second to blend in with rocks and coral. Some octopuses even squirt ink to confuse predators while they swim away.',
      question: 'Which detail from the passage best supports the idea that octopuses are smart?',
      options: [
        'They have blue blood',
        'They can solve puzzles and open jars',
        'They squirt ink when scared',
        'They change colour to blend in'
      ],
      answer: 'They can solve puzzles and open jars',
      explanation: 'Solving puzzles and opening jars are things that require intelligence. Changing colour and squirting ink are more about survival instincts!'
    },
    {
      id: 'r15', type: 'multiple-choice', difficulty: 'hard',
      passage: 'Grandma Rose always said the best stories come from the kitchen. She had a big wooden spoon that she said was "magic" because every soup she stirred with it tasted amazing. One day, the spoon cracked and broke in two. Grandma Rose looked sad for a moment, then she smiled. "Well," she said, "I suppose the magic was never really in the spoon. It was in the love." That night, she used a regular spoon, and the soup tasted just as wonderful.',
      question: 'What lesson does this story teach?',
      options: [
        'Wooden spoons are better than metal ones',
        'The love and care you put into something matters more than the tools',
        'Grandma Rose needs a new spoon',
        'Magic spoons make better soup'
      ],
      answer: 'The love and care you put into something matters more than the tools',
      explanation: 'Grandma Rose realised "the magic was never really in the spoon. It was in the love." The lesson is that love and care matter more than any tool!'
    }
  ]
};

// Subject metadata for display
const SUBJECTS = {
  math: { name: 'Math', emoji: '🔢', color: '#60A5FA' },
  english: { name: 'English', emoji: '📚', color: '#EC4899' },
  reading: { name: 'Reading', emoji: '📖', color: '#8B5CF6' },
  science: { name: 'Science', emoji: '🔬', color: '#34D399' },
  history: { name: 'History', emoji: '🏝️', color: '#FB923C' },
  weekly: { name: "This Week's Test", emoji: '📄', color: '#FBBF24' }
};

// Encouraging messages — varied to keep ADHD engagement high
const ENCOURAGEMENT = {
  correct: [
    "Amazing job! That's correct! 🎉",
    "You're on fire, Aarya! 🔥",
    "Brilliant! You nailed it! ⭐",
    "Superstar! That's right! 🌟",
    "Wow, you're so smart! ✨",
    "Yes! You got it! Keep going! 💪",
    "Perfect! You're doing incredible! 🏆",
    "That's the one! Awesome work! 🎯",
    "Look at you go! Correct! 🚀",
    "You're a learning machine! 🤩"
  ],
  wrong: [
    "Not quite, but great try! 💡",
    "Almost! Let's learn from this one. 🌱",
    "Oops! But you're getting smarter every time! 💪",
    "So close! Now you'll remember it! 🧠",
    "Good guess! Here's what it actually is: 📚",
    "That's tricky! But now you know! 💡",
    "Don't worry — every mistake helps you learn! 🌟",
    "Nice try! Let's remember this for next time! ✨"
  ],
  streak: [
    "🔥 {n} in a row! You're unstoppable!",
    "🔥 {n} streak! Aarya's on fire!",
    "⚡ {n} in a row! Lightning fast!",
    "🌟 {n} streak! Super brain activated!",
    "💫 {n} correct! You can't be stopped!"
  ],
  perfect: [
    "🏆 PERFECT SCORE! You're a GENIUS, Aarya!",
    "🌟 FLAWLESS! Not a single mistake! WOW!",
    "👑 100%! Aarya the SUPERSTAR!",
    "🎉 PERFECT! You conquered every single question!"
  ],
  milestone: [
    "🎯 You just hit {n} total stars! Amazing!",
    "⭐ {n} stars! You're shining so bright!",
    "🏅 {n} stars collected! Keep going!"
  ]
};

// Pick a random message from a category
function getEncouragement(category, replacements = {}) {
  const messages = ENCOURAGEMENT[category];
  if (!messages) return '';
  let msg = messages[Math.floor(Math.random() * messages.length)];
  for (const [key, val] of Object.entries(replacements)) {
    msg = msg.replace(`{${key}}`, val);
  }
  return msg;
}
