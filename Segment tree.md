Details in implementing Segment tree

1. Store the nodes in several arrays or as pairs/structs? If structs, does storing in-tree-position help?

Use pair/struct only when all data are needed for arbitary interval. (e.g. yes for contiguous max; no for cache for range update). Never store positions in the tree as this will complicate your code. Instead, using

#define lson tl, tm, v<<1
#define rson, tm+1, tr, v<<1|1

and passing them as argument is a better choice.

2. Build trees as full binary tree or perfect binary tree?

A full binary tree does not require the bottom layer to be full, so the underlying index 1 ~ N can be arbitary. By padding null/identity elements until the next power of two (b = 1<<int(log(N-1)+1)), we can pack all elements to the left in the bottom layer. The underlying index is 0 ~ b-1. The size needed for the array is essentially the same (2*b <= 4*N. Null elements are there in the full binary tree implementation as skipped nodes in the bottom layer).

Advantage of Full binary tree:

Perfect binary tree requires all null nodes at the bottom layer to be identity with respect to the merging operation. No special care is needed in the full binary implementation as internal nodes only summarizes valid nodes, and null nodes are never accessed (though we may still want to prepare identity nodes for out-of-range merging).

Advantage of Perfect binary tree:

Underlying array is stored in the array from index starting at b. This enables building and updating from bottom up through for-loops. Also, this makes debugging easier since we can easily access different layers (like bfs).

3. Recursive pointwise implementation (build, update, binary search):

1) End condition: Leaf node operation
2) Perform left OR right operation.
3) Update/Return from children

4. Recursive range implementation (query, range update):

There are two equivalent ways of writing conditions that make use of merging identity, and one that avoids it. Suppose the method is called range(l, r, ..., tl, tr, v).

// First version:
if (l > r) { // Out-of-range. Return merging identity }
if (tl == l && tr == r) { // Return this whole node }
int tm = (tl + tr) /2;
return merge(range(l, min(r,tm), ..., Left child), range(max(l, tm+1), r, ..., Right child));

// Second version:
if (r < tl || l > tr) { // Out-of-range. Return merging identity }
if (l <= tl && tr <= r) { // Return this whole node }
int tm = (tl + tr) /2;
return merge(range(l, r, ..., Left child), range(l, r, Right child);

// Third version (without merging identity, never out-of-range):
if (tl == l && tr == r) { // Return this whole node }
int tm = (tl + tr) /2;
if (r <= mid) return range(l, r, ..., Left child);
if (l > mid) return range(l, r, ..., Right child);
return merge(range(l, tm, ..., Left child), range(tm+1, r, ..., Right child));

Caching is in "Return this whole node" and clearing cache immediately follows. 

5. Iterative implementation (Perfect binary tree)

Access an element i with t[b+i]. For building, iterating can be done from 2*b-1 to 1. For pointwise updating, each time we i>>1 to access its parent node.
