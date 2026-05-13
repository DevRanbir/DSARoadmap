export interface Problem {
  title: string;
  source: 'leetcode' | 'gfg' | 'codeforces' | 'custom';
  id?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url?: string;
}

export interface TheoryNode {
  type: 'theory';
  title: string;
  problems: Problem[];
  topicUrl?: string;
}

export interface RevisionNode {
  type: 'revision';
  title: string;
  items: string[];
}

export type DayItem = TheoryNode | RevisionNode;

export interface DayPlan {
  day: number;
  items: DayItem[];
}

export interface SyllabusSection {
  title: string;
  dayRange: [number, number]; // [startDay, endDay]
  color: string; // tailwind color class prefix like 'blue', 'emerald', etc.
}

export const syllabusSections: SyllabusSection[] = [
  { title: "Introduction to Data Structures", dayRange: [1, 7], color: "blue" },
  { title: "Algorithmic Complexity", dayRange: [8, 10], color: "cyan" },
  { title: "Sorting Algorithms", dayRange: [11, 16], color: "violet" },
  { title: "Search Algorithms", dayRange: [17, 18], color: "emerald" },
  { title: "Graph Data Structures", dayRange: [19, 26], color: "orange" },
  { title: "Tree Data Structures", dayRange: [27, 34], color: "rose" },
  { title: "Advanced Data Structures", dayRange: [35, 39], color: "amber" },
  { title: "Algorithm Techniques", dayRange: [40, 50], color: "teal" },
  { title: "Problem Solving Techniques", dayRange: [51, 54], color: "indigo" },
  { title: "Indexing & Final Review", dayRange: [55, 60], color: "lime" },
];

export const dsaPlan: DayPlan[] = [
  // ============================================================
  // WEEK 1: Introduction to Data Structures (Days 1-7)
  // ============================================================
  {
    day: 1,
    items: [
      {
        type: 'theory',
        title: "Arrays — Fundamentals & Operations",
        problems: [
          { title: "Two Sum", source: "leetcode", id: "1", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/" },
          { title: "Contains Duplicate", source: "leetcode", id: "217", difficulty: "Easy", url: "https://leetcode.com/problems/contains-duplicate/" },
          { title: "Maximum Subarray", source: "leetcode", id: "53", difficulty: "Medium", url: "https://leetcode.com/problems/maximum-subarray/" },
        ],
      },
      {
        type: 'theory',
        title: "Arrays — Two Pointer & In-Place Manipulation",
        problems: [
          { title: "Remove Duplicates from Sorted Array", source: "leetcode", id: "26", difficulty: "Easy", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
          { title: "Product of Array Except Self", source: "leetcode", id: "238", difficulty: "Medium", url: "https://leetcode.com/problems/product-of-array-except-self/" },
          { title: "Rotate Array", source: "leetcode", id: "189", difficulty: "Medium", url: "https://leetcode.com/problems/rotate-array/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 1 Revision",
        items: [
          "Explain the difference between static and dynamic arrays",
          "How does the two-pointer technique reduce time complexity?",
          "What is the time complexity of inserting at the beginning of an array?",
        ],
      },
    ],
  },
  {
    day: 2,
    items: [
      {
        type: 'theory',
        title: "Linked Lists — Singly & Doubly Linked Lists",
        problems: [
          { title: "Reverse Linked List", source: "leetcode", id: "206", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-linked-list/" },
          { title: "Middle of the Linked List", source: "leetcode", id: "876", difficulty: "Easy", url: "https://leetcode.com/problems/middle-of-the-linked-list/" },
          { title: "Linked List Cycle", source: "leetcode", id: "141", difficulty: "Easy", url: "https://leetcode.com/problems/linked-list-cycle/" },
        ],
      },
      {
        type: 'theory',
        title: "Linked Lists — Advanced Manipulation",
        problems: [
          { title: "Merge Two Sorted Lists", source: "leetcode", id: "21", difficulty: "Easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
          { title: "Remove Nth Node From End of List", source: "leetcode", id: "19", difficulty: "Medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
          { title: "Linked List Cycle II", source: "leetcode", id: "142", difficulty: "Medium", url: "https://leetcode.com/problems/linked-list-cycle-ii/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 2 Revision",
        items: [
          "Compare array vs linked list for insert, delete, and access operations",
          "How does Floyd's cycle detection algorithm work?",
          "Explain the dummy head technique for linked list manipulation",
        ],
      },
    ],
  },
  {
    day: 3,
    items: [
      {
        type: 'theory',
        title: "Stacks — LIFO Principle & Applications",
        problems: [
          { title: "Valid Parentheses", source: "leetcode", id: "20", difficulty: "Easy", url: "https://leetcode.com/problems/valid-parentheses/" },
          { title: "Min Stack", source: "leetcode", id: "155", difficulty: "Medium", url: "https://leetcode.com/problems/min-stack/" },
          { title: "Evaluate Reverse Polish Notation", source: "leetcode", id: "150", difficulty: "Medium", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
        ],
      },
      {
        type: 'theory',
        title: "Stacks — Monotonic Stack Patterns",
        problems: [
          { title: "Daily Temperatures", source: "leetcode", id: "739", difficulty: "Medium", url: "https://leetcode.com/problems/daily-temperatures/" },
          { title: "Next Greater Element I", source: "leetcode", id: "496", difficulty: "Easy", url: "https://leetcode.com/problems/next-greater-element-i/" },
          { title: "Largest Rectangle in Histogram", source: "leetcode", id: "84", difficulty: "Hard", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 3 Revision",
        items: [
          "How does a monotonic stack differ from a regular stack?",
          "Explain how the min stack achieves O(1) getMin",
          "When would you use a stack vs recursion?",
        ],
      },
    ],
  },
  {
    day: 4,
    items: [
      {
        type: 'theory',
        title: "Queues — FIFO Principle & Basic Operations",
        problems: [
          { title: "Implement Queue using Stacks", source: "leetcode", id: "232", difficulty: "Easy", url: "https://leetcode.com/problems/implement-queue-using-stacks/" },
          { title: "Number of Recent Calls", source: "leetcode", id: "933", difficulty: "Easy", url: "https://leetcode.com/problems/number-of-recent-calls/" },
          { title: "Design Circular Queue", source: "leetcode", id: "622", difficulty: "Medium", url: "https://leetcode.com/problems/design-circular-queue/" },
        ],
      },
      {
        type: 'theory',
        title: "Deques & Priority Queues — Double-Ended & Ordered Access",
        problems: [
          { title: "Sliding Window Maximum", source: "leetcode", id: "239", difficulty: "Hard", url: "https://leetcode.com/problems/sliding-window-maximum/" },
          { title: "Design Circular Deque", source: "leetcode", id: "641", difficulty: "Medium", url: "https://leetcode.com/problems/design-circular-deque/" },
          { title: "Task Scheduler", source: "leetcode", id: "621", difficulty: "Medium", url: "https://leetcode.com/problems/task-scheduler/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 4 Revision",
        items: [
          "How does a deque improve over a regular queue for sliding window problems?",
          "Explain how to implement a queue using two stacks",
          "What is the difference between a priority queue and a regular queue?",
        ],
      },
    ],
  },
  {
    day: 5,
    items: [
      {
        type: 'theory',
        title: "Hash Tables — Hash Functions & Collision Handling",
        problems: [
          { title: "Valid Anagram", source: "leetcode", id: "242", difficulty: "Easy", url: "https://leetcode.com/problems/valid-anagram/" },
          { title: "Group Anagrams", source: "leetcode", id: "49", difficulty: "Medium", url: "https://leetcode.com/problems/group-anagrams/" },
          { title: "Longest Consecutive Sequence", source: "leetcode", id: "128", difficulty: "Medium", url: "https://leetcode.com/problems/longest-consecutive-sequence/" },
        ],
      },
      {
        type: 'theory',
        title: "Hash Maps — Frequency Counting & Lookup Patterns",
        problems: [
          { title: "Subarray Sum Equals K", source: "leetcode", id: "560", difficulty: "Medium", url: "https://leetcode.com/problems/subarray-sum-equals-k/" },
          { title: "Top K Frequent Elements", source: "leetcode", id: "347", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
          { title: "4Sum II", source: "leetcode", id: "454", difficulty: "Medium", url: "https://leetcode.com/problems/4sum-ii/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 5 Revision",
        items: [
          "Explain open addressing vs chaining for collision resolution",
          "What is the amortized time complexity of hash table operations?",
          "How does the prefix sum + hash map pattern work for subarray problems?",
        ],
      },
    ],
  },
  {
    day: 6,
    items: [
      {
        type: 'theory',
        title: "Mixed Arrays & Hashing — Combined Techniques",
        problems: [
          { title: "3Sum", source: "leetcode", id: "15", difficulty: "Medium", url: "https://leetcode.com/problems/3sum/" },
          { title: "Container With Most Water", source: "leetcode", id: "11", difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/" },
          { title: "Trapping Rain Water", source: "leetcode", id: "42", difficulty: "Hard", url: "https://leetcode.com/problems/trapping-rain-water/" },
        ],
      },
      {
        type: 'theory',
        title: "Arrays & Hashing — Interview Classics",
        problems: [
          { title: "Longest Substring Without Repeating Characters", source: "leetcode", id: "3", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
          { title: "Minimum Window Substring", source: "leetcode", id: "76", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-window-substring/" },
          { title: "Find All Anagrams in a String", source: "leetcode", id: "438", difficulty: "Medium", url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 6 Revision",
        items: [
          "When to use sorting + two pointers vs hashing for pair/triplet problems?",
          "Explain the sliding window with hash map technique",
          "How to handle the 'no valid answer' case in minimum window substring?",
        ],
      },
    ],
  },
  {
    day: 7,
    items: [
      {
        type: 'theory',
        title: "Data Structures Review — Arrays & Linked Lists",
        problems: [
          { title: "Copy List with Random Pointer", source: "leetcode", id: "138", difficulty: "Medium", url: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
          { title: "Sort List", source: "leetcode", id: "148", difficulty: "Medium", url: "https://leetcode.com/problems/sort-list/" },
        ],
      },
      {
        type: 'theory',
        title: "Data Structures Review — Stacks, Queues & Hash Tables",
        problems: [
          { title: "LRU Cache", source: "leetcode", id: "146", difficulty: "Medium", url: "https://leetcode.com/problems/lru-cache/" },
          { title: "Online Stock Span", source: "leetcode", id: "901", difficulty: "Medium", url: "https://leetcode.com/problems/online-stock-span/" },
          { title: "Design Underground System", source: "leetcode", id: "1396", difficulty: "Medium", url: "https://leetcode.com/problems/design-underground-system/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 7 Revision — Week 1 Recap",
        items: [
          "Compare time complexities of all basic data structure operations",
          "When to choose a hash table over an array for lookup?",
          "How does LRU Cache combine hash map and doubly linked list?",
        ],
      },
    ],
  },

  // ============================================================
  // WEEK 2: Algorithmic Complexity (Days 8-10)
  // ============================================================
  {
    day: 8,
    items: [
      {
        type: 'theory',
        title: "Time Complexity — Big-O Notation & Analysis",
        problems: [
          { title: "Introduction to Big-O", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/analysis-of-algorithms-set-2-asymptotic-analysis/" },
          { title: "Time Complexity Analysis Practice", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/practice-questions-time-complexity-analysis/" },
          { title: "Fibonacci Number", source: "leetcode", id: "509", difficulty: "Easy", url: "https://leetcode.com/problems/fibonacci-number/" },
        ],
      },
      {
        type: 'theory',
        title: "Space Complexity — Memory Analysis & Trade-offs",
        problems: [
          { title: "Space Complexity Practice", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/g-fact-86/" },
          { title: "Climbing Stairs", source: "leetcode", id: "70", difficulty: "Easy", url: "https://leetcode.com/problems/climbing-stairs/" },
          { title: "Power of Two", source: "leetcode", id: "231", difficulty: "Easy", url: "https://leetcode.com/problems/power-of-two/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 8 Revision",
        items: [
          "What is the difference between best, average, and worst case complexity?",
          "How do you analyze the complexity of nested loops?",
          "Give an example where time and space complexity are traded off",
        ],
      },
    ],
  },
  {
    day: 9,
    items: [
      {
        type: 'theory',
        title: "Big-Ω, Big-Θ & Common Runtime Classes",
        problems: [
          { title: "Asymptotic Notations Practice", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/analysis-of-algorithms-set-3asymptotic-notations/" },
          { title: "Find First and Last Position in Sorted Array", source: "leetcode", id: "34", difficulty: "Medium", url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/" },
          { title: "Search a 2D Matrix", source: "leetcode", id: "74", difficulty: "Medium", url: "https://leetcode.com/problems/search-a-2d-matrix/" },
        ],
      },
      {
        type: 'theory',
        title: "Amortized Analysis & Complexity Comparison",
        problems: [
          { title: "Amortized Analysis Introduction", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/amortized-analysis-introduction/" },
          { title: "Insert Delete GetRandom O(1)", source: "leetcode", id: "380", difficulty: "Medium", url: "https://leetcode.com/problems/insert-delete-getrandom-o1/" },
          { title: "Min Stack", source: "leetcode", id: "155", difficulty: "Medium", url: "https://leetcode.com/problems/min-stack/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 9 Revision",
        items: [
          "Explain the difference between Big-O, Big-Ω, and Big-Θ",
          "What are the common runtime classes from fastest to slowest?",
          "How does amortized analysis differ from worst-case analysis?",
        ],
      },
    ],
  },
  {
    day: 10,
    items: [
      {
        type: 'theory',
        title: "Complexity Analysis — Practical Problem Solving",
        problems: [
          { title: "Single Number", source: "leetcode", id: "136", difficulty: "Easy", url: "https://leetcode.com/problems/single-number/" },
          { title: "Counting Bits", source: "leetcode", id: "338", difficulty: "Easy", url: "https://leetcode.com/problems/counting-bits/" },
          { title: "Missing Number", source: "leetcode", id: "268", difficulty: "Easy", url: "https://leetcode.com/problems/missing-number/" },
        ],
      },
      {
        type: 'theory',
        title: "Complexity Analysis — Identifying Patterns",
        problems: [
          { title: "Squares of a Sorted Array", source: "leetcode", id: "977", difficulty: "Easy", url: "https://leetcode.com/problems/squares-of-a-sorted-array/" },
          { title: "Move Zeroes", source: "leetcode", id: "283", difficulty: "Easy", url: "https://leetcode.com/problems/move-zeroes/" },
          { title: "Reshape the Matrix", source: "leetcode", id: "566", difficulty: "Easy", url: "https://leetcode.com/problems/reshape-the-matrix/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 10 Revision — Complexity Week Recap",
        items: [
          "Analyze the complexity of merge sort and explain why it's O(n log n)",
          "Why is O(2^n) unacceptable for large inputs? Give an example.",
          "How can you reduce O(n²) to O(n log n) in practice?",
        ],
      },
    ],
  },

  // ============================================================
  // WEEK 3: Sorting Algorithms (Days 11-16)
  // ============================================================
  {
    day: 11,
    items: [
      {
        type: 'theory',
        title: "Bubble Sort — Adjacent Swapping Strategy",
        problems: [
          { title: "Bubble Sort", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/bubble-sort/" },
          { title: "Sort an Array", source: "leetcode", id: "912", difficulty: "Medium", url: "https://leetcode.com/problems/sort-an-array/" },
          { title: "Move Zeroes", source: "leetcode", id: "283", difficulty: "Easy", url: "https://leetcode.com/problems/move-zeroes/" },
        ],
      },
      {
        type: 'theory',
        title: "Selection Sort — Finding the Minimum",
        problems: [
          { title: "Selection Sort", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/selection-sort/" },
          { title: "Find the Kth Largest Element (naive)", source: "leetcode", id: "215", difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 11 Revision",
        items: [
          "Why is bubble sort O(n²) in the worst case?",
          "What optimization makes bubble sort O(n) in the best case?",
          "Compare bubble sort vs selection sort stability",
        ],
      },
    ],
  },
  {
    day: 12,
    items: [
      {
        type: 'theory',
        title: "Insertion Sort — Building Sorted Portion",
        problems: [
          { title: "Insertion Sort List", source: "leetcode", id: "147", difficulty: "Medium", url: "https://leetcode.com/problems/insertion-sort-list/" },
          { title: "Insertion Sort", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/insertion-sort/" },
          { title: "Relative Sort Array", source: "leetcode", id: "1122", difficulty: "Easy", url: "https://leetcode.com/problems/relative-sort-array/" },
        ],
      },
      {
        type: 'theory',
        title: "Counting Sort — Non-Comparison Integer Sorting",
        problems: [
          { title: "Counting Sort", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/counting-sort/" },
          { title: "Sort Colors", source: "leetcode", id: "75", difficulty: "Medium", url: "https://leetcode.com/problems/sort-colors/" },
          { title: "Top K Frequent Elements", source: "leetcode", id: "347", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 12 Revision",
        items: [
          "When is insertion sort preferred over merge sort?",
          "Why is counting sort O(n+k) and when is it impractical?",
          "Is insertion sort stable? Why does stability matter?",
        ],
      },
    ],
  },
  {
    day: 13,
    items: [
      {
        type: 'theory',
        title: "Merge Sort — Divide and Conquer Sorting",
        problems: [
          { title: "Merge Sort", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/merge-sort/" },
          { title: "Sort an Array", source: "leetcode", id: "912", difficulty: "Medium", url: "https://leetcode.com/problems/sort-an-array/" },
          { title: "Sort List", source: "leetcode", id: "148", difficulty: "Medium", url: "https://leetcode.com/problems/sort-list/" },
        ],
      },
      {
        type: 'theory',
        title: "Merge Sort — Applications Beyond Sorting",
        problems: [
          { title: "Count Inversions", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/counting-inversions/" },
          { title: "Count of Smaller Numbers After Self", source: "leetcode", id: "315", difficulty: "Hard", url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/" },
          { title: "Reverse Pairs", source: "leetcode", id: "493", difficulty: "Hard", url: "https://leetcode.com/problems/reverse-pairs/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 13 Revision",
        items: [
          "Explain the merge step of merge sort and its O(n) cost",
          "How does merge sort help count inversions?",
          "What is the space complexity of merge sort and why?",
        ],
      },
    ],
  },
  {
    day: 14,
    items: [
      {
        type: 'theory',
        title: "Quick Sort — Partitioning Strategy",
        problems: [
          { title: "Quick Sort", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/quick-sort/" },
          { title: "Kth Largest Element in an Array", source: "leetcode", id: "215", difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
          { title: "Partition Array According to Given Pivot", source: "leetcode", id: "2161", difficulty: "Medium", url: "https://leetcode.com/problems/partition-array-according-to-given-pivot/" },
        ],
      },
      {
        type: 'theory',
        title: "Quick Sort — Partition Variants & Analysis",
        problems: [
          { title: "Sort Colors (Dutch National Flag)", source: "leetcode", id: "75", difficulty: "Medium", url: "https://leetcode.com/problems/sort-colors/" },
          { title: "Quickselect Algorithm", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/quickselect-algorithm/" },
          { title: "Wiggle Sort II", source: "leetcode", id: "324", difficulty: "Medium", url: "https://leetcode.com/problems/wiggle-sort-ii/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 14 Revision",
        items: [
          "Explain Lomuto vs Hoare partition schemes",
          "Why is quicksort O(n²) worst case and how do we mitigate it?",
          "How does randomized pivot selection help?",
        ],
      },
    ],
  },
  {
    day: 15,
    items: [
      {
        type: 'theory',
        title: "Heap Sort — Building & Extracting from Heaps",
        problems: [
          { title: "Heap Sort", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/heap-sort/" },
          { title: "Kth Largest Element in an Array (heap)", source: "leetcode", id: "215", difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
          { title: "Sort Characters By Frequency", source: "leetcode", id: "451", difficulty: "Medium", url: "https://leetcode.com/problems/sort-characters-by-frequency/" },
        ],
      },
      {
        type: 'theory',
        title: "Priority Queue — Heap Applications",
        problems: [
          { title: "Merge k Sorted Lists", source: "leetcode", id: "23", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
          { title: "Find Median from Data Stream", source: "leetcode", id: "295", difficulty: "Hard", url: "https://leetcode.com/problems/find-median-from-data-stream/" },
          { title: "Top K Frequent Elements (heap approach)", source: "leetcode", id: "347", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 15 Revision",
        items: [
          "Explain heapify and its O(n) construction time",
          "Why is heap sort not stable?",
          "Compare heap sort vs merge sort vs quick sort trade-offs",
        ],
      },
    ],
  },
  {
    day: 16,
    items: [
      {
        type: 'theory',
        title: "Sorting Review — Comparing All Algorithms",
        problems: [
          { title: "Meeting Rooms II", source: "leetcode", id: "253", difficulty: "Medium", url: "https://leetcode.com/problems/meeting-rooms-ii/" },
          { title: "Non-overlapping Intervals", source: "leetcode", id: "435", difficulty: "Medium", url: "https://leetcode.com/problems/non-overlapping-intervals/" },
          { title: "Car Fleet", source: "leetcode", id: "853", difficulty: "Medium", url: "https://leetcode.com/problems/car-fleet/" },
        ],
      },
      {
        type: 'theory',
        title: "Mixed Sort Problems — Choosing the Right Algorithm",
        problems: [
          { title: "Maximum Gap", source: "leetcode", id: "164", difficulty: "Hard", url: "https://leetcode.com/problems/maximum-gap/" },
          { title: "H-Index", source: "leetcode", id: "274", difficulty: "Medium", url: "https://leetcode.com/problems/h-index/" },
          { title: "Largest Number", source: "leetcode", id: "179", difficulty: "Medium", url: "https://leetcode.com/problems/largest-number/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 16 Revision — Sorting Week Recap",
        items: [
          "Create a comparison table of all sorting algorithms (time, space, stability)",
          "When would you choose counting sort over comparison sorts?",
          "Explain why O(n log n) is the lower bound for comparison sorts",
        ],
      },
    ],
  },

  // ============================================================
  // WEEK 4: Search Algorithms (Days 17-18)
  // ============================================================
  {
    day: 17,
    items: [
      {
        type: 'theory',
        title: "Binary Search — The Fundamental Pattern",
        problems: [
          { title: "Binary Search", source: "leetcode", id: "704", difficulty: "Easy", url: "https://leetcode.com/problems/binary-search/" },
          { title: "Search Insert Position", source: "leetcode", id: "35", difficulty: "Easy", url: "https://leetcode.com/problems/search-insert-position/" },
          { title: "Find Minimum in Rotated Sorted Array", source: "leetcode", id: "153", difficulty: "Medium", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
        ],
      },
      {
        type: 'theory',
        title: "Binary Search — Variants & Edge Cases",
        problems: [
          { title: "Search in Rotated Sorted Array", source: "leetcode", id: "33", difficulty: "Medium", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
          { title: "Find Peak Element", source: "leetcode", id: "162", difficulty: "Medium", url: "https://leetcode.com/problems/find-peak-element/" },
          { title: "Search a 2D Matrix II", source: "leetcode", id: "240", difficulty: "Medium", url: "https://leetcode.com/problems/search-a-2d-matrix-ii/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 17 Revision",
        items: [
          "Explain the binary search invariant and loop condition",
          "How do you handle the left vs right boundary in binary search?",
          "Why is binary search on rotated arrays still O(log n)?",
        ],
      },
    ],
  },
  {
    day: 18,
    items: [
      {
        type: 'theory',
        title: "Binary Search on Answer — Parametric Search",
        problems: [
          { title: "Koko Eating Bananas", source: "leetcode", id: "875", difficulty: "Medium", url: "https://leetcode.com/problems/koko-eating-bananas/" },
          { title: "Capacity To Ship Packages Within D Days", source: "leetcode", id: "1011", difficulty: "Medium", url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/" },
          { title: "Split Array Largest Sum", source: "leetcode", id: "410", difficulty: "Hard", url: "https://leetcode.com/problems/split-array-largest-sum/" },
        ],
      },
      {
        type: 'theory',
        title: "Linear Search & Search Revision",
        problems: [
          { title: "Linear Search", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/linear-search/" },
          { title: "Median of Two Sorted Arrays", source: "leetcode", id: "4", difficulty: "Hard", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
          { title: "Search Suggestions System", source: "leetcode", id: "1268", difficulty: "Medium", url: "https://leetcode.com/problems/search-suggestions-system/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 18 Revision — Search Recap",
        items: [
          "Explain the 'binary search on answer' pattern and when to use it",
          "When is linear search preferable to binary search?",
          "How does the median of two sorted arrays use binary search?",
        ],
      },
    ],
  },

  // ============================================================
  // WEEK 5-6: Graph Data Structures (Days 19-26)
  // ============================================================
  {
    day: 19,
    items: [
      {
        type: 'theory',
        title: "Graph Representation — Adjacency List, Matrix & Edge List",
        problems: [
          { title: "Graph Representation", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/graph-and-its-representations/" },
          { title: "Find if Path Exists in Graph", source: "leetcode", id: "1971", difficulty: "Easy", url: "https://leetcode.com/problems/find-if-path-exists-in-graph/" },
          { title: "Number of Provinces", source: "leetcode", id: "547", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-provinces/" },
        ],
      },
      {
        type: 'theory',
        title: "Directed & Undirected Graphs — Types & Properties",
        problems: [
          { title: "Types of Graphs", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/graph-types-and-applications/" },
          { title: "Find the Town Judge", source: "leetcode", id: "997", difficulty: "Easy", url: "https://leetcode.com/problems/find-the-town-judge/" },
          { title: "Course Schedule", source: "leetcode", id: "207", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 19 Revision",
        items: [
          "Compare adjacency list vs adjacency matrix for sparse vs dense graphs",
          "What is the difference between directed and undirected graphs?",
          "How do you detect self-loops and parallel edges in adjacency list?",
        ],
      },
    ],
  },
  {
    day: 20,
    items: [
      {
        type: 'theory',
        title: "BFS — Breadth-First Search on Graphs",
        problems: [
          { title: "BFS of Graph", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/" },
          { title: "Shortest Path in Binary Matrix", source: "leetcode", id: "1091", difficulty: "Medium", url: "https://leetcode.com/problems/shortest-path-in-binary-matrix/" },
          { title: "Word Ladder", source: "leetcode", id: "127", difficulty: "Hard", url: "https://leetcode.com/problems/word-ladder/" },
        ],
      },
      {
        type: 'theory',
        title: "BFS — Level-Order & Shortest Path in Unweighted Graphs",
        problems: [
          { title: "Rotting Oranges", source: "leetcode", id: "994", difficulty: "Medium", url: "https://leetcode.com/problems/rotting-oranges/" },
          { title: "Walls and Gates", source: "leetcode", id: "286", difficulty: "Medium", url: "https://leetcode.com/problems/walls-and-gates/" },
          { title: "Snakes and Ladders", source: "leetcode", id: "909", difficulty: "Medium", url: "https://leetcode.com/problems/snakes-and-ladders/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 20 Revision",
        items: [
          "Why does BFS find the shortest path in unweighted graphs?",
          "Explain BFS with visited set and why it's needed",
          "How to implement BFS for a grid vs an adjacency list graph?",
        ],
      },
    ],
  },
  {
    day: 21,
    items: [
      {
        type: 'theory',
        title: "DFS — Depth-First Search on Graphs",
        problems: [
          { title: "DFS of Graph", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/" },
          { title: "Number of Islands", source: "leetcode", id: "200", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/" },
          { title: "Max Area of Island", source: "leetcode", id: "695", difficulty: "Medium", url: "https://leetcode.com/problems/max-area-of-island/" },
        ],
      },
      {
        type: 'theory',
        title: "DFS — Connected Components & Cycle Detection",
        problems: [
          { title: "Clone Graph", source: "leetcode", id: "133", difficulty: "Medium", url: "https://leetcode.com/problems/clone-graph/" },
          { title: "Pacific Atlantic Water Flow", source: "leetcode", id: "417", difficulty: "Medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
          { title: "Course Schedule (DFS cycle detection)", source: "leetcode", id: "207", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 21 Revision",
        items: [
          "Compare DFS vs BFS: when to use which?",
          "How does DFS detect cycles in directed vs undirected graphs?",
          "Explain recursive vs iterative DFS implementation",
        ],
      },
    ],
  },
  {
    day: 22,
    items: [
      {
        type: 'theory',
        title: "Dijkstra's Algorithm — Single Source Shortest Path",
        problems: [
          { title: "Dijkstra's Algorithm", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/" },
          { title: "Network Delay Time", source: "leetcode", id: "743", difficulty: "Medium", url: "https://leetcode.com/problems/network-delay-time/" },
          { title: "Path with Minimum Effort", source: "leetcode", id: "1631", difficulty: "Medium", url: "https://leetcode.com/problems/path-with-minimum-effort/" },
        ],
      },
      {
        type: 'theory',
        title: "Dijkstra — Variants & Multi-State Shortest Path",
        problems: [
          { title: "Cheapest Flights Within K Stops", source: "leetcode", id: "787", difficulty: "Medium", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/" },
          { title: "Swim in Rising Water", source: "leetcode", id: "778", difficulty: "Hard", url: "https://leetcode.com/problems/swim-in-rising-water/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 22 Revision",
        items: [
          "Why doesn't Dijkstra work with negative edge weights?",
          "Explain the priority queue optimization in Dijkstra",
          "How does Dijkstra with state differ from standard Dijkstra?",
        ],
      },
    ],
  },
  {
    day: 23,
    items: [
      {
        type: 'theory',
        title: "Bellman-Ford Algorithm — Handling Negative Weights",
        problems: [
          { title: "Bellman-Ford Algorithm", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/" },
          { title: "Cheapest Flights Within K Stops (Bellman-Ford)", source: "leetcode", id: "787", difficulty: "Medium", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/" },
          { title: "Negative Weight Cycle Detection", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/detect-negative-cycle-graph-bellman-ford/" },
        ],
      },
      {
        type: 'theory',
        title: "Floyd-Warshall — All Pairs Shortest Path",
        problems: [
          { title: "Floyd Warshall Algorithm", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/" },
          { title: "Find the City With the Smallest Number of Neighbors", source: "leetcode", id: "1334", difficulty: "Medium", url: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/" },
          { title: "Evaluate Division", source: "leetcode", id: "399", difficulty: "Medium", url: "https://leetcode.com/problems/evaluate-division/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 23 Revision",
        items: [
          "How does Bellman-Ford detect negative weight cycles?",
          "Compare Dijkstra vs Bellman-Ford vs Floyd-Warshall",
          "When is Floyd-Warshall preferred over running Dijkstra N times?",
        ],
      },
    ],
  },
  {
    day: 24,
    items: [
      {
        type: 'theory',
        title: "A* Algorithm — Heuristic-Guided Search",
        problems: [
          { title: "A* Search Algorithm", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/a-search-algorithm/" },
          { title: "Shortest Path in a Grid with Obstacles", source: "leetcode", id: "1293", difficulty: "Hard", url: "https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/" },
          { title: "The Maze II", source: "leetcode", id: "505", difficulty: "Medium", url: "https://leetcode.com/problems/the-maze-ii/" },
        ],
      },
      {
        type: 'theory',
        title: "Shortest Path Variants — 0-1 BFS & Bidirectional BFS",
        problems: [
          { title: "Minimum Cost to Make at Least One Valid Path", source: "leetcode", id: "1368", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/" },
          { title: "0-1 BFS", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/0-1-bfs-shortest-path-binary-graph/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 24 Revision",
        items: [
          "How does A* guarantee optimality with an admissible heuristic?",
          "When is 0-1 BFS more efficient than Dijkstra?",
          "Explain bidirectional BFS and its speedup factor",
        ],
      },
    ],
  },
  {
    day: 25,
    items: [
      {
        type: 'theory',
        title: "Minimum Spanning Tree — Prim's Algorithm",
        problems: [
          { title: "Prim's Algorithm", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/" },
          { title: "Min Cost to Connect All Points", source: "leetcode", id: "1584", difficulty: "Medium", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/" },
          { title: "Connecting Cities With Minimum Cost", source: "leetcode", id: "1135", difficulty: "Medium", url: "https://leetcode.com/problems/connecting-cities-with-minimum-cost/" },
        ],
      },
      {
        type: 'theory',
        title: "Minimum Spanning Tree — Kruskal's Algorithm & Union-Find",
        problems: [
          { title: "Kruskal's Algorithm", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/" },
          { title: "Optimize Water Distribution in a Village", source: "leetcode", id: "1168", difficulty: "Hard", url: "https://leetcode.com/problems/optimize-water-distribution-in-a-village/" },
          { title: "Redundant Connection", source: "leetcode", id: "684", difficulty: "Medium", url: "https://leetcode.com/problems/redundant-connection/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 25 Revision",
        items: [
          "Compare Prim's vs Kruskal's: when to use which?",
          "How does Kruskal's use Union-Find to detect cycles?",
          "What is the cut property and why does it make MST algorithms correct?",
        ],
      },
    ],
  },
  {
    day: 26,
    items: [
      {
        type: 'theory',
        title: "Graph Review — Topological Sort & Strongly Connected Components",
        problems: [
          { title: "Course Schedule II", source: "leetcode", id: "210", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule-ii/" },
          { title: "Alien Dictionary", source: "leetcode", id: "269", difficulty: "Hard", url: "https://leetcode.com/problems/alien-dictionary/" },
          { title: "Critical Connections in a Network", source: "leetcode", id: "1192", difficulty: "Hard", url: "https://leetcode.com/problems/critical-connections-in-a-network/" },
        ],
      },
      {
        type: 'theory',
        title: "Graph Mixed Problems — B/B+ Trees, Skip List, ISAM Overview",
        problems: [
          { title: "B and B+ Trees", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/introduction-of-b-tree/" },
          { title: "Design Skiplist", source: "leetcode", id: "1206", difficulty: "Hard", url: "https://leetcode.com/problems/design-skiplist/" },
          { title: "Accounts Merge", source: "leetcode", id: "721", difficulty: "Medium", url: "https://leetcode.com/problems/accounts-merge/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 26 Revision — Graph Week Recap",
        items: [
          "Explain the difference between bridges and articulation points",
          "How does topological sort work and when is it applicable?",
          "Summarize all shortest path algorithms and their use cases",
        ],
      },
    ],
  },

  // ============================================================
  // WEEK 7-8: Tree Data Structures (Days 27-34)
  // ============================================================
  {
    day: 27,
    items: [
      {
        type: 'theory',
        title: "Binary Trees — Structure & Properties",
        problems: [
          { title: "Binary Tree", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/introduction-to-binary-trees/" },
          { title: "Maximum Depth of Binary Tree", source: "leetcode", id: "104", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
          { title: "Same Tree", source: "leetcode", id: "100", difficulty: "Easy", url: "https://leetcode.com/problems/same-tree/" },
          { title: "Invert Binary Tree", source: "leetcode", id: "226", difficulty: "Easy", url: "https://leetcode.com/problems/invert-binary-tree/" },
        ],
      },
      {
        type: 'theory',
        title: "Binary Trees — Level-Order & BFS Traversal",
        problems: [
          { title: "Binary Tree Level Order Traversal", source: "leetcode", id: "102", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
          { title: "Binary Tree Right Side View", source: "leetcode", id: "199", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-right-side-view/" },
          { title: "Average of Levels in Binary Tree", source: "leetcode", id: "637", difficulty: "Easy", url: "https://leetcode.com/problems/average-of-levels-in-binary-tree/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 27 Revision",
        items: [
          "What is the difference between a full, complete, and perfect binary tree?",
          "How does level-order traversal use BFS on a tree?",
          "What is the maximum number of nodes at depth d of a binary tree?",
        ],
      },
    ],
  },
  {
    day: 28,
    items: [
      {
        type: 'theory',
        title: "In-Order & Pre-Order Traversal — DFS Patterns",
        problems: [
          { title: "Binary Tree Inorder Traversal", source: "leetcode", id: "94", difficulty: "Easy", url: "https://leetcode.com/problems/binary-tree-inorder-traversal/" },
          { title: "Binary Tree Preorder Traversal", source: "leetcode", id: "144", difficulty: "Easy", url: "https://leetcode.com/problems/binary-tree-preorder-traversal/" },
          { title: "Validate Binary Search Tree", source: "leetcode", id: "98", difficulty: "Medium", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
          { title: "Kth Smallest Element in a BST", source: "leetcode", id: "230", difficulty: "Medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
        ],
      },
      {
        type: 'theory',
        title: "Post-Order Traversal & Construction from Traversals",
        problems: [
          { title: "Binary Tree Postorder Traversal", source: "leetcode", id: "145", difficulty: "Easy", url: "https://leetcode.com/problems/binary-tree-postorder-traversal/" },
          { title: "Construct Binary Tree from Preorder and Inorder", source: "leetcode", id: "105", difficulty: "Medium", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
          { title: "Construct Binary Tree from Inorder and Postorder", source: "leetcode", id: "106", difficulty: "Medium", url: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 28 Revision",
        items: [
          "What is the order of visiting nodes in in-order, pre-order, post-order?",
          "Can you construct a unique tree from pre-order + post-order?",
          "How does Morris traversal achieve O(1) space for in-order?",
        ],
      },
    ],
  },
  {
    day: 29,
    items: [
      {
        type: 'theory',
        title: "Binary Search Trees — Properties & Operations",
        problems: [
          { title: "Search in a Binary Search Tree", source: "leetcode", id: "700", difficulty: "Easy", url: "https://leetcode.com/problems/search-in-a-binary-search-tree/" },
          { title: "Insert into a Binary Search Tree", source: "leetcode", id: "701", difficulty: "Medium", url: "https://leetcode.com/problems/insert-into-a-binary-search-tree/" },
          { title: "Delete Node in a BST", source: "leetcode", id: "450", difficulty: "Medium", url: "https://leetcode.com/problems/delete-node-in-a-bst/" },
        ],
      },
      {
        type: 'theory',
        title: "BST — Advanced Problems & Inorder Predecessor/Successor",
        problems: [
          { title: "Lowest Common Ancestor of a BST", source: "leetcode", id: "235", difficulty: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
          { title: "Convert Sorted Array to Binary Search Tree", source: "leetcode", id: "108", difficulty: "Easy", url: "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/" },
          { title: "Two Sum IV - Input is a BST", source: "leetcode", id: "653", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 29 Revision",
        items: [
          "Why is BST search O(log n) on average but O(n) worst case?",
          "Explain the three cases for BST node deletion",
          "How do you find inorder predecessor and successor in a BST?",
        ],
      },
    ],
  },
  {
    day: 30,
    items: [
      {
        type: 'theory',
        title: "AVL Trees — Self-Balancing BST",
        problems: [
          { title: "AVL Tree Insertion", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/avl-tree-set-1-insertion/" },
          { title: "AVL Tree Deletion", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/avl-tree-set-2-deletion/" },
          { title: "Balance a Binary Search Tree", source: "leetcode", id: "1382", difficulty: "Medium", url: "https://leetcode.com/problems/balance-a-binary-search-tree/" },
        ],
      },
      {
        type: 'theory',
        title: "AVL Trees — Rotations & Balancing Factor",
        problems: [
          { title: "AVL Tree Rotations", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/introduction-to-avl-tree/" },
          { title: "Count Balanced Binary Trees of Height h", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/count-balanced-binary-trees-of-height-h/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 30 Revision",
        items: [
          "Explain the four rotation types in AVL trees (LL, RR, LR, RL)",
          "What is the balance factor and how does it trigger rotations?",
          "Why does AVL guarantee O(log n) height?",
        ],
      },
    ],
  },
  {
    day: 31,
    items: [
      {
        type: 'theory',
        title: "B-Trees — Multi-Way Search Trees",
        problems: [
          { title: "Introduction to B-Trees", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/introduction-of-b-tree/" },
          { title: "B-Tree Insertion", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/b-tree-set-1-insert-2/" },
          { title: "B-Tree Search", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/b-tree-set-1-introduction-2/" },
        ],
      },
      {
        type: 'theory',
        title: "B+ Trees — Database Indexing Structure",
        problems: [
          { title: "Introduction to B+ Trees", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/introduction-of-b-tree-2/" },
          { title: "Difference between B-Tree and B+ Tree", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/difference-between-b-tree-and-b-tree/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 31 Revision",
        items: [
          "Why are B-Trees used in databases and file systems?",
          "What is the minimum degree of a B-Tree and how does it affect height?",
          "How do B+ Trees differ from B-Trees in range queries?",
        ],
      },
    ],
  },
  {
    day: 32,
    items: [
      {
        type: 'theory',
        title: "Heaps — Min Heap & Max Heap Operations",
        problems: [
          { title: "Heap Data Structure", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/heap-data-structure/" },
          { title: "Kth Largest Element in a Stream", source: "leetcode", id: "703", difficulty: "Easy", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
          { title: "Last Stone Weight", source: "leetcode", id: "1046", difficulty: "Easy", url: "https://leetcode.com/problems/last-stone-weight/" },
        ],
      },
      {
        type: 'theory',
        title: "Priority Queues — Heap Applications in Trees",
        problems: [
          { title: "Merge k Sorted Lists", source: "leetcode", id: "23", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
          { title: "Find Median from Data Stream", source: "leetcode", id: "295", difficulty: "Hard", url: "https://leetcode.com/problems/find-median-from-data-stream/" },
          { title: "Reorganize String", source: "leetcode", id: "767", difficulty: "Medium", url: "https://leetcode.com/problems/reorganize-string/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 32 Revision",
        items: [
          "Explain heapify up and heapify down operations",
          "How do two heaps solve the median from data stream problem?",
          "When to use a heap vs sorted array vs BST for order statistics?",
        ],
      },
    ],
  },
  {
    day: 33,
    items: [
      {
        type: 'theory',
        title: "Tree BFS — Level-Order & Zigzag Problems",
        problems: [
          { title: "Binary Tree Zigzag Level Order Traversal", source: "leetcode", id: "103", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/" },
          { title: "Populating Next Right Pointers in Each Node", source: "leetcode", id: "116", difficulty: "Medium", url: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/" },
          { title: "Binary Tree Vertical Order Traversal", source: "leetcode", id: "987", difficulty: "Hard", url: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/" },
        ],
      },
      {
        type: 'theory',
        title: "Tree DFS — Path & Depth Problems",
        problems: [
          { title: "Path Sum", source: "leetcode", id: "112", difficulty: "Easy", url: "https://leetcode.com/problems/path-sum/" },
          { title: "Binary Tree Maximum Path Sum", source: "leetcode", id: "124", difficulty: "Hard", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
          { title: "Diameter of Binary Tree", source: "leetcode", id: "543", difficulty: "Easy", url: "https://leetcode.com/problems/diameter-of-binary-tree/" },
          { title: "Lowest Common Ancestor of a Binary Tree", source: "leetcode", id: "236", difficulty: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 33 Revision",
        items: [
          "How to serialize and deserialize a binary tree?",
          "Explain the 'bottom-up' DFS pattern for tree problems",
          "How does the diameter problem avoid double-counting paths?",
        ],
      },
    ],
  },
  {
    day: 34,
    items: [
      {
        type: 'theory',
        title: "Tree Mixed Review — Serialization & Construction",
        problems: [
          { title: "Serialize and Deserialize Binary Tree", source: "leetcode", id: "297", difficulty: "Hard", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
          { title: "Construct Binary Tree from String", source: "leetcode", id: "536", difficulty: "Medium", url: "https://leetcode.com/problems/construct-binary-tree-from-string/" },
          { title: "Flatten Binary Tree to Linked List", source: "leetcode", id: "114", difficulty: "Medium", url: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/" },
        ],
      },
      {
        type: 'theory',
        title: "Tree Mixed Review — Advanced Tree Problems",
        problems: [
          { title: "Boundary of Binary Tree", source: "leetcode", id: "545", difficulty: "Medium", url: "https://leetcode.com/problems/boundary-of-binary-tree/" },
          { title: "Binary Tree Cameras", source: "leetcode", id: "968", difficulty: "Hard", url: "https://leetcode.com/problems/binary-tree-cameras/" },
          { title: "Unique Binary Search Trees", source: "leetcode", id: "96", difficulty: "Medium", url: "https://leetcode.com/problems/unique-binary-search-trees/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 34 Revision — Tree Week Recap",
        items: [
          "Summarize all tree traversal methods and their use cases",
          "When to use DFS vs BFS on trees?",
          "How do self-balancing trees (AVL, Red-Black) maintain balance?",
        ],
      },
    ],
  },

  // ============================================================
  // WEEK 9: Advanced Data Structures (Days 35-39)
  // ============================================================
  {
    day: 35,
    items: [
      {
        type: 'theory',
        title: "Trie (Prefix Tree) — Structure & Operations",
        problems: [
          { title: "Implement Trie (Prefix Tree)", source: "leetcode", id: "208", difficulty: "Medium", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
          { title: "Design Add and Search Words", source: "leetcode", id: "211", difficulty: "Medium", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
          { title: "Word Search II", source: "leetcode", id: "212", difficulty: "Hard", url: "https://leetcode.com/problems/word-search-ii/" },
        ],
      },
      {
        type: 'theory',
        title: "Trie — Advanced Applications",
        problems: [
          { title: "Maximum XOR of Two Numbers in an Array", source: "leetcode", id: "421", difficulty: "Medium", url: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/" },
          { title: "Replace Words", source: "leetcode", id: "648", difficulty: "Medium", url: "https://leetcode.com/problems/replace-words/" },
          { title: "Concatenated Words", source: "leetcode", id: "472", difficulty: "Hard", url: "https://leetcode.com/problems/concatenated-words/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 35 Revision",
        items: [
          "What is the space complexity of a trie for storing N words of length L?",
          "How does a trie improve over hash set for prefix-based queries?",
          "Explain the XOR trie technique for maximum XOR problems",
        ],
      },
    ],
  },
  {
    day: 36,
    items: [
      {
        type: 'theory',
        title: "Segment Trees — Range Query Structure",
        problems: [
          { title: "Segment Tree", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/segment-tree-data-structure/" },
          { title: "Range Sum Query - Mutable", source: "leetcode", id: "307", difficulty: "Medium", url: "https://leetcode.com/problems/range-sum-query-mutable/" },
          { title: "Range Module", source: "leetcode", id: "715", difficulty: "Hard", url: "https://leetcode.com/problems/range-module/" },
        ],
      },
      {
        type: 'theory',
        title: "Segment Trees — Lazy Propagation",
        problems: [
          { title: "Lazy Propagation in Segment Tree", source: "gfg", difficulty: "Hard", url: "https://www.geeksforgeeks.org/lazy-propagation-in-segment-tree/" },
          { title: "My Calendar III", source: "leetcode", id: "732", difficulty: "Hard", url: "https://leetcode.com/problems/my-calendar-iii/" },
          { title: "Count of Range Sum", source: "leetcode", id: "327", difficulty: "Hard", url: "https://leetcode.com/problems/count-of-range-sum/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 36 Revision",
        items: [
          "How does a segment tree achieve O(log n) for range queries and updates?",
          "Explain lazy propagation with an example",
          "When would you use a segment tree vs Fenwick tree?",
        ],
      },
    ],
  },
  {
    day: 37,
    items: [
      {
        type: 'theory',
        title: "Fenwick Trees (Binary Indexed Trees) — Point Updates & Range Queries",
        problems: [
          { title: "Binary Indexed Tree", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/" },
          { title: "NumArray (Fenwick Tree approach)", source: "leetcode", id: "307", difficulty: "Medium", url: "https://leetcode.com/problems/range-sum-query-mutable/" },
          { title: "Count of Smaller Numbers After Self", source: "leetcode", id: "315", difficulty: "Hard", url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/" },
        ],
      },
      {
        type: 'theory',
        title: "Fenwick Trees — 2D BIT & Advanced Applications",
        problems: [
          { title: "Range Sum Query 2D - Mutable", source: "leetcode", id: "308", difficulty: "Hard", url: "https://leetcode.com/problems/range-sum-query-2d-mutable/" },
          { title: "Reverse Pairs", source: "leetcode", id: "493", difficulty: "Hard", url: "https://leetcode.com/problems/reverse-pairs/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 37 Revision",
        items: [
          "How does the lowbit operation work in Fenwick trees?",
          "Compare Fenwick tree vs Segment tree complexity and flexibility",
          "How to convert a point-update BIT to support range updates?",
        ],
      },
    ],
  },
  {
    day: 38,
    items: [
      {
        type: 'theory',
        title: "Disjoint Set (Union-Find) — Structure & Path Compression",
        problems: [
          { title: "Disjoint Set Data Structure", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/disjoint-set-data-structures/" },
          { title: "Number of Provinces", source: "leetcode", id: "547", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-provinces/" },
          { title: "Graph Valid Tree", source: "leetcode", id: "261", difficulty: "Medium", url: "https://leetcode.com/problems/graph-valid-tree/" },
        ],
      },
      {
        type: 'theory',
        title: "Union-Find — Advanced Applications",
        problems: [
          { title: "Accounts Merge", source: "leetcode", id: "721", difficulty: "Medium", url: "https://leetcode.com/problems/accounts-merge/" },
          { title: "Longest Consecutive Sequence (Union-Find)", source: "leetcode", id: "128", difficulty: "Medium", url: "https://leetcode.com/problems/longest-consecutive-sequence/" },
          { title: "Swim in Rising Water", source: "leetcode", id: "778", difficulty: "Hard", url: "https://leetcode.com/problems/swim-in-rising-water/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 38 Revision",
        items: [
          "Explain union by rank vs union by size",
          "How does path compression achieve near O(1) amortized operations?",
          "When to use Union-Find vs DFS for connectivity problems?",
        ],
      },
    ],
  },
  {
    day: 39,
    items: [
      {
        type: 'theory',
        title: "Suffix Trees — Pattern Matching Structure",
        problems: [
          { title: "Suffix Tree", source: "gfg", difficulty: "Hard", url: "https://www.geeksforgeeks.org/suffix-tree-application-1-substring-check/" },
          { title: "Longest Duplicate Substring", source: "leetcode", id: "1044", difficulty: "Hard", url: "https://leetcode.com/problems/longest-duplicate-substring/" },
          { title: "Repeated Substring Pattern", source: "leetcode", id: "459", difficulty: "Medium", url: "https://leetcode.com/problems/repeated-substring-pattern/" },
        ],
      },
      {
        type: 'theory',
        title: "Suffix Arrays — Space-Efficient Alternative",
        problems: [
          { title: "Suffix Array", source: "gfg", difficulty: "Hard", url: "https://www.geeksforgeeks.org/suffix-array-set-1-introduction/" },
          { title: "Longest Common Prefix Array", source: "gfg", difficulty: "Hard", url: "https://www.geeksforgeeks.org/%c2%ad%c2%adkasais-algorithm-for-construction-of-lcp-array-from-suffix-array/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 39 Revision — Advanced DS Recap",
        items: [
          "Compare suffix tree vs suffix array for string matching",
          "How does a trie differ from a suffix tree?",
          "When would you choose a Fenwick tree over a segment tree?",
        ],
      },
    ],
  },

  // ============================================================
  // WEEK 10-12: Algorithm Techniques (Days 40-50)
  // ============================================================
  {
    day: 40,
    items: [
      {
        type: 'theory',
        title: "Brute Force — Exhaustive Search Technique",
        problems: [
          { title: "Two Sum (brute force)", source: "leetcode", id: "1", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/" },
          { title: "3Sum", source: "leetcode", id: "15", difficulty: "Medium", url: "https://leetcode.com/problems/3sum/" },
          { title: "Substring with Concatenation of All Words", source: "leetcode", id: "30", difficulty: "Hard", url: "https://leetcode.com/problems/substring-with-concatenation-of-all-words/" },
        ],
      },
      {
        type: 'theory',
        title: "Recursion — Base Cases & Recursive Cases",
        problems: [
          { title: "Fibonacci Number", source: "leetcode", id: "509", difficulty: "Easy", url: "https://leetcode.com/problems/fibonacci-number/" },
          { title: "Power of Three", source: "leetcode", id: "326", difficulty: "Easy", url: "https://leetcode.com/problems/power-of-three/" },
          { title: "Pow(x, n)", source: "leetcode", id: "50", difficulty: "Medium", url: "https://leetcode.com/problems/powx-n/" },
          { title: "Generate Parentheses", source: "leetcode", id: "22", difficulty: "Medium", url: "https://leetcode.com/problems/generate-parentheses/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 40 Revision",
        items: [
          "When is brute force acceptable and when is optimization needed?",
          "Explain the call stack in recursive functions",
          "How do you identify overlapping subproblems in recursion?",
        ],
      },
    ],
  },
  {
    day: 41,
    items: [
      {
        type: 'theory',
        title: "Backtracking — Systematic Search with Pruning",
        problems: [
          { title: "Permutations", source: "leetcode", id: "46", difficulty: "Medium", url: "https://leetcode.com/problems/permutations/" },
          { title: "Subsets", source: "leetcode", id: "78", difficulty: "Medium", url: "https://leetcode.com/problems/subsets/" },
          { title: "Combination Sum", source: "leetcode", id: "39", difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum/" },
        ],
      },
      {
        type: 'theory',
        title: "Backtracking — Constraints & Pruning Strategies",
        problems: [
          { title: "N-Queens", source: "leetcode", id: "51", difficulty: "Hard", url: "https://leetcode.com/problems/n-queens/" },
          { title: "Letter Combinations of a Phone Number", source: "leetcode", id: "17", difficulty: "Medium", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
          { title: "Word Search", source: "leetcode", id: "79", difficulty: "Medium", url: "https://leetcode.com/problems/word-search/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 41 Revision",
        items: [
          "How does backtracking differ from brute force?",
          "Explain the choose-explore-unchoose pattern",
          "What pruning strategies can reduce backtracking search space?",
        ],
      },
    ],
  },
  {
    day: 42,
    items: [
      {
        type: 'theory',
        title: "Backtracking Advanced — Complex Constraint Problems",
        problems: [
          { title: "Sudoku Solver", source: "leetcode", id: "37", difficulty: "Hard", url: "https://leetcode.com/problems/sudoku-solver/" },
          { title: "Palindrome Partitioning", source: "leetcode", id: "131", difficulty: "Medium", url: "https://leetcode.com/problems/palindrome-partitioning/" },
          { title: "Restore IP Addresses", source: "leetcode", id: "93", difficulty: "Medium", url: "https://leetcode.com/problems/restore-ip-addresses/" },
        ],
      },
      {
        type: 'theory',
        title: "Backtracking — Combination & Selection Problems",
        problems: [
          { title: "Combination Sum II", source: "leetcode", id: "40", difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum-ii/" },
          { title: "Partition to K Equal Sum Subsets", source: "leetcode", id: "698", difficulty: "Medium", url: "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/" },
          { title: "Word Break II", source: "leetcode", id: "140", difficulty: "Hard", url: "https://leetcode.com/problems/word-break-ii/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 42 Revision",
        items: [
          "How to handle duplicates in combination problems?",
          "Explain memoization as an optimization for backtracking",
          "When to use backtracking vs DP for combinatorial problems?",
        ],
      },
    ],
  },
  {
    day: 43,
    items: [
      {
        type: 'theory',
        title: "Divide and Conquer — Split, Solve, Merge",
        problems: [
          { title: "Merge Sort (D&C)", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/merge-sort/" },
          { title: "Maximum Subarray (D&C approach)", source: "leetcode", id: "53", difficulty: "Medium", url: "https://leetcode.com/problems/maximum-subarray/" },
          { title: "Count Inversions", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/counting-inversions/" },
        ],
      },
      {
        type: 'theory',
        title: "Divide and Conquer — Advanced Applications",
        problems: [
          { title: "Merge k Sorted Lists", source: "leetcode", id: "23", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
          { title: "Beautiful Array", source: "leetcode", id: "932", difficulty: "Medium", url: "https://leetcode.com/problems/beautiful-array/" },
          { title: "Count of Range Sum", source: "leetcode", id: "327", difficulty: "Hard", url: "https://leetcode.com/problems/count-of-range-sum/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 43 Revision",
        items: [
          "What is the master theorem and how does it apply to D&C?",
          "How does D&C differ from dynamic programming?",
          "Explain the D&C approach for counting inversions",
        ],
      },
    ],
  },
  {
    day: 44,
    items: [
      {
        type: 'theory',
        title: "Greedy Algorithms — Local Optimal Choices",
        problems: [
          { title: "Jump Game", source: "leetcode", id: "55", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game/" },
          { title: "Jump Game II", source: "leetcode", id: "45", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game-ii/" },
          { title: "Assign Cookies", source: "leetcode", id: "455", difficulty: "Easy", url: "https://leetcode.com/problems/assign-cookies/" },
        ],
      },
      {
        type: 'theory',
        title: "Greedy — Activity Selection & Interval Scheduling",
        problems: [
          { title: "Activity Selection Problem", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/" },
          { title: "Non-overlapping Intervals", source: "leetcode", id: "435", difficulty: "Medium", url: "https://leetcode.com/problems/non-overlapping-intervals/" },
          { title: "Minimum Number of Arrows to Burst Balloons", source: "leetcode", id: "452", difficulty: "Medium", url: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 44 Revision",
        items: [
          "How do you prove a greedy algorithm is correct?",
          "When does greedy fail and DP is needed?",
          "Explain the exchange argument for greedy proof",
        ],
      },
    ],
  },
  {
    day: 45,
    items: [
      {
        type: 'theory',
        title: "Greedy Advanced — Scheduling & Resource Allocation",
        problems: [
          { title: "Task Scheduler", source: "leetcode", id: "621", difficulty: "Medium", url: "https://leetcode.com/problems/task-scheduler/" },
          { title: "Course Schedule III", source: "leetcode", id: "630", difficulty: "Hard", url: "https://leetcode.com/problems/course-schedule-iii/" },
          { title: "Candy", source: "leetcode", id: "135", difficulty: "Hard", url: "https://leetcode.com/problems/candy/" },
        ],
      },
      {
        type: 'theory',
        title: "Greedy Advanced — Gas Station & Fractional Problems",
        problems: [
          { title: "Gas Station", source: "leetcode", id: "134", difficulty: "Medium", url: "https://leetcode.com/problems/gas-station/" },
          { title: "Fractional Knapsack", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/fractional-knapsack-problem/" },
          { title: "Minimum Number of Refueling Stops", source: "leetcode", id: "871", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-number-of-refueling-stops/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 45 Revision",
        items: [
          "How does the greedy choice for gas station problem work?",
          "Compare 0/1 knapsack (DP) vs fractional knapsack (greedy)",
          "Explain the two-pass greedy technique in the Candy problem",
        ],
      },
    ],
  },
  {
    day: 46,
    items: [
      {
        type: 'theory',
        title: "Dynamic Programming — Introduction & Overlapping Subproblems",
        problems: [
          { title: "Climbing Stairs", source: "leetcode", id: "70", difficulty: "Easy", url: "https://leetcode.com/problems/climbing-stairs/" },
          { title: "House Robber", source: "leetcode", id: "198", difficulty: "Medium", url: "https://leetcode.com/problems/house-robber/" },
          { title: "Coin Change", source: "leetcode", id: "322", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/" },
        ],
      },
      {
        type: 'theory',
        title: "DP — Top-Down (Memoization) vs Bottom-Up (Tabulation)",
        problems: [
          { title: "Fibonacci Number (memoized)", source: "leetcode", id: "509", difficulty: "Easy", url: "https://leetcode.com/problems/fibonacci-number/" },
          { title: "Min Cost Climbing Stairs", source: "leetcode", id: "746", difficulty: "Easy", url: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
          { title: "Decode Ways", source: "leetcode", id: "91", difficulty: "Medium", url: "https://leetcode.com/problems/decode-ways/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 46 Revision",
        items: [
          "What is the difference between memoization and tabulation?",
          "How do you identify if a problem has optimal substructure?",
          "Explain the state transition in the Coin Change problem",
        ],
      },
    ],
  },
  {
    day: 47,
    items: [
      {
        type: 'theory',
        title: "DP — 1D Problems: Sequences & Subarrays",
        problems: [
          { title: "Longest Increasing Subsequence", source: "leetcode", id: "300", difficulty: "Medium", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
          { title: "Word Break", source: "leetcode", id: "139", difficulty: "Medium", url: "https://leetcode.com/problems/word-break/" },
          { title: "Maximum Subarray (DP)", source: "leetcode", id: "53", difficulty: "Medium", url: "https://leetcode.com/problems/maximum-subarray/" },
        ],
      },
      {
        type: 'theory',
        title: "DP — 1D Problems: House Robber Variants & Stickers",
        problems: [
          { title: "House Robber II", source: "leetcode", id: "213", difficulty: "Medium", url: "https://leetcode.com/problems/house-robber-ii/" },
          { title: "Partition Equal Subset Sum", source: "leetcode", id: "416", difficulty: "Medium", url: "https://leetcode.com/problems/partition-equal-subset-sum/" },
          { title: "Target Sum", source: "leetcode", id: "494", difficulty: "Medium", url: "https://leetcode.com/problems/target-sum/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 47 Revision",
        items: [
          "How does the O(n log n) LIS algorithm using binary search work?",
          "Explain the subset sum DP and its relation to partition problems",
          "How to handle circular arrays in DP (House Robber II)?",
        ],
      },
    ],
  },
  {
    day: 48,
    items: [
      {
        type: 'theory',
        title: "DP — 2D Problems: Grid & Matrix",
        problems: [
          { title: "Unique Paths", source: "leetcode", id: "62", difficulty: "Medium", url: "https://leetcode.com/problems/unique-paths/" },
          { title: "Unique Paths II", source: "leetcode", id: "63", difficulty: "Medium", url: "https://leetcode.com/problems/unique-paths-ii/" },
          { title: "Minimum Path Sum", source: "leetcode", id: "64", difficulty: "Medium", url: "https://leetcode.com/problems/minimum-path-sum/" },
        ],
      },
      {
        type: 'theory',
        title: "DP — 2D Problems: String Matching & LCS",
        problems: [
          { title: "Longest Common Subsequence", source: "leetcode", id: "1143", difficulty: "Medium", url: "https://leetcode.com/problems/longest-common-subsequence/" },
          { title: "Edit Distance", source: "leetcode", id: "72", difficulty: "Medium", url: "https://leetcode.com/problems/edit-distance/" },
          { title: "Interleaving String", source: "leetcode", id: "97", difficulty: "Medium", url: "https://leetcode.com/problems/interleaving-string/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 48 Revision",
        items: [
          "How does the 2D DP table for LCS work?",
          "Explain the recurrence for Edit Distance",
          "When can you optimize 2D DP space from O(mn) to O(min(m,n))?",
        ],
      },
    ],
  },
  {
    day: 49,
    items: [
      {
        type: 'theory',
        title: "DP Advanced — Knapsack & Interval DP",
        problems: [
          { title: "0/1 Knapsack Problem", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/" },
          { title: "Burst Balloons", source: "leetcode", id: "312", difficulty: "Hard", url: "https://leetcode.com/problems/burst-balloons/" },
          { title: "Minimum Score Triangulation of Polygon", source: "leetcode", id: "1039", difficulty: "Medium", url: "https://leetcode.com/problems/minimum-score-triangulation-of-polygon/" },
        ],
      },
      {
        type: 'theory',
        title: "DP Advanced — State Machines & Bitmask DP",
        problems: [
          { title: "Best Time to Buy and Sell Stock III", source: "leetcode", id: "123", difficulty: "Hard", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/" },
          { title: "Best Time to Buy and Sell Stock with Cooldown", source: "leetcode", id: "309", difficulty: "Medium", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/" },
          { title: "Smallest Sufficient Team", source: "leetcode", id: "1125", difficulty: "Hard", url: "https://leetcode.com/problems/smallest-sufficient-team/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 49 Revision",
        items: [
          "How does interval DP define its state differently from sequence DP?",
          "Explain the state machine DP approach for stock problems",
          "When do you need bitmask in DP state representation?",
        ],
      },
    ],
  },
  {
    day: 50,
    items: [
      {
        type: 'theory',
        title: "Two Pointer Technique — Opposite Ends & Same Direction",
        problems: [
          { title: "Two Sum II - Input Array Is Sorted", source: "leetcode", id: "167", difficulty: "Medium", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
          { title: "3Sum", source: "leetcode", id: "15", difficulty: "Medium", url: "https://leetcode.com/problems/3sum/" },
          { title: "Container With Most Water", source: "leetcode", id: "11", difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/" },
        ],
      },
      {
        type: 'theory',
        title: "Sliding Window Technique — Fixed & Variable Size",
        problems: [
          { title: "Maximum Average Subarray I", source: "leetcode", id: "643", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-average-subarray-i/" },
          { title: "Longest Substring Without Repeating Characters", source: "leetcode", id: "3", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
          { title: "Minimum Window Substring", source: "leetcode", id: "76", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-window-substring/" },
          { title: "Subarray Product Less Than K", source: "leetcode", id: "713", difficulty: "Medium", url: "https://leetcode.com/problems/subarray-product-less-than-k/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 50 Revision — Algorithm Techniques Recap",
        items: [
          "How does the two-pointer technique reduce O(n²) to O(n)?",
          "Explain the sliding window expand-shrink pattern",
          "Compare sliding window fixed size vs variable size approaches",
        ],
      },
    ],
  },

  // ============================================================
  // WEEK 13: Problem Solving Techniques (Days 51-54)
  // ============================================================
  {
    day: 51,
    items: [
      {
        type: 'theory',
        title: "Island Traversal — Matrix DFS/BFS Patterns",
        problems: [
          { title: "Number of Islands", source: "leetcode", id: "200", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/" },
          { title: "Max Area of Island", source: "leetcode", id: "695", difficulty: "Medium", url: "https://leetcode.com/problems/max-area-of-island/" },
          { title: "Surrounded Regions", source: "leetcode", id: "130", difficulty: "Medium", url: "https://leetcode.com/problems/surrounded-regions/" },
        ],
      },
      {
        type: 'theory',
        title: "Island Traversal — Advanced Matrix Problems",
        problems: [
          { title: "Word Search", source: "leetcode", id: "79", difficulty: "Medium", url: "https://leetcode.com/problems/word-search/" },
          { title: "Pacific Atlantic Water Flow", source: "leetcode", id: "417", difficulty: "Medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
          { title: "Rotting Oranges", source: "leetcode", id: "994", difficulty: "Medium", url: "https://leetcode.com/problems/rotting-oranges/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 51 Revision",
        items: [
          "Explain the flood-fill algorithm for island problems",
          "How do you handle boundary conditions in matrix traversal?",
          "When to use DFS vs BFS for island/matrix problems?",
        ],
      },
    ],
  },
  {
    day: 52,
    items: [
      {
        type: 'theory',
        title: "Two Heaps Technique — Median & Balanced Partitioning",
        problems: [
          { title: "Find Median from Data Stream", source: "leetcode", id: "295", difficulty: "Hard", url: "https://leetcode.com/problems/find-median-from-data-stream/" },
          { title: "Sliding Window Median", source: "leetcode", id: "480", difficulty: "Hard", url: "https://leetcode.com/problems/sliding-window-median/" },
          { title: "IPO", source: "leetcode", id: "502", difficulty: "Hard", url: "https://leetcode.com/problems/ipo/" },
        ],
      },
      {
        type: 'theory',
        title: "Two Heaps — Scheduling & Resource Allocation",
        problems: [
          { title: "Task Scheduler", source: "leetcode", id: "621", difficulty: "Medium", url: "https://leetcode.com/problems/task-scheduler/" },
          { title: "Minimum Number of Refueling Stops", source: "leetcode", id: "871", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-number-of-refueling-stops/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 52 Revision",
        items: [
          "How does the two-heap pattern maintain balance?",
          "Explain the invariant of the max-heap and min-heap in median finding",
          "When is the two-heap technique preferred over sorting?",
        ],
      },
    ],
  },
  {
    day: 53,
    items: [
      {
        type: 'theory',
        title: "Merge Intervals — Overlapping & Non-Overlapping Patterns",
        problems: [
          { title: "Merge Intervals", source: "leetcode", id: "56", difficulty: "Medium", url: "https://leetcode.com/problems/merge-intervals/" },
          { title: "Insert Interval", source: "leetcode", id: "57", difficulty: "Medium", url: "https://leetcode.com/problems/insert-interval/" },
          { title: "Non-overlapping Intervals", source: "leetcode", id: "435", difficulty: "Medium", url: "https://leetcode.com/problems/non-overlapping-intervals/" },
        ],
      },
      {
        type: 'theory',
        title: "Merge Intervals — Advanced Applications",
        problems: [
          { title: "Meeting Rooms II", source: "leetcode", id: "253", difficulty: "Medium", url: "https://leetcode.com/problems/meeting-rooms-ii/" },
          { title: "Employee Free Time", source: "leetcode", id: "759", difficulty: "Medium", url: "https://leetcode.com/problems/employee-free-time/" },
          { title: "Minimum Number of Arrows to Burst Balloons", source: "leetcode", id: "452", difficulty: "Medium", url: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 53 Revision",
        items: [
          "What is the key sorting step before processing intervals?",
          "How do you merge vs count overlaps in interval problems?",
          "Explain the sweep line approach for meeting rooms",
        ],
      },
    ],
  },
  {
    day: 54,
    items: [
      {
        type: 'theory',
        title: "Cyclic Sort — In-Place Indexing Pattern",
        problems: [
          { title: "Cyclic Sort", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/cycle-sort/" },
          { title: "Missing Number", source: "leetcode", id: "268", difficulty: "Easy", url: "https://leetcode.com/problems/missing-number/" },
          { title: "Find All Numbers Disappeared in an Array", source: "leetcode", id: "448", difficulty: "Easy", url: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/" },
          { title: "Find the Duplicate Number", source: "leetcode", id: "287", difficulty: "Medium", url: "https://leetcode.com/problems/find-the-duplicate-number/" },
        ],
      },
      {
        type: 'theory',
        title: "Fast and Slow Pointers — Cycle Detection in Arrays & Lists",
        problems: [
          { title: "Linked List Cycle", source: "leetcode", id: "141", difficulty: "Easy", url: "https://leetcode.com/problems/linked-list-cycle/" },
          { title: "Linked List Cycle II", source: "leetcode", id: "142", difficulty: "Medium", url: "https://leetcode.com/problems/linked-list-cycle-ii/" },
          { title: "Happy Number", source: "leetcode", id: "202", difficulty: "Easy", url: "https://leetcode.com/problems/happy-number/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 54 Revision — Problem Solving Techniques Recap",
        items: [
          "How does cyclic sort leverage the array index as a hash key?",
          "Explain why fast and slow pointers meet in a cycle",
          "Compare cycle detection in linked lists vs arrays",
        ],
      },
    ],
  },

  // ============================================================
  // WEEK 14: Indexing & Advanced Topics (Days 55-57)
  // ============================================================
  {
    day: 55,
    items: [
      {
        type: 'theory',
        title: "Linear Indexing — Sequential & Dense Index Structures",
        problems: [
          { title: "Linear Indexing", source: "gfg", difficulty: "Easy", url: "https://www.geeksforgeeks.org/indexing-in-databases/" },
          { title: "Design Underground System", source: "leetcode", id: "1396", difficulty: "Medium", url: "https://leetcode.com/problems/design-underground-system/" },
          { title: "Design a Number Container System", source: "leetcode", id: "2349", difficulty: "Medium", url: "https://leetcode.com/problems/design-a-number-container-system/" },
        ],
      },
      {
        type: 'theory',
        title: "Tree-Based Indexing — B-Tree & ISAM Overview",
        problems: [
          { title: "Database Indexing (B-Tree)", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/indexing-in-databases/" },
          { title: "ISAM (Indexed Sequential Access Method)", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/introduction-of-b-tree/" },
          { title: "Design Add and Search Words Data Structure", source: "leetcode", id: "211", difficulty: "Medium", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 55 Revision",
        items: [
          "Compare linear vs tree-based indexing for search performance",
          "How does ISAM differ from a B-Tree index?",
          "When is a dense index preferred over a sparse index?",
        ],
      },
    ],
  },
  {
    day: 56,
    items: [
      {
        type: 'theory',
        title: "Kth Element — Quick Select & Order Statistics",
        problems: [
          { title: "Kth Largest Element in an Array", source: "leetcode", id: "215", difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
          { title: "Kth Smallest Element in a BST", source: "leetcode", id: "230", difficulty: "Medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
          { title: "Kth Largest Element in a Stream", source: "leetcode", id: "703", difficulty: "Easy", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
        ],
      },
      {
        type: 'theory',
        title: "Quick Select — Average O(n) Selection Algorithm",
        problems: [
          { title: "Quickselect Algorithm", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/quickselect-algorithm/" },
          { title: "Top K Frequent Elements", source: "leetcode", id: "347", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
          { title: "Wiggle Sort II", source: "leetcode", id: "324", difficulty: "Medium", url: "https://leetcode.com/problems/wiggle-sort-ii/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 56 Revision",
        items: [
          "Why is quickselect O(n) average but O(n²) worst case?",
          "How does the median-of-medians algorithm guarantee O(n)?",
          "Compare heap-based vs quickselect approach for Kth element",
        ],
      },
    ],
  },
  {
    day: 57,
    items: [
      {
        type: 'theory',
        title: "Randomized Algorithms — Expected Complexity & Applications",
        problems: [
          { title: "Insert Delete GetRandom O(1)", source: "leetcode", id: "380", difficulty: "Medium", url: "https://leetcode.com/problems/insert-delete-getrandom-o1/" },
          { title: "Insert Delete GetRandom O(1) - Duplicates allowed", source: "leetcode", id: "381", difficulty: "Hard", url: "https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed/" },
          { title: "Random Pick with Weight", source: "leetcode", id: "528", difficulty: "Medium", url: "https://leetcode.com/problems/random-pick-with-weight/" },
        ],
      },
      {
        type: 'theory',
        title: "Multi-threaded DSA — Concurrent Data Structures",
        problems: [
          { title: "Concurrency in Data Structures", source: "gfg", difficulty: "Medium", url: "https://www.geeksforgeeks.org/concurrency-in-operating-system/" },
          { title: "Design Bounded Blocking Queue", source: "leetcode", id: "1188", difficulty: "Medium", url: "https://leetcode.com/problems/design-bounded-blocking-queue/" },
          { title: "Print in Order", source: "leetcode", id: "1114", difficulty: "Easy", url: "https://leetcode.com/problems/print-in-order/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 57 Revision — Indexing & Advanced Recap",
        items: [
          "How does randomization help in algorithm design?",
          "Explain the role of mutexes and semaphores in concurrent data structures",
          "When is a randomized algorithm preferred over a deterministic one?",
        ],
      },
    ],
  },

  // ============================================================
  // WEEK 15-16: Final Review & Interview Prep (Days 58-60)
  // ============================================================
  {
    day: 58,
    items: [
      {
        type: 'theory',
        title: "Mock Interview Patterns I — Arrays, Strings & Hashing",
        problems: [
          { title: "Two Sum", source: "leetcode", id: "1", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/" },
          { title: "Longest Substring Without Repeating Characters", source: "leetcode", id: "3", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
          { title: "Group Anagrams", source: "leetcode", id: "49", difficulty: "Medium", url: "https://leetcode.com/problems/group-anagrams/" },
          { title: "Trapping Rain Water", source: "leetcode", id: "42", difficulty: "Hard", url: "https://leetcode.com/problems/trapping-rain-water/" },
        ],
      },
      {
        type: 'theory',
        title: "Mock Interview Patterns I — Linked Lists & Stacks",
        problems: [
          { title: "Reverse Linked List", source: "leetcode", id: "206", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-linked-list/" },
          { title: "Merge Two Sorted Lists", source: "leetcode", id: "21", difficulty: "Easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
          { title: "Valid Parentheses", source: "leetcode", id: "20", difficulty: "Easy", url: "https://leetcode.com/problems/valid-parentheses/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 58 Revision",
        items: [
          "Practice explaining your approach out loud before coding",
          "Review time/space complexity for each problem you solve",
          "Focus on edge cases: empty input, single element, duplicates",
        ],
      },
    ],
  },
  {
    day: 59,
    items: [
      {
        type: 'theory',
        title: "Mock Interview Patterns II — Trees, Graphs & BFS/DFS",
        problems: [
          { title: "Maximum Depth of Binary Tree", source: "leetcode", id: "104", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
          { title: "Number of Islands", source: "leetcode", id: "200", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/" },
          { title: "Clone Graph", source: "leetcode", id: "133", difficulty: "Medium", url: "https://leetcode.com/problems/clone-graph/" },
          { title: "Binary Tree Level Order Traversal", source: "leetcode", id: "102", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
        ],
      },
      {
        type: 'theory',
        title: "Mock Interview Patterns II — DP & Backtracking",
        problems: [
          { title: "Climbing Stairs", source: "leetcode", id: "70", difficulty: "Easy", url: "https://leetcode.com/problems/climbing-stairs/" },
          { title: "Coin Change", source: "leetcode", id: "322", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/" },
          { title: "Longest Common Subsequence", source: "leetcode", id: "1143", difficulty: "Medium", url: "https://leetcode.com/problems/longest-common-subsequence/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 59 Revision",
        items: [
          "Practice the BFS/DFS template and when to use each",
          "Review DP state transition identification technique",
          "Practice optimizing brute force to polynomial solutions",
        ],
      },
    ],
  },
  {
    day: 60,
    items: [
      {
        type: 'theory',
        title: "Final Sprint — High-Frequency Interview Problems",
        problems: [
          { title: "LRU Cache", source: "leetcode", id: "146", difficulty: "Medium", url: "https://leetcode.com/problems/lru-cache/" },
          { title: "Merge Intervals", source: "leetcode", id: "56", difficulty: "Medium", url: "https://leetcode.com/problems/merge-intervals/" },
          { title: "Word Search II", source: "leetcode", id: "212", difficulty: "Hard", url: "https://leetcode.com/problems/word-search-ii/" },
          { title: "Median of Two Sorted Arrays", source: "leetcode", id: "4", difficulty: "Hard", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
        ],
      },
      {
        type: 'theory',
        title: "Final Sprint — Mixed Review & Speed Practice",
        problems: [
          { title: "Container With Most Water", source: "leetcode", id: "11", difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/" },
          { title: "Find Median from Data Stream", source: "leetcode", id: "295", difficulty: "Hard", url: "https://leetcode.com/problems/find-median-from-data-stream/" },
          { title: "Network Delay Time", source: "leetcode", id: "743", difficulty: "Medium", url: "https://leetcode.com/problems/network-delay-time/" },
        ],
      },
      {
        type: 'revision',
        title: "Day 60 Revision — Course Complete!",
        items: [
          "Review your weakest topics from the past 60 days",
          "Practice solving problems within 20-25 minutes (interview pace)",
          "Focus on clear communication: explain approach, complexity, then code",
        ],
      },
    ],
  },
];

// ─── Topic educational URL mapping ───
// Maps theory topic titles to educational reference links (W3Schools, GeeksforGeeks, etc.)
const topicUrlMap: Record<string, string> = {
  // Arrays
  "Arrays — Fundamentals & Operations": "https://www.w3schools.com/java/java_arrays.asp",
  "Arrays — Two Pointer & In-Place Manipulation": "https://www.geeksforgeeks.org/two-pointer-technique/",
  "Mixed Arrays & Hashing — Combined Techniques": "https://www.geeksforgeeks.org/introduction-to-hashing-data-structure-and-algorithm-tutorials/",
  "Arrays & Hashing — Interview Classics": "https://www.geeksforgeeks.org/top-50-array-coding-problems-for-interviews/",
  // Linked Lists
  "Linked Lists — Singly & Doubly Linked Lists": "https://www.w3schools.com/cpp/cpp_linkedlists.asp",
  "Linked Lists — Advanced Manipulation": "https://www.geeksforgeeks.org/data-structures/linked-list/",
  // Stacks
  "Stacks — LIFO Principle & Applications": "https://www.w3schools.com/java/java_stack.asp",
  "Stacks — Monotonic Stack Patterns": "https://www.geeksforgeeks.org/introduction-to-monotonic-stack-data-structure-and-algorithm-tutorials/",
  // Queues
  "Queues — FIFO Principle & Basic Operations": "https://www.w3schools.com/java/java_queue.asp",
  "Deques & Priority Queues — Double-Ended & Ordered Access": "https://www.geeksforgeeks.org/deque-set-1-introduction-applications/",
  // Hash Tables
  "Hash Tables — Hash Functions & Collision Handling": "https://www.w3schools.com/java/java_hashmap.asp",
  "Hash Maps — Frequency Counting & Lookup Patterns": "https://www.geeksforgeeks.org/java-util-hashmap-in-java-with-examples/",
  // Review
  "Data Structures Review — Arrays & Linked Lists": "https://www.geeksforgeeks.org/difference-between-array-and-linked-list/",
  "Data Structures Review — Stacks, Queues & Hash Tables": "https://www.geeksforgeeks.org/difference-between-stack-and-queue-data-structures/",
  // Complexity
  "Time Complexity — Big-O Notation & Analysis": "https://www.w3schools.com/dsa/dsa_algo_complexity.php",
  "Space Complexity — Memory Analysis & Trade-offs": "https://www.geeksforgeeks.org/g-fact-86/",
  "Big-Ω, Big-Θ & Common Runtime Classes": "https://www.geeksforgeeks.org/analysis-of-algorithms-set-3asymptotic-notations/",
  "Amortized Analysis & Complexity Comparison": "https://www.geeksforgeeks.org/amortized-analysis-introduction/",
  "Complexity Analysis — Practical Problem Solving": "https://www.geeksforgeeks.org/practice-questions-time-complexity-analysis/",
  "Complexity Analysis — Identifying Patterns": "https://www.geeksforgeeks.org/understanding-time-complexity-simple-examples/",
  // Sorting
  "Bubble Sort — Adjacent Swapping Strategy": "https://www.w3schools.com/dsa/dsa_algo_bubblesort.php",
  "Selection Sort — Finding the Minimum": "https://www.w3schools.com/dsa/dsa_algo_selectionsort.php",
  "Insertion Sort — Building Sorted Portion": "https://www.w3schools.com/dsa/dsa_algo_insertionsort.php",
  "Counting Sort — Non-Comparison Integer Sorting": "https://www.geeksforgeeks.org/counting-sort/",
  "Merge Sort — Divide and Conquer Sorting": "https://www.w3schools.com/dsa/dsa_algo_mergesort.php",
  "Merge Sort — Applications Beyond Sorting": "https://www.geeksforgeeks.org/merge-sort/",
  "Quick Sort — Partitioning Strategy": "https://www.w3schools.com/dsa/dsa_algo_quicksort.php",
  "Quick Sort — Partition Variants & Analysis": "https://www.geeksforgeeks.org/quick-sort/",
  "Heap Sort — Building & Extracting from Heaps": "https://www.w3schools.com/dsa/dsa_algo_heapsort.php",
  "Priority Queue — Heap Applications": "https://www.geeksforgeeks.org/priority-queue-set-1-introduction/",
  "Sorting Review — Comparing All Algorithms": "https://www.geeksforgeeks.org/sorting-algorithms/",
  "Mixed Sort Problems — Choosing the Right Algorithm": "https://www.geeksforgeeks.org/sorting-algorithms/",
  // Search
  "Binary Search — The Fundamental Pattern": "https://www.w3schools.com/dsa/dsa_algo_binarysearch.php",
  "Binary Search — Variants & Edge Cases": "https://www.geeksforgeeks.org/binary-search/",
  "Binary Search on Answer — Parametric Search": "https://www.geeksforgeeks.org/binary-search-on-answer/",
  "Linear Search & Search Revision": "https://www.w3schools.com/dsa/dsa_algo_linearsearch.php",
  // Graphs
  "Graph Representation — Adjacency List, Matrix & Edge List": "https://www.geeksforgeeks.org/graph-and-its-representations/",
  "Directed & Undirected Graphs — Types & Properties": "https://www.geeksforgeeks.org/graph-types-and-applications/",
  "BFS — Breadth-First Search on Graphs": "https://www.w3schools.com/dsa/dsa_algo_graphs_bfs.php",
  "BFS — Level-Order & Shortest Path in Unweighted Graphs": "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/",
  "DFS — Depth-First Search on Graphs": "https://www.w3schools.com/dsa/dsa_algo_graphs_dfs.php",
  "DFS — Connected Components & Cycle Detection": "https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/",
  "Dijkstra's Algorithm — Single Source Shortest Path": "https://www.w3schools.com/dsa/dsa_algo_graphs_dijkstra.php",
  "Dijkstra — Variants & Multi-State Shortest Path": "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/",
  "Bellman-Ford Algorithm — Handling Negative Weights": "https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/",
  "Floyd-Warshall — All Pairs Shortest Path": "https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/",
  "A* Algorithm — Heuristic-Guided Search": "https://www.geeksforgeeks.org/a-search-algorithm/",
  "Shortest Path Variants — 0-1 BFS & Bidirectional BFS": "https://www.geeksforgeeks.org/0-1-bfs-shortest-path-binary-graph/",
  "Minimum Spanning Tree — Prim's Algorithm": "https://www.w3schools.com/dsa/dsa_algo_graphs_mst.php",
  "Minimum Spanning Tree — Kruskal's Algorithm": "https://www.geeksforgeeks.org/introduction-to-kruskals-algorithm/",
  "Topological Sort — Ordering with Dependencies": "https://www.geeksforgeeks.org/topological-sorting/",
  "Topological Sort — Kahn's Algorithm & Applications": "https://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/",
  "Union-Find — Disjoint Set Union (DSU)": "https://www.geeksforgeeks.org/introduction-to-disjoint-set-data-structure-or-union-find-algorithm/",
  "Graph Traversal & Applications Review": "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
  // Trees
  "Binary Trees — Structure & Traversals": "https://www.w3schools.com/dsa/dsa_trees_binary.php",
  "Binary Trees — Recursive Patterns & Construction": "https://www.geeksforgeeks.org/binary-tree-data-structure/",
  "Binary Search Trees — Search, Insert & Delete": "https://www.w3schools.com/dsa/dsa_trees_bst.php",
  "Binary Search Trees — Balancing & Validation": "https://www.geeksforgeeks.org/binary-search-tree-data-structure/",
  "AVL Trees — Self-Balancing BST": "https://www.geeksforgeeks.org/introduction-to-avl-tree/",
  "AVL Trees — Rotations & Balancing Strategies": "https://www.geeksforgeeks.org/avl-tree-set-1-insertion/",
  "Tries — Prefix Trees & String Matching": "https://www.geeksforgeeks.org/trie-insert-search-and-delete/",
  "Tries — Advanced Operations & Variants": "https://www.geeksforgeeks.org/advanced-trie-data-structure/",
  "Segment Trees — Range Queries": "https://www.geeksforgeeks.org/segment-tree-data-structure/",
  "Segment Trees — Lazy Propagation": "https://www.geeksforgeeks.org/lazy-propagation-in-segment-tree/",
  "Tree Review — Comparing Tree Structures": "https://www.geeksforgeeks.org/binary-tree-data-structure/",
  // Advanced Data Structures
  "Heaps — Min Heap & Max Heap": "https://www.w3schools.com/dsa/dsa_algo_heaps.php",
  "Heaps — Advanced Patterns & Applications": "https://www.geeksforgeeks.org/heap-data-structure/",
  "Hash Maps — Advanced Implementation": "https://www.geeksforgeeks.org/java-util-hashmap-in-java-with-examples/",
  "Bloom Filters & Cuckoo Hashing": "https://www.geeksforgeeks.org/bloom-filters-introduction-and-python-implementation/",
  "Disjoint Set Union — Advanced Techniques": "https://www.geeksforgeeks.org/introduction-to-disjoint-set-data-structure-or-union-find-algorithm/",
  "Sparse Tables & RMQ": "https://www.geeksforgeeks.org/sparse-table/",
  "Advanced DS Review — When to Use What": "https://www.geeksforgeeks.org/data-structures/",
  // Algorithm Techniques
  "Greedy Algorithms — Principles & Classic Problems": "https://www.w3schools.com/dsa/dsa_algo_greedy.php",
  "Greedy Algorithms — Advanced Applications": "https://www.geeksforgeeks.org/greedy-algorithms/",
  "Dynamic Programming — Memoization & Tabulation": "https://www.w3schools.com/dsa/dsa_algo_dynamic.php",
  "Dynamic Programming — 1D Problems": "https://www.geeksforgeeks.org/dynamic-programming/",
  "Dynamic Programming — 2D Problems": "https://www.geeksforgeeks.org/dynamic-programming/",
  "Dynamic Programming — String Problems": "https://www.geeksforgeeks.org/dynamic-programming/",
  "Dynamic Programming — Advanced Patterns": "https://www.geeksforgeeks.org/dynamic-programming/",
  "Backtracking — Generating All Possibilities": "https://www.geeksforgeeks.org/backtracking-algorithms/",
  "Backtracking — Constraint Satisfaction": "https://www.geeksforgeeks.org/backtracking-algorithms/",
  "Divide and Conquer — Split, Solve, Combine": "https://www.geeksforgeeks.org/introduction-to-divide-and-conquer-algorithm/",
  "Divide and Conquer — Advanced Applications": "https://www.geeksforgeeks.org/divide-and-conquer-algorithm-introduction/",
  // Problem Solving
  "Sliding Window — Fixed & Variable Size": "https://www.geeksforgeeks.org/window-sliding-technique/",
  "Two Pointers — Pair & Triplet Patterns": "https://www.geeksforgeeks.org/two-pointer-technique/",
  "Bit Manipulation — Operations & Tricks": "https://www.geeksforgeeks.org/bitwise-algorithms/",
  "Intervals — Merging & Overlapping": "https://www.geeksforgeeks.org/merging-intervals/",
  "Math & Number Theory for DSA": "https://www.geeksforgeeks.org/mathematical-algorithms/",
  // Review / Final
  "Comprehensive Review — Data Structures": "https://www.geeksforgeeks.org/data-structures/",
  "Comprehensive Review — Algorithms": "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
  "Mock Interview — Problem Solving Under Time": "https://www.geeksforgeeks.org/top-algorithms-and-data-structures-for-competitive-programming/",
  "Final Review — Weak Areas Reinforcement": "https://www.geeksforgeeks.org/data-structures/",
};

export function getTopicUrl(title: string): string | undefined {
  return topicUrlMap[title];
}
