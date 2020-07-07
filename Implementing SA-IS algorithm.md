# Implementing SA-IS algorithm
SA-IS is an algorithm that builds a suffix array in `O(m)` time, where m is the size of input string. I find the [Stanford CS166 slides](http://web.stanford.edu/class/cs166/lectures/04/Small04.pdf) especially helpful for understanding it. There aren't many implementations of it on platforms like Codeforces or Codechef, and many people seem to go with the `O(m(logm)^2)` radix-sort approach to build the suffix array, as illustrated in [CP-algorithms](https://cp-algorithms.com/string/suffix-array.html). I found SA-IS quite elegant, and its length of implementation can be made comparable to that of the radix-sort approach. Hence this blog.

```cpp
#include <bits/stdc++.h>
using namespace std;
using vi = vector<int>;

vector<int> induce(string &s, vi &stype, vi &LMS, vi bs, vi be) {
	int m = s.size();
	vi sa(m, -1), be1(be);
	for (int lms : LMS) sa[be1[s[lms]]--] = lms;
	for (int i = 0; i < m; ++i) {
		int j = sa[i] - 1;
		if (j >= 0 && !stype[j]) sa[bs[s[j]]++] = j; 
	}
	for (int i = m-1; i >= 0; --i) {
		int j = sa[i] - 1;
		if (j >= 0 && stype[j]) sa[be[s[j]]--] = j;
	}
	return sa;
}

vector<int> SAIS(string &s, int cs) {
  int m = s.size(), uniq = true;
	vi bs(cs+1), be(cs+1), stype(m, false), LMS;
	vector<string> lookup(m);
	for (int i = m-1; i >= 0; --i) {
		uniq &= ++bs[s[i]+1] <= 1;
		stype[i] = i == m-1 || s[i] < s[i+1] || s[i] == s[i+1] && stype[i+1]; 
		if (!stype[i] && stype[i+1]) {
			lookup[i+1] = s.substr(i+1, LMS.empty() ? 1 : LMS.back() - i);
			LMS.push_back(i+1);
		}
	}
	for (int i = 1; i <= cs; ++i) {
		bs[i] += bs[i-1];
		be[i-1] = bs[i] - 1;
	}
	vi sa = induce(s, stype, LMS, bs, be);
	if (uniq) return sa;
	
	vector<int> com(m);
	int subcs = 0, subm = LMS.size();
	string topbk = "\0\0", subs(subm, 0);
	for (int i = 0, j = sa[i]; i < m; ++i, j = sa[i]) {
		com[j] = subcs;
		if (!lookup[j].empty() && lookup[j] != topbk) {
			topbk = lookup[j];
			++subcs;
		}
	}
	reverse(LMS.begin(), LMS.end());
	for (int i = 0; i < subm; ++i) subs[i] = com[LMS[i]];
	vector<int> subsa = SAIS(subs, subcs);
	vector<int> oLMS(subm);
	for (int i = 0; i < subm; ++i) oLMS[subm-1-i] = LMS[subsa[i]];
	return induce(s, stype, oLMS, bs, be);
}

```
