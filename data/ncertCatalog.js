// data/ncertCatalog.js
// Comprehensive NCERT catalog with authentic textbook covers only

const BOARD = 'NCERT';
const CATEGORY = 'Books';

/**
 * NCERT_BOOK_COVERS: Authentic NCERT textbook cover images only
 * 
 * IMPORTANT: Only add images from these sources:
 * 1. Official NCERT PDF cover pages (extracted first page)
 * 2. Google Books API thumbnails (verified NCERT textbooks)
 * 3. Wikimedia Commons (verified NCERT covers only)
 * 
 * Format: 'class-subject-medium': { url: '...', source: '...' }
 * 
 * If no authentic cover is available, leave it out of this object.
 * The system will show "NCERT Book Cover Coming Soon" placeholder.
 */
const NCERT_BOOK_COVERS = {
  // Class 10 - Board Exam Priority (Already Added)
  '10-mathematics-english': {
    url: 'https://m.media-amazon.com/images/I/71mcGy2zP8L._AC_UF1000,1000_QL80_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Mathematics Textbook Cover'
  },
  '10-political-science-english': {
    url: 'https://ncert.nic.in/textbook/pdf/jess4cc.jpg',
    source: 'Official NCERT',
    alt: 'NCERT Class 10 Democratic Politics Textbook Cover'
  },
  '10-geography-english': {
    url: 'https://m.media-amazon.com/images/I/31KTJxWDdjL._AC_UF1000,1000_QL80_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Geography Textbook Cover'
  },
  '10-history-english': {
    url: 'https://m.media-amazon.com/images/I/513hAFj0bCL._AC_UF1000,1000_QL80_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 History Textbook Cover'
  },
  '10-economics-english': {
    url: 'https://m.media-amazon.com/images/I/9169hGRPv1L._AC_UF1000,1000_QL80_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Economics Textbook Cover'
  },
  
  // Class 10 - New Additions
  '10-science-english': {
    url: 'https://m.media-amazon.com/images/I/41+Op669lxL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Science Textbook Cover'
  },
  '10-english-english': {
    url: 'https://m.media-amazon.com/images/I/71O0Y9-hFWL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 English Textbook Cover'
  },
  '10-hindi-english': {
    url: 'https://m.media-amazon.com/images/I/41-Ls9KpIVL._AC_UY419_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Hindi Textbook Cover'
  },
  '10-hindi-hindi': {
    url: 'https://m.media-amazon.com/images/I/41-Ls9KpIVL._AC_UY419_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Hindi (Hindi) Textbook Cover'
  },
  '10-sanskrit-english': {
    url: 'https://m.media-amazon.com/images/I/41CvBTj4EEL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Sanskrit Textbook Cover'
  },
  '10-computer-science-english': {
    url: 'https://m.media-amazon.com/images/I/81KL31AHZ7L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Computer Science Textbook Cover'
  },
  '10-social-science-english': {
    url: 'https://m.media-amazon.com/images/I/312feeUIgWL._AC_UY262_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Social Science Textbook Cover'
  },
  
  // Class 6
  '6-mathematics-english': {
    url: 'https://m.media-amazon.com/images/I/41g344hnc+L._SY445_SX342_FMwebp_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 Mathematics Textbook Cover'
  },
  '6-science-english': {
    url: 'https://m.media-amazon.com/images/I/517zIdfjNrL._SY522_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 Science Textbook Cover'
  },
  '6-english-english': {
    url: 'https://m.media-amazon.com/images/I/71-JyGC6QWL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 English Textbook Cover'
  },
  '6-hindi-english': {
    url: 'https://m.media-amazon.com/images/I/61bG4iDeJ1L._SY522_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 Hindi Textbook Cover'
  },
  '6-history-english': {
    url: 'https://m.media-amazon.com/images/I/51DJsEe+y2S.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 History Textbook Cover'
  },
  '6-geography-english': {
    url: 'https://m.media-amazon.com/images/I/51PbQAim4CL.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 Geography Textbook Cover'
  },
  '6-civics-english': {
    url: 'https://m.media-amazon.com/images/I/918tkReqhBL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 Civics Textbook Cover'
  },
  '6-sanskrit-english': {
    url: 'https://m.media-amazon.com/images/I/51T347pzFEL._FMwebp_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 Sanskrit Textbook Cover'
  },
  '6-computer-science-english': {
    url: 'https://m.media-amazon.com/images/I/71wUUV6zljL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 Computer Science Textbook Cover'
  },
  
  // Class 7
  '7-mathematics-english': {
    url: 'https://m.media-amazon.com/images/I/41mladVQ7OL._SY445_SX342_FMwebp_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 Mathematics Textbook Cover'
  },
  '7-science-english': {
    url: 'https://m.media-amazon.com/images/I/51j+V5s6j5L._SY445_SX342_FMwebp_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 Science Textbook Cover'
  },
  '7-english-english': {
    url: 'https://m.media-amazon.com/images/I/91EUa7dUPXL._SY522_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 English Textbook Cover'
  },
  '7-hindi-english': {
    url: 'https://m.media-amazon.com/images/I/91reLa1QXoL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 Hindi Textbook Cover'
  },
  '7-history-english': {
    url: 'https://m.media-amazon.com/images/I/81A8IePHdQL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 History Textbook Cover'
  },
  '7-geography-english': {
    url: 'https://m.media-amazon.com/images/I/51S+LiemhbL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 Geography Textbook Cover'
  },
  '7-civics-english': {
    url: 'https://m.media-amazon.com/images/I/51tkac6ZqcL._SY445_SX342_FMwebp_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 Civics Textbook Cover'
  },
  '7-sanskrit-english': {
    url: 'https://m.media-amazon.com/images/I/91cDpyknF4L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 Sanskrit Textbook Cover'
  },
  '7-computer-science-english': {
    url: 'https://m.media-amazon.com/images/I/71HwaYyc7hL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 Computer Science Textbook Cover'
  },
  
  // Class 8
  '8-mathematics-english': {
    url: 'https://m.media-amazon.com/images/I/41mladVQ7OL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 Mathematics Textbook Cover'
  },
  '8-science-english': {
    url: 'https://m.media-amazon.com/images/I/81GpW5PRZHL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 Science Textbook Cover'
  },
  '8-english-english': {
    url: 'https://m.media-amazon.com/images/I/81zEH16SqWL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 English Textbook Cover'
  },
  '8-hindi-english': {
    url: 'https://m.media-amazon.com/images/I/71oeW8rFrDL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 Hindi Textbook Cover'
  },
  '8-history-english': {
    url: 'https://m.media-amazon.com/images/I/41B0rSCmSjL.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 History Textbook Cover'
  },
  '8-geography-english': {
    url: 'https://m.media-amazon.com/images/I/A1rEIM3v+XL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 Geography Textbook Cover'
  },
  '8-civics-english': {
    url: 'https://m.media-amazon.com/images/I/817vYI9PkhL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 Civics Textbook Cover'
  },
  '8-sanskrit-english': {
    url: 'https://m.media-amazon.com/images/I/818Dol46PpL._SY522_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 Sanskrit Textbook Cover'
  },
  '8-computer-science-english': {
    url: 'https://m.media-amazon.com/images/I/713uQF2bGKL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 Computer Science Textbook Cover'
  },
  
  // Class 9
  '9-mathematics-english': {
    url: 'https://m.media-amazon.com/images/I/41I7-2nBMGL._AC_UY420_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Mathematics Textbook Cover'
  },
  '9-science-english': {
    url: 'https://m.media-amazon.com/images/I/51ssbKdZBxL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Science Textbook Cover'
  },
  '9-english-english': {
    url: 'https://m.media-amazon.com/images/I/51R3M7kI+jL._SY445_SX342_FMwebp_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 English Textbook Cover'
  },
  '9-hindi-english': {
    url: 'https://m.media-amazon.com/images/I/31pXbYiKJYL._FMwebp_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Hindi Textbook Cover'
  },
  '9-hindi-hindi': {
    url: 'https://m.media-amazon.com/images/I/51-3TmCFSrL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Hindi (Hindi) Textbook Cover - Parts 1 & 2'
  },
  '9-history-english': {
    url: 'https://m.media-amazon.com/images/I/9128f+-JOoL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 History Textbook Cover'
  },
  '9-geography-english': {
    url: 'https://m.media-amazon.com/images/I/516PWnTriyL._AC_UY420_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Geography Textbook Cover'
  },
  '9-political-science-english': {
    url: 'https://m.media-amazon.com/images/I/41sm1ipIssL._AC_UY420_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Political Science Textbook Cover'
  },
  '9-economics-english': {
    url: 'https://m.media-amazon.com/images/I/91osgxfpH3L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Economics Textbook Cover'
  },
  '9-sanskrit-english': {
    url: 'https://m.media-amazon.com/images/I/51rEMzrR6wL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Sanskrit Textbook Cover'
  },
  '9-computer-science-english': {
    url: 'https://m.media-amazon.com/images/I/51-fE8VxcxL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Computer Science Textbook Cover'
  },
  
  // Hindi Medium Books - Classes 6-10
  '6-mathematics-hindi': {
    url: 'https://m.media-amazon.com/images/I/61o-dGolP+L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 Mathematics (Hindi) Textbook Cover'
  },
  '6-science-hindi': {
    url: 'https://m.media-amazon.com/images/I/61bG4iDeJ1L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 Science (Hindi) Textbook Cover'
  },
  '6-hindi-hindi': {
    url: 'https://m.media-amazon.com/images/I/51vKBRXM8YL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 Hindi (Hindi) Textbook Cover'
  },
  '6-history-hindi': {
    url: 'https://m.media-amazon.com/images/I/71139cu+FFL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 History (Hindi) Textbook Cover'
  },
  '6-geography-hindi': {
    url: 'https://m.media-amazon.com/images/I/61I91XhuEvL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 Geography (Hindi) Textbook Cover'
  },
  '6-civics-hindi': {
    url: 'https://m.media-amazon.com/images/I/A1Qc4zFU96L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 Civics (Hindi) Textbook Cover'
  },
  '6-sanskrit-hindi': {
    url: 'https://m.media-amazon.com/images/I/51T347pzFEL._AC_UY418_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 6 Sanskrit (Hindi) Textbook Cover'
  },
  
  '7-mathematics-hindi': {
    url: 'https://m.media-amazon.com/images/I/716+Ini1b0L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 Mathematics (Hindi) Textbook Cover'
  },
  '7-science-hindi': {
    url: 'https://m.media-amazon.com/images/I/61uzLAX4GDL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 Science (Hindi) Textbook Cover'
  },
  '7-hindi-hindi': {
    url: 'https://m.media-amazon.com/images/I/71J1q6p5pZL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 Hindi (Hindi) Textbook Cover'
  },
  '7-history-hindi': {
    url: 'https://m.media-amazon.com/images/I/51Hkyk-31yL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 History (Hindi) Textbook Cover'
  },
  '7-geography-hindi': {
    url: 'https://m.media-amazon.com/images/I/71GNX5lr3NL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 Geography (Hindi) Textbook Cover'
  },
  '7-civics-hindi': {
    url: 'https://m.media-amazon.com/images/I/41ERPiXdaNL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 Civics (Hindi) Textbook Cover'
  },
  '7-sanskrit-hindi': {
    url: 'https://m.media-amazon.com/images/I/91cDpyknF4L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 7 Sanskrit (Hindi) Textbook Cover'
  },
  
  '8-mathematics-hindi': {
    url: 'https://m.media-amazon.com/images/I/51Swq9OQXOL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 Mathematics (Hindi) Textbook Cover'
  },
  '8-science-hindi': {
    url: 'https://m.media-amazon.com/images/I/61YHRvK42BS._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 Science (Hindi) Textbook Cover'
  },
  '8-hindi-hindi': {
    url: 'https://m.media-amazon.com/images/I/91sgAszns4L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 Hindi (Hindi) Textbook Cover'
  },
  '8-history-hindi': {
    url: 'https://m.media-amazon.com/images/I/51T9XyjFIgL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 History (Hindi) Textbook Cover'
  },
  '8-geography-hindi': {
    url: 'https://m.media-amazon.com/images/I/51W7PfbdYcL._AC_UY420_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 Geography (Hindi) Textbook Cover'
  },
  '8-civics-hindi': {
    url: 'https://m.media-amazon.com/images/I/51TIg6NxJAL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 Civics (Hindi) Textbook Cover'
  },
  '8-sanskrit-hindi': {
    url: 'https://m.media-amazon.com/images/I/818Dol46PpL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 8 Sanskrit (Hindi) Textbook Cover'
  },
  
  '9-mathematics-hindi': {
    url: 'https://m.media-amazon.com/images/I/91W450IUl-L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Mathematics (Hindi) Textbook Cover'
  },
  '9-science-hindi': {
    url: 'https://m.media-amazon.com/images/I/41+agxl3CEL._AC_UY420_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Science (Hindi) Textbook Cover'
  },
  '9-history-hindi': {
    url: 'https://m.media-amazon.com/images/I/71C28frpWzL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 History (Hindi) Textbook Cover'
  },
  '9-geography-hindi': {
    url: 'https://m.media-amazon.com/images/I/51A+P4mR82L._AC_UY402_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Geography (Hindi) Textbook Cover'
  },
  '9-political-science-hindi': {
    url: 'https://m.media-amazon.com/images/I/71bHK-n79EL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Political Science (Hindi) Textbook Cover'
  },
  '9-economics-hindi': {
    url: 'https://m.media-amazon.com/images/I/51wgG9h71iL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Economics (Hindi) Textbook Cover'
  },
  '9-sanskrit-hindi': {
    url: 'https://m.media-amazon.com/images/I/71ulYdKipVL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 9 Sanskrit (Hindi) Textbook Cover'
  },
  
  '10-mathematics-hindi': {
    url: 'https://m.media-amazon.com/images/I/71LWsw8CzAL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Mathematics (Hindi) Textbook Cover'
  },
  '10-science-hindi': {
    url: 'https://m.media-amazon.com/images/I/41icVzWDgRL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Science (Hindi) Textbook Cover'
  },
  '10-history-hindi': {
    url: 'https://m.media-amazon.com/images/I/31T+Qv8DhcL._AC_UY420_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 History (Hindi) Textbook Cover'
  },
  '10-geography-hindi': {
    url: 'https://m.media-amazon.com/images/I/31nIRfUnxGL._AC_UY420_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Geography (Hindi) Textbook Cover'
  },
  '10-political-science-hindi': {
    url: 'https://m.media-amazon.com/images/I/51td-Xi4eyL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Political Science (Hindi) Textbook Cover'
  },
  '10-economics-hindi': {
    url: 'https://m.media-amazon.com/images/I/81SHVcJHmYL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Economics (Hindi) Textbook Cover'
  },
  '10-sanskrit-hindi': {
    url: 'https://m.media-amazon.com/images/I/51eJJ-AEmTL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 10 Sanskrit (Hindi) Textbook Cover'
  },
  
  // Class 11 Books
  '11-english-english': {
    url: 'https://m.media-amazon.com/images/I/91zsMY5i8KS._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 English Textbook Cover'
  },
  '11-hindi-hindi': {
    url: 'https://m.media-amazon.com/images/I/51m+spCLZDL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Hindi Textbook Cover'
  },
  '11-mathematics-english': {
    url: 'https://m.media-amazon.com/images/I/81FG0XZXXGL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Mathematics (English) Textbook Cover'
  },
  '11-mathematics-hindi': {
    url: 'https://m.media-amazon.com/images/I/41c+9wP2fmL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Mathematics (Hindi) Textbook Cover'
  },
  '11-physics-english': {
    url: 'https://m.media-amazon.com/images/I/418JRohebEL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Physics (English) Textbook Cover'
  },
  '11-physics-hindi': {
    url: 'https://m.media-amazon.com/images/I/317QXnYYfVL._AC_UY420_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Physics (Hindi) Textbook Cover'
  },
  '11-chemistry-english': {
    url: 'https://m.media-amazon.com/images/I/51kXCOEcYOL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Chemistry (English) Textbook Cover'
  },
  '11-chemistry-hindi': {
    url: 'https://m.media-amazon.com/images/I/41h+edtVJEL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Chemistry (Hindi) Textbook Cover'
  },
  '11-biology-english': {
    url: 'https://m.media-amazon.com/images/I/81yMxebg4VL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Biology (English) Textbook Cover'
  },
  '11-biology-hindi': {
    url: 'https://m.media-amazon.com/images/I/416h3uCZ5yL._AC_UY312_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Biology (Hindi) Textbook Cover'
  },
  '11-computer-science-english': {
    url: 'https://m.media-amazon.com/images/I/41L+myHwtYL._AC_UY420_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Computer Science Textbook Cover'
  },
  '11-economics-english': {
    url: 'https://m.media-amazon.com/images/I/61VZni9XTrL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Economics (English) Textbook Cover'
  },
  '11-economics-hindi': {
    url: 'https://m.media-amazon.com/images/I/51rUptnkd0L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Economics (Hindi) Textbook Cover'
  },
  '11-accountancy-english': {
    url: 'https://m.media-amazon.com/images/I/61zXOq6MNZL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Accountancy (English) Textbook Cover'
  },
  '11-accountancy-hindi': {
    url: 'https://m.media-amazon.com/images/I/41IcH-Ten7L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Accountancy (Hindi) Textbook Cover'
  },
  '11-business-studies-english': {
    url: 'https://m.media-amazon.com/images/I/614LQEVkOtL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Business Studies (English) Textbook Cover'
  },
  '11-business-studies-hindi': {
    url: 'https://m.media-amazon.com/images/I/51NeucTKyBL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Business Studies (Hindi) Textbook Cover'
  },
  '11-history-english': {
    url: 'https://m.media-amazon.com/images/I/51rNc7gfj3L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 History (English) Textbook Cover'
  },
  '11-history-hindi': {
    url: 'https://m.media-amazon.com/images/I/3141jOgCyDL._AC_UY269_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 History (Hindi) Textbook Cover'
  },
  '11-geography-english': {
    url: 'https://m.media-amazon.com/images/I/31loK5hoOdL._AC_UY370_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Geography (English) Textbook Cover'
  },
  '11-geography-hindi': {
    url: 'https://m.media-amazon.com/images/I/411POFxCBML._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Geography (Hindi) Textbook Cover'
  },
  '11-political-science-english': {
    url: 'https://m.media-amazon.com/images/I/41VZ0+TKqML._AC_UY420_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Political Science (English) Textbook Cover'
  },
  '11-political-science-hindi': {
    url: 'https://m.media-amazon.com/images/I/51Fs1auDb-L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Political Science (Hindi) Textbook Cover'
  },
  '11-sociology-english': {
    url: 'https://m.media-amazon.com/images/I/61eVNCuhHiL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Sociology (English) Textbook Cover'
  },
  '11-sociology-hindi': {
    url: 'https://m.media-amazon.com/images/I/81nq1rvdKDL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Sociology (Hindi) Textbook Cover'
  },
  '11-psychology-english': {
    url: 'https://m.media-amazon.com/images/I/41vqQqwJZVL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Psychology (English) Textbook Cover'
  },
  '11-psychology-hindi': {
    url: 'https://m.media-amazon.com/images/I/41AifMBbBaL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Psychology (Hindi) Textbook Cover'
  },
  '11-sanskrit-sanskrit': {
    url: 'https://m.media-amazon.com/images/I/31GitbAKNvL._AC_UY420_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 11 Sanskrit Textbook Cover'
  },
  
  // Class 12 Books
  '12-english-english': {
    url: 'https://m.media-amazon.com/images/I/61QyHl9wiDL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 English Textbook Cover'
  },
  '12-hindi-hindi': {
    url: 'https://m.media-amazon.com/images/I/612OyZfE+ML._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Hindi Textbook Cover'
  },
  '12-mathematics-english': {
    url: 'https://m.media-amazon.com/images/I/81HJdyhEcLL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Mathematics (English) Textbook Cover'
  },
  '12-mathematics-hindi': {
    url: 'https://m.media-amazon.com/images/I/A12FInMpC8L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Mathematics (Hindi) Textbook Cover'
  },
  '12-physics-english': {
    url: 'https://m.media-amazon.com/images/I/51wiVE33buL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Physics (English) Textbook Cover'
  },
  '12-physics-hindi': {
    url: 'https://m.media-amazon.com/images/I/313zzy6N1+L._AC_UY420_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Physics (Hindi) Textbook Cover'
  },
  '12-chemistry-english': {
    url: 'https://m.media-amazon.com/images/I/711bzverB+L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Chemistry Part 1 (English) Textbook Cover'
  },
  '12-chemistry-hindi': {
    url: 'https://m.media-amazon.com/images/I/41+6iM7a01L._AC_UY327_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Chemistry Part 1 (Hindi) Textbook Cover'
  },
  '12-biology-english': {
    url: 'https://m.media-amazon.com/images/I/71TVJkA2czL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Biology (English) Textbook Cover'
  },
  '12-biology-hindi': {
    url: 'https://m.media-amazon.com/images/I/71UVDWrSOXL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Biology (Hindi) Textbook Cover'
  },
  '12-computer-science-english': {
    url: 'https://m.media-amazon.com/images/I/41y-BYlpj+L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Computer Science Textbook Cover'
  },
  '12-economics-english': {
    url: 'https://m.media-amazon.com/images/I/91Su+UJY5aL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Economics (English) Textbook Cover'
  },
  '12-economics-hindi': {
    url: 'https://m.media-amazon.com/images/I/91-ODrtU3eL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Economics (Hindi) Textbook Cover'
  },
  '12-accountancy-english': {
    url: 'https://m.media-amazon.com/images/I/610ba5E6RsL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Accountancy (English) Textbook Cover'
  },
  '12-accountancy-hindi': {
    url: 'https://m.media-amazon.com/images/I/31rDRosBFuL._AC_UY420_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Accountancy (Hindi) Textbook Cover'
  },
  '12-business-studies-english': {
    url: 'https://m.media-amazon.com/images/I/41UkIA9SNYL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Business Studies (English) Textbook Cover'
  },
  '12-business-studies-hindi': {
    url: 'https://m.media-amazon.com/images/I/41K-TRosOlL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Business Studies (Hindi) Textbook Cover'
  },
  '12-history-english': {
    url: 'https://m.media-amazon.com/images/I/61LUlsEYg9L._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 History (English) Textbook Cover'
  },
  '12-history-hindi': {
    url: 'https://m.media-amazon.com/images/I/61QWWCewAXL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 History (Hindi) Textbook Cover'
  },
  '12-geography-english': {
    url: 'https://m.media-amazon.com/images/I/31KkX2fON+L._AC_UY265_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Geography (English) Textbook Cover'
  },
  '12-geography-hindi': {
    url: 'https://m.media-amazon.com/images/I/31kFb0ebNML._AC_UY218_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Geography (Hindi) Textbook Cover'
  },
  '12-political-science-english': {
    url: 'https://m.media-amazon.com/images/I/81qjb+9DKQL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Political Science (English) Textbook Cover'
  },
  '12-political-science-hindi': {
    url: 'https://m.media-amazon.com/images/I/51vIHnLajxL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Political Science (Hindi) Textbook Cover'
  },
  '12-sociology-english': {
    url: 'https://m.media-amazon.com/images/I/41J-eWvRIPL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Sociology (English) Textbook Cover - Parts 1 & 2'
  },
  '12-sociology-hindi': {
    url: 'https://m.media-amazon.com/images/I/91v0stPRbiL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Sociology (Hindi) Textbook Cover - Parts 1 & 2'
  },
  '12-psychology-english': {
    url: 'https://m.media-amazon.com/images/I/61FBIUEh2xL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Psychology (English) Textbook Cover'
  },
  '12-psychology-hindi': {
    url: 'https://m.media-amazon.com/images/I/71EXvX8KPXS._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Psychology (Hindi) Textbook Cover'
  },
  '12-sanskrit-sanskrit': {
    url: 'https://m.media-amazon.com/images/I/417PKyDShbL._AC_UY436_FMwebp_QL65_.jpg',
    source: 'NCERT Textbook',
    alt: 'NCERT Class 12 Sanskrit Textbook Cover'
  },
};

// Comprehensive subject list by class
const SUBJECTS_BY_CLASS = {
  1: ['Mathematics', 'English', 'Hindi'],
  2: ['Mathematics', 'English', 'Hindi'],
  3: ['Mathematics', 'English', 'Hindi', 'Environmental Studies'],
  4: ['Mathematics', 'English', 'Hindi', 'Environmental Studies'],
  5: ['Mathematics', 'English', 'Hindi', 'Environmental Studies'],
  6: ['Mathematics', 'Science', 'English', 'Hindi', 'History', 'Geography', 'Civics', 'Sanskrit', 'Computer Science'],
  7: ['Mathematics', 'Science', 'English', 'Hindi', 'History', 'Geography', 'Civics', 'Sanskrit', 'Computer Science'],
  8: ['Mathematics', 'Science', 'English', 'Hindi', 'History', 'Geography', 'Civics', 'Sanskrit', 'Computer Science'],
  9: ['Mathematics', 'Science', 'English', 'Hindi', 'History', 'Geography', 'Political Science', 'Economics', 'Sanskrit', 'Computer Science'],
  10: ['Mathematics', 'Science', 'English', 'Hindi', 'History', 'Geography', 'Political Science', 'Economics', 'Sanskrit', 'Computer Science'],
  11: [
    'English',
    'Hindi',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Accountancy',
    'Business Studies',
    'History',
    'Geography',
    'Political Science',
    'Sociology',
    'Psychology',
    'Computer Science',
    'Sanskrit'
  ],
  12: [
    'English',
    'Hindi',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Accountancy',
    'Business Studies',
    'History',
    'Geography',
    'Political Science',
    'Sociology',
    'Psychology',
    'Computer Science',
    'Sanskrit'
  ],
};

function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function mediumsForSubject(subject) {
  // Language books are inherently single-medium.
  if (subject === 'English' || subject === 'Computer Science') return ['English'];
  if (subject === 'Hindi') return ['Hindi'];
  if (subject === 'Sanskrit') return ['Sanskrit'];
  if (subject === 'Urdu') return ['Urdu'];
  // All other subjects available in both mediums
  return ['English', 'Hindi'];
}

function basePriceForClass(classLevel) {
  if (classLevel <= 2) return 65;
  if (classLevel <= 5) return 80;
  if (classLevel <= 8) return 95;
  if (classLevel <= 10) return 110;
  return 140;
}

function subjectSurcharge(subject) {
  const s = String(subject).toLowerCase();
  if (['physics', 'chemistry', 'biology', 'science'].includes(s)) return 20;
  if (['mathematics'].includes(s)) return 15;
  if (['economics', 'accountancy', 'business studies'].includes(s)) return 15;
  if (['history', 'geography', 'political science', 'civics', 'sociology', 'psychology', 'social science'].includes(s)) return 10;
  if (['english', 'hindi', 'sanskrit', 'urdu'].includes(s)) return 5;
  return 0;
}

function priceFor({ classLevel, subject, medium }) {
  const raw = basePriceForClass(classLevel) + subjectSurcharge(subject);
  let price = Math.round(raw / 5) * 5;
  
  // Multi-part books (2 books sold together) - double the price
  const isMultiPart = (
    // Class 9 Hindi (Hindi medium) - Parts 1 & 2
    (classLevel === 9 && subject === 'Hindi' && medium === 'Hindi') ||
    // Class 12 Mathematics - Parts 1 & 2
    (classLevel === 12 && subject === 'Mathematics') ||
    // Class 12 Chemistry - Parts 1 & 2
    (classLevel === 12 && subject === 'Chemistry') ||
    // Class 12 Physics - Parts 1 & 2
    (classLevel === 12 && subject === 'Physics') ||
    // Class 12 Sociology - Parts 1 & 2
    (classLevel === 12 && subject === 'Sociology')
  );
  
  if (isMultiPart) {
    price = price * 2; // Double price for 2-part books
  }
  
  return price;
}

/**
 * Get authentic NCERT book cover image
 * Returns empty array if no authentic cover is available
 * 
 * @param {string} subject - Subject name
 * @param {number} classLevel - Class level (1-12)
 * @param {string} medium - Medium (English/Hindi/Sanskrit/Urdu)
 * @returns {Array} Array of image objects or empty array
 */
function getBookCoverImage(subject, classLevel, medium) {
  // Create lookup key
  const mediumCode = medium === 'English' ? 'english' : 
                     medium === 'Hindi' ? 'hindi' : 
                     medium === 'Sanskrit' ? 'sanskrit' : 'urdu';
  const key = `${classLevel}-${slugify(subject)}-${mediumCode}`;
  
  // Check if authentic cover exists
  const cover = NCERT_BOOK_COVERS[key];
  
  if (cover) {
    // Return authentic cover with source attribution
    return [{
      url: cover.url,
      alt: cover.alt || `NCERT Class ${classLevel} ${subject} (${medium}) Textbook Cover`,
      source: cover.source
    }];
  }
  
  // No authentic cover available - return empty array
  // UI will show "NCERT Book Cover Coming Soon" placeholder
  return [];
}

// Exported catalog generator
export function generateNcertCatalog({ inStockDefault = true } = {}) {
  const out = [];

  for (let classLevel = 1; classLevel <= 12; classLevel++) {
    const subjects = SUBJECTS_BY_CLASS[classLevel] || [];
    for (const subject of subjects) {
      for (const medium of mediumsForSubject(subject)) {
        const id = `ncert-c${classLevel}-${slugify(subject)}-${medium === 'English' ? 'en' : medium === 'Hindi' ? 'hi' : medium === 'Sanskrit' ? 'sa' : 'ur'}`;
        const title = `NCERT Class ${classLevel} ${subject} (${medium})`;

        out.push({
          id,
          title,
          class: classLevel,
          subject,
          medium,
          board: BOARD,
          price: priceFor({ classLevel, subject, medium }),
          category: CATEGORY,
          inStock: inStockDefault,
        });
      }
    }
  }

  return out;
}

export const ncertCatalog = generateNcertCatalog();

// Adapter: turns NCERT metadata into the existing app's product shape.
export function ncertCatalogToProducts(catalog = ncertCatalog) {
  return catalog.map((b) => {
    const slug = slugify(`${b.board}-class-${b.class}-${b.subject}-${b.medium}`);
    
    // Get authentic book cover image (returns empty array if not available)
    const images = getBookCoverImage(b.subject, b.class, b.medium);

    return {
      id: b.id,
      _id: b.id,
      name: b.title,
      title: b.title,
      slug,
      description: `NCERT ${b.subject} textbook for Class ${b.class} students (${b.medium} medium). Comprehensive coverage of all topics as per the latest CBSE curriculum. Published by the National Council of Educational Research and Training.`,
      category: b.category,
      price: b.price,
      inStock: b.inStock,
      stock: b.inStock ? 100 : 0,
      brand: b.board,
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 50) + 10,
      images, // Empty array if no authentic cover available

      // Keep raw metadata for future backend migration / filtering.
      board: b.board,
      class: b.class,
      subject: b.subject,
      medium: b.medium,

      // Add relevant tags
      tags: [
        `Class ${b.class}`,
        b.subject,
        b.medium,
        'NCERT',
        'CBSE',
        'Textbook',
        b.class <= 5 ? 'Primary' : b.class <= 10 ? 'Secondary' : 'Senior Secondary'
      ],

      // NCERT items are not featured by default.
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: b.class === 10 || b.class === 12, // Board exam classes
      createdAt: '2024-01-01T00:00:00.000Z',
      
      // Additional metadata
      hsn: '49011010', // HSN code for printed books
      weight: b.class <= 5 ? 200 : b.class <= 10 ? 300 : 400,
      weightUnit: 'g',
      countryOfOrigin: 'India',
      manufacturer: 'NCERT',
      quantityPerItem: 1,
      unit: 'piece',
    };
  });
}

export const ncertProducts = ncertCatalogToProducts();
