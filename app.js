    const OMDB_API_KEY = "911ca8df";
    const OMDB_BASE = "https://www.omdbapi.com/";

    // State Variables
    let currentType = null;
    const letterState = { ei: null, sn: null, tf: null, jp: null };

    let quizIndex = 0;
    let quizScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    let quizAnswers = [];

    let moviesLoading = false;
    let searchTermOffset = 0;
    let songOffset = 0; // rotates soundtrack pages (5 tracks per page)
    const SONGS_PAGE_SIZE = 5;
    let playingSongKey = null; // tracking playing song key: {type}_{index}
    let currentAudio = null; // global HTML5 Audio player instance

    // Comprehensive MBTI database containing metadata, search seeds, and hand-curated high-vibe music track lists
    const mbtiData = {
      INTJ: {
        fullName: 'The Mastermind',
        shortDescription: 'Strategic and independent, INTJs see patterns others miss and build long-range plans with precision. They prefer depth over small talk and are drawn to systems, ideas, and competence. Quietly ambitious, they value autonomy and intellectual honesty.',
        movieGenres: [878, 53, 9648, 18],
        songGenres: ['cinematic', 'ambient', 'post-rock', 'instrumental'],
        keywords: 'mind-bending strategic complex',
        searchTerms: ['Inception', 'Ex Machina', 'Blade Runner', 'The Prestige', 'Arrival', 'Primer', 'Coherence', 'Moon', 'Predestination', 'Upstream Color', 'Annihilation', 'Interstellar', 'The Matrix', 'Dark City', 'Pi', 'Gattaca', 'Minority Report', 'Source Code', 'Looper', 'Tenet', 'Shutter Island', 'The Imitation Game', 'A Beautiful Mind', 'Good Will Hunting', 'The Theory of Everything', 'Oppenheimer', 'Tinker Tailor Soldier Spy', 'The Lives of Others', 'Zodiac', 'Gone Girl', 'Prisoners', 'Sicario', 'Nightcrawler', 'The Social Network', 'Her', 'Ex Machina AI', 'Contact', 'Solaris', '2001 A Space Odyssey', 'Stalker', 'The Fountain', 'Enemy', 'Under the Skin', 'High Life', 'Ad Astra', 'Gravity', 'The Martian', 'Arrival alien', 'Primer time', 'Timecrimes', 'Triangle', 'The Butterfly Effect', 'Deja Vu', 'Frequency', 'Coherence paradox'],
        seedMovies: ['Inception', 'Ex Machina', 'The Prestige', 'Arrival', 'Blade Runner 2049', 'Blade Runner', 'Interstellar', 'The Matrix', 'Moon', 'Coherence', 'Predestination', 'Annihilation', 'Pi', 'Gattaca', 'Minority Report', 'Source Code', 'Looper', 'Tenet', 'Shutter Island', 'Zodiac', 'Gone Girl', 'Prisoners', 'Sicario', 'Nightcrawler', 'The Social Network', 'Her', 'Contact', 'Solaris', '2001: A Space Odyssey', 'Stalker', 'The Fountain', 'Enemy', 'Under the Skin', 'Ad Astra', 'Gravity', 'The Martian', 'Timecrimes', 'Triangle', 'Primer', 'Upstream Color', 'Dark City', 'The Imitation Game', 'A Beautiful Mind', 'Good Will Hunting', 'Oppenheimer', 'Tinker Tailor Soldier Spy', 'The Lives of Others', 'Donnie Darko', 'Mr. Nobody', 'Synedoche New York', 'Melancholia', 'The Man from Earth', 'Cube', 'Exam', 'Identity', 'The Game', 'Memento', 'Following', 'Insomnia', 'The Machinist', 'Shattered Glass', 'Margin Call', 'The Big Short', 'Moneyball', 'Spotlight', 'The Insider', 'All the President\'s Men', 'The Conversation', 'Blow Out', 'Three Days of the Condor', 'Michael Clayton', 'A Most Violent Year', 'There Will Be Blood', 'No Country for Old Men', 'The Assassination of Jesse James', 'True Grit', 'Wind River', 'Hell or High Water', 'Drive', 'Only God Forgives', 'The Place Beyond the Pines', 'Prisoners', 'Incendies', 'Polytechnique', 'Enemy', 'Maps to the Stars', 'Cosmopolis', 'Crash', 'A History of Violence', 'Eastern Promises'],
        songs: [
          { title: "Time", artist: "Hans Zimmer" },
          { title: "Intro", artist: "The xx" },
          { title: "On the Nature of Daylight", artist: "Max Richter" },
          { title: "Something About Us", artist: "Daft Punk" },
          { title: "Nightcall", artist: "Kavinsky" },
          { title: "Space Song", artist: "Beach House" },
          { title: "First Breath After Coma", artist: "Explosions in the Sky" },
          { title: "Starboy", artist: "The Weeknd" },
          { title: "Experience", artist: "Ludovico Einaudi" },
          { title: "An Ending (Ascent)", artist: "Brian Eno" },
        ]
      },
      INTP: {
        fullName: 'The Architect',
        shortDescription: 'Curious and analytical, INTPs live in a world of ideas and logical possibility. They question assumptions, chase understanding for its own sake, and often lose track of time exploring theories. Independent and reserved, they value precision and intellectual freedom.',
        movieGenres: [878, 9648, 99, 35],
        songGenres: ['lo-fi', 'electronic', 'jazz', 'experimental'],
        keywords: 'philosophical cerebral quirky',
        searchTerms: ['The Matrix', 'Pi', 'Coherence', 'Donnie Darko', 'Primer', 'Annihilation', 'Being John Malkovich', 'Adaptation', 'Synecdoche New York', 'Eternal Sunshine', 'Her', 'Ex Machina', 'Ghost in the Shell', 'Akira', 'Paprika', 'Serial Experiments', 'Waking Life', 'A Scanner Darkly', 'Linklater', 'Before Sunrise', 'My Dinner with Andre', 'The Man from Earth', 'Cube', 'Exam', 'Fermat\'s Room', 'The Banquet', 'Sneakers', 'Hackers', 'WarGames', 'The Imitation Game', 'The Theory of Everything', 'A Beautiful Mind', 'Good Will Hunting', 'Pi Darren', 'Upstream Color', 'Primer Shane', 'Timecrimes', 'Triangle', 'Coherence dinner', 'The One I Love', 'Safety Not Guaranteed', 'About Time', 'The Time Traveler\'s Wife', 'Predestination', 'Looper', 'Source Code', 'Moon', 'Robot and Frank', 'Wall-E', 'Her Spike', 'Blade Runner', 'Ghost in the Shell 1995'],
        seedMovies: ['The Matrix', 'Pi', 'Coherence', 'Donnie Darko', 'Primer', 'Annihilation', 'Being John Malkovich', 'Adaptation', 'Synecdoche, New York', 'Eternal Sunshine of the Spotless Mind', 'Her', 'Ex Machina', 'Ghost in the Shell', 'Akira', 'Paprika', 'Waking Life', 'A Scanner Darkly', 'Before Sunrise', 'My Dinner with Andre', 'The Man from Earth', 'Cube', 'Exam', 'Sneakers', 'WarGames', 'The Imitation Game', 'A Beautiful Mind', 'Good Will Hunting', 'Upstream Color', 'Timecrimes', 'Triangle', 'The One I Love', 'Safety Not Guaranteed', 'About Time', 'Predestination', 'Looper', 'Source Code', 'Moon', 'Robot & Frank', 'WALL-E', 'Blade Runner', 'Blade Runner 2049', 'Arrival', 'Interstellar', '2001: A Space Odyssey', 'Solaris', 'Stalker', 'Contact', 'Close Encounters of the Third Kind', 'Arrival', 'The Fountain', 'Mr. Nobody', 'Enemy', 'Under the Skin', 'High-Rise', 'Brazil', '12 Monkeys', 'The Truman Show', 'Pleasantville', 'Stranger Than Fiction', 'The Invention of Lying', 'Groundhog Day', 'Palm Springs', 'Russian Doll', 'Edge of Tomorrow', 'Inception', 'Memento', 'Following', 'The Prestige', 'Shutter Island', 'Fight Club', 'Se7en', 'Zodiac', 'Gone Girl', 'The Game', 'Identity', 'Secret Window', 'The Number 23', 'Pi'],
        songs: [
          { title: "Avril 14th", artist: "Aphex Twin" },
          { title: "Resonance", artist: "HOME" },
          { title: "Everything In Its Right Place", artist: "Radiohead" },
          { title: "Teardrop", artist: "Massive Attack" },
          { title: "Midnight City", artist: "M83" },
          { title: "Let It Happen", artist: "Tame Impala" },
          { title: "Breathe", artist: "Télépopmusik" },
          { title: "Daydream in Blue", artist: "I Monster" },
          { title: "Weird Fishes/Arpeggi", artist: "Radiohead" },
          { title: "Windowlicker", artist: "Aphex Twin" },
        ]
      },
      ENTJ: {
        fullName: 'The Commander',
        shortDescription: 'Bold and decisive, ENTJs organize people and resources toward ambitious goals. They think in systems, dislike inefficiency, and naturally step into leadership. Driven and confident, they respect competence and results more than sentiment.',
        movieGenres: [18, 53, 10752, 80],
        songGenres: ['epic orchestral', 'power rock', 'motivational', 'classical'],
        keywords: 'leadership ambition strategy',
        searchTerms: ['The Social Network', 'Whiplash', 'There Will Be Blood', 'The Wolf of Wall Street', 'Gladiator', 'Moneyball', 'The Dark Knight', 'Steve Jobs', 'The Founder', 'Margin Call', 'Wall Street', 'Jerry Maguire', 'Any Given Sunday', 'Draft Day', 'Moneyball Brad', 'The Big Short', 'Boiler Room', 'American Psycho', 'Nightcrawler', 'Yes Man', 'The Pursuit of Happyness', 'Rocky', 'Creed', 'Warrior', 'Ford v Ferrari', 'Rush', 'Senna', 'Moneyball', 'Lincoln', 'Darkest Hour', 'The King\'s Speech', 'Thirteen Days', 'Apollo 13', 'The Martian', 'Gravity', 'Zero Dark Thirty', 'Captain Phillips', 'Sully', 'Bridge of Spies', 'Spotlight', 'The Post', 'All the President\'s Men', 'Michael Clayton', 'A Most Violent Year', 'Sicario', 'Heat', 'The Departed', 'The Town', 'Gone Baby Gone'],
        seedMovies: ['The Social Network', 'Whiplash', 'There Will Be Blood', 'The Wolf of Wall Street', 'Gladiator', 'Moneyball', 'The Dark Knight', 'Steve Jobs', 'The Founder', 'Margin Call', 'Wall Street', 'Jerry Maguire', 'The Big Short', 'Boiler Room', 'American Psycho', 'Nightcrawler', 'The Pursuit of Happyness', 'Rocky', 'Creed', 'Warrior', 'Ford v Ferrari', 'Rush', 'Senna', 'Lincoln', 'Darkest Hour', 'The King\'s Speech', 'Thirteen Days', 'Apollo 13', 'The Martian', 'Gravity', 'Zero Dark Thirty', 'Captain Phillips', 'Sully', 'Bridge of Spies', 'Spotlight', 'The Post', 'All the President\'s Men', 'Michael Clayton', 'A Most Violent Year', 'Sicario', 'Heat', 'The Departed', 'The Town', 'The Godfather', 'The Godfather Part II', 'Scarface', 'Casino', 'Goodfellas', 'A Few Good Men', 'The Insider', 'Erin Brockovich', 'Norma Rae', 'Silkwood', 'The Verdict', '12 Angry Men', 'Paths of Glory', 'Lawrence of Arabia', 'Patton', 'Master and Commander', 'Braveheart', 'Kingdom of Heaven', 'Troy', '300', 'Gladiator', 'Spartacus', 'Ben-Hur', 'The Last Samurai', 'Dunkirk', '1917', 'Saving Private Ryan', 'Band of Brothers', 'The Pacific', 'Black Hawk Down', 'We Were Soldiers', 'Platoon', 'Full Metal Jacket'],
        songs: [
          { title: "Power", artist: "Kanye West" },
          { title: "Lose Yourself", artist: "Eminem" },
          { title: "Stronger", artist: "Kanye West" },
          { title: "Believer", artist: "Imagine Dragons" },
          { title: "Natural", artist: "Imagine Dragons" },
          { title: "Hall of Fame", artist: "The Script" },
          { title: "Eye of the Tiger", artist: "Survivor" },
          { title: "Till I Collapse", artist: "Eminem" },
          { title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis" },
          { title: "Remember the Name", artist: "Fort Minor" },
        ]
      },
      ENTP: {
        fullName: 'The Visionary',
        shortDescription: 'Quick-witted and inventive, ENTPs love exploring ideas through debate and possibility. They challenge norms, connect distant concepts, and thrive on intellectual sparring. Energetic and adaptable, they get restless when things become too routine.',
        movieGenres: [35, 878, 12, 9648],
        songGenres: ['indie rock', 'alternative', 'funk', 'upbeat electronic'],
        keywords: 'witty clever unconventional',
        searchTerms: ['Fight Club', 'Inception', 'The Big Short', 'Deadpool', 'Scott Pilgrim', 'Everything Everywhere', 'The Grand Budapest Hotel', 'Birdman', 'Adaptation', 'Being John Malkovich', 'Eternal Sunshine', 'The Truman Show', 'Yes Man', 'Liar Liar', 'Ace Ventura', 'The Mask', 'Dumb and Dumber', 'Zoolander', 'Anchorman', 'Superbad', 'The Interview', 'Tropic Thunder', 'Kiss Kiss Bang Bang', 'In Bruges', 'Seven Psychopaths', 'The Gentlemen', 'Snatch', 'Lock Stock', 'Pulp Fiction', 'Reservoir Dogs', 'Kill Bill', 'Django Unchained', 'Inglourious Basterds', 'Jackie Brown', 'True Romance', 'Natural Born Killers', 'Fear and Loathing', 'The Big Lebowski', 'Raising Arizona', 'O Brother', 'Fargo', 'Burn After Reading', 'Intolerable Cruelty', 'The Ladykillers', 'Hail Caesar', 'Barton Fink', 'Hudsucker Proxy'],
        seedMovies: ['Fight Club', 'Inception', 'The Big Short', 'Deadpool', 'Scott Pilgrim vs. the World', 'Everything Everywhere All at Once', 'The Grand Budapest Hotel', 'Birdman', 'Adaptation', 'Being John Malkovich', 'Eternal Sunshine of the Spotless Mind', 'The Truman Show', 'Yes Man', 'Zoolander', 'Anchorman', 'Superbad', 'Tropic Thunder', 'Kiss Kiss Bang Bang', 'In Bruges', 'Seven Psychopaths', 'The Gentlemen', 'Snatch', 'Lock, Stock and Two Smoking Barrels', 'Pulp Fiction', 'Reservoir Dogs', 'Kill Bill: Vol. 1', 'Django Unchained', 'Inglourious Basterds', 'True Romance', 'Fear and Loathing in Las Vegas', 'The Big Lebowski', 'Raising Arizona', 'O Brother, Where Art Thou?', 'Fargo', 'Burn After Reading', 'Barton Fink', 'The Hudsucker Proxy', 'Hot Fuzz', 'Shaun of the Dead', 'The World\'s End', 'Baby Driver', 'Edgar Wright', 'Scott Pilgrim', 'Kick-Ass', 'Kingsman: The Secret Service', 'The Nice Guys', 'Game Night', 'Knives Out', 'Glass Onion', 'Clue', 'Murder by Death', 'The Last of Sheila', 'Sleuth', 'Deathtrap', 'The Game', 'Now You See Me', 'Ocean\'s Eleven', 'Ocean\'s Twelve', 'Ocean\'s Thirteen', 'The Thomas Crown Affair', 'Catch Me If You Can', 'Matchstick Men', 'The Sting', 'Paper Moon', 'The Great Escape', 'Ocean\'s 8', 'Logan Lucky', 'Army of Thieves'],
        songs: [
          { title: "Electric Feel", artist: "MGMT" },
          { title: "Feel Good Inc.", artist: "Gorillaz" },
          { title: "Kids", artist: "MGMT" },
          { title: "Do I Wanna Know?", artist: "Arctic Monkeys" },
          { title: "Pumped Up Kicks", artist: "Foster the People" },
          { title: "1901", artist: "Phoenix" },
          { title: "A-Punk", artist: "Vampire Weekend" },
          { title: "Take a Walk", artist: "Passion Pit" },
          { title: "Fluorescent Adolescent", artist: "Arctic Monkeys" },
          { title: "Clint Eastwood", artist: "Gorillaz" },
        ]
      },
      INFJ: {
        fullName: 'The Counselor',
        shortDescription: 'Insightful and idealistic, INFJs seek meaning and quietly work toward a better future. They read people deeply, hold strong values, and often feel a private sense of purpose. Reserved yet passionate, they prefer authentic connection over surface socializing.',
        movieGenres: [18, 14, 9648, 878],
        songGenres: ['indie folk', 'ambient', 'singer-songwriter', 'dream pop'],
        keywords: 'meaningful atmospheric thoughtful',
        searchTerms: ['Arrival', 'The Fountain', 'A Beautiful Mind', 'Eternal Sunshine', 'Her', 'The Tree of Life', 'Moonlight', 'Manchester by the Sea', 'Nomadland', 'Lady Bird', 'Call Me by Your Name', 'Portrait of a Lady on Fire', 'The Hours', 'Atonement', 'Never Let Me Go', 'The Remains of the Day', 'Howards End', 'Sense and Sensibility', 'Pride and Prejudice', 'Little Women', 'Jojo Rabbit', 'Life is Beautiful', 'The Boy in the Striped Pajamas', 'Schindler\'s List', 'The Pianist', 'Sophie\'s Choice', 'Amelie', 'The Green Mile', 'The Shawshank Redemption', 'Dead Poets Society', 'Good Will Hunting', 'Patch Adams', 'Pay It Forward', 'The Pursuit of Happyness', 'Wonder', 'A Beautiful Day in the Neighborhood', 'Mr. Rogers', 'The Intouchables', 'Coco', 'Soul', 'Inside Out', 'Up', 'Wall-E', 'Spirited Away', 'My Neighbor Totoro', 'Princess Mononoke', 'Your Name'],
        seedMovies: ['Arrival', 'The Fountain', 'A Beautiful Mind', 'Eternal Sunshine of the Spotless Mind', 'Her', 'The Tree of Life', 'Moonlight', 'Manchester by the Sea', 'Nomadland', 'Lady Bird', 'Call Me by Your Name', 'Portrait of a Lady on Fire', 'The Hours', 'Atonement', 'Never Let Me Go', 'The Remains of the Day', 'Sense and Sensibility', 'Little Women', 'Jojo Rabbit', 'Life Is Beautiful', 'Schindler\'s List', 'The Pianist', 'Amélie', 'The Green Mile', 'The Shawshank Redemption', 'Dead Poets Society', 'Good Will Hunting', 'The Pursuit of Happyness', 'Wonder', 'A Beautiful Day in the Neighborhood', 'The Intouchables', 'Coco', 'Soul', 'Inside Out', 'Up', 'WALL-E', 'Spirited Away', 'My Neighbor Totoro', 'Your Name', 'The Secret Life of Walter Mitty', 'Big Fish', 'Edward Scissorhands', 'Corpse Bride', 'The Science of Sleep', 'Michel Gondry', 'Eternal Sunshine', 'Synecdoche, New York', 'Being John Malkovich', 'Adaptation', 'Her', 'Lost in Translation', 'Broken Flowers', 'Paterson', 'Only Lovers Left Alive', 'The Darjeeling Limited', 'Moonrise Kingdom', 'Fantastic Mr. Fox', 'Isle of Dogs', 'The Grand Budapest Hotel', 'Frances Ha', 'Mistress America', 'While We\'re Young', 'Marriage Story', 'The Squid and the Whale', 'The Meyerowitz Stories', 'Baumbach', 'Noah Baumbach', 'Lady Bird'],
        songs: [
          { title: "Holocene", artist: "Bon Iver" },
          { title: "Mystery of Love", artist: "Sufjan Stevens" },
          { title: "Saturn", artist: "Sleeping At Last" },
          { title: "Pink + White", artist: "Frank Ocean" },
          { title: "To Build a Home", artist: "The Cinematic Orchestra" },
          { title: "Fade Into You", artist: "Mazzy Star" },
          { title: "Lua", artist: "Bright Eyes" },
          { title: "Motion Picture Soundtrack", artist: "Radiohead" },
          { title: "Skinny Love", artist: "Bon Iver" },
          { title: "Was It a Dream?", artist: "Sufjan Stevens" },
        ]
      },
      INFP: {
        fullName: 'The Healer',
        shortDescription: 'Empathetic and imaginative, INFPs are guided by personal values and a desire for authenticity. They see potential in people and ideas, and often express themselves through creative or quiet acts of care. Idealistic and sensitive, they need space to process emotion.',
        movieGenres: [14, 18, 10749, 16],
        songGenres: ['indie folk', 'bedroom pop', 'acoustic', 'dream pop'],
        keywords: 'emotional poetic heartfelt',
        searchTerms: ['Amelie', 'Eternal Sunshine', 'The Secret Life of Walter Mitty', 'Little Women', 'Call Me by Your Name', 'Spirited Away', 'My Neighbor Totoro', 'Howl\'s Moving Castle', 'Whisper of the Heart', 'The Wind Rises', 'Your Name', 'Garden of Words', '5 Centimeters per Second', 'A Silent Voice', 'I Want to Eat Your Pancreas', 'Wolf Children', 'The Tale of Princess Kaguya', 'Song of the Sea', 'The Secret of Kells', 'Klaus', 'Coco', 'Soul', 'Inside Out', 'Up', 'Wall-E', 'Fantasia', 'Big Fish', 'Edward Scissorhands', 'Corpse Bride', 'Alice in Wonderland', 'Pan\'s Labyrinth', 'The Shape of Water', 'Crimson Peak', 'Carol', 'Brokeback Mountain', 'Moonlight', 'Portrait of a Lady on Fire', 'The Handmaiden', 'Phantom Thread', 'There Will Be Blood', 'The Master', 'Inherent Vice', 'Punch-Drunk Love', 'Magnolia', 'Boogie Nights'],
        seedMovies: ['Amélie', 'Eternal Sunshine of the Spotless Mind', 'The Secret Life of Walter Mitty', 'Little Women', 'Call Me by Your Name', 'Spirited Away', 'My Neighbor Totoro', 'Howl\'s Moving Castle', 'Your Name', 'A Silent Voice', 'Wolf Children', 'The Tale of the Princess Kaguya', 'Song of the Sea', 'Klaus', 'Coco', 'Soul', 'Inside Out', 'Up', 'WALL-E', 'Big Fish', 'Edward Scissorhands', 'Corpse Bride', 'Pan\'s Labyrinth', 'The Shape of Water', 'Carol', 'Moonlight', 'Portrait of a Lady on Fire', 'Phantom Thread', 'Punch-Drunk Love', 'Lost in Translation', 'Her', 'The Tree of Life', 'Nomadland', 'Lady Bird', 'Frances Ha', 'Paterson', 'Only Lovers Left Alive', 'Moonrise Kingdom', 'Fantastic Mr. Fox', 'The Grand Budapest Hotel', 'Before Sunrise', 'Before Sunset', 'Before Midnight', 'Once', 'Begin Again', 'La La Land', 'Sing Street', 'Once Upon a Time in Hollywood', 'Almost Famous', 'Empire Records', 'High Fidelity', '500 Days of Summer', 'The Perks of Being a Wallflower', 'Me and Earl and the Dying Girl', 'The Spectacular Now', 'Juno', 'Lady Bird', 'Booksmart', 'Edge of Seventeen', 'Eighth Grade', 'The Diary of a Teenage Girl', 'Ghost World', 'Thumbsucker'],
        songs: [
          { title: "Cherry Wine", artist: "Hozier" },
          { title: "Work Song", artist: "Hozier" },
          { title: "First Day of My Life", artist: "Bright Eyes" },
          { title: "Rivers and Roads", artist: "The Head and the Heart" },
          { title: "Ophelia", artist: "The Lumineers" },
          { title: "Stubborn Love", artist: "The Lumineers" },
          { title: "Bloom", artist: "The Paper Kites" },
          { title: "Skinny Love", artist: "Bon Iver" },
          { title: "Holocene", artist: "Bon Iver" },
          { title: "From Eden", artist: "Hozier" },
        ]
      },
      ENFJ: {
        fullName: 'The Teacher',
        shortDescription: 'Charismatic and empathetic, ENFJs inspire others and champion collective growth. They notice group dynamics, encourage potential, and often take on mentoring roles. Warm and organized, they balance people-focus with a drive to make things better.',
        movieGenres: [18, 10749, 12, 10751],
        songGenres: ['inspirational pop', 'soul', 'uplifting indie', 'gospel'],
        keywords: 'uplifting heartfelt community',
        searchTerms: ['Dead Poets Society', 'The Pursuit of Happyness', 'Hidden Figures', 'Pay It Forward', 'Freedom Writers', 'Coach Carter', 'Remember the Titans', 'Glory Road', 'McFarland USA', 'The Blind Side', 'Safe Haven', 'The Help', 'Hidden Figures', 'Erin Brockovich', 'Norma Rae', 'Silkwood', 'Wonder', 'A Beautiful Day in the Neighborhood', 'Patch Adams', 'Good Will Hunting', 'October Sky', 'Stand and Deliver', 'Lean on Me', 'Dangerous Minds', 'Mr. Holland\'s Opus', 'Music of the Heart', 'The Ron Clark Story', 'Front of the Class', 'The Miracle Worker', 'To Sir with Love', 'The Great Debaters', 'Invictus', 'Mandela', 'Selma', 'MLK', 'The Butler', 'Hidden Figures', '42', 'Race', 'The Intouchables', 'The Fundamentals of Caring', 'Me Before You', 'The Fault in Our Stars', 'A Walk to Remember'],
        seedMovies: ['Dead Poets Society', 'The Pursuit of Happyness', 'Hidden Figures', 'Freedom Writers', 'Coach Carter', 'Remember the Titans', 'McFarland, USA', 'The Blind Side', 'The Help', 'Erin Brockovich', 'Wonder', 'A Beautiful Day in the Neighborhood', 'Patch Adams', 'Good Will Hunting', 'October Sky', 'Stand and Deliver', 'Lean on Me', 'Mr. Holland\'s Opus', 'The Miracle Worker', 'The Great Debaters', 'Invictus', 'Selma', 'The Butler', '42', 'The Intouchables', 'The Fundamentals of Caring', 'Me Before You', 'The Fault in Our Stars', 'A Walk to Remember', 'Pay It Forward', 'Pay It Forward', 'Evan Almighty', 'Bruce Almighty', 'The Bucket List', 'About Time', 'The Terminal', 'Cast Away', 'Forrest Gump', 'The Green Mile', 'The Shawshank Redemption', 'It\'s a Wonderful Life', 'Groundhog Day', 'Yes Man', 'Liar Liar', 'The Truman Show', 'Pleasantville', 'Stranger Than Fiction', 'Big', 'Hook', 'Mrs. Doubtfire', 'Parenthood', 'Cheaper by the Dozen', 'Little Miss Sunshine', 'Juno', 'Lady Bird', 'Booksmart', 'The Edge of Seventeen', 'Eighth Grade', 'Eighth Grade', 'The Perks of Being a Wallflower', 'Wonder', 'Wonder', 'Wonder'],
        songs: [
          { title: "You've Got the Love", artist: "Florence + The Machine" },
          { title: "A Sky Full of Stars", artist: "Coldplay" },
          { title: "Happy", artist: "Pharrell Williams" },
          { title: "Count on Me", artist: "Bruno Mars" },
          { title: "Home", artist: "Edward Sharpe & The Magnetic Zeros" },
          { title: "Three Little Birds", artist: "Bob Marley" },
          { title: "Here Comes the Sun", artist: "The Beatles" },
          { title: "Good Life", artist: "OneRepublic" },
          { title: "Dog Days Are Over", artist: "Florence + The Machine" },
          { title: "Viva La Vida", artist: "Coldplay" },
        ]
      },
      ENFP: {
        fullName: 'The Champion',
        shortDescription: 'Enthusiastic and imaginative, ENFPs connect people and chase meaningful possibilities. They light up around new ideas and relationships, and resist rigid structure. Warm and spontaneous, they need freedom to explore and express themselves.',
        movieGenres: [12, 35, 14, 10749],
        songGenres: ['indie pop', 'feel-good', 'folk pop', 'upbeat alternative'],
        keywords: 'joyful adventurous free-spirited',
        searchTerms: ['Yes Man', 'La La Land', 'The Grand Budapest Hotel', 'Almost Famous', 'Little Miss Sunshine', 'Ferris Bueller', 'The Secret Life of Walter Mitty', 'Amelie', 'Amélie', 'Sing Street', 'Begin Again', 'Once', '500 Days of Summer', 'Eternal Sunshine', 'Scott Pilgrim', 'Everything Everywhere', 'The Disaster Artist', 'Pawn Sacrifice', 'The Big Short', 'Lady Bird', 'Booksmart', 'Edge of Seventeen', 'Juno', 'Superbad', 'Knocked Up', 'Forgetting Sarah Marshall', 'I Love You Man', 'Role Models', 'Wanderlust', 'Old School', 'Wedding Crashers', 'The Hangover', 'Bridesmaids', 'Spy', 'Ghostbusters', 'Oceans Eight', 'The Heat', 'The Other Guys', 'Anchorman', 'Talladega Nights', 'Step Brothers', 'Elf', 'Zoolander', 'Night at the Museum', 'Night at the Museum', 'Paddington', 'Paddington 2', 'The Greatest Showman'],
        seedMovies: ['Yes Man', 'La La Land', 'The Grand Budapest Hotel', 'Almost Famous', 'Little Miss Sunshine', 'Ferris Bueller\'s Day Off', 'The Secret Life of Walter Mitty', 'Amélie', 'Sing Street', 'Begin Again', 'Once', '(500) Days of Summer', 'Eternal Sunshine of the Spotless Mind', 'Scott Pilgrim vs. the World', 'Everything Everywhere All at Once', 'Lady Bird', 'Booksmart', 'The Edge of Seventeen', 'Juno', 'Superbad', 'Knocked Up', 'I Love You, Man', 'Role Models', 'Wedding Crashers', 'The Hangover', 'Bridesmaids', 'Spy', 'Anchorman', 'Step Brothers', 'Elf', 'Zoolander', 'Night at the Museum', 'Paddington', 'Paddington 2', 'The Greatest Showman', 'Mamma Mia!', 'Mamma Mia! Here We Go Again', 'Pitch Perfect', 'Pitch Perfect 2', 'Pitch Perfect 3', 'Barbie', 'Legally Blonde', 'Clueless', '10 Things I Hate About You', 'She\'s All That', 'Never Been Kissed', 'Crazy Rich Asians', 'The Holiday', 'Love Actually', 'Notting Hill', 'Four Weddings and a Funeral', 'About Time', 'The Big Sick', 'Crazy, Stupid, Love', 'Friends with Benefits', 'No Strings Attached', 'How to Lose a Guy in 10 Days', '13 Going on 30'],
        songs: [
          { title: "Dog Days Are Over", artist: "Florence + The Machine" },
          { title: "Shut Up and Dance", artist: "WALK THE MOON" },
          { title: "Float On", artist: "Modest Mouse" },
          { title: "Island in the Sun", artist: "Weezer" },
          { title: "On Top of the World", artist: "Imagine Dragons" },
          { title: "Safe and Sound", artist: "Capital Cities" },
          { title: "Good as Hell", artist: "Lizzo" },
          { title: "Walking on Sunshine", artist: "Katrina and the Waves" },
          { title: "Can't Stop the Feeling!", artist: "Justin Timberlake" },
          { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
        ]
      },
      ISTJ: {
        fullName: 'The Inspector',
        shortDescription: 'Reliable and practical, ISTJs value duty, order, and proven methods. They follow through on commitments, notice details, and prefer clear expectations. Steady and responsible, they build trust through consistency rather than flair.',
        movieGenres: [18, 36, 80, 53],
        songGenres: ['classic rock', 'orchestral', 'folk', 'traditional'],
        keywords: 'grounded historical precise',
        searchTerms: ['The Imitation Game', 'Spotlight', 'Bridge of Spies', 'Apollo 13', 'The King\'s Speech', 'Zero Dark Thirty', 'Captain Phillips', 'Sully', 'Lincoln', 'Darkest Hour', 'Thirteen Days', 'Apollo 13', 'The Martian', 'Gravity', 'Moneyball', 'The Big Short', 'Margin Call', 'The Social Network', 'The Founder', 'Steve Jobs', 'The Insider', 'All the President\'s Men', 'The Post', 'Spotlight', 'Zodiac', 'Prisoners', 'Sicario', 'Hell or High Water', 'Wind River', 'No Country for Old Men', 'True Grit', 'The Assassination of Jesse James', 'There Will Be Blood', 'A Most Violent Year', 'Michael Clayton', 'The Verdict', '12 Angry Men', 'A Few Good Men', 'The Firm', 'Pelican Brief', 'The Client', 'Presumed Innocent', 'Primal Fear', 'A Time to Kill', 'Philadelphia', 'Erin Brockovich', 'Norma Rae'],
        seedMovies: ['The Imitation Game', 'Spotlight', 'Bridge of Spies', 'Apollo 13', 'The King\'s Speech', 'Zero Dark Thirty', 'Captain Phillips', 'Sully', 'Lincoln', 'Darkest Hour', 'Thirteen Days', 'The Martian', 'Gravity', 'Moneyball', 'The Big Short', 'Margin Call', 'The Social Network', 'The Founder', 'Steve Jobs', 'The Insider', 'All the President\'s Men', 'The Post', 'Zodiac', 'Prisoners', 'Sicario', 'Hell or High Water', 'Wind River', 'No Country for Old Men', 'True Grit', 'There Will Be Blood', 'A Most Violent Year', 'Michael Clayton', 'The Verdict', '12 Angry Men', 'A Few Good Men', 'The Firm', 'Presumed Innocent', 'Primal Fear', 'Philadelphia', 'Erin Brockovich', 'Norma Rae', 'Silkwood', 'The Rainmaker', 'A Civil Action', 'Dark Waters', 'The Report', 'Official Secrets', 'The Whistleblower', 'Serpico', 'The French Connection', 'Dog Day Afternoon', 'Heat', 'The Departed', 'The Town', 'Gone Baby Gone', 'Mystic River', 'Shutter Island', 'The Departed', 'Insomnia', 'Memento', 'The Prestige', 'Following', 'Inception', 'Dunkirk', '1917', 'Saving Private Ryan', 'Band of Brothers', 'The Pacific', 'Black Hawk Down', 'We Were Soldiers', 'Platoon', 'Full Metal Jacket', 'Apocalypse Now'],
        songs: [
          { title: "The Sound of Silence", artist: "Simon & Garfunkel" },
          { title: "Dust in the Wind", artist: "Kansas" },
          { title: "Landslide", artist: "Fleetwood Mac" },
          { title: "Hallelujah", artist: "Jeff Buckley" },
          { title: "Yesterday", artist: "The Beatles" },
          { title: "Bridge Over Troubled Water", artist: "Simon & Garfunkel" },
          { title: "Fields of Gold", artist: "Sting" },
          { title: "Tears in Heaven", artist: "Eric Clapton" },
          { title: "The Boxer", artist: "Simon & Garfunkel" },
          { title: "Wish You Were Here", artist: "Pink Floyd" },
        ]
      },
      ISFJ: {
        fullName: 'The Protector',
        shortDescription: 'Warm and protective, ISFJs quietly support others through practical care. They remember details about people, honor traditions, and work hard behind the scenes. Loyal and considerate, they need appreciation and a sense of belonging.',
        movieGenres: [18, 10751, 10749, 36],
        songGenres: ['soft pop', 'acoustic', 'easy listening', 'singer-songwriter'],
        keywords: 'heartwarming gentle nostalgic',
        searchTerms: ['The Help', 'Forrest Gump', 'Little Women', 'The Blind Side', 'Marley and Me', 'Wonder', 'The Notebook', 'A Walk to Remember', 'The Fault in Our Stars', 'Me Before You', 'The Fundamentals of Caring', 'The Intouchables', 'A Beautiful Day in the Neighborhood', 'Patch Adams', 'Good Will Hunting', 'Dead Poets Society', 'Mr. Holland\'s Opus', 'Music of the Heart', 'The Miracle Worker', 'The Pursuit of Happyness', 'October Sky', 'Hidden Figures', 'Erin Brockovich', 'Norma Rae', 'Silkwood', 'Steel Magnolias', 'Fried Green Tomatoes', 'Terms of Endearment', 'Ordinary People', 'Kramer vs Kramer', 'Mrs. Miniver', 'Since You Went Away', 'The Best Years of Our Lives', 'It\'s a Wonderful Life', 'Miracle on 34th Street', 'A Christmas Carol', 'The Sound of Music', 'Mary Poppins', 'The Parent Trap', 'Cheaper by the Dozen', 'Parenthood', 'Father of the Bride', 'Stepmom', 'The Family Stone'],
        seedMovies: ['The Help', 'Forrest Gump', 'Little Women', 'The Blind Side', 'Marley & Me', 'Wonder', 'The Notebook', 'A Walk to Remember', 'The Fault in Our Stars', 'Me Before You', 'The Fundamentals of Caring', 'The Intouchables', 'A Beautiful Day in the Neighborhood', 'Patch Adams', 'Good Will Hunting', 'Dead Poets Society', 'Mr. Holland\'s Opus', 'The Miracle Worker', 'The Pursuit of Happyness', 'October Sky', 'Hidden Figures', 'Erin Brockovich', 'Norma Rae', 'Steel Magnolias', 'Fried Green Tomatoes', 'Terms of Endearment', 'Ordinary People', 'Kramer vs. Kramer', 'It\'s a Wonderful Life', 'Miracle on 34th Street', 'The Sound of Music', 'Mary Poppins', 'The Parent Trap', 'Parenthood', 'Father of the Bride', 'Stepmom', 'The Family Stone', 'Little Miss Sunshine', 'Juno', 'Lady Bird', 'Booksmart', 'The Edge of Seventeen', 'Eighth Grade', 'The Perks of Being a Wallflower', 'Wonder', 'CODA', 'The Father', 'Still Alice', 'Away from Her', 'Iris', 'The Iron Lady', 'Philomena', 'Florence Foster Jenkins', 'The Duchess', 'The Queen', 'Spencer', 'The Crown', 'Darkest Hour', 'The King\'s Speech', 'Lincoln', 'Amistad', 'Glory', '12 Years a Slave', 'Beloved', 'The Color Purple', 'Precious', 'Moonlight', 'If Beale Street Could Talk'],
        songs: [
          { title: "Make You Feel My Love", artist: "Adele" },
          { title: "Someone Like You", artist: "Adele" },
          { title: "All of Me", artist: "John Legend" },
          { title: "Photograph", artist: "Ed Sheeran" },
          { title: "Stay With Me", artist: "Sam Smith" },
          { title: "Say You Won't Let Go", artist: "James Arthur" },
          { title: "A Thousand Years", artist: "Christina Perri" },
          { title: "The One That Got Away", artist: "Katy Perry" },
          { title: "Perfect", artist: "Ed Sheeran" },
          { title: "Thinking Out Loud", artist: "Ed Sheeran" },
        ]
      },
      ESTJ: {
        fullName: 'The Supervisor',
        shortDescription: 'Organized and decisive, ESTJs bring structure and get things done. They respect rules that work, lead by example, and prefer clear roles and timelines. Direct and practical, they value efficiency and accountability in themselves and others.',
        movieGenres: [28, 18, 80, 10752],
        songGenres: ['rock', 'anthemic', 'country rock', 'classic hits'],
        keywords: 'decisive powerful structured',
        searchTerms: ['The Dark Knight', 'Zero Dark Thirty', 'Moneyball', 'Captain Phillips', 'Sully', 'Lincoln', 'Darkest Hour', 'Thirteen Days', 'Apollo 13', 'The Martian', 'Gravity', 'Bridge of Spies', 'Spotlight', 'The Post', 'All the President\'s Men', 'A Few Good Men', '12 Angry Men', 'The Verdict', 'Michael Clayton', 'A Most Violent Year', 'Sicario', 'Heat', 'The Departed', 'The Town', 'The Godfather', 'Goodfellas', 'Casino', 'Scarface', 'The Untouchables', 'Public Enemies', 'The Irishman', 'Donnie Brasco', 'American Gangster', 'Training Day', 'End of Watch', 'Den of Thieves', 'The Place Beyond the Pines', 'Prisoners', 'Gone Baby Gone', 'Mystic River', 'Shutter Island', 'Insomnia', 'Zodiac', 'Se7en', 'The Game', 'Fight Club', 'American Psycho', 'Nightcrawler'],
        seedMovies: ['The Dark Knight', 'Zero Dark Thirty', 'Moneyball', 'Captain Phillips', 'Sully', 'Lincoln', 'Darkest Hour', 'Thirteen Days', 'Apollo 13', 'The Martian', 'Gravity', 'Bridge of Spies', 'Spotlight', 'The Post', 'All the President\'s Men', 'A Few Good Men', '12 Angry Men', 'The Verdict', 'Michael Clayton', 'A Most Violent Year', 'Sicario', 'Heat', 'The Departed', 'The Town', 'The Godfather', 'Goodfellas', 'Casino', 'Scarface', 'The Untouchables', 'Public Enemies', 'The Irishman', 'Donnie Brasco', 'American Gangster', 'Training Day', 'End of Watch', 'Prisoners', 'Gone Baby Gone', 'Mystic River', 'Shutter Island', 'Zodiac', 'Se7en', 'The Game', 'Fight Club', 'American Psycho', 'Nightcrawler', 'The Social Network', 'The Founder', 'Steve Jobs', 'The Big Short', 'Margin Call', 'Wall Street', 'Boiler Room', 'Gladiator', 'Braveheart', 'Kingdom of Heaven', 'Troy', '300', 'Spartacus', 'Ben-Hur', 'The Last Samurai', 'Dunkirk', '1917', 'Saving Private Ryan', 'Black Hawk Down', 'We Were Soldiers', 'Platoon', 'Full Metal Jacket', 'Apocalypse Now', 'The Bridge on the River Kwai', 'Patton'],
        songs: [
          { title: "We Will Rock You", artist: "Queen" },
          { title: "Don't Stop Believin'", artist: "Journey" },
          { title: "We Are the Champions", artist: "Queen" },
          { title: "Eye of the Tiger", artist: "Survivor" },
          { title: "Thunderstruck", artist: "AC/DC" },
          { title: "Born to Run", artist: "Bruce Springsteen" },
          { title: "Glory Days", artist: "Bruce Springsteen" },
          { title: "Working for the Weekend", artist: "Loverboy" },
          { title: "Another One Bites the Dust", artist: "Queen" },
          { title: "Livin' on a Prayer", artist: "Bon Jovi" },
        ]
      },
      ESFJ: {
        fullName: 'The Provider',
        shortDescription: 'Supportive and sociable, ESFJs nurture harmony and look after their communities. They notice others’ needs, enjoy hosting and celebrating, and feel best when people get along. Practical and warm, they thrive on appreciation and shared routines.',
        movieGenres: [35, 10749, 10751, 18],
        songGenres: ['pop', 'soul', 'feel-good', 'dance pop'],
        keywords: 'warm social feel-good',
        searchTerms: ['Love Actually', 'The Holiday', 'Mamma Mia', 'Crazy Rich Asians', 'The Intern', 'Julie and Julia', 'It\'s Complicated', 'Something\'s Gotta Give', 'The Proposal', '27 Dresses', 'The Wedding Planner', 'Bride Wars', 'Bridesmaids', 'My Big Fat Greek Wedding', 'Father of the Bride', 'The Family Stone', 'This Is Where I Leave You', 'Parenthood', 'Cheaper by the Dozen', 'Little Miss Sunshine', 'Juno', 'Lady Bird', 'Booksmart', 'Clueless', 'Legally Blonde', '10 Things I Hate About You', 'She\'s All That', 'Never Been Kissed', '13 Going on 30', 'How to Lose a Guy in 10 Days', 'What Women Want', 'Hitch', 'Hitch', 'The Ugly Truth', 'Force of Nature', 'The Break-Up', 'Friends with Benefits', 'No Strings Attached', 'Friends with Kids', 'The Big Sick', 'Crazy Stupid Love', 'About Time', 'Notting Hill'],
        seedMovies: ['Love Actually', 'The Holiday', 'Mamma Mia!', 'Crazy Rich Asians', 'The Intern', 'Julie & Julia', 'It\'s Complicated', 'Something\'s Gotta Give', 'The Proposal', '27 Dresses', 'The Wedding Planner', 'Bridesmaids', 'My Big Fat Greek Wedding', 'Father of the Bride', 'The Family Stone', 'Parenthood', 'Little Miss Sunshine', 'Juno', 'Lady Bird', 'Booksmart', 'Clueless', 'Legally Blonde', '10 Things I Hate About You', '13 Going on 30', 'How to Lose a Guy in 10 Days', 'What Women Want', 'Hitch', 'The Ugly Truth', 'The Break-Up', 'Friends with Benefits', 'The Big Sick', 'Crazy, Stupid, Love.', 'About Time', 'Notting Hill', 'Four Weddings and a Funeral', 'Love Actually', 'The Holiday', 'While You Were Sleeping', 'Sleepless in Seattle', 'You\'ve Got Mail', 'When Harry Met Sally', 'Annie Hall', 'Manhattan', 'The Apartment', 'Roman Holiday', 'Breakfast at Tiffany\'s', 'Pretty Woman', 'My Fair Lady', 'The Sound of Music', 'Mary Poppins', 'Funny Face', 'Sabrina', 'Charade', 'To Catch a Thief', 'Rear Window', 'North by Northwest', 'The Philadelphia Story', 'His Girl Friday', 'Bringing Up Baby', 'It Happened One Night'],
        songs: [
          { title: "Dancing Queen", artist: "ABBA" },
          { title: "September", artist: "Earth, Wind & Fire" },
          { title: "I Want You Back", artist: "The Jackson 5" },
          { title: "Ain't No Mountain High Enough", artist: "Marvin Gaye & Tammi Terrell" },
          { title: "Signed, Sealed, Delivered", artist: "Stevie Wonder" },
          { title: "Celebration", artist: "Kool & The Gang" },
          { title: "Happy Together", artist: "The Turtles" },
          { title: "Build Me Up Buttercup", artist: "The Foundations" },
          { title: "I Got You (I Feel Good)", artist: "James Brown" },
          { title: "Respect", artist: "Aretha Franklin" },
        ]
      },
      ISTP: {
        fullName: 'The Craftsperson',
        shortDescription: 'Hands-on and analytical, ISTPs master tools and stay calm under pressure. They learn by doing, solve practical problems efficiently, and prefer freedom over rigid plans. Reserved but action-oriented, they enjoy skill, craft, and the present moment.',
        movieGenres: [28, 53, 80, 12],
        songGenres: ['rock', 'electronic', 'instrumental rock', 'blues'],
        keywords: 'action skillful cool',
        searchTerms: ['Mad Max Fury Road', 'John Wick', 'Drive', 'The Bourne Identity', 'Mission Impossible', 'Baby Driver', 'Heat', 'Collateral', 'Jack Reacher', 'The Accountant', 'Nobody', 'Atomic Blonde', 'Atomic Blonde', 'John Wick Chapter', 'The Raid', 'The Raid 2', 'The Night Comes for Us', 'Ong Bak', 'Ip Man', 'The Grandmaster', 'Crouching Tiger', 'Hero', 'House of Flying Daggers', 'Kill Bill', 'Oldboy', 'I Saw the Devil', 'The Man from Nowhere', 'A Bittersweet Life', 'The Chaser', 'Memories of Murder', 'Zodiac', 'Se7en', 'Prisoners', 'Sicario', 'No Country for Old Men', 'Wind River', 'Hell or High Water', 'True Grit', 'The Assassination of Jesse James', 'There Will Be Blood', 'A History of Violence', 'Eastern Promises', 'A Most Violent Year', 'The Place Beyond the Pines', 'Drive', 'Only God Forgives', 'The Rover'],
        seedMovies: ['Mad Max: Fury Road', 'John Wick', 'Drive', 'The Bourne Identity', 'Mission: Impossible', 'Baby Driver', 'Heat', 'Collateral', 'Jack Reacher', 'The Accountant', 'Nobody', 'Atomic Blonde', 'The Raid: Redemption', 'The Raid 2', 'The Night Comes for Us', 'Ong Bak', 'Ip Man', 'The Grandmaster', 'Crouching Tiger, Hidden Dragon', 'Hero', 'Kill Bill: Vol. 1', 'Oldboy', 'I Saw the Devil', 'The Man from Nowhere', 'Memories of Murder', 'Zodiac', 'Se7en', 'Prisoners', 'Sicario', 'No Country for Old Men', 'Wind River', 'Hell or High Water', 'True Grit', 'There Will Be Blood', 'A History of Violence', 'Eastern Promises', 'The Place Beyond the Pines', 'Only God Forgives', 'The Rover', 'Mad Max', 'The Road Warrior', 'Fury Road', 'John Wick: Chapter 2', 'John Wick: Chapter 3', 'John Wick: Chapter 4', 'The Bourne Supremacy', 'The Bourne Ultimatum', 'The Bourne Legacy', 'Jason Bourne', 'Mission: Impossible - Fallout', 'Mission: Impossible - Rogue Nation', 'Edge of Tomorrow', 'Extraction', 'Extraction 2', 'The Gray Man', 'Bullet Train', 'Nobody', 'Peppermint', 'Taken', 'Taken 2', 'The Equalizer', 'The Equalizer 2', 'Safe', 'Safe House', 'The Town'],
        songs: [
          { title: "Seven Nation Army", artist: "The White Stripes" },
          { title: "Come Together", artist: "The Beatles" },
          { title: "Paranoid", artist: "Black Sabbath" },
          { title: "Back in Black", artist: "AC/DC" },
          { title: "Enter Sandman", artist: "Metallica" },
          { title: "Smells Like Teen Spirit", artist: "Nirvana" },
          { title: "Killing in the Name", artist: "Rage Against the Machine" },
          { title: "Bulls on Parade", artist: "Rage Against the Machine" },
          { title: "Sabotage", artist: "Beastie Boys" },
          { title: "Guerrilla Radio", artist: "Rage Against the Machine" },
        ]
      },
      ISFP: {
        fullName: 'The Composer',
        shortDescription: 'Gentle and aesthetic, ISFPs live in the moment and express themselves through beauty and experience. They value authenticity, avoid conflict when possible, and need personal space. Quietly passionate, they often show care through actions rather than words.',
        movieGenres: [18, 10749, 10402, 16],
        songGenres: ['indie', 'acoustic', 'lo-fi', 'soft alternative'],
        keywords: 'aesthetic intimate artistic',
        searchTerms: ['Call Me by Your Name', 'Lost in Translation', 'Moonlight', 'Portrait of a Lady on Fire', 'The Secret Garden', 'Amelie', 'Amélie', 'Spirited Away', 'My Neighbor Totoro', 'Howl\'s Moving Castle', 'Whisper of the Heart', 'Your Name', 'Garden of Words', 'A Silent Voice', 'Wolf Children', 'Song of the Sea', 'The Secret of Kells', 'Klaus', 'Coco', 'Soul', 'Inside Out', 'Up', 'Wall-E', 'Big Fish', 'Edward Scissorhands', 'Corpse Bride', 'Pan\'s Labyrinth', 'The Shape of Water', 'Carol', 'Brokeback Mountain', 'Phantom Thread', 'Punch-Drunk Love', 'Her', 'Paterson', 'Only Lovers Left Alive', 'Moonrise Kingdom', 'Fantastic Mr. Fox', 'The Grand Budapest Hotel', 'Frances Ha', 'Before Sunrise', 'Before Sunset', 'Before Midnight', 'Once', 'Begin Again', 'La La Land', 'Sing Street'],
        seedMovies: ['Call Me by Your Name', 'Lost in Translation', 'Moonlight', 'Portrait of a Lady on Fire', 'Amélie', 'Spirited Away', 'My Neighbor Totoro', 'Howl\'s Moving Castle', 'Your Name', 'A Silent Voice', 'Wolf Children', 'Song of the Sea', 'Klaus', 'Coco', 'Soul', 'Inside Out', 'Up', 'WALL-E', 'Big Fish', 'Edward Scissorhands', 'Corpse Bride', 'Pan\'s Labyrinth', 'The Shape of Water', 'Carol', 'Brokeback Mountain', 'Phantom Thread', 'Punch-Drunk Love', 'Her', 'Paterson', 'Only Lovers Left Alive', 'Moonrise Kingdom', 'Fantastic Mr. Fox', 'The Grand Budapest Hotel', 'Frances Ha', 'Before Sunrise', 'Before Sunset', 'Before Midnight', 'Once', 'Begin Again', 'La La Land', 'Sing Street', 'The Secret Life of Walter Mitty', 'Almost Famous', 'Empire Records', 'High Fidelity', '(500) Days of Summer', 'The Perks of Being a Wallflower', 'Me and Earl and the Dying Girl', 'Juno', 'Lady Bird', 'Booksmart', 'The Edge of Seventeen', 'Eighth Grade', 'Ghost World', 'Thumbsucker', 'Submarine', 'The Way Way Back', 'Adventureland', 'Nick and Norah\'s Infinite Playlist', 'Bandslam', 'School of Rock', 'Almost Famous', 'Singles'],
        songs: [
          { title: "Yellow", artist: "Coldplay" },
          { title: "Sweater Weather", artist: "The Neighbourhood" },
          { title: "Riptide", artist: "Vance Joy" },
          { title: "Budapest", artist: "George Ezra" },
          { title: "Ho Hey", artist: "The Lumineers" },
          { title: "Banana Pancakes", artist: "Jack Johnson" },
          { title: "Better Together", artist: "Jack Johnson" },
          { title: "Home", artist: "Phillip Phillips" },
          { title: "The Scientist", artist: "Coldplay" },
          { title: "Fix You", artist: "Coldplay" },
        ]
      },
      ESTP: {
        fullName: 'The Dynamo',
        shortDescription: 'Energetic and realistic, ESTPs act fast, take calculated risks, and thrive on excitement. They read situations in the moment, prefer action over theory, and adapt quickly. Bold and pragmatic, they get bored when life becomes too predictable.',
        movieGenres: [28, 35, 12, 53],
        songGenres: ['hip hop', 'electronic dance', 'rock', 'party'],
        keywords: 'high-energy thrilling bold',
        searchTerms: ['Fast and Furious', 'Ocean\'s Eleven', 'The Hangover', 'Rush Hour', 'Kingsman', '6 Underground', 'Baby Driver', 'The Italian Job', 'The Thomas Crown Affair', 'Catch Me If You Can', 'Matchstick Men', 'The Sting', 'Now You See Me', 'Ocean\'s Twelve', 'Ocean\'s Thirteen', 'Ocean\'s 8', 'Logan Lucky', 'Army of Thieves', 'The Gentlemen', 'Snatch', 'Lock Stock', 'RocknRolla', 'Layer Cake', 'The Transporter', 'Taken', 'The Bourne Identity', 'Mission Impossible', 'Jack Reacher', 'Nobody', 'Extraction', 'The Gray Man', 'Bullet Train', 'Deadpool', 'Deadpool 2', 'Deadpool 3', 'Guardians of the Galaxy', 'Thor Ragnarok', 'Ant-Man', 'Shang-Chi', 'Black Panther', 'The Avengers', 'Iron Man'],
        seedMovies: ['The Fast and the Furious', 'Ocean\'s Eleven', 'The Hangover', 'Rush Hour', 'Kingsman: The Secret Service', '6 Underground', 'Baby Driver', 'The Italian Job', 'The Thomas Crown Affair', 'Catch Me If You Can', 'Matchstick Men', 'The Sting', 'Now You See Me', 'Ocean\'s Twelve', 'Ocean\'s Thirteen', 'Ocean\'s 8', 'Logan Lucky', 'The Gentlemen', 'Snatch', 'Lock, Stock and Two Smoking Barrels', 'RocknRolla', 'Layer Cake', 'The Transporter', 'Taken', 'The Bourne Identity', 'Mission: Impossible', 'Jack Reacher', 'Nobody', 'Extraction', 'The Gray Man', 'Bullet Train', 'Deadpool', 'Guardians of the Galaxy', 'Thor: Ragnarok', 'Ant-Man', 'Shang-Chi and the Legend of the Ten Rings', 'Black Panther', 'Iron Man', 'The Avengers', 'Mad Max: Fury Road', 'John Wick', 'Drive', 'Heat', 'Collateral', 'Point Break', 'Days of Thunder', 'Top Gun', 'Top Gun: Maverick', 'Ford v Ferrari', 'Rush', 'Senna', 'Talladega Nights', 'Ricky Bobby', 'Step Brothers', 'Anchorman', 'Zoolander', 'Tropic Thunder', 'Kiss Kiss Bang Bang', 'The Nice Guys', 'Game Night', 'Knives Out', 'Glass Onion', 'Clue', 'Hot Fuzz', 'Shaun of the Dead', 'The World\'s End', 'Scott Pilgrim'],
        songs: [
          { title: "Levels", artist: "Avicii" },
          { title: "Titanium", artist: "David Guetta ft. Sia" },
          { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
          { title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis" },
          { title: "HUMBLE.", artist: "Kendrick Lamar" },
          { title: "Till I Collapse", artist: "Eminem" },
          { title: "Can't Stop", artist: "Red Hot Chili Peppers" },
          { title: "Stronger", artist: "Kelly Clarkson" },
          { title: "Wake Me Up", artist: "Avicii" },
          { title: "Don't You Worry Child", artist: "Swedish House Mafia" },
        ]
      },
      ESFP: {
        fullName: 'The Performer',
        shortDescription: 'Spontaneous and warm, ESFPs light up rooms and live for shared joy. They notice sensory detail, enjoy performance and play, and bring energy to social settings. Present-focused and generous, they prefer experience over long-term planning.',
        movieGenres: [35, 10402, 10749, 12],
        songGenres: ['pop', 'dance', 'funk', 'upbeat soul'],
        keywords: 'fun energetic celebratory',
        searchTerms: ['La La Land', 'Mamma Mia', 'The Greatest Showman', 'Pitch Perfect', 'Crazy Rich Asians', 'Barbie', 'Mamma Mia Here We Go', 'Pitch Perfect 2', 'Pitch Perfect 3', 'Hairspray', 'Grease', 'Chicago', 'Moulin Rouge', 'Burlesque', 'A Star is Born', 'Bohemian Rhapsody', 'Rocketman', 'Walk the Line', 'Ray', 'Get On Up', 'Straight Outta Compton', '8 Mile', 'Purple Rain', 'The Bodyguard', 'Dirty Dancing', 'Footloose', 'Flashdance', 'Saturday Night Fever', 'Fame', 'Center Stage', 'Save the Last Dance', 'Step Up', 'Honey', 'You Got Served', 'Bring It On', 'Cheerleader', 'Legally Blonde', 'Clueless', '10 Things I Hate About You', 'She\'s All That', 'Never Been Kissed', '13 Going on 30', 'The Princess Diaries', 'Enchanted', 'A Cinderella Story', 'Ella Enchanted', 'The House Bunny', 'White Chicks'],
        seedMovies: ['La La Land', 'Mamma Mia!', 'The Greatest Showman', 'Pitch Perfect', 'Crazy Rich Asians', 'Barbie', 'Mamma Mia! Here We Go Again', 'Pitch Perfect 2', 'Pitch Perfect 3', 'Hairspray', 'Grease', 'Chicago', 'Moulin Rouge!', 'Burlesque', 'A Star Is Born', 'Bohemian Rhapsody', 'Rocketman', 'Walk the Line', 'Ray', 'Straight Outta Compton', '8 Mile', 'Purple Rain', 'The Bodyguard', 'Dirty Dancing', 'Footloose', 'Flashdance', 'Saturday Night Fever', 'Fame', 'Center Stage', 'Save the Last Dance', 'Step Up', 'Bring It On', 'Legally Blonde', 'Clueless', '10 Things I Hate About You', '13 Going on 30', 'The Princess Diaries', 'Enchanted', 'Ella Enchanted', 'The House Bunny', 'White Chicks', 'Bridesmaids', 'The Hangover', 'Wedding Crashers', 'Yes Man', 'Elf', 'Zoolander', 'Night at the Museum', 'Paddington', 'Paddington 2', 'The Intern', 'Julie & Julia', 'The Proposal', '27 Dresses', 'The Wedding Planner', 'My Big Fat Greek Wedding', 'Love Actually', 'The Holiday', 'Notting Hill', 'Four Weddings and a Funeral', 'About Time', 'Crazy, Stupid, Love.', 'Friends with Benefits', 'Hitch', 'What Women Want'],
        songs: [
          { title: "Levitating", artist: "Dua Lipa" },
          { title: "Blinding Lights", artist: "The Weeknd" },
          { title: "Don't Start Now", artist: "Dua Lipa" },
          { title: "As It Was", artist: "Harry Styles" },
          { title: "Good as Hell", artist: "Lizzo" },
          { title: "Shake It Off", artist: "Taylor Swift" },
          { title: "24K Magic", artist: "Bruno Mars" },
          { title: "Can't Stop the Feeling!", artist: "Justin Timberlake" },
          { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
          { title: "Dance Monkey", artist: "Tones and I" },
        ]
      },
    };

    // Diagnostic Diagnostic Diagnostic Framework
    const typeProfiles = {
      INFP: {
        fullName: "The Healer",
        blurb: "Imaginative idealists, guided by their own unique core values and beliefs.",
        traits: ["Introverted", "Intuitive", "Feeling", "Perceiving"],
        lead: "INFPs are energized by solitude, drawn to meaning, guided by values, and flexible in how they move through life. That mix creates people who care deeply about authenticity.",
        overview: "An INFP leads with an inner compass. They notice what feels true and what feels hollow. Practical details matter less than whether a choice aligns with their values.",
        nutshell: "Imaginative, values-led, and quietly stubborn about integrity.",
        strengths: ["Empathy without performance", "Creative problem-framing", "Loyalty to people and principles", "Openness to unconventional paths", "Depth of reflection"],
        growth: ["Can delay decisions searching for the perfect answer", "May withdraw when conflict threatens values", "Practical follow-through can lag", "Self-criticism can outrun self-compassion"],
        careers: "They often thrive where meaning and craft meet: counseling, writing, psychology, education, design, music, and nonprofit work.",
        relationships: "Warm and encouraging once trust is earned. They need partners who respect privacy and do not treat sensitivity as weakness.",
        facts: ["Motivated by authenticity and alignment between belief and life.", "Often private; depth is shared selectively.", "Drawn to arts, reflection, and conversations about purpose.", "Nonconformist in quiet ways."],
        others: "May seem reserved at first. Close friends know a fiercely loyal idealist.",
        famous: "Often associated with artists, writers, and empathetic public figures.",
      },
      INTJ: {
        fullName: "The Mastermind",
        blurb: "Analytical problem-solvers, eager to improve systems with innovative ideas.",
        traits: ["Introverted", "Intuitive", "Thinking", "Judging"],
        lead: "INTJs recharge alone, think in systems, decide with logic, and prefer plans that work. They redesign whatever feels inefficient.",
        overview: "An INTJ maps complexity quickly, looks for leverage, and commits once a strategy is clear. Competence is the currency they respect.",
        nutshell: "Independent strategists who prefer depth over small talk and results over ritual.",
        strengths: ["Systems thinking", "Independent judgment", "Long-term planning", "Intellectual honesty", "High standards for craft"],
        growth: ["Can undervalue emotional context", "Impatience with inefficiency", "May stay too long in analysis", "Standards can read as coldness"],
        careers: "Strategy, engineering, research, architecture, product, law, and roles where independent thinking improves a system.",
        relationships: "Loyal and low-drama when trust exists. Care shows through reliability and problem-solving.",
        facts: ["Energized by solitude and clear mental models.", "Prefer frameworks that scale.", "Future-oriented and selective with collaboration.", "Value competence and directness."],
        others: "Seen as quiet, intense, and highly capable.",
        famous: "Often linked with strategists, inventors, and analytical leaders.",
      },
      INFJ: {
        fullName: "The Counselor",
        blurb: "Creative nurturers with strong integrity and a drive to help others grow.",
        traits: ["Introverted", "Intuitive", "Feeling", "Judging"],
        lead: "INFJs combine private reflection with people-centered insight. They sense patterns in emotion and meaning, then organize life around purpose.",
        overview: "An INFJ often understands others quickly and holds a private vision of how things could be more humane.",
        nutshell: "Insightful, principled, and quietly driven to help people grow.",
        strengths: ["Deep empathy with foresight", "Integrity", "Ability to counsel and guide", "Pattern recognition in people", "Commitment to meaningful work"],
        growth: ["Can overextend for others", "Perfectionism around purpose", "Difficulty with shallow environments", "May idealize outcomes"],
        careers: "Counseling, writing, education, coaching, advocacy, psychology, and creative work with a human core.",
        relationships: "Selective but devoted. They want emotional honesty and shared values.",
        facts: ["Often rare and intensely private about motives.", "Motivated by integrity and long-term impact.", "Strong sense of narrative and symbolism.", "Need solitude after emotional absorption."],
        others: "May appear calm while carrying a rich inner world.",
        famous: "Associated with thoughtful creatives, counselors, and quiet cultural voices.",
      },
      INTP: {
        fullName: "The Architect",
        blurb: "Philosophical innovators, fascinated by logical analysis, systems, and design.",
        traits: ["Introverted", "Intuitive", "Thinking", "Perceiving"],
        lead: "INTPs live in possibility space. They question assumptions, chase elegant models, and stay flexible until a theory holds.",
        overview: "An INTP is curious first. They dismantle ideas to see how they work, then rebuild better ones.",
        nutshell: "Analytical explorers who would rather understand the system than manage the room.",
        strengths: ["Logical precision", "Creative analysis", "Intellectual independence", "Comfort with ambiguity", "Original problem framing"],
        growth: ["Follow-through can lag", "May under-communicate needs", "Practical routines can feel optional", "Can disappear into theory"],
        careers: "Research, software, design systems, strategy, and inventive technical roles.",
        relationships: "Loyal in a low-pressure way. They bond through ideas and shared curiosity.",
        facts: ["Energized by problems that reward deep thinking.", "Prefer autonomy and minimal structure.", "Often witty in precise ways.", "Value truth-seeking over consensus."],
        others: "Quiet, inventive, occasionally absent-minded about logistics.",
        famous: "Linked with theorists, inventors, and lateral thinkers.",
      },
      ENFP: {
        fullName: "The Champion",
        blurb: "People-centered creators with contagious enthusiasm for new ideas and people.",
        traits: ["Extraverted", "Intuitive", "Feeling", "Perceiving"],
        lead: "ENFPs light up around people and possibility. They connect ideas, encourage growth, and resist boxes that feel too small.",
        overview: "An ENFP spots potential quickly in projects and people. Structure is useful when it protects freedom.",
        nutshell: "Warm catalysts who turn curiosity into connection and possibility into momentum.",
        strengths: ["Enthusiasm that includes others", "Creative brainstorming", "Empathic reading of people", "Adaptability", "Storytelling energy"],
        growth: ["Can start more than they finish", "Overcommitment from yes-energy", "Routine tasks drain faster", "May avoid hard limits"],
        careers: "Creative direction, counseling-adjacent roles, entrepreneurship, media, teaching, community building.",
        relationships: "Affectionate and affirming. They need room to explore and partners who can ground them.",
        facts: ["Motivated by meaning, novelty, and human potential.", "Often skilled at making people feel seen.", "Ideas arrive in clusters.", "Need both social spark and recovery time."],
        others: "Magnetic, expressive, and hard to keep in a narrow role.",
        famous: "Often associated with performers, founders, and charismatic creatives.",
      },
      ENTJ: {
        fullName: "The Commander",
        blurb: "Strategic leaders who take charge and implement efficient, impactful change.",
        traits: ["Extraverted", "Intuitive", "Thinking", "Judging"],
        lead: "ENTJs organize people and resources toward outcomes. They think in goals, timelines, and leverage.",
        overview: "An ENTJ sees the destination and builds the path. Inefficiency frustrates them; competent collaboration energizes them.",
        nutshell: "Decisive builders who turn strategy into coordinated action.",
        strengths: ["Leadership under pressure", "Strategic clarity", "Execution focus", "Direct communication", "High agency"],
        growth: ["Can steamroll softer voices", "Patience with process may run thin", "Emotional nuance can be underweighted", "Rest can feel like lost momentum"],
        careers: "Executive leadership, operations, law, entrepreneurship, high-stakes project leadership.",
        relationships: "Loyal and protective when committed. They respect partners who are capable and clear.",
        facts: ["Motivated by impact and effective systems.", "Prefer honest conflict over polite stagnation.", "Natural coordinators in groups.", "Measure progress in concrete outcomes."],
        others: "Confident, direct, sometimes intimidating.",
        famous: "Associated with commanders, founders, and high-output leaders.",
      },
      ENTP: {
        fullName: "The Visionary",
        blurb: "Inspired innovators motivated by new solutions to challenging problems.",
        traits: ["Extraverted", "Intuitive", "Thinking", "Perceiving"],
        lead: "ENTPs argue to discover, invent to stay interested, and treat constraints as puzzles.",
        overview: "An ENTP thrives on novelty and intellectual sparring. They challenge orthodoxy and move on when the puzzle is solved.",
        nutshell: "Quick-witted innovators who stress-test ideas until something stronger remains.",
        strengths: ["Mental agility", "Persuasive framing", "Opportunity spotting", "Humor under pressure", "Comfort with disruption"],
        growth: ["Follow-through can scatter", "Argument can outrun diplomacy", "Routine maintenance is less natural", "May underestimate emotional stakes"],
        careers: "Entrepreneurship, product innovation, media, law, consulting, inventive technical roles.",
        relationships: "Playful and stimulating. They need partners who enjoy ideas and call them back to commitments.",
        facts: ["Energized by debate and new frameworks.", "Often multipotential.", "Rules are interesting mainly when tested.", "Charm and challenge arrive together."],
        others: "Seen as clever, provocative, and hard to pin down.",
        famous: "Linked with debaters, inventors, and cultural disruptors.",
      },
      ENFJ: {
        fullName: "The Teacher",
        blurb: "Idealist organizers driven to lead others toward a better vision for people.",
        traits: ["Extraverted", "Intuitive", "Feeling", "Judging"],
        lead: "ENFJs organize people around a hopeful vision. They notice group dynamics and mentor growth.",
        overview: "An ENFJ often becomes the emotional center of a team. They want progress that is ethical and human.",
        nutshell: "Charismatic guides who lead with empathy and a plan for collective betterment.",
        strengths: ["People development", "Inspiring communication", "Organizational warmth", "Conflict mediation", "Vision with follow-through"],
        growth: ["Can over-identify with group needs", "Hard to switch off caretaking", "May take criticism personally", "Boundaries need active practice"],
        careers: "Education, coaching, HR, nonprofit leadership, counseling-adjacent roles, community organizing.",
        relationships: "Devoted and expressive. They thrive with mutual growth and honest appreciation.",
        facts: ["Motivated by human potential and shared purpose.", "Often natural mentors.", "Read social temperature quickly.", "Want harmony without abandoning standards."],
        others: "Warm, organized, and easy to trust with people responsibility.",
        famous: "Associated with teachers, organizers, and public motivators.",
      },
      ISFJ: {
        fullName: "The Protector",
        blurb: "Industrious caretakers, loyal and ready to do the hard work for others.",
        traits: ["Introverted", "Sensing", "Feeling", "Judging"],
        lead: "ISFJs steady the world around them. They remember details that keep people safe and take duty seriously.",
        overview: "An ISFJ builds reliability into daily life. Tradition and care are tools, not cages.",
        nutshell: "Quiet stewards who keep commitments and notice what others need before it is asked.",
        strengths: ["Dependability", "Practical care", "Memory for personal detail", "Patience", "Loyalty to people and places"],
        growth: ["May understate own needs", "Change can feel costly", "Can over-carry responsibility", "Harder to release control of care"],
        careers: "Healthcare, administration, education support, hospitality, community services.",
        relationships: "Steady and thoughtful. Love shows through acts of service and consistency.",
        facts: ["Prefer concrete help over abstract theory.", "Often the backbone of families and teams.", "Value continuity and earned trust.", "Need sincere recognition, not flashy praise."],
        others: "Gentle, capable, sometimes underestimated until everything relies on them.",
        famous: "Linked with caretakers and people known for quiet loyalty.",
      },
      ISFP: {
        fullName: "The Composer",
        blurb: "Gentle caretakers who live in the present with quiet, low-key enthusiasm.",
        traits: ["Introverted", "Sensing", "Feeling", "Perceiving"],
        lead: "ISFPs live close to the senses and the moment. They express values through style, craft, and presence.",
        overview: "An ISFP notices texture, mood, and beauty. Freedom to move and create matters.",
        nutshell: "Gentle aesthetic souls who protect personal values and savor immediate experience.",
        strengths: ["Aesthetic sensitivity", "Present-moment calm", "Kindness without performance", "Hands-on creativity", "Adaptability"],
        growth: ["Long planning can feel unnatural", "May avoid conflict too long", "Structure needs to stay light", "Self-advocacy can be delayed"],
        careers: "Design, music, culinary arts, photography, hands-on trades, wellness, nature-related work.",
        relationships: "Warm and accepting in private. They need space and partners who do not force constant verbal processing.",
        facts: ["Values show up in choices more than slogans.", "Often artistic in understated ways.", "Prefer harmony and sensory ease.", "Autonomy is non-negotiable for wellbeing."],
        others: "Soft-spoken, stylish, hard to rush.",
        famous: "Associated with artists, performers, and quiet cultural tastemakers.",
      },
      ISTJ: {
        fullName: "The Inspector",
        blurb: "Responsible organizers who create and enforce order within systems.",
        traits: ["Introverted", "Sensing", "Thinking", "Judging"],
        lead: "ISTJs build order you can trust. They respect facts, process, and responsibility.",
        overview: "An ISTJ prefers clear standards and proven methods. They are not opposed to change — they oppose careless change.",
        nutshell: "Precise, dutiful organizers who keep systems honest and running.",
        strengths: ["Reliability", "Attention to detail", "Process discipline", "Fair-minded consistency", "Calm under procedure"],
        growth: ["May resist unproven methods", "Flexibility can take effort", "Emotional expression may stay minimal", "Can over-identify with duty"],
        careers: "Accounting, operations, logistics, administration, engineering operations.",
        relationships: "Loyal and practical. Care is shown through stability and follow-through.",
        facts: ["Prefer evidence over hype.", "Often the person who remembers the checklist.", "Respect hierarchy that is earned.", "Value private competence over public praise."],
        others: "Serious, capable, occasionally formal.",
        famous: "Linked with inspectors, administrators, and steady high-standard public servants.",
      },
      ISTP: {
        fullName: "The Craftsperson",
        blurb: "Observant artisans with a feel for mechanics and hands-on troubleshooting.",
        traits: ["Introverted", "Sensing", "Thinking", "Perceiving"],
        lead: "ISTPs learn by taking things apart. They stay cool in crisis and keep options open.",
        overview: "An ISTP is a troubleshooter. Theory is fine; working mechanisms are better.",
        nutshell: "Reserved craftsmen of the physical and technical world who move when action is useful.",
        strengths: ["Crisis calm", "Mechanical insight", "Independent problem-solving", "Efficiency", "Observational accuracy"],
        growth: ["Long emotional processing can feel foreign", "Commitment timing may frustrate others", "Boredom with pure theory", "Communication can stay minimal"],
        careers: "Engineering trades, emergency response, mechanics, athletics, technical operations.",
        relationships: "Low-drama and loyal in action. They need freedom and partners who do not demand constant narration.",
        facts: ["Prefer tools and tests over meetings.", "Often highly skilled with systems you can touch.", "Risk is interesting when skill can meet it.", "Privacy is a default setting."],
        others: "Quiet, capable, occasionally unpredictable.",
        famous: "Associated with athletes, mechanics, pilots, and cool-headed operators.",
      },
      ESFJ: {
        fullName: "The Provider",
        blurb: "Conscientious helpers, sensitive to needs and dedicated to their duties.",
        traits: ["Extraverted", "Sensing", "Feeling", "Judging"],
        lead: "ESFJs keep communities stitched together. They notice needs and take pride in responsibility well handled.",
        overview: "An ESFJ thrives when people feel included and systems of care are clear.",
        nutshell: "Warm organizers who turn duty into hospitality and belonging.",
        strengths: ["Social awareness", "Practical helpfulness", "Loyalty", "Event and people coordination", "Encouraging presence"],
        growth: ["Can overfocus on approval", "Conflict avoidance may delay truth", "Change needs a human reason", "Self-care can slip"],
        careers: "Healthcare, teaching, event coordination, hospitality, customer success, community management.",
        relationships: "Attentive and expressive. They flourish with appreciation and shared rituals.",
        facts: ["Motivated by harmony and concrete care.", "Often remember preferences and logistics.", "Prefer clear social roles when they help people.", "Energy rises in cooperative groups."],
        others: "Friendly, reliable, and socially fluent.",
        famous: "Linked with hosts, caregivers, and community pillars.",
      },
      ESFP: {
        fullName: "The Performer",
        blurb: "Vivacious entertainers who charm others with fun-loving spontaneity.",
        traits: ["Extraverted", "Sensing", "Feeling", "Perceiving"],
        lead: "ESFPs bring heat and color into the room. They respond to the moment and pull others into the fun.",
        overview: "An ESFP trusts what is alive right now. Plans are useful when they protect joy and connection.",
        nutshell: "Spontaneous entertainers who turn ordinary moments into shared energy.",
        strengths: ["Presence", "Charisma", "Adaptability", "Emotional expressiveness", "Ability to lift a room"],
        growth: ["Long-range planning can feel heavy", "May avoid painful pauses", "Impulse needs a gentle brake", "Depth conversations need intention"],
        careers: "Performance, hospitality, sales, event work, coaching, culinary arts.",
        relationships: "Affectionate and playful. They need partners who enjoy the present and still handle practical follow-through.",
        facts: ["Energized by people and sensory richness.", "Often talented at improvisation.", "Prefer learning by doing.", "Authenticity shows up as liveliness."],
        others: "Bright, social, hard to ignore.",
        famous: "Associated with performers, hosts, and public personalities who live out loud.",
      },
      ESTJ: {
        fullName: "The Supervisor",
        blurb: "Hardworking traditionalists eager to organize projects and people.",
        traits: ["Extraverted", "Sensing", "Thinking", "Judging"],
        lead: "ESTJs take charge of the practical world. They set standards, assign roles, and measure progress in results.",
        overview: "An ESTJ believes order is a form of respect. They want clear expectations and people who follow through.",
        nutshell: "Direct supervisors who turn chaos into coordinated work.",
        strengths: ["Organization", "Decisiveness", "Accountability", "Operational clarity", "Consistency"],
        growth: ["Can be blunt under stress", "Flexibility with exceptions takes effort", "Emotional processing may be secondary", "Delegation needs trust practice"],
        careers: "Management, operations, project management, business ownership, civic leadership tracks.",
        relationships: "Protective and structured. Loyalty is shown through provision and reliability.",
        facts: ["Prefer clear rules that serve a purpose.", "Often step up when leadership is vacant.", "Respect competence and punctuality.", "Measure success in completed commitments."],
        others: "Commanding, efficient, occasionally stern.",
        famous: "Linked with executives, organizers, and traditional institutional leaders.",
      },
      ESTP: {
        fullName: "The Dynamo",
        blurb: "Energetic thrillseekers who bring dynamic energy to every interaction.",
        traits: ["Extraverted", "Sensing", "Thinking", "Perceiving"],
        lead: "ESTPs move toward action. They read the room, take calculated risks, and learn fastest when stakes are real.",
        overview: "An ESTP prefers negotiations, motion, and problems that respond to skill over pure theory.",
        nutshell: "Bold operators who turn pressure into play and opportunity into motion.",
        strengths: ["Situational awareness", "Persuasion", "Nerve under pressure", "Practical improvisation", "Social boldness"],
        growth: ["Long-term planning can be postponed", "May underweight subtle feelings", "Restlessness with slow systems", "Impulse needs selective discipline"],
        careers: "Entrepreneurship, sales, emergency response, athletics, negotiations, hands-on technical work.",
        relationships: "Exciting and direct. They need partners who can match energy without demanding constant analysis.",
        facts: ["Energized by real-time challenge.", "Often persuasive and physically confident.", "Prefer concrete feedback loops.", "Rules are tools, not sacred texts."],
        others: "Dynamic, competitive, socially bold.",
        famous: "Associated with athletes, deal-makers, and high-energy public risk-takers.",
      },
    };

    const questions = [
      {
        id: 1,
        dichotomy: 'EI',
        text: 'When you are working through a complex idea, what tends to clarify it for you?',
        optionA: 'Talking it through with someone - the exchange itself sharpens my thinking.',
        optionB: 'Sitting with it alone until the structure settles in my mind.',
        aScore: 'E',
        bScore: 'I',
      },
      {
        id: 2,
        dichotomy: 'EI',
        text: 'After a stretch of social time (even enjoyable), what do you usually notice?',
        optionA: 'I still have energy left - interaction tends to fuel me.',
        optionB: 'I need quiet afterward to feel like myself again.',
        aScore: 'E',
        bScore: 'I',
      },
      {
        id: 3,
        dichotomy: 'EI',
        text: 'In a group discussion where you care about the topic, you are more likely to...',
        optionA: 'Think out loud as the conversation unfolds and refine ideas in real time.',
        optionB: 'Form a clearer position internally before you choose when to speak.',
        aScore: 'E',
        bScore: 'I',
      },
      {
        id: 4,
        dichotomy: 'EI',
        text: 'When something meaningful happens in your life, your first instinct is often to...',
        optionA: 'Share it - processing it with others makes it more real.',
        optionB: 'Hold it privately for a while before deciding whether to share.',
        aScore: 'E',
        bScore: 'I',
      },
      {
        id: 5,
        dichotomy: 'SN',
        text: 'When you take in a new situation, what do you tend to notice first?',
        optionA: 'Concrete details and what is actually present - the facts on the ground.',
        optionB: 'Patterns, implications, and where this might be heading.',
        aScore: 'S',
        bScore: 'N',
      },
      {
        id: 6,
        dichotomy: 'SN',
        text: 'You trust a conclusion more when it is grounded in...',
        optionA: 'Direct experience, tested methods, and observable evidence.',
        optionB: 'Insight, underlying models, and how the pieces fit together conceptually.',
        aScore: 'S',
        bScore: 'N',
      },
      {
        id: 7,
        dichotomy: 'SN',
        text: 'When learning something important, you prefer material that...',
        optionA: 'Walks through clear examples and practical application step by step.',
        optionB: 'Maps the big picture first so you can see how the parts relate.',
        aScore: 'S',
        bScore: 'N',
      },
      {
        id: 8,
        dichotomy: 'SN',
        text: 'Your mind, left to itself, more often drifts toward...',
        optionA: 'What is happening now and how to respond effectively in the present.',
        optionB: 'Possibilities, meanings, and "what if" threads that branch outward.',
        aScore: 'S',
        bScore: 'N',
      },
      {
        id: 9,
        dichotomy: 'TF',
        text: 'When a decision affects people you care about, what do you weigh most carefully?',
        optionA: 'What is consistent, effective, and fair according to clear criteria.',
        optionB: 'How each person will experience the outcome and whether it honors what matters to them.',
        aScore: 'T',
        bScore: 'F',
      },
      {
        id: 10,
        dichotomy: 'TF',
        text: 'If a friend is upset about criticism they received, your natural response is closer to...',
        optionA: 'Helping them sort what was valid in the feedback and what to do next.',
        optionB: 'First making sure they feel understood before moving into solutions.',
        aScore: 'T',
        bScore: 'F',
      },
      {
        id: 11,
        dichotomy: 'TF',
        text: 'You feel most respected in a disagreement when the other person...',
        optionA: 'Engages the logic of your position and tests it directly.',
        optionB: 'Shows they grasp the personal stakes and values underneath your view.',
        aScore: 'T',
        bScore: 'F',
      },
      {
        id: 12,
        dichotomy: 'TF',
        text: 'In conflict, your default aim is closer to...',
        optionA: 'Clarify the issue, separate it from personalities, and resolve it cleanly.',
        optionB: 'Protect the relationship while searching for a resolution that feels right for everyone involved.',
        aScore: 'T',
        bScore: 'F',
      },
      {
        id: 13,
        dichotomy: 'JP',
        text: 'When facing a deadline with real stakes, you tend to work best when...',
        optionA: 'You have broken the work into steps ahead of time and can close things out early.',
        optionB: 'You keep room to adapt; momentum and clarity often arrive closer to the edge.',
        aScore: 'J',
        bScore: 'P',
      },
      {
        id: 14,
        dichotomy: 'JP',
        text: 'A day that feels well-spent usually has...',
        optionA: 'A clear sense of what needed to get done - and most of it did.',
        optionB: 'Space to follow interesting threads and respond to what emerged.',
        aScore: 'J',
        bScore: 'P',
      },
      {
        id: 15,
        dichotomy: 'JP',
        text: 'When plans change unexpectedly, your honest internal reaction is closer to...',
        optionA: 'Mild friction - you had oriented around the original structure.',
        optionB: 'Curiosity or relief - flexibility often opens something useful.',
        aScore: 'J',
        bScore: 'P',
      },
      {
        id: 16,
        dichotomy: 'JP',
        text: 'You feel most productive when your environment allows you to...',
        optionA: 'Commit to a plan and move through it with few open loops.',
        optionB: 'Keep options visible and decide the path as new information appears.',
        aScore: 'J',
        bScore: 'P',
      },
    ];

    const QUIZ_QUESTIONS = questions;

    const DICHOTOMY_LABELS = {
      EI: 'Energy',
      SN: 'Information',
      TF: 'Decisions',
      JP: 'Lifestyle',
    };

    const SECTIONS = ['quiz-section', 'manual-section', 'results-section'];

    function showSection(id) {
      const hero = document.getElementById('hero');
      if (hero) hero.classList.add('hidden');

      SECTIONS.forEach((s) => {
        const el = document.getElementById(s);
        if (el) {
          el.classList.add('hidden');
          el.classList.remove('section-enter');
        }
      });

      const target = document.getElementById(id);
      if (target) {
        target.classList.remove('hidden');
        void target.offsetWidth;
        target.classList.add('section-enter');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
          if (id === 'manual-section') {
        try { renderTypeCards(); } catch (e) { console.warn(e); }
      }
    }

    function showHome() {
      SECTIONS.forEach((s) => {
        const el = document.getElementById(s);
        if (el) {
          el.classList.add('hidden');
          el.classList.remove('section-enter');
        }
      });
      const hero = document.getElementById('hero');
      if (hero) {
        hero.classList.remove('hidden');
        hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Quiz Navigation
    function startQuiz() {
      quizIndex = 0;
      quizScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
      quizAnswers = [];
      showSection('quiz-section');
      renderQuestion();
    }

    function renderQuestion() {
      const q = questions[quizIndex];
      const total = questions.length;
      document.getElementById('quiz-current').textContent = String(quizIndex + 1);
      document.getElementById('quiz-total').textContent = String(total);
      document.getElementById('quiz-progress').style.width = ((quizIndex + 1) / total * 100) + '%';
      document.getElementById('quiz-dimension').textContent = DICHOTOMY_LABELS[q.dichotomy] || q.dichotomy;
      document.getElementById('quiz-question').textContent = q.text;
      document.getElementById('quiz-option-a').textContent = q.optionA;
      document.getElementById('quiz-option-b').textContent = q.optionB;
      const qEl = document.getElementById('quiz-question');
      qEl.classList.remove('section-enter');
      void qEl.offsetWidth;
      qEl.classList.add('section-enter');
      document.getElementById('quiz-back-btn').disabled = quizIndex === 0;
    }

    function answerQuiz(choice) {
      const q = questions[quizIndex];
      const letter = choice === 'A' ? q.aScore : q.bScore;
      if (quizAnswers[quizIndex]) quizScores[quizAnswers[quizIndex]] -= 1;
      quizScores[letter] += 1;
      quizAnswers[quizIndex] = letter;
      if (quizIndex < questions.length - 1) {
        quizIndex += 1;
        renderQuestion();
      } else {
        finishQuiz();
      }
    }

    function quizGoBack() {
      if (quizIndex <= 0) return;
      quizIndex -= 1;
      renderQuestion();
    }

    function finishQuiz() {
      const type =
        (quizScores.E >= quizScores.I ? 'E' : 'I') +
        (quizScores.S >= quizScores.N ? 'S' : 'N') +
        (quizScores.T >= quizScores.F ? 'T' : 'F') +
        (quizScores.J >= quizScores.P ? 'J' : 'P');
      applyTypeAndShowResults(type);
    }

    function applyTypeAndShowResults(type) {
      currentType = type;
      const data = mbtiData[type];
      const titleEl = document.getElementById('results-type-title');
      const descEl = document.getElementById('results-type-desc');
      
      const profile = (typeof typeProfiles !== 'undefined' && typeProfiles[type]) ? typeProfiles[type] : {};
      const displayName = profile.fullName || (data && data.fullName) || type;
      if (data || profile.fullName) {
        if (titleEl) titleEl.textContent = type + ' — ' + displayName;
        if (descEl) descEl.textContent = profile.lead || (data && data.shortDescription) || '';
      } else {
        if (titleEl) titleEl.textContent = type || 'Type';
        if (descEl) descEl.textContent = 'Select your type to see personalized recommendations.';
      }
      try { fillTypeProfile(type); } catch (e) { console.warn(e); }
      
      searchTermOffset = 0;
      songOffset = 0;
      
      // Stop and clear previous music playback if switching profiles
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      playingSongKey = null; 
      
      // Reset play/pause button state in mini player
      const playBtn = document.getElementById('player-play-btn');
      if (playBtn) {
        playBtn.disabled = true;
        playBtn.innerHTML = `<svg class="w-3.5 h-3.5 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
        playBtn.setAttribute('title', 'Select a song track above to begin playback');
      }
      const playerTitle = document.getElementById('player-title');
      const playerArtist = document.getElementById('player-artist');
      if (playerTitle) playerTitle.textContent = "Select a track";
      if (playerArtist) playerArtist.textContent = "Curated for your state of mind";
      const visualizerStatus = document.getElementById('visualizer-status');
      if (visualizerStatus) {
        visualizerStatus.classList.remove('playing');
      }
      
      showSection('results-section');
      try { updatePrefsStatus(); } catch (e) { console.warn(e); }
      loadAndRenderMovies();
      try { renderSongs(); } catch (e) { console.error(e); }
    }

    function debugRandomType() {
      const types = Object.keys(mbtiData);
      const random = types[Math.floor(Math.random() * types.length)];
      applyTypeAndShowResults(random);
    }

    // Manual Type Selector — 16 type cards
    function renderTypeCards() {
      const grid = document.getElementById('type-cards-grid');
      if (!grid) return;
      const order = ['INFP','INTJ','INFJ','INTP','ENFP','ENTJ','ENTP','ENFJ','ISFJ','ISFP','ISTJ','ISTP','ESFJ','ESFP','ESTJ','ESTP'];
      grid.innerHTML = order.map((code) => {
        const p = typeProfiles[code] || {};
        const name = p.fullName || (mbtiData[code] && mbtiData[code].fullName) || code;
        const blurb = p.blurb || '';
        return `
          <button type="button" onclick="selectType('${code}')"
            class="card card-hover text-left p-5 rounded-xl border-pearl/10 hover:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent transition-all duration-[330ms]">
            <div class="flex items-baseline justify-between gap-2 mb-2">
              <span class="font-display text-xl font-semibold text-pearl tracking-wide">${code}</span>
              <span class="text-[10px] font-mono uppercase tracking-widest text-accent">${escapeHtml(String(name).replace(/^The /, ''))}</span>
            </div>
            <p class="text-[11px] font-mono text-pearl/35 uppercase tracking-wider mb-2">${escapeHtml(name)}</p>
            <p class="text-sm text-pearl/55 leading-relaxed">${escapeHtml(blurb)}</p>
          </button>`;
      }).join('');
    }

    function selectType(code) {
      if (!code || !mbtiData[code]) return;
      applyTypeAndShowResults(code);
    }

    function fillTypeProfile(type) {
      const p = typeProfiles[type] || {};
      const data = mbtiData[type] || {};
      const name = p.fullName || data.fullName || type;
      const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ''; };

      setText('summary-type-code', type || '----');
      setText('summary-type-name', name ? (type + ' · ' + name) : type);
      setText('summary-type-blurb', p.lead || data.shortDescription || '');
      setText('deep-profile-heading', name ? (type + ' — ' + name) : (type || 'About this type'));
      setText('deep-profile-lead', p.lead || data.shortDescription || '');
      setText('profile-overview', p.overview || data.shortDescription || '');
      setText('profile-nutshell', p.nutshell || '');
      setText('profile-careers', p.careers || '');
      setText('profile-relationships', p.relationships || '');
      setText('profile-others', p.others || '');
      setText('profile-famous', p.famous || '');

      const traits = document.getElementById('summary-traits');
      if (traits) {
        traits.innerHTML = (p.traits || []).map((t) =>
          '<span class="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-pearl/10 text-pearl/50 bg-pearl/[0.03]">' + escapeHtml(t) + '</span>'
        ).join('');
      }

      const fillList = (id, arr) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = (arr || []).map((item) => '<li>' + escapeHtml(item) + '</li>').join('') || '<li class="list-none text-pearl/35">—</li>';
      };
      fillList('profile-strengths', p.strengths);
      fillList('profile-growth', p.growth);
      fillList('profile-facts', p.facts);
    }

    function showRecommendations() {
      if (currentType) applyTypeAndShowResults(currentType);
    }

    // Persistence Serialization
    function getLiked(type) {
      try {
        const raw = JSON.parse(localStorage.getItem('liked_' + type) || '[]');
        if (!Array.isArray(raw)) return [];
        return raw.map((item) => {
          if (typeof item === 'string') return { imdbID: item, Title: '', Genre: '' };
          return {
            imdbID: item.imdbID || '',
            Title: item.Title || '',
            Genre: item.Genre || '',
          };
        }).filter((x) => x.imdbID);
      } catch {
        return [];
      }
    }

    function updatePrefsStatus() {
      const el = document.getElementById('prefs-status');
      if (!el) return;
      if (!currentType) {
        el.textContent = '';
        return;
      }
      const likedN = getLiked(currentType).length;
      const dislikedN = getDisliked(currentType).length;
      if (likedN === 0 && dislikedN === 0) {
        el.textContent = '';
      } else {
        el.textContent = likedN + ' liked · ' + dislikedN + ' hidden for ' + currentType + ' (saved on this device)';
      }
    }

    // Dynamic Visual Notifications
    let toastTimer = null;
    function showToast(message) {
      const el = document.getElementById('toast');
      if (!el) return;
      el.textContent = message;
      el.classList.remove('opacity-0', 'translate-y-2');
      el.classList.add('opacity-100', 'translate-y-0');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        el.classList.remove('opacity-100', 'translate-y-0');
        el.classList.add('opacity-0', 'translate-y-2');
      }, 2400);
    }

    // Movie Reactions
    function likeMovie(imdbID, title, genre) {
      if (!currentType || !imdbID) return;

      let liked = getLiked(currentType);
      let disliked = getDisliked(currentType);

      disliked = disliked.filter((id) => id !== imdbID);
      setDisliked(currentType, disliked);

      const existing = liked.findIndex((x) => x.imdbID === imdbID);
      const entry = {
        imdbID,
        Title: title || '',
        Genre: genre || '',
      };
      if (existing >= 0) {
        liked[existing] = { ...liked[existing], ...entry };
      } else {
        liked.push(entry);
      }
      setLiked(currentType, liked);

      const card = document.querySelector(`[data-imdb="${imdbID}"]`);
      if (card) {
        card.classList.add('ring-1', 'ring-accent/40');
        card.querySelector('.like-btn')?.classList.add('bg-accent/10', 'border-accent', 'text-pearl');
      }
      updatePrefsStatus();
      showToast(title ? `Liked: ${title}` : 'Added to likes');
    }

    function dislikeMovie(imdbID, title) {
      if (!currentType || !imdbID) return;

      let liked = getLiked(currentType);
      let disliked = getDisliked(currentType);

      liked = liked.filter((x) => x.imdbID !== imdbID);
      setLiked(currentType, liked);

      if (!disliked.includes(imdbID)) disliked.push(imdbID);
      setDisliked(currentType, disliked);

      const card = document.querySelector(`[data-imdb="${imdbID}"]`);
      if (card) {
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateX(12px)';
        setTimeout(() => card.remove(), 260);
      }
      updatePrefsStatus();
      showToast(title ? `Hidden: ${title}` : 'Removed from view');
    }

    function clearPreferences() {
      if (!currentType) return;
      if (!confirm(`Clear all likes and dislikes for ${currentType}?`)) return;
      localStorage.removeItem('liked_' + currentType);
      localStorage.removeItem('disliked_' + currentType);
      searchTermOffset = 0;
      updatePrefsStatus();
      showToast('Preferences cleared for ' + currentType);
      loadAndRenderMovies();
    }

    // ─── Share feature ───────────────────────────────────────────────────────
    function getTopMoviesForShare() {
      const cards = document.querySelectorAll('#movies-list article[data-imdb]');
      const result = [];
      cards.forEach((card, i) => {
        if (i >= 2) return;
        const title = card.querySelector('h4')?.textContent?.trim() || '';
        const year = card.querySelector('.font-mono')?.textContent?.trim() || '';
        if (title) result.push({ title, year });
      });
      return result;
    }

    function getTopSongsForShare() {
      const { page } = getSongPage();
      return (page || []).slice(0, 2).map(({ song }) => ({
        title: song.title,
        artist: song.artist
      }));
    }

    function buildSharePayload() {
      if (!currentType) return null;
      const data = mbtiData[currentType] || {};
      const profile = typeProfiles[currentType] || {};
      const fullName = profile.fullName || data.fullName || currentType;
      const movies = getTopMoviesForShare();
      const songs = getTopSongsForShare();
      const appUrl = window.location.origin + window.location.pathname;

      let text = `I'm an ${currentType} – ${fullName} on MBTI Vibe\n\n`;

      if (movies.length) {
        text += `Movies that fit me:\n`;
        movies.forEach(m => {
          text += `• ${m.title}${m.year ? ` (${m.year})` : ''}\n`;
        });
        text += `\n`;
      }

      if (songs.length) {
        text += `Soundtrack vibe:\n`;
        songs.forEach(s => {
          text += `• ${s.title} – ${s.artist}\n`;
        });
        text += `\n`;
      }

      text += `Find your type + recommendations → ${appUrl}`;
      return { text, appUrl, fullName, movies, songs };
    }

    function openShareModal() {
      const modal = document.getElementById('share-modal');
      if (!modal) return;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeShareModal() {
      const modal = document.getElementById('share-modal');
      if (!modal) return;
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      modal.setAttribute('aria-hidden', 'true');
    }

    async function shareResults() {
      if (!currentType) {
        showToast('Pick a type first');
        return;
      }
      openShareModal();
    }

    async function doNativeShare() {
      const payload = buildSharePayload();
      if (!payload) return;
      closeShareModal();
      try {
        if (navigator.share) {
          await navigator.share({
            title: `I'm an ${currentType} on MBTI Vibe`,
            text: payload.text,
            url: payload.appUrl
          });
        } else {
          await navigator.clipboard.writeText(payload.text);
          showToast('Profile copied to clipboard');
        }
      } catch (err) {
        if (err?.name !== 'AbortError') showToast('Sharing failed');
      }
    }

    function doTwitterShare() {
      const payload = buildSharePayload();
      if (!payload) return;
      closeShareModal();
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(payload.text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    async function doCopyShare() {
      const payload = buildSharePayload();
      if (!payload) return;
      closeShareModal();
      try {
        await navigator.clipboard.writeText(payload.text);
        showToast('Share text copied');
      } catch {
        showToast('Could not copy');
      }
    }

    function doDownloadCard() {
      const payload = buildSharePayload();
      if (!payload) return;
      closeShareModal();

      const W = 1200;
      const H = 630;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#0c0c0e';
      ctx.fillRect(0, 0, W, H);

      const grad = ctx.createRadialGradient(W * 0.8, H * 0.2, 0, W * 0.8, H * 0.2, 400);
      grad.addColorStop(0, 'rgba(206,76,70,0.25)');
      grad.addColorStop(1, 'rgba(206,76,70,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#ce4c46';
      ctx.fillRect(0, 0, 12, H);

      ctx.fillStyle = '#edeae0';
      ctx.font = '700 72px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(currentType, 80, 140);

      ctx.fillStyle = 'rgba(237,234,224,0.7)';
      ctx.font = '500 36px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(payload.fullName, 80, 195);

      ctx.strokeStyle = 'rgba(237,234,224,0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 230);
      ctx.lineTo(W - 80, 230);
      ctx.stroke();

      ctx.fillStyle = '#ce4c46';
      ctx.font = '600 18px system-ui, sans-serif';
      ctx.fillText('MOVIES', 80, 290);
      ctx.fillStyle = '#edeae0';
      ctx.font = '500 28px "Cormorant Garamond", Georgia, serif';
      payload.movies.forEach((m, i) => {
        const label = m.year ? `${m.title} (${m.year})` : m.title;
        ctx.fillText(label, 80, 335 + i * 42);
      });

      ctx.fillStyle = '#ce4c46';
      ctx.font = '600 18px system-ui, sans-serif';
      ctx.fillText('SOUNDTRACK', 80, 450);
      ctx.fillStyle = '#edeae0';
      ctx.font = '500 28px "Cormorant Garamond", Georgia, serif';
      payload.songs.forEach((s, i) => {
        ctx.fillText(`${s.title} – ${s.artist}`, 80, 495 + i * 42);
      });

      ctx.fillStyle = 'rgba(237,234,224,0.45)';
      ctx.font = '500 20px system-ui, sans-serif';
      ctx.fillText('MBTI Vibe  ·  ' + payload.appUrl.replace(/^https?:\/\//, ''), 80, H - 50);

      const link = document.createElement('a');
      link.download = `mbti-vibe-${currentType}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Card downloaded');
    }

    // OMDb Query Orchestration
    const JUNK_TITLE_RE = /\b(making(\s+of|\s+the)?|behind\s+the\s+scenes|featurette|deleted\s+scenes?|bonus\s+(disc|feature|track|content)|special\s+edition|imax\s+experience|documentary|docuseries|annotated|explained|trivia|recap|reaction|review|trailer|teaser|promo|outtakes?|blooper|gag\s+reel|cast\s+interview|press\s+junket|fan\s+film|fanfilm|re[- ]?cut|extended\s+cut\s+of|a\s+glitch\s+in|glitch\s+in\s+the|the\s+making|making\s+the|unboxing|watchalong|revisited|retrospective|tribute|parody|porn|xxx|sex\s+and\s+the)\b/i;

    const STOP_WORDS = new Set([
      'the','a','an','of','and','or','in','on','at','to','for','with','from','by',
      'part','vol','volume','chapter','episode','movie','film','story','life'
    ]);

    function normalizeTitle(title) {
      return String(title || '')
        .toLowerCase()
        .replace(/[:\-–,.]/g, ' ')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function titleTokens(title) {
      return normalizeTitle(title).split(' ').filter((w) => w.length > 2 && !STOP_WORDS.has(w));
    }

    function isJunkTitle(title) {
      const t = String(title || '');
      if (!t.trim()) return true;
      if (JUNK_TITLE_RE.test(t)) return true;
      const lower = t.toLowerCase();
      // Common non-feature patterns
      if (/^making\b/i.test(t)) return true;
      if (/\b(making the|the making of)\b/i.test(t)) return true;
      if (/\ba glitch in\b/i.test(t)) return true;
      if (/\b(episode|season)\s*\d/i.test(t)) return true;
      if (/\b(part|vol\.?)\s*\d+\s*$/i.test(t) && t.length < 18) return true;
      // Extremely long "meta" titles are often docs/compilations
      if (t.length > 90) return true;
      return false;
    }

    function hasValidPoster(poster) {
      if (!poster || poster === 'N/A') return false;
      const p = String(poster).trim();
      if (!/^https?:\/\//i.test(p)) return false;
      if (/null|undefined|placeholder/i.test(p)) return false;
      return true;
    }

    function titlesAreNearDuplicate(a, b) {
      const na = normalizeTitle(a);
      const nb = normalizeTitle(b);
      if (!na || !nb) return false;
      if (na === nb) return true;
      // Prefix sequel / variant: "blade runner" vs "blade runner 2049"
      if (na.startsWith(nb + ' ') || nb.startsWith(na + ' ')) return true;
      const ta = titleTokens(a);
      const tb = titleTokens(b);
      if (!ta.length || !tb.length) return false;
      // Shared head keyword = same franchise family (Matrix, Matrix Reloaded, etc.)
      if (ta[0] && ta[0] === tb[0]) return true;
      const setA = new Set(ta);
      const setB = new Set(tb);
      let shared = 0;
      for (const w of setA) if (setB.has(w)) shared++;
      const minLen = Math.min(setA.size, setB.size);
      if (minLen >= 1 && shared === minLen) return true;
      if (Math.max(setA.size, setB.size) > 0 && shared / Math.max(setA.size, setB.size) >= 0.8) return true;
      return false;
    }

    function primaryKeyword(title) {
      const tokens = titleTokens(title);
      return tokens[0] || normalizeTitle(title).slice(0, 12);
    }

    async function omdbSearch(query) {
      const url = `${OMDB_BASE}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network error ' + res.status);
      const data = await res.json();
      if (data.Response === 'False') return [];
      return (data.Search || []).filter((item) => {
        if (!item || item.Type && item.Type !== 'movie') return false;
        if (isJunkTitle(item.Title)) return false;
        if (!hasValidPoster(item.Poster)) return false;
        return true;
      });
    }

    // Exact title lookup — preferred for seed movies (avoids "Making the Matrix" noise)
    async function omdbByTitle(title) {
      const url = `${OMDB_BASE}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&type=movie&plot=short`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network error ' + res.status);
      const data = await res.json();
      if (data.Response === 'False') return null;
      if (data.Type && data.Type !== 'movie') return null;
      if (isJunkTitle(data.Title)) return null;
      // Reject pure documentaries unless the seed was explicitly that title
      const genre = String(data.Genre || '').toLowerCase();
      if (genre === 'documentary' || genre.startsWith('documentary,')) return null;
      if (!hasValidPoster(data.Poster)) return null;
      return {
        Title: data.Title,
        Year: data.Year,
        imdbID: data.imdbID,
        Poster: data.Poster,
        Plot: data.Plot && data.Plot !== 'N/A' ? data.Plot : '',
        imdbRating: data.imdbRating && data.imdbRating !== 'N/A' ? data.imdbRating : null,
        Genre: data.Genre && data.Genre !== 'N/A' ? data.Genre : '',
        Type: data.Type || 'movie',
      };
    }

    async function omdbDetails(imdbID) {
      const url = `${OMDB_BASE}?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(imdbID)}&plot=short`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network error ' + res.status);
      const data = await res.json();
      if (data.Response === 'False') return null;
      if (data.Type && data.Type !== 'movie') return null;
      if (isJunkTitle(data.Title)) return null;
      const genre = String(data.Genre || '').toLowerCase();
      if (genre === 'documentary' || (genre.includes('documentary') && !genre.includes('drama') && !genre.includes('biography'))) {
        return null;
      }
      if (!hasValidPoster(data.Poster)) return null;
      return {
        Title: data.Title,
        Year: data.Year,
        imdbID: data.imdbID,
        Poster: data.Poster,
        Plot: data.Plot && data.Plot !== 'N/A' ? data.Plot : '',
        imdbRating: data.imdbRating && data.imdbRating !== 'N/A' ? data.imdbRating : null,
        Genre: data.Genre && data.Genre !== 'N/A' ? data.Genre : '',
        Type: data.Type || 'movie',
      };
    }

    function getDisliked(type) {
      try {
        const raw = JSON.parse(localStorage.getItem('disliked_' + type) || '[]');
        if (!Array.isArray(raw)) return [];
        return raw.map((item) => (typeof item === 'string' ? item : item.imdbID)).filter(Boolean);
      } catch {
        return [];
      }
    }

    function setLiked(type, arr) {
      localStorage.setItem('liked_' + type, JSON.stringify(arr));
    }

    function setDisliked(type, arr) {
      localStorage.setItem('disliked_' + type, JSON.stringify(arr));
    }

    // Movie recommendation engine
    async function fetchMovies() {
      if (!currentType || !mbtiData[currentType]) return [];

      // Short-term session cache so mobile doesn't re-hit OMDb on every tab switch / back
      const cacheKey = 'mv_cache_' + currentType + '_' + searchTermOffset;
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length) return parsed;
        }
      } catch (_) {}

      const data = mbtiData[currentType];
      const likedList = getLiked(currentType);
      const dislikedSet = new Set(getDisliked(currentType));
      const likedIds = new Set(likedList.map((x) => x.imdbID));

      const seedMovies = (data.seedMovies || []).filter(Boolean);
      const searchTerms = (data.searchTerms || []).filter(Boolean);
      // Prefer exact seeds first, then broader search terms
      const baseTerms = [...seedMovies, ...searchTerms];

      const seenIds = new Set();
      const selectedTitles = [];
      const keywordCounts = Object.create(null);
      const candidates = [];
      const MAX_RESULTS = 10;
      const MAX_PER_KEYWORD = 1; // prevent Matrix / Matrix / Glitch-in-Matrix piles

      function canAcceptTitle(title) {
        if (isJunkTitle(title)) return false;
        for (const sel of selectedTitles) {
          if (titlesAreNearDuplicate(title, sel)) return false;
        }
        const key = primaryKeyword(title);
        if (key && (keywordCounts[key] || 0) >= MAX_PER_KEYWORD) return false;
        return true;
      }

      function acceptCandidate(item) {
        if (!item || !item.imdbID) return false;
        if (seenIds.has(item.imdbID)) return false;
        if (dislikedSet.has(item.imdbID)) return false;
        if (!hasValidPoster(item.Poster)) return false;
        if (!canAcceptTitle(item.Title)) return false;
        seenIds.add(item.imdbID);
        selectedTitles.push(item.Title);
        const key = primaryKeyword(item.Title);
        if (key) keywordCounts[key] = (keywordCounts[key] || 0) + 1;
        candidates.push(item);
        return true;
      }

      // 1) Exact title hits from seeds (clean posters, no search noise)
      const seedSlice = [];
      for (let i = 0; i < seedMovies.length && seedSlice.length < 6; i++) {
        const idx = (searchTermOffset + i) % seedMovies.length;
        const title = seedMovies[idx];
        if (title && !seedSlice.includes(title)) seedSlice.push(title);
      }
      // Always include a couple of liked titles as exact lookups when available
      for (const item of likedList) {
        if (item.Title && seedSlice.length < 8 && !seedSlice.includes(item.Title)) {
          seedSlice.push(item.Title);
        }
      }

      const exactHits = await Promise.all(
        seedSlice.map((title) => omdbByTitle(title).catch(() => null))
      );
      for (const hit of exactHits) {
        if (candidates.length >= MAX_RESULTS) break;
        if (hit) acceptCandidate(hit);
      }

      // 2) Broader search for diversity, still filtered hard
      const queries = [];
      const QUERY_BATCH = 6;
      for (let i = 0; i < baseTerms.length && queries.length < QUERY_BATCH; i++) {
        const idx = (searchTermOffset + i * 2) % Math.max(baseTerms.length, 1);
        const t = baseTerms[idx];
        if (t && !queries.includes(t) && !seedSlice.includes(t)) queries.push(t);
      }
      // Fill remaining query slots from searchTerms with stride for variety
      for (let i = 0; i < searchTerms.length && queries.length < QUERY_BATCH; i++) {
        const idx = (searchTermOffset + 3 + i * 3) % searchTerms.length;
        const t = searchTerms[idx];
        if (t && !queries.includes(t)) queries.push(t);
      }

      if (candidates.length < MAX_RESULTS && queries.length) {
        const searchResults = await Promise.all(
          queries.map((q) => omdbSearch(q).catch(() => []))
        );

        // Prefer exact / close title matches to the query first
        for (let qi = 0; qi < searchResults.length; qi++) {
          const q = normalizeTitle(queries[qi]);
          const list = searchResults[qi] || [];
          const ranked = list.slice().sort((a, b) => {
            const na = normalizeTitle(a.Title);
            const nb = normalizeTitle(b.Title);
            const score = (n) => (n === q ? 0 : n.startsWith(q) || q.startsWith(n) ? 1 : 2);
            return score(na) - score(nb);
          });
          for (const item of ranked) {
            if (candidates.length >= MAX_RESULTS) break;
            // Skip weak partial matches that only share one junk token
            acceptCandidate(item);
          }
        }
      }

      // 3) Details pass — drop anything that fails poster / type / junk checks again
      const toFetch = candidates.filter((c) => c.imdbID).slice(0, MAX_RESULTS);
      // Items from omdbByTitle already have full detail; only fetch missing plots for search hits
      const detailed = await Promise.all(
        toFetch.map(async (c) => {
          if (c.Plot !== undefined && c.Genre !== undefined && hasValidPoster(c.Poster)) {
            // Already a full detail object from omdbByTitle
            if (isJunkTitle(c.Title) || dislikedSet.has(c.imdbID)) return null;
            return c;
          }
          return omdbDetails(c.imdbID).catch(() => null);
        })
      );

      let movies = detailed.filter((m) => {
        if (!m || !m.imdbID) return false;
        if (!hasValidPoster(m.Poster)) return false;
        if (isJunkTitle(m.Title)) return false;
        if (dislikedSet.has(m.imdbID)) return false;
        return true;
      });

      // Final diversity pass on the detailed set
      const final = [];
      const finalTitles = [];
      const finalKeys = Object.create(null);
      for (const m of movies) {
        let dup = false;
        for (const t of finalTitles) {
          if (titlesAreNearDuplicate(m.Title, t)) { dup = true; break; }
        }
        if (dup) continue;
        const key = primaryKeyword(m.Title);
        if (key && (finalKeys[key] || 0) >= MAX_PER_KEYWORD) continue;
        finalTitles.push(m.Title);
        if (key) finalKeys[key] = (finalKeys[key] || 0) + 1;
        final.push(m);
      }
      movies = final;

      // Sort: liked first, then by rating when available
      movies.sort((a, b) => {
        const aL = likedIds.has(a.imdbID) ? 1 : 0;
        const bL = likedIds.has(b.imdbID) ? 1 : 0;
        if (bL !== aL) return bL - aL;
        const aR = parseFloat(a.imdbRating) || 0;
        const bR = parseFloat(b.imdbRating) || 0;
        return bR - aR;
      });

      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(movies));
      } catch (_) {}

      return movies;
    }

    function showMoviesLoading() {
      const list = document.getElementById('movies-list');
      const count = document.getElementById('movies-count');
      const btn = document.getElementById('movies-load-more');
      if (count) count.textContent = 'Refreshing';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Loading...';
      }
      if (list) {
        list.innerHTML = `
          <div class="flex flex-col items-center justify-center py-16 gap-4">
            <div class="w-6 h-6 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
            <p class="text-xs text-pearl/40 uppercase tracking-widest">Finding cinematic matches</p>
          </div>`;
      }
    }

    function showMoviesError(msg) {
      const list = document.getElementById('movies-list');
      const count = document.getElementById('movies-count');
      const btn = document.getElementById('movies-load-more');
      if (count) count.textContent = 'Error';
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Retry';
      }
      if (list) {
        list.innerHTML = `
          <div class="card rounded-xl p-8 text-center border-accent/20">
            <p class="text-sm text-pearl/60 mb-4">${msg || 'Could not fetch movies.'}</p>
            <button onclick="refreshMovies()" class="text-xs font-mono text-accent hover:text-pearl uppercase tracking-widest transition-colors">Retry Search</button>
          </div>`;
      }
    }

    function renderMovies(movies) {
      const list = document.getElementById('movies-list');
      const count = document.getElementById('movies-count');
      const btn = document.getElementById('movies-load-more');
      const likedIds = currentType
        ? new Set(getLiked(currentType).map((x) => x.imdbID))
        : new Set();

      // Never render cards without a real poster URL
      const safeMovies = (movies || []).filter(
        (m) => m && m.imdbID && m.Poster && m.Poster !== 'N/A' && /^https?:\/\//i.test(m.Poster)
      );

      if (count) count.textContent = safeMovies.length ? `${safeMovies.length} matches` : 'No matches';
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Load More Recommendations';
      }
      updatePrefsStatus();

      if (!list) return;

      if (!safeMovies.length) {
        list.innerHTML = `
          <div class="card rounded-xl p-8 text-center text-sm text-pearl/40 border-pearl/10">
            No solid movie matches with artwork found. Try Refresh for another set.
          </div>`;
        return;
      }

      list.innerHTML = safeMovies.map((m, idx) => {
        const isLiked = likedIds.has(m.imdbID);
        // Proxy via images.weserv.nl: WebP, max 300×450, edge-cached — much faster on mobile than raw Amazon URLs
        const rawPoster = (m.Poster && m.Poster !== 'N/A') ? m.Poster : '';
        const posterUrl = rawPoster
          ? `https://images.weserv.nl/?url=${encodeURIComponent(rawPoster.replace(/^https?:\/\//i, ''))}&w=300&h=450&fit=cover&output=webp&q=80&default=1`
          : '';
        const loadingAttr = idx < 4 ? 'eager' : 'lazy';
        const prioAttr = idx < 2 ? ' fetchpriority="high"' : '';
        const poster = posterUrl
          ? `<div class="relative w-full h-full bg-canvas rounded-lg overflow-hidden select-none">
              <img src="${posterUrl}" alt="${escapeAttr(m.Title)} poster" class="absolute inset-0 w-full h-full object-cover z-10" loading="${loadingAttr}" decoding="async"${prioAttr} referrerpolicy="no-referrer" onerror="this.onerror=null;this.remove();" />
              <div class="absolute inset-0 flex items-center justify-center text-pearl/25 pointer-events-none" aria-hidden="true">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg>
              </div>
             </div>`
          : `<div class="w-full h-full flex items-center justify-center text-pearl/25 bg-canvas select-none pointer-events-none" aria-hidden="true">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg>
            </div>`;
        const rating = m.imdbRating
          ? `<span class="inline-flex items-center gap-1.5 text-xs text-accent"><svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><span class="font-semibold text-pearl">${m.imdbRating}</span></span>`
          : '';
        const genreTags = m.Genre
          ? m.Genre.split(',').slice(0, 2).map((g) =>
              `<span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pearl/5 text-pearl/50 border border-pearl/5">${escapeHtml(g.trim())}</span>`
            ).join('')
          : '';
        const ringClass = isLiked ? 'ring-1 ring-accent/40 bg-accent/[0.01]' : '';

        return `
          <article data-imdb="${m.imdbID}" class="card card-hover flex gap-5 p-4 rounded-xl transition-all duration-[330ms] ${ringClass} border-pearl/10">
            <div class="w-20 sm:w-24 shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-canvas border border-pearl/10">
              ${poster}
            </div>
            <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <h4 class="font-display font-semibold text-pearl text-base truncate">${escapeHtml(m.Title)}</h4>
                <div class="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span class="text-xs text-pearl/40 font-mono">${escapeHtml(m.Year || '')}</span>
                  ${rating}
                </div>
                <p class="text-xs text-pearl/50 mt-3 line-clamp-2 leading-relaxed">${escapeHtml(m.Plot || '')}</p>
              </div>
              
              <div class="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-pearl/5 flex-wrap">
                <div class="flex items-center gap-1.5">${genreTags}</div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="btn-tactile like-btn text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded border border-pearl/10 text-pearl/50 hover:border-accent hover:text-pearl transition-colors duration-200 ${isLiked ? 'bg-accent/10 border-accent text-pearl' : ''}"
                    onclick="likeMovie('${m.imdbID}', '${escapeAttr(m.Title)}', '${escapeAttr(m.Genre || '')}')"
                    aria-label="Like ${escapeAttr(m.Title)}"
                    aria-pressed="${isLiked ? 'true' : 'false'}"
                  >
                    Like
                  </button>
                  <button
                    type="button"
                    class="btn-tactile dislike-btn text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded border border-pearl/10 text-pearl/50 hover:border-accent hover:text-pearl transition-colors duration-200"
                    onclick="dislikeMovie('${m.imdbID}', '${escapeAttr(m.Title)}')"
                    aria-label="Hide ${escapeAttr(m.Title)}"
                  >
                    Hide
                  </button>
                </div>
              </div>
            </div>
          </article>`;
      }).join('');
    }

    // Soundtrack playlist with refresh / load-more paging
    function getSongPage() {
      if (!currentType || !mbtiData[currentType]) return { page: [], total: 0, pageIndex: 0, pageCount: 0 };
      const all = mbtiData[currentType].songs || [];
      const total = all.length;
      if (!total) return { page: [], total: 0, pageIndex: 0, pageCount: 0 };
      const pageCount = Math.max(1, Math.ceil(total / SONGS_PAGE_SIZE));
      const pageIndex = ((songOffset % total) + total) % total;
      // take SONGS_PAGE_SIZE tracks wrapping around the pool
      const page = [];
      for (let i = 0; i < Math.min(SONGS_PAGE_SIZE, total); i++) {
        page.push({ song: all[(pageIndex + i) % total], absoluteIndex: (pageIndex + i) % total });
      }
      return { page, total, pageIndex, pageCount };
    }

    function updateSongsStatus() {
      const countEl = document.getElementById('songs-count');
      const statusEl = document.getElementById('songs-page-status');
      const { page, total, pageIndex, pageCount } = getSongPage();
      if (countEl) {
        countEl.textContent = total ? `${page.length} of ${total} tracks` : 'No tracks';
      }
      if (statusEl) {
        if (!total) {
          statusEl.textContent = '';
        } else {
          const setNum = Math.floor(pageIndex / SONGS_PAGE_SIZE) % pageCount + 1;
          statusEl.textContent = `Set ${setNum} of ${pageCount} · Refresh for another vibe`;
        }
      }
    }

    function refreshSongs() {
      if (!currentType || !mbtiData[currentType]) return;
      const total = (mbtiData[currentType].songs || []).length;
      if (!total) return;

      // Advance by one page; wrap through the full pool
      songOffset = (songOffset + SONGS_PAGE_SIZE) % total;

      // Stop playback if current track leaves the visible set
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      playingSongKey = null;
      const playBtn = document.getElementById('player-play-btn');
      const playerTitle = document.getElementById('player-title');
      const playerArtist = document.getElementById('player-artist');
      const visualizerStatus = document.getElementById('visualizer-status');
      if (playBtn) {
        playBtn.disabled = true;
        playBtn.innerHTML = `<svg class="w-3.5 h-3.5 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
      }
      if (playerTitle) playerTitle.textContent = 'Select a track';
      if (playerArtist) playerArtist.textContent = 'Curated for your state of mind';
      if (visualizerStatus) visualizerStatus.classList.remove('playing');

      renderSongs();
      showToast('New soundtrack set loaded');
    }

    function shuffleSongs() {
      if (!currentType || !mbtiData[currentType]) return;
      const total = (mbtiData[currentType].songs || []).length;
      if (!total) return;
      // Random start index within the pool
      songOffset = Math.floor(Math.random() * total);
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      playingSongKey = null;
      const playBtn = document.getElementById('player-play-btn');
      const playerTitle = document.getElementById('player-title');
      const playerArtist = document.getElementById('player-artist');
      const visualizerStatus = document.getElementById('visualizer-status');
      if (playBtn) {
        playBtn.disabled = true;
        playBtn.innerHTML = `<svg class="w-3.5 h-3.5 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
      }
      if (playerTitle) playerTitle.textContent = 'Select a track';
      if (playerArtist) playerArtist.textContent = 'Curated for your state of mind';
      if (visualizerStatus) visualizerStatus.classList.remove('playing');
      renderSongs();
      showToast('Shuffled to a new vibe');
    }

    function renderSongs() {
      const list = document.getElementById('songs-list');
      if (!list || !currentType || !mbtiData[currentType]) return;

      const profile = mbtiData[currentType];
      const { page, total } = getSongPage();
      updateSongsStatus();

      if (!total) {
        list.innerHTML = `
          <div class="card rounded-xl p-6 text-center text-sm text-pearl/40 border-pearl/10">
            No audio recommendations found for this type.
          </div>`;
        return;
      }

      list.innerHTML = page.map(({ song, absoluteIndex }, idx) => {
        const songKey = `${currentType}_${absoluteIndex}`;
        const isPlaying = (playingSongKey === songKey);
        const cardClass = isPlaying ? 'ring-1 ring-accent/40 bg-accent/[0.02] border-accent/30' : 'border-pearl/10';

        // Map unique SoundHelix loops from type + absolute index + page offset
        const mbtiOffset = currentType.charCodeAt(0) + currentType.charCodeAt(1);
        const songNumber = ((absoluteIndex + mbtiOffset + songOffset) % 16) + 1;
        const mp3Url = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${songNumber}.mp3`;

        const isCurrentlyPlaying = isPlaying && currentAudio && !currentAudio.paused;
        const visualizerClass = isCurrentlyPlaying ? 'playing' : '';

        const visualizer = isPlaying ? `
          <div class="flex items-end gap-[2px] w-3.5 h-3.5 shrink-0 ${visualizerClass}" aria-hidden="true">
            <span class="visualizer-bar w-[2px] h-3 bg-accent rounded-full"></span>
            <span class="visualizer-bar w-[2px] h-3.5 bg-accent rounded-full"></span>
            <span class="visualizer-bar w-[2px] h-1.5 bg-accent rounded-full"></span>
            <span class="visualizer-bar w-[2px] h-2.5 bg-accent rounded-full"></span>
          </div>` : `
          <svg class="w-3.5 h-3.5 text-pearl/30 group-hover:text-accent transition-colors shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>`;

        const genre = (profile.songGenres && profile.songGenres.length)
          ? profile.songGenres[absoluteIndex % profile.songGenres.length]
          : '';

        const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(song.artist + ' ' + song.title)}`;

        return `
          <div 
            class="card card-hover flex items-center justify-between p-4 rounded-xl group transition-all duration-[330ms] ${cardClass}"
          >
            <div class="flex items-center gap-4 min-w-0 flex-1 cursor-pointer" onclick="playSong('${songKey}', '${escapeAttr(song.title)}', '${escapeAttr(song.artist)}', '${mp3Url}', '${escapeAttr(spotifyUrl)}')">
              <span class="text-xs font-mono text-pearl/30 w-4">${idx + 1}</span>
              <div class="min-w-0">
                <h4 class="text-sm font-semibold text-pearl truncate group-hover:text-accent transition-colors">${escapeHtml(song.title)}</h4>
                <p class="text-xs text-pearl/40 truncate mt-0.5">${escapeHtml(song.artist)}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[10px] font-mono text-pearl/30 uppercase tracking-widest hidden lg:inline">${escapeHtml(genre)}</span>
              <a
                href="${spotifyUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-tactile text-[10px] font-mono uppercase tracking-wider px-2.5 py-1.5 rounded border border-[#1DB954]/40 text-[#1DB954] hover:bg-[#1DB954]/10 transition-colors"
                title="Open in Spotify"
                onclick="event.stopPropagation()"
              >Spotify</a>
              <button
                type="button"
                class="w-7 h-7 rounded-full bg-pearl/5 border border-pearl/10 flex items-center justify-center transition-all hover:border-accent/40 hover:bg-accent/10"
                onclick="playSong('${songKey}', '${escapeAttr(song.title)}', '${escapeAttr(song.artist)}', '${mp3Url}', '${escapeAttr(spotifyUrl)}')"
                title="Preview"
              >
                ${visualizer}
              </button>
            </div>
          </div>`;
      }).join('');
    }

    // Interactive Audio Playback Core Engine
    function playSong(songKey, title, artist, mp3Url, spotifyUrl) {
      const visualizerStatus = document.getElementById('visualizer-status');
      const playerTitle = document.getElementById('player-title');
      const playerArtist = document.getElementById('player-artist');
      const playBtn = document.getElementById('player-play-btn');

      // Stop any existing playing audio
      if (currentAudio) {
        currentAudio.pause();
      }

      if (playingSongKey === songKey) {
        // Toggle playback off if clicking the currently active track
        playingSongKey = null;
        currentAudio = null;
        
        if (visualizerStatus) visualizerStatus.classList.remove('playing');
        if (playerTitle) playerTitle.textContent = "Select a track";
        if (playerArtist) playerArtist.textContent = "Curated for your state of mind";
        if (playBtn) {
          playBtn.disabled = true;
          playBtn.innerHTML = `<svg class="w-3.5 h-3.5 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
        }
        
        renderSongs();
        showToast("Playback paused");
      } else {
        // Switch audio track to the newly selected item
        playingSongKey = songKey;
        if (playerTitle) playerTitle.textContent = title;
        if (playerArtist) playerArtist.textContent = artist;
        if (playBtn) {
          playBtn.disabled = false;
          playBtn.innerHTML = `<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        }
        const spotifyLink = document.getElementById('player-spotify-link');
        if (spotifyLink) {
          if (spotifyUrl) {
            spotifyLink.href = spotifyUrl;
            spotifyLink.classList.remove('opacity-40', 'pointer-events-none');
          } else {
            spotifyLink.href = 'https://open.spotify.com/search/' + encodeURIComponent(artist + ' ' + title);
            spotifyLink.classList.remove('opacity-40', 'pointer-events-none');
          }
        }

        // Initialize and trigger real audio stream
        currentAudio = new Audio(mp3Url);
        const volumeSlider = document.getElementById('player-volume');
        if (volumeSlider) {
          currentAudio.volume = parseFloat(volumeSlider.value);
        } else {
          currentAudio.volume = 0.5;
        }
        currentAudio.loop = true;
        
        if (visualizerStatus) visualizerStatus.classList.add('playing');
        
        currentAudio.play().catch((err) => {
          console.warn("Autoplay blocked by browser policy, waiting for user click.", err);
        });

        renderSongs();
        showToast(`Playing: ${title}`);
      }
    }

    function setPlayerVolume(val) {
      if (currentAudio) {
        currentAudio.volume = parseFloat(val);
      }
    }

    function togglePlayerPause() {
      if (!currentAudio) return;
      const btn = document.getElementById('player-play-btn');
      const visualizerStatus = document.getElementById('visualizer-status');

      if (currentAudio.paused) {
        currentAudio.play().catch(() => {});
        if (btn) btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        if (visualizerStatus) visualizerStatus.classList.add('playing');
        showToast("Playback resumed");
      } else {
        currentAudio.pause();
        if (btn) btn.innerHTML = `<svg class="w-3.5 h-3.5 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
        if (visualizerStatus) visualizerStatus.classList.remove('playing');
        showToast("Playback paused");
      }
      renderSongs();
    }

    // Escape Sanitization Helpers
    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
    function escapeAttr(str) {
      return String(str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    }

    async function loadAndRenderMovies() {
      if (moviesLoading) return;
      moviesLoading = true;
      showMoviesLoading();
      try {
        const movies = await fetchMovies();
        renderMovies(movies);
      } catch (err) {
        console.error(err);
        showMoviesError(err.message || 'Failed to load movie picks.');
      } finally {
        moviesLoading = false;
      }
    }

    function refreshMovies() {
      // Jump further through the 100+ title pool on each refresh
      searchTermOffset += 8;
      loadAndRenderMovies();
    }