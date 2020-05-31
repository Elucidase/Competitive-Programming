# Implementing Segment Tree

In implementing a segment tree, there are several choices to make. What's the difference between building the tree top-down and bottom-up? When should we implement a node as a struct? What are the formula for pointwise and range operations? Here are some summaries.

## 1. Nodes in several arrays or as pairs/structs? If structs, what data should I store?

Use pair/struct only when all data are needed for arbitary interval. (e.g. yes for contiguous max; no for cache for range update). Never store positions in the tree as they will complicate your code. Instead, using

```cpp
#define lson tl, tm, v<<1
#define rson, tm+1, tr, v<<1|1
```

and passing them as argument can save repetitive/unnecessary codes.

## 2. Build trees as top-down or bottom-up?

Building the tree top-down gives a full binary tree (but not necessarily a perfect binary tree). A full binary tree does not require the bottom layer to be full, so the underlying index 1 ~ N can be arbitary. On the other hand, by padding null/identity elements until the number of elements reach next power of two (`b = 1<<int(log(N-1)+1)`), we can pack all elements to the left in the bottom layer. The underlying index is 0 ~ b-1 but with only 0 ~ N-1 nontrivial data. The sizes needed for the array to store the tree in both approach are essentially the same (`2*b` <= `4*N`. Null elements are there in the full binary tree implementation as skipped nodes in the bottom layer).

### Advantage of Perfect binary tree:

Underlying array is stored in the array from index starting at b. This enables building and updating from bottom up through for-loops. Also, this makes debugging easier since we can easily access different layers (like bfs).

### Advantage of Full binary tree:

Perfect binary tree requires all null nodes at the bottom layer to be identity with respect to the merging operation. We don't need to care about null nodes in the full binary implementation as internal nodes only summarizes valid nodes, and null nodes are never accessed (though we may still want to prepare identity nodes for out-of-range merging, see below).

## 3. Recursive pointwise implementation (build, update, binary search):

1. End condition: Leaf node operation
1. Perform left OR right operation.
1. Update/Return from children

## 4. Recursive range implementation (query, range update):

There are two equivalent ways of writing conditions that make use of merging identity, and one that avoids it. Suppose the method is called with `range(l, r, ..., tl, tr, v)`.

### First version

```cpp
if (l > r) { /* Query out of node range. Return merging identity */ }
if (tl == l && tr == r) { /* Return this whole node */ }
int tm = (tl + tr) /2;
return merge(range(l, min(r,tm), ..., Left child), range(max(l, tm+1), r, ..., Right child));
```

### Second version

```cpp
if (r < tl || l > tr) { /* Query out of node range. Return merging identity */ }
if (l <= tl && tr <= r) { /* Return this whole node */ }
int tm = (tl + tr) /2;
return merge(range(l, r, ..., Left child), range(l, r, Right child);
```

### Third version (without merging identity, query never out of node range)

```cpp
if (tl == l && tr == r) { /* Return this whole node */ }
int tm = (tl + tr) /2;
if (r <= mid) return range(l, r, ..., Left child);
if (l > mid) return range(l, r, ..., Right child);
return merge(range(l, tm, ..., Left child), range(tm+1, r, ..., Right child));
```

Caching is done in "Return this whole node" section and cache is immediately cleared when this condition is false. 

## 6. Iterative implementation (Perfect binary tree)

Access an element `i` with `t[b+i]`. For building, iterating can be done from `2*b-1` to `1`. For pointwise updating, each time we `i>>1` to access its parent node.
