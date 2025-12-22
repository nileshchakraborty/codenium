const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../api/data/solutions.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// =============================================
// DESIGN PROBLEM TEMPLATES (Multi-Language)
// =============================================

const DESIGN_TEMPLATES = {
    'lru-cache': {
        python: `class LRUCache:
    def __init__(self, capacity: int):
        # Initialize your data structure here
        pass

    def get(self, key: int) -> int:
        # Return the value of the key if it exists, otherwise return -1
        pass

    def put(self, key: int, value: int) -> None:
        # Update the value of the key if it exists, otherwise add the key-value pair
        pass
`,
        javascript: `/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    // Initialize your data structure here
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    // Return the value of the key if it exists, otherwise return -1
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    // Update the value of the key if it exists, otherwise add the key-value pair
};
`,
        java: `class LRUCache {
    public LRUCache(int capacity) {
        // Initialize your data structure here
    }
    
    public int get(int key) {
        // Return the value of the key if it exists, otherwise return -1
        return -1;
    }
    
    public void put(int key, int value) {
        // Update the value of the key if it exists, otherwise add the key-value pair
    }
}
`,
        cpp: `class LRUCache {
public:
    LRUCache(int capacity) {
        // Initialize your data structure here
    }
    
    int get(int key) {
        // Return the value of the key if it exists, otherwise return -1
        return -1;
    }
    
    void put(int key, int value) {
        // Update the value of the key if it exists, otherwise add the key-value pair
    }
};
`,
        go: `type LRUCache struct {
    // Your data structure here
}

func Constructor(capacity int) LRUCache {
    // Initialize your data structure here
    return LRUCache{}
}

func (this *LRUCache) Get(key int) int {
    // Return the value of the key if it exists, otherwise return -1
    return -1
}

func (this *LRUCache) Put(key int, value int) {
    // Update the value of the key if it exists, otherwise add the key-value pair
}
`,
        rust: `struct LRUCache {
    // Your data structure here
}

impl LRUCache {
    fn new(capacity: i32) -> Self {
        // Initialize your data structure here
        LRUCache {}
    }
    
    fn get(&mut self, key: i32) -> i32 {
        // Return the value of the key if it exists, otherwise return -1
        -1
    }
    
    fn put(&mut self, key: i32, value: i32) {
        // Update the value of the key if it exists, otherwise add the key-value pair
    }
}
`,
    },

    'implement-trie-prefix-tree': {
        python: `class Trie:
    def __init__(self):
        # Initialize your data structure here
        pass

    def insert(self, word: str) -> None:
        # Insert a word into the trie
        pass

    def search(self, word: str) -> bool:
        # Returns True if the word is in the trie
        pass

    def startsWith(self, prefix: str) -> bool:
        # Returns True if there is any word that starts with the given prefix
        pass
`,
        javascript: `var Trie = function() {
    // Initialize your data structure here
};

Trie.prototype.insert = function(word) {
    // Insert a word into the trie
};

Trie.prototype.search = function(word) {
    // Returns true if the word is in the trie
};

Trie.prototype.startsWith = function(prefix) {
    // Returns true if there is any word that starts with the given prefix
};
`,
        java: `class Trie {
    public Trie() {
        // Initialize your data structure here
    }
    
    public void insert(String word) {
        // Insert a word into the trie
    }
    
    public boolean search(String word) {
        // Returns true if the word is in the trie
        return false;
    }
    
    public boolean startsWith(String prefix) {
        // Returns true if there is any word that starts with the given prefix
        return false;
    }
}
`,
        cpp: `class Trie {
public:
    Trie() {
        // Initialize your data structure here
    }
    
    void insert(string word) {
        // Insert a word into the trie
    }
    
    bool search(string word) {
        // Returns true if the word is in the trie
        return false;
    }
    
    bool startsWith(string prefix) {
        // Returns true if there is any word that starts with the given prefix
        return false;
    }
};
`,
        go: `type Trie struct {
    // Your data structure here
}

func Constructor() Trie {
    return Trie{}
}

func (this *Trie) Insert(word string) {
    // Insert a word into the trie
}

func (this *Trie) Search(word string) bool {
    // Returns true if the word is in the trie
    return false
}

func (this *Trie) StartsWith(prefix string) bool {
    // Returns true if there is any word that starts with the given prefix
    return false
}
`,
        rust: `struct Trie {
    // Your data structure here
}

impl Trie {
    fn new() -> Self {
        Trie {}
    }
    
    fn insert(&mut self, word: String) {
        // Insert a word into the trie
    }
    
    fn search(&self, word: String) -> bool {
        // Returns true if the word is in the trie
        false
    }
    
    fn starts_with(&self, prefix: String) -> bool {
        // Returns true if there is any word that starts with the given prefix
        false
    }
}
`,
    },

    'min-stack': {
        python: `class MinStack:
    def __init__(self):
        # Initialize your data structure here
        pass

    def push(self, val: int) -> None:
        # Push element val onto stack
        pass

    def pop(self) -> None:
        # Remove the element on top of the stack
        pass

    def top(self) -> int:
        # Get the top element
        pass

    def getMin(self) -> int:
        # Retrieve the minimum element in the stack
        pass
`,
        javascript: `var MinStack = function() {
    // Initialize your data structure here
};

MinStack.prototype.push = function(val) {
    // Push element val onto stack
};

MinStack.prototype.pop = function() {
    // Remove the element on top of the stack
};

MinStack.prototype.top = function() {
    // Get the top element
};

MinStack.prototype.getMin = function() {
    // Retrieve the minimum element in the stack
};
`,
        java: `class MinStack {
    public MinStack() {
        // Initialize your data structure here
    }
    
    public void push(int val) {
        // Push element val onto stack
    }
    
    public void pop() {
        // Remove the element on top of the stack
    }
    
    public int top() {
        // Get the top element
        return 0;
    }
    
    public int getMin() {
        // Retrieve the minimum element in the stack
        return 0;
    }
}
`,
        cpp: `class MinStack {
public:
    MinStack() {
        // Initialize your data structure here
    }
    
    void push(int val) {
        // Push element val onto stack
    }
    
    void pop() {
        // Remove the element on top of the stack
    }
    
    int top() {
        // Get the top element
        return 0;
    }
    
    int getMin() {
        // Retrieve the minimum element in the stack
        return 0;
    }
};
`,
        go: `type MinStack struct {
    // Your data structure here
}

func Constructor() MinStack {
    return MinStack{}
}

func (this *MinStack) Push(val int) {
    // Push element val onto stack
}

func (this *MinStack) Pop() {
    // Remove the element on top of the stack
}

func (this *MinStack) Top() int {
    // Get the top element
    return 0
}

func (this *MinStack) GetMin() int {
    // Retrieve the minimum element in the stack
    return 0
}
`,
        rust: `struct MinStack {
    // Your data structure here
}

impl MinStack {
    fn new() -> Self {
        MinStack {}
    }
    
    fn push(&mut self, val: i32) {
        // Push element val onto stack
    }
    
    fn pop(&mut self) {
        // Remove the element on top of the stack
    }
    
    fn top(&self) -> i32 {
        // Get the top element
        0
    }
    
    fn get_min(&self) -> i32 {
        // Retrieve the minimum element in the stack
        0
    }
}
`,
    },

    'find-median-from-data-stream': {
        python: `class MedianFinder:
    def __init__(self):
        # Initialize your data structure here
        pass

    def addNum(self, num: int) -> None:
        # Add a number to the data stream
        pass

    def findMedian(self) -> float:
        # Return the median of all elements so far
        pass
`,
        javascript: `var MedianFinder = function() {
    // Initialize your data structure here
};

MedianFinder.prototype.addNum = function(num) {
    // Add a number to the data stream
};

MedianFinder.prototype.findMedian = function() {
    // Return the median of all elements so far
};
`,
        java: `class MedianFinder {
    public MedianFinder() {
        // Initialize your data structure here
    }
    
    public void addNum(int num) {
        // Add a number to the data stream
    }
    
    public double findMedian() {
        // Return the median of all elements so far
        return 0.0;
    }
}
`,
        cpp: `class MedianFinder {
public:
    MedianFinder() {
        // Initialize your data structure here
    }
    
    void addNum(int num) {
        // Add a number to the data stream
    }
    
    double findMedian() {
        // Return the median of all elements so far
        return 0.0;
    }
};
`,
        go: `type MedianFinder struct {
    // Your data structure here
}

func Constructor() MedianFinder {
    return MedianFinder{}
}

func (this *MedianFinder) AddNum(num int) {
    // Add a number to the data stream
}

func (this *MedianFinder) FindMedian() float64 {
    // Return the median of all elements so far
    return 0.0
}
`,
        rust: `struct MedianFinder {
    // Your data structure here
}

impl MedianFinder {
    fn new() -> Self {
        MedianFinder {}
    }
    
    fn add_num(&mut self, num: i32) {
        // Add a number to the data stream
    }
    
    fn find_median(&self) -> f64 {
        // Return the median of all elements so far
        0.0
    }
}
`,
    },

    'design-twitter': {
        python: `class Twitter:
    def __init__(self):
        # Initialize your data structure here
        pass

    def postTweet(self, userId: int, tweetId: int) -> None:
        # Compose a new tweet with ID tweetId by the user userId
        pass

    def getNewsFeed(self, userId: int) -> list[int]:
        # Retrieve the 10 most recent tweet IDs in the user's news feed
        pass

    def follow(self, followerId: int, followeeId: int) -> None:
        # Follower follows a followee
        pass

    def unfollow(self, followerId: int, followeeId: int) -> None:
        # Follower unfollows a followee
        pass
`,
        javascript: `var Twitter = function() {
    // Initialize your data structure here
};

Twitter.prototype.postTweet = function(userId, tweetId) {
    // Compose a new tweet with ID tweetId by the user userId
};

Twitter.prototype.getNewsFeed = function(userId) {
    // Retrieve the 10 most recent tweet IDs in the user's news feed
};

Twitter.prototype.follow = function(followerId, followeeId) {
    // Follower follows a followee
};

Twitter.prototype.unfollow = function(followerId, followeeId) {
    // Follower unfollows a followee
};
`,
        java: `class Twitter {
    public Twitter() {
        // Initialize your data structure here
    }
    
    public void postTweet(int userId, int tweetId) {
        // Compose a new tweet with ID tweetId by the user userId
    }
    
    public List<Integer> getNewsFeed(int userId) {
        // Retrieve the 10 most recent tweet IDs in the user's news feed
        return new ArrayList<>();
    }
    
    public void follow(int followerId, int followeeId) {
        // Follower follows a followee
    }
    
    public void unfollow(int followerId, int followeeId) {
        // Follower unfollows a followee
    }
}
`,
        cpp: `class Twitter {
public:
    Twitter() {
        // Initialize your data structure here
    }
    
    void postTweet(int userId, int tweetId) {
        // Compose a new tweet with ID tweetId by the user userId
    }
    
    vector<int> getNewsFeed(int userId) {
        // Retrieve the 10 most recent tweet IDs in the user's news feed
        return {};
    }
    
    void follow(int followerId, int followeeId) {
        // Follower follows a followee
    }
    
    void unfollow(int followerId, int followeeId) {
        // Follower unfollows a followee
    }
};
`,
        go: `type Twitter struct {
    // Your data structure here
}

func Constructor() Twitter {
    return Twitter{}
}

func (this *Twitter) PostTweet(userId int, tweetId int) {
    // Compose a new tweet with ID tweetId by the user userId
}

func (this *Twitter) GetNewsFeed(userId int) []int {
    // Retrieve the 10 most recent tweet IDs in the user's news feed
    return []int{}
}

func (this *Twitter) Follow(followerId int, followeeId int) {
    // Follower follows a followee
}

func (this *Twitter) Unfollow(followerId int, followeeId int) {
    // Follower unfollows a followee
}
`,
        rust: `struct Twitter {
    // Your data structure here
}

impl Twitter {
    fn new() -> Self {
        Twitter {}
    }
    
    fn post_tweet(&mut self, user_id: i32, tweet_id: i32) {
        // Compose a new tweet with ID tweetId by the user userId
    }
    
    fn get_news_feed(&self, user_id: i32) -> Vec<i32> {
        // Retrieve the 10 most recent tweet IDs in the user's news feed
        vec![]
    }
    
    fn follow(&mut self, follower_id: i32, followee_id: i32) {
        // Follower follows a followee
    }
    
    fn unfollow(&mut self, follower_id: i32, followee_id: i32) {
        // Follower unfollows a followee
    }
}
`,
    },

    'kth-largest-element-in-a-stream': {
        python: `class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        # Initialize your data structure here
        pass

    def add(self, val: int) -> int:
        # Add a new element to the stream and return the Kth largest element
        pass
`,
        javascript: `var KthLargest = function(k, nums) {
    // Initialize your data structure here
};

KthLargest.prototype.add = function(val) {
    // Add a new element to the stream and return the Kth largest element
};
`,
        java: `class KthLargest {
    public KthLargest(int k, int[] nums) {
        // Initialize your data structure here
    }
    
    public int add(int val) {
        // Add a new element to the stream and return the Kth largest element
        return 0;
    }
}
`,
        cpp: `class KthLargest {
public:
    KthLargest(int k, vector<int>& nums) {
        // Initialize your data structure here
    }
    
    int add(int val) {
        // Add a new element to the stream and return the Kth largest element
        return 0;
    }
};
`,
        go: `type KthLargest struct {
    // Your data structure here
}

func Constructor(k int, nums []int) KthLargest {
    return KthLargest{}
}

func (this *KthLargest) Add(val int) int {
    // Add a new element to the stream and return the Kth largest element
    return 0
}
`,
        rust: `struct KthLargest {
    // Your data structure here
}

impl KthLargest {
    fn new(k: i32, nums: Vec<i32>) -> Self {
        KthLargest {}
    }
    
    fn add(&mut self, val: i32) -> i32 {
        // Add a new element to the stream and return the Kth largest element
        0
    }
}
`,
    },

    'time-based-key-value-store': {
        python: `class TimeMap:
    def __init__(self):
        # Initialize your data structure here
        pass

    def set(self, key: str, value: str, timestamp: int) -> None:
        # Store the key with value at the given timestamp
        pass

    def get(self, key: str, timestamp: int) -> str:
        # Return the value at the given timestamp, or "" if not found
        pass
`,
        javascript: `var TimeMap = function() {
    // Initialize your data structure here
};

TimeMap.prototype.set = function(key, value, timestamp) {
    // Store the key with value at the given timestamp
};

TimeMap.prototype.get = function(key, timestamp) {
    // Return the value at the given timestamp, or "" if not found
};
`,
        java: `class TimeMap {
    public TimeMap() {
        // Initialize your data structure here
    }
    
    public void set(String key, String value, int timestamp) {
        // Store the key with value at the given timestamp
    }
    
    public String get(String key, int timestamp) {
        // Return the value at the given timestamp, or "" if not found
        return "";
    }
}
`,
        cpp: `class TimeMap {
public:
    TimeMap() {
        // Initialize your data structure here
    }
    
    void set(string key, string value, int timestamp) {
        // Store the key with value at the given timestamp
    }
    
    string get(string key, int timestamp) {
        // Return the value at the given timestamp, or "" if not found
        return "";
    }
};
`,
        go: `type TimeMap struct {
    // Your data structure here
}

func Constructor() TimeMap {
    return TimeMap{}
}

func (this *TimeMap) Set(key string, value string, timestamp int) {
    // Store the key with value at the given timestamp
}

func (this *TimeMap) Get(key string, timestamp int) string {
    // Return the value at the given timestamp, or "" if not found
    return ""
}
`,
        rust: `struct TimeMap {
    // Your data structure here
}

impl TimeMap {
    fn new() -> Self {
        TimeMap {}
    }
    
    fn set(&mut self, key: String, value: String, timestamp: i32) {
        // Store the key with value at the given timestamp
    }
    
    fn get(&self, key: String, timestamp: i32) -> String {
        // Return the value at the given timestamp, or "" if not found
        String::new()
    }
}
`,
    },

    'design-add-and-search-words-data-structure': {
        python: `class WordDictionary:
    def __init__(self):
        # Initialize your data structure here
        pass

    def addWord(self, word: str) -> None:
        # Add a word to the data structure
        pass

    def search(self, word: str) -> bool:
        # Search for a word (. matches any single character)
        pass
`,
        javascript: `var WordDictionary = function() {
    // Initialize your data structure here
};

WordDictionary.prototype.addWord = function(word) {
    // Add a word to the data structure
};

WordDictionary.prototype.search = function(word) {
    // Search for a word (. matches any single character)
};
`,
        java: `class WordDictionary {
    public WordDictionary() {
        // Initialize your data structure here
    }
    
    public void addWord(String word) {
        // Add a word to the data structure
    }
    
    public boolean search(String word) {
        // Search for a word (. matches any single character)
        return false;
    }
}
`,
        cpp: `class WordDictionary {
public:
    WordDictionary() {
        // Initialize your data structure here
    }
    
    void addWord(string word) {
        // Add a word to the data structure
    }
    
    bool search(string word) {
        // Search for a word (. matches any single character)
        return false;
    }
};
`,
        go: `type WordDictionary struct {
    // Your data structure here
}

func Constructor() WordDictionary {
    return WordDictionary{}
}

func (this *WordDictionary) AddWord(word string) {
    // Add a word to the data structure
}

func (this *WordDictionary) Search(word string) bool {
    // Search for a word (. matches any single character)
    return false
}
`,
        rust: `struct WordDictionary {
    // Your data structure here
}

impl WordDictionary {
    fn new() -> Self {
        WordDictionary {}
    }
    
    fn add_word(&mut self, word: String) {
        // Add a word to the data structure
    }
    
    fn search(&self, word: String) -> bool {
        // Search for a word (. matches any single character)
        false
    }
}
`,
    },

    'binary-search-tree-iterator': {
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BSTIterator:
    def __init__(self, root: TreeNode):
        # Initialize the iterator
        pass

    def next(self) -> int:
        # Return the next smallest number
        pass

    def hasNext(self) -> bool:
        # Return whether we have a next smallest number
        pass
`,
        javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

var BSTIterator = function(root) {
    // Initialize the iterator
};

BSTIterator.prototype.next = function() {
    // Return the next smallest number
};

BSTIterator.prototype.hasNext = function() {
    // Return whether we have a next smallest number
};
`,
        java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class BSTIterator {
    public BSTIterator(TreeNode root) {
        // Initialize the iterator
    }
    
    public int next() {
        // Return the next smallest number
        return 0;
    }
    
    public boolean hasNext() {
        // Return whether we have a next smallest number
        return false;
    }
}
`,
        cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class BSTIterator {
public:
    BSTIterator(TreeNode* root) {
        // Initialize the iterator
    }
    
    int next() {
        // Return the next smallest number
        return 0;
    }
    
    bool hasNext() {
        // Return whether we have a next smallest number
        return false;
    }
};
`,
        go: `/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
type BSTIterator struct {
    // Your data structure here
}

func Constructor(root *TreeNode) BSTIterator {
    return BSTIterator{}
}

func (this *BSTIterator) Next() int {
    // Return the next smallest number
    return 0
}

func (this *BSTIterator) HasNext() bool {
    // Return whether we have a next smallest number
    return false
}
`,
        rust: `// Definition for a binary tree node.
// #[derive(Debug, PartialEq, Eq)]
// pub struct TreeNode {
//   pub val: i32,
//   pub left: Option<Rc<RefCell<TreeNode>>>,
//   pub right: Option<Rc<RefCell<TreeNode>>>,
// }
use std::rc::Rc;
use std::cell::RefCell;

struct BSTIterator {
    // Your data structure here
}

impl BSTIterator {
    fn new(root: Option<Rc<RefCell<TreeNode>>>) -> Self {
        BSTIterator {}
    }
    
    fn next(&mut self) -> i32 {
        // Return the next smallest number
        0
    }
    
    fn has_next(&self) -> bool {
        // Return whether we have a next smallest number
        false
    }
}
`,
    },

    'insert-delete-getrandom-o1': {
        python: `import random

class RandomizedSet:
    def __init__(self):
        # Initialize your data structure here
        pass

    def insert(self, val: int) -> bool:
        # Insert val if not present, return True if inserted
        pass

    def remove(self, val: int) -> bool:
        # Remove val if present, return True if removed
        pass

    def getRandom(self) -> int:
        # Return a random element from the set
        pass
`,
        javascript: `var RandomizedSet = function() {
    // Initialize your data structure here
};

RandomizedSet.prototype.insert = function(val) {
    // Insert val if not present, return true if inserted
};

RandomizedSet.prototype.remove = function(val) {
    // Remove val if present, return true if removed
};

RandomizedSet.prototype.getRandom = function() {
    // Return a random element from the set
};
`,
        java: `class RandomizedSet {
    public RandomizedSet() {
        // Initialize your data structure here
    }
    
    public boolean insert(int val) {
        // Insert val if not present, return true if inserted
        return false;
    }
    
    public boolean remove(int val) {
        // Remove val if present, return true if removed
        return false;
    }
    
    public int getRandom() {
        // Return a random element from the set
        return 0;
    }
}
`,
        cpp: `class RandomizedSet {
public:
    RandomizedSet() {
        // Initialize your data structure here
    }
    
    bool insert(int val) {
        // Insert val if not present, return true if inserted
        return false;
    }
    
    bool remove(int val) {
        // Remove val if present, return true if removed
        return false;
    }
    
    int getRandom() {
        // Return a random element from the set
        return 0;
    }
};
`,
        go: `type RandomizedSet struct {
    // Your data structure here
}

func Constructor() RandomizedSet {
    return RandomizedSet{}
}

func (this *RandomizedSet) Insert(val int) bool {
    // Insert val if not present, return true if inserted
    return false
}

func (this *RandomizedSet) Remove(val int) bool {
    // Remove val if present, return true if removed
    return false
}

func (this *RandomizedSet) GetRandom() int {
    // Return a random element from the set
    return 0
}
`,
        rust: `use rand::Rng;

struct RandomizedSet {
    // Your data structure here
}

impl RandomizedSet {
    fn new() -> Self {
        RandomizedSet {}
    }
    
    fn insert(&mut self, val: i32) -> bool {
        // Insert val if not present, return true if inserted
        false
    }
    
    fn remove(&mut self, val: i32) -> bool {
        // Remove val if present, return true if removed
        false
    }
    
    fn get_random(&self) -> i32 {
        // Return a random element from the set
        0
    }
}
`,
    },

    'implement-stack-using-queues': {
        python: `from collections import deque

class MyStack:
    def __init__(self):
        # Initialize your data structure here
        pass

    def push(self, x: int) -> None:
        # Push element x onto stack
        pass

    def pop(self) -> int:
        # Remove the element on top of the stack and return it
        pass

    def top(self) -> int:
        # Get the top element
        pass

    def empty(self) -> bool:
        # Return whether the stack is empty
        pass
`,
        javascript: `var MyStack = function() {
    // Initialize your data structure here
};

MyStack.prototype.push = function(x) {
    // Push element x onto stack
};

MyStack.prototype.pop = function() {
    // Remove the element on top of the stack and return it
};

MyStack.prototype.top = function() {
    // Get the top element
};

MyStack.prototype.empty = function() {
    // Return whether the stack is empty
};
`,
        java: `class MyStack {
    public MyStack() {
        // Initialize your data structure here
    }
    
    public void push(int x) {
        // Push element x onto stack
    }
    
    public int pop() {
        // Remove the element on top of the stack and return it
        return 0;
    }
    
    public int top() {
        // Get the top element
        return 0;
    }
    
    public boolean empty() {
        // Return whether the stack is empty
        return true;
    }
}
`,
        cpp: `class MyStack {
public:
    MyStack() {
        // Initialize your data structure here
    }
    
    void push(int x) {
        // Push element x onto stack
    }
    
    int pop() {
        // Remove the element on top of the stack and return it
        return 0;
    }
    
    int top() {
        // Get the top element
        return 0;
    }
    
    bool empty() {
        // Return whether the stack is empty
        return true;
    }
};
`,
        go: `type MyStack struct {
    // Your data structure here
}

func Constructor() MyStack {
    return MyStack{}
}

func (this *MyStack) Push(x int) {
    // Push element x onto stack
}

func (this *MyStack) Pop() int {
    // Remove the element on top of the stack and return it
    return 0
}

func (this *MyStack) Top() int {
    // Get the top element
    return 0
}

func (this *MyStack) Empty() bool {
    // Return whether the stack is empty
    return true
}
`,
        rust: `struct MyStack {
    // Your data structure here
}

impl MyStack {
    fn new() -> Self {
        MyStack {}
    }
    
    fn push(&mut self, x: i32) {
        // Push element x onto stack
    }
    
    fn pop(&mut self) -> i32 {
        // Remove the element on top of the stack and return it
        0
    }
    
    fn top(&self) -> i32 {
        // Get the top element
        0
    }
    
    fn empty(&self) -> bool {
        // Return whether the stack is empty
        true
    }
}
`,
    },

    'range-sum-query---immutable': {
        python: `class NumArray:
    def __init__(self, nums: list[int]):
        # Initialize your data structure here with the given array
        pass

    def sumRange(self, left: int, right: int) -> int:
        # Return the sum of elements from index left to right (inclusive)
        pass
`,
        javascript: `var NumArray = function(nums) {
    // Initialize your data structure here with the given array
};

NumArray.prototype.sumRange = function(left, right) {
    // Return the sum of elements from index left to right (inclusive)
};
`,
        java: `class NumArray {
    public NumArray(int[] nums) {
        // Initialize your data structure here with the given array
    }
    
    public int sumRange(int left, int right) {
        // Return the sum of elements from index left to right (inclusive)
        return 0;
    }
}
`,
        cpp: `class NumArray {
public:
    NumArray(vector<int>& nums) {
        // Initialize your data structure here with the given array
    }
    
    int sumRange(int left, int right) {
        // Return the sum of elements from index left to right (inclusive)
        return 0;
    }
};
`,
        go: `type NumArray struct {
    // Your data structure here
}

func Constructor(nums []int) NumArray {
    return NumArray{}
}

func (this *NumArray) SumRange(left int, right int) int {
    // Return the sum of elements from index left to right (inclusive)
    return 0
}
`,
        rust: `struct NumArray {
    // Your data structure here
}

impl NumArray {
    fn new(nums: Vec<i32>) -> Self {
        NumArray {}
    }
    
    fn sum_range(&self, left: i32, right: i32) -> i32 {
        // Return the sum of elements from index left to right (inclusive)
        0
    }
}
`,
    },

    'serialize-and-deserialize-binary-tree': {
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root: TreeNode) -> str:
        # Encode a tree to a single string
        pass
    
    def deserialize(self, data: str) -> TreeNode:
        # Decode the string to a tree
        pass
`,
        javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

var serialize = function(root) {
    // Encode a tree to a single string
};

var deserialize = function(data) {
    // Decode the string to a tree
};
`,
        java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
public class Codec {
    public String serialize(TreeNode root) {
        // Encode a tree to a single string
        return "";
    }

    public TreeNode deserialize(String data) {
        // Decode the string to a tree
        return null;
    }
}
`,
        cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Codec {
public:
    string serialize(TreeNode* root) {
        // Encode a tree to a single string
        return "";
    }

    TreeNode* deserialize(string data) {
        // Decode the string to a tree
        return nullptr;
    }
};
`,
        go: `/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */

type Codec struct {
    // Your data structure here
}

func Constructor() Codec {
    return Codec{}
}

func (this *Codec) serialize(root *TreeNode) string {
    // Encode a tree to a single string
    return ""
}

func (this *Codec) deserialize(data string) *TreeNode {
    // Decode the string to a tree
    return nil
}
`,
        rust: `// Definition for a binary tree node.
// #[derive(Debug, PartialEq, Eq)]
// pub struct TreeNode {
//   pub val: i32,
//   pub left: Option<Rc<RefCell<TreeNode>>>,
//   pub right: Option<Rc<RefCell<TreeNode>>>,
// }
use std::rc::Rc;
use std::cell::RefCell;

struct Codec {
    // Your data structure here
}

impl Codec {
    fn new() -> Self {
        Codec {}
    }

    fn serialize(&self, root: Option<Rc<RefCell<TreeNode>>>) -> String {
        // Encode a tree to a single string
        String::new()
    }

    fn deserialize(&self, data: String) -> Option<Rc<RefCell<TreeNode>>> {
        // Decode the string to a tree
        None
    }
}
`,
    },
};

// =============================================
// APPLY TEMPLATES TO SOLUTIONS
// =============================================

const SUPPORTED_LANGUAGES = ['python', 'javascript', 'java', 'cpp', 'go', 'rust'];
let updatedCount = 0;

for (const [slug, templates] of Object.entries(DESIGN_TEMPLATES)) {
    if (!data[slug]) {
        console.log(`Warning: ${slug} not found in solutions.json`);
        continue;
    }

    const solution = data[slug];

    // Ensure implementations object exists
    if (!solution.implementations) solution.implementations = {};

    for (const lang of SUPPORTED_LANGUAGES) {
        if (templates[lang]) {
            if (!solution.implementations[lang]) solution.implementations[lang] = {};
            solution.implementations[lang].initialCode = templates[lang];
            updatedCount++;

            // Also update root initialCode for Python
            if (lang === 'python') {
                solution.initialCode = templates[lang];
            }
        }
    }

    console.log(`Updated ${slug} with templates for ${Object.keys(templates).length} languages`);
}

// Save updated solutions
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n===== COMPLETE =====`);
console.log(`Updated ${updatedCount} initialCode entries for ${Object.keys(DESIGN_TEMPLATES).length} design problems`);
