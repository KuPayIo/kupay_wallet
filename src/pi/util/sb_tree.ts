/**
 * Size Balanced Tree（SBT）平衡二叉树，写时复制(COW)
 */
// ============================== 导出
export class Tree<K, V> {

	// 根节点
	private root: Node<K, V>;
	// 比较函数
	private cmp: (a: K, b: K) => number;

	constructor(cmp: (a: K, b: K) => number) {
		this.cmp = cmp;
	}

	/**
	 * 判空
	 */
	public empty() {
		return !this.root;
	}
	/**
	 * 获取指定树的大小
	 */
	public size() {
		return this.root ? this.root.size : 0;
	}
	/**
	 * 检查指定的Key在树中是否存在
	 */
	public has(key: K) {
		let node = this.root;
		while (node) {
			const r = this.cmp(key, node.key);
			if (r > 0) {
				node = node.right;
			} else if (r < 0) {
				node = node.left;
			} else {
				return true;
			}
		}

		return false;
	}
	/**
	 * 获取指定Key在树中的值
	 */
	// tslint:disable:no-reserved-keywords
	public get(key: K) {
		let node = this.root;
		while (node) {
			const r = this.cmp(key, node.key);
			if (r > 0) {
				node = node.right;
			} else if (r < 0) {
				node = node.left;
			} else {
				return node.value;
			}
		}
	}
	/**
	 * 获取树中最小的键值对
	 */
	public smallest() {
		let node = this.root;
		while (node) {
			if (!node.left) {
				return { key: node.key, value: node.value };
			}
			node = node.left;
		}
	}
	/**
	 * 获取树中最大的键值对
	 */
	public largest() {
		let node = this.root;
		// tslint:disable-next-line:no-constant-condition
		while (true) {
			if (!node.right) {
				return { key: node.key, value: node.value };
			}
			node = node.right;
		}
	}
	/**
	 * 获取指定Key在树中的排名，1表示第一名，负数表示没有该key，排名比该排名小
	 */
	public rank(key: K) {
		let c = 1;
		let node = this.root;
		while (node) {
			const r = this.cmp(key, node.key);
			if (r > 0) {
				c += (node.left) ? node.size + 1 : 1;
				node = node.right;
			} else if (r < 0) {
				node = node.left;
			} else {
				return (node.left) ? c + node.size : c;
			}
		}

		return -c;
	}
	/**
	 * 获取指定排名的键值，必须从1开始
	 */
	public byRank(rank: number) {
		rank--;
		let node = this.root;
		while (node) {
			if (!node.left) {
				return { key: node.key, value: node.value };
			}
			const c = node.left.size;
			if (rank > c) {
				rank -= c + 1;
				node = node.right;
			} else if (rank < c) {
				node = node.left;
			} else {
				return { key: node.key, value: node.value };
			}
		}
	}

	/**
	 *  插入一个新的键值对(不允许插入存在的key)
	 */
	public insert(key: K, value: V) {
		const arr: Item<K, V>[] = cache;
		let node = this.root;
		while (node) {
			const r = this.cmp(key, node.key);
			if (r > 0) {
				arr.push(new Item(null, node));
				node = node.right;
			} else if (r < 0) {
				arr.push(new Item(node, null));
				node = node.left;
			} else {
				throw new Error(`key_exists:${key}`);
			}
		}
		const tree = new Tree<K, V>(this.cmp);
		tree.root = nodeInsert(arr, new Node(key, value, 1, null, null));
		arr.length = 0;

		return tree;
	}
	/**
	 *  更新一个已存在键值对(更新值)(不允许更新不存在的key)
	 */
	public update(key: K, value: V) {
		const arr: Item<K, V>[] = cache;
		let node = this.root;
		while (node) {
			const r = this.cmp(key, node.key);
			if (r > 0) {
				arr.push(new Item(null, node));
				node = node.right;
			} else if (r < 0) {
				arr.push(new Item(node, null));
				node = node.left;
			} else {
				if (value === node.value) {
					arr.length = 0;

					return this;
				}
				const tree = new Tree<K, V>(this.cmp);
				tree.root = nodeUpdate(arr, new Node(key, value, node.size, node.left, node.right));
				arr.length = 0;

				return tree;
			}
		}
		throw new Error(`key_not_found:${key}`);
	}
	/**
	 *  放入指定的键值对
	 */
	public set(key: K, value: V) {
		const arr: Item<K, V>[] = cache;
		let node = this.root;
		while (node) {
			const r = this.cmp(key, node.key);
			if (r > 0) {
				arr.push(new Item(null, node));
				node = node.right;
			} else if (r < 0) {
				arr.push(new Item(node, null));
				node = node.left;
			} else {
				if (value === node.value) {
					arr.length = 0;

					return this;
				}
				const tree = new Tree<K, V>(this.cmp);
				tree.root = nodeUpdate(arr, new Node(key, value, node.size, node.left, node.right));
				arr.length = 0;

				return tree;
			}
		}
		const tree = new Tree<K, V>(this.cmp);
		tree.root = nodeInsert(arr, new Node(key, value, 1, null, null));

		arr.length = 0;

		return tree;
	}
	/**
	 * 删除一个键值对(有指定key则删除)
	 */
	public delete(key: K) {
		const arr: Item<K, V>[] = cache;
		let node = this.root;
		while (node) {
			const r = this.cmp(key, node.key);
			if (r > 0) {
				arr.push(new Item(null, node));
				node = node.right;
			} else if (r < 0) {
				arr.push(new Item(node, null));
				node = node.left;
			} else {
				const tree = new Tree<K, V>(this.cmp);
				tree.root = nodeDelete(arr, deleteNode(node.size - 1, node.left, node.right));
				arr.length = 0;

				return tree;
			}
		}
		arr.length = 0;

		return this;
	}
	/**
	 * 删除一个键, 并返回该键的值
	 */
	public remove(key: K) {
		const arr: Item<K, V>[] = cache;
		let node = this.root;
		while (node) {
			const r = this.cmp(key, node.key);
			if (r > 0) {
				arr.push(new Item(null, node));
				node = node.right;
			} else if (r < 0) {
				arr.push(new Item(node, null));
				node = node.left;
			} else {
				const tree = new Tree<K, V>(this.cmp);
				tree.root = nodeDelete(arr, deleteNode(node.size - 1, node.left, node.right));
				arr.length = 0;

				return { key, value: node.value, tree };
			}
		}
		arr.length = 0;
	}
	/**
	 * 对指定的键用指定的函数进行操作，函数返回0表示放弃，1表示删除，否则为更新或插入值
	 */
	public action(key: K, func: (args: any, k: K, v: V) => 0 | 1 | { value: V }, args: any) {
		const arr: Item<K, V>[] = cache;
		let node = this.root;
		while (node) {
			const r = this.cmp(key, node.key);
			if (r > 0) {
				arr.push(new Item(null, node));
				node = node.right;
			} else if (r < 0) {
				arr.push(new Item(node, null));
				node = node.left;
			} else {
				const result = func(args, node.key, node.value);
				if (result === 0) {
					arr.length = 0;

					return { result, tree: this };
				} else if (result === 1) {
					const tree = new Tree<K, V>(this.cmp);
					tree.root = nodeDelete(arr, deleteNode(node.size - 1, node.left, node.right));
					arr.length = 0;

					return { result, tree };
				} else {
					const tree = new Tree<K, V>(this.cmp);
					tree.root = nodeUpdate(arr, new Node(key, result.value, node.size, node.left, node.right));
					arr.length = 0;

					return { result, tree };
				}
			}
		}
		const result = func(args, node.key, node.value);
		if (result === 0 || result === 1) {
			arr.length = 0;

			return { result, tree: this };
		}
		const tree = new Tree<K, V>(this.cmp);
		tree.root = nodeInsert(arr, new Node(key, result.value, 1, null, null));
		arr.length = 0;

		return { result, tree };
	}
	/**
	 * 返回从指定键开始的键迭代器，如果不指定键，则从最小键开始
	 */
	public *keys(key?: K): IterableIterator<K> {
		const root = this.root;
		const cmp = this.cmp;
		yield* (key ? iterKey(root, cmp, key, getKey) : iter(root, getKey));
	}
	/**
	 * 返回从指定键开始的值迭代器，如果不指定键，则从最小键开始
	 */
	public *values(key?: K): IterableIterator<V> {
		const root = this.root;
		const cmp = this.cmp;
		yield* (key ? iterKey(root, cmp, key, getValue) : iter(root, getValue));
	}
	/**
	 * 返回从指定键开始的条目迭代器，如果不指定键，则从最小键开始
	 */
	public *items(key?: K): IterableIterator<{ key: K; value: V }> {
		const root = this.root;
		const cmp = this.cmp;
		yield* (key ? iterKey(root, cmp, key, getItem) : iter(root, getItem));
	}

}

// ============================== 本地
// 节点
class Node<K, V> {
	public key: K;
	public value: V;
	public size: number;
	public left: Node<K, V>;
	public right: Node<K, V>;
	constructor(k: K, v: V, s: number, l: Node<K, V>, r: Node<K, V>) {
		this.key = k;
		this.value = v;
		this.size = s;
		this.left = l;
		this.right = r;
	}

}

// 更新条目
class Item<K, V> {
	public left: Node<K, V>;
	public right: Node<K, V>;
	constructor(l: Node<K, V>, r: Node<K, V>) {
		this.left = l;
		this.right = r;
	}
}

// 缓冲数组
const cache = [];

// 节点左旋
const leftRatote = <K, V>(key: K, value: V, size: number, left: Node<K, V>, right: Node<K, V>) => {
	const lsize = left ? left.size : 0;
	const rsize = right.left ? right.left.size : 0;

	return new Node(right.key, right.value, size, new Node(key, value, lsize + rsize + 1, left, right.left), right.right);
};

// 节点右旋
const rightRatote = <K, V>(key: K, value: V, size: number, left: Node<K, V>, right: Node<K, V>) => {
	const lsize = left.right ? left.right.size : 0;
	const rsize = right ? right.size : 0;

	return new Node(left.key, left.value, size, left.left, new Node(key, value, lsize + rsize + 1, left.right, right));
};

// Maintain操作，Maintain(T)用于修复以T为根的 SBT。调用Maintain(T)的前提条件是T的子树都已经是SBT。
// 左节点增加大小，Maintain操作
const maintainLeft = <K, V>(key: K, value: V, size: number, left: Node<K, V>, right: Node<K, V>) => {
	if (right) {
		if (left.left && left.left.size > right.size) {
			return rightRatote(key, value, size, left, right);
		}
		if (left.right && left.right.size > right.size) {
			return rightRatote(key, value, size, leftRatote(left.key, left.value, left.size, left.left, left.right), right);
		}
	} else if (left && left.size > 1) {
		return rightRatote(key, value, size, left, null);
	}

	return new Node(key, value, size, left, right);
};

// 右节点增加大小，Maintain操作
const maintainRight = <K, V>(key: K, value: V, size: number, left: Node<K, V>, right: Node<K, V>) => {
	if (left) {
		if (right.right && right.right.size > left.size) {
			return leftRatote(key, value, size, left, right);
		}
		if (right.left && right.left.size > left.size) {
			return leftRatote(key, value, size, left, rightRatote(right.key, right.value, right.size, right.left, right.right));
		}
	} else if (right && right.size > 1) {
		return leftRatote(key, value, size, null, right);
	}

	return new Node(key, value, size, left, right);
};

// 节点插入操作
const nodeInsert = <K, V>(arr: Item<K, V>[], node: Node<K, V>) => {
	for (let i = arr.length - 1; i >= 0; i--) {
		let n = arr[i].left;
		if (n) {
			node = maintainLeft(n.key, n.value, n.size + 1, node, n.right);
		} else {
			n = arr[i].right;
			node = maintainRight(n.key, n.value, n.size + 1, n.left, node);
		}
	}

	return node;
};

// 节点更新操作
const nodeUpdate = <K, V>(arr: Item<K, V>[], node: Node<K, V>) => {
	for (let i = arr.length - 1; i >= 0; i--) {
		let n = arr[i].left;
		if (n) {
			node = new Node(n.key, n.value, n.size, node, n.right);
		} else {
			n = arr[i].right;
			node = new Node(n.key, n.value, n.size, n.left, node);
		}
	}

	return node;
};

// 节点删除操作
const nodeDelete = <K, V>(arr: Item<K, V>[], node: Node<K, V>) => {
	for (let i = arr.length - 1; i >= 0; i--) {
		let n = arr[i].left;
		if (n) {
			node = maintainRight(n.key, n.value, n.size - 1, node, n.right);
		} else {
			n = arr[i].right;
			node = maintainLeft(n.key, n.value, n.size - 1, n.left, node);
		}
	}

	return node;
};
// 节点删除操作，选Size大的子树旋转，旋转到叶子节点，然后删除
const deleteNode = <K, V>(size: number, left: Node<K, V>, right: Node<K, V>) => {
	if (left) {
		if (right) {
			if (left.size > right.size) {
				const lsize = left.right ? left.right.size : 0;

				return maintainRight(left.key, left.value, size, left.left, deleteNode(lsize + right.size, left.right, right));
			}
			const rsize = right.left ? right.left.size : 0;

			return maintainLeft(right.key, right.value, size, deleteNode(rsize + left.size, left, right.left), right.right);

		}

		return left;
	}

	return right;
};

// 获得键
const getKey = <K, V>(node: Node<K, V>) => {
	return node.key;
};
// 获得键
const getValue = <K, V>(node: Node<K, V>) => {
	return node.value;
};
// 获得键
const getItem = <K, V>(node: Node<K, V>) => {
	return { key: node.key, value: node.value };
};

// 从指定的键开始迭代
// tslint:disable-next-line:no-function-expression
const iterKey = function* <K, V, T>(node: Node<K, V>, cmp: (a: K, b: K) => number, key: K, get: (node: Node<K, V>) => T) {
	const r = cmp(key, node.key);
	if (r > 0) {
		if (node.right) yield* iterKey(node.right, cmp, key, get);
	} else if (r < 0) {
		if (node.left) yield* iterKey(node.left, cmp, key, get);
		yield get(node);
		if (node.right) yield* iter(node.right, get);
	} else {
		yield get(node);
		if (node.right) yield* iter(node.right, get);
	}
};
// 迭代指定节点
// tslint:disable-next-line:no-function-expression
const iter = function* <K, V, T>(node: Node<K, V>, get: (node: Node<K, V>) => T) {
	if (node.left) yield* iter(node.left, get);
	yield get(node);
	if (node.right) yield* iter(node.right, get);
};
