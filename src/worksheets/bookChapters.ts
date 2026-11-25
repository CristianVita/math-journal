// The chapter of the book exercises for which the rules of chapters.ts go wrong, read one by one (25 November 2026): the
// model (or the part of the recap) and the number of the exercise.
const BY_CHAPTER: Record<string, string[]> = {
  numbers: [
    'en-1#1', 'en-4#1', 'en-11#1', 'en-12#1', 'en-13#4', 'en-17#5', 'en-40#3', 'recap8-alg-a#1', 'recap8-alg-a#15', 'recap8-alg-b#7',
  ],
  percent: [
    'en-1#3', 'en-1#4', 'en-3#6', 'en-7#13', 'en-13#3', 'en-15#13', 'en-16#2', 'en-16#3', 'en-17#6', 'en-21#6',
    'en-21#13', 'en-22#3', 'en-22#5', 'en-23#1', 'en-23#13', 'en-42#6', 'en-44#2', 'en-46#2', 'en-47#2', 'en-47#13',
    'recap8-alg-b#5',
  ],
  triangles: [
    'en-1#7', 'en-1#17', 'en-2#7', 'en-4#7', 'en-7#8', 'en-7#11', 'en-10#8', 'en-14#7', 'en-16#7', 'en-16#8',
    'en-18#7', 'en-18#8', 'en-21#17', 'en-22#7', 'en-22#15', 'en-23#10', 'en-40#7', 'en-40#9', 'en-40#17', 'en-41#8',
    'en-41#16', 'en-44#8', 'en-45#7', 'en-47#8',
  ],
  quads: [
    'en-1#10', 'en-2#8', 'en-3#17', 'en-4#16', 'en-5#16', 'en-7#16', 'en-8#17', 'en-9#11', 'en-12#9', 'en-12#10',
    'en-12#12', 'en-13#11', 'en-16#17', 'en-17#16', 'en-20#10', 'en-21#10', 'en-21#16', 'en-23#9', 'en-23#16', 'en-40#16',
    'en-41#10', 'en-42#7', 'en-42#16', 'en-42#17', 'en-43#7', 'en-44#10', 'en-44#16', 'en-44#17', 'en-47#7', 'en-47#10',
    'en-47#17',
  ],
  problems: [
    'en-1#13', 'en-8#13', 'en-10#6', 'en-10#13', 'en-11#6', 'en-11#13', 'en-12#6', 'en-17#3', 'en-18#6', 'en-19#3',
    'en-19#6', 'en-21#2', 'en-23#2', 'en-23#6', 'en-42#2', 'en-43#6', 'recap8-alg-a#16', 'recap8-alg-b#19',
  ],
  algebra: [
    'en-1#14', 'en-2#6', 'en-11#5', 'en-40#14', 'en-44#3', 'recap8-alg-b#9',
  ],
  radicals: [
    'en-1#15', 'en-2#15', 'en-4#14', 'en-6#2', 'en-18#5', 'en-21#4', 'en-21#14', 'en-40#5', 'en-42#4', 'en-45#5',
    'en-45#6', 'en-46#5', 'en-47#5', 'recap8-alg-a#2', 'recap8-alg-b#4', 'recap8-alg-b#6',
  ],
  equations: [
    'en-3#2', 'en-9#5', 'recap8-alg-a#5',
  ],
  data: [
    'en-3#3', 'en-5#6',
  ],
  space: [
    'en-3#12', 'en-4#12',
  ],
  function: [
    'en-14#15', 'en-17#15', 'recap8-alg-a#11',
  ],
}

export const BOOK_CHAPTERS: Record<string, string> = Object.fromEntries(Object.entries(BY_CHAPTER).flatMap(([c, l]) => l.map((k) => [k, c])))
