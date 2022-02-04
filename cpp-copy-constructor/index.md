# C++ 中的拷贝构造函数：浅拷贝、深拷贝

## 什么时候会调用拷贝构造函数

- 一个对象以**值传递**的方式**传入函数体**
- 一个对象以**值传递**的方式**从函数返回**
- 一个对象**通过另一个对象**以进行**初始化**

## 默认拷贝构造函数：浅拷贝

即：将被拷贝对象的数据成员的值一一赋值给新创建的对象

- 如果数据成员中有指针成员
    - **浅拷贝只是增加了一个指针指向已经存在的内存**
    - 则**新对象的指针所指向的地址**与**被拷贝对象的指针所指向的地址**相同
    - 则析构 delete 对象时会重复 delete 两次同一个内存空间而出错

### 实例

```cpp
class Rect{
private:
		int *p;     // 一指针成员
public:
    Rect(){      // 构造函数，p 指向堆中分配的一内存
        p = new int(100); // new 动态分配
    }
    ~Rect(){     // 析构函数，释放动态分配的内存
        if(p != NULL){
            delete p; // delete 释放 p 所指向的内存
        }
    }
};

int main(){
    Rect rect1;
    Rect rect2(rect1);   // 拷贝 rect1 来构造 rect2
		// 也即： Rect rect2 = rect1;
		// 浅拷贝，将成员的值进行拷贝 rect2.p = rect1.p （地址 = 地址）

		// 会出现错误
		// 在 delete 时既要 delete rect2.p 指向的空间，又要 delete rect1.p 指向的内存。但这是同一个内存（地址 = 地址），导致同一个内存被释放两次

    return 0;
}
```

同时还造成另外两个错误：

- `rect2.p` 在初始化时新建的 `p` 所指向的内存没被释放（因为构造函数新建之后，又直接值传递换了地址），造成内存泄漏
- `rect2.p`（指针） 和 `rect1.p`（指针）指向同一块内存（同一个地址），任何一方的变动都会影响另一方

## 自行新建拷贝构造函数：并使用深拷贝

新增加一个指针，并申请一个新的内存。新指针指向新内存。

### 实例

```cpp
class Rect{
public:
    int *p;			// 一指针成员
    Rect(){     // 构造函数，p指向堆中分配的一内存
        p = new int(100);
    }
    Rect(const Rect &r){ // 自行新建拷贝构造函数
        p = new int;     // 为新对象重新动态分配内存
        *p = *r.p;
        // 或带括号 *p = *(r.p);
    }
    ~Rect(){    // 析构函数，释放动态分配的内存
        if(p != NULL){
            delete p;
        }
    }
};

int main(){
    Rect rect1;
    Rect rect2(rect1);		// 拷贝 rect1 来构造 rect2
		// 也即： Rect rect2 = rect1;
    // 深拷贝，创建新的 p 以及其所指向的空间，然后把值赋过去 *r.p = *rect1.p; 然后 *rect2.p = *r.p;

  return 0;
}
```

不妨输出地址比对一下：

```cpp
class Rect{
public:
    int *p;
    Rect(){
        p = new int(100);
        cout<<"start new: "<<p<<endl; // 无参的新构造（初始化）时创建的内存空间
    }
    Rect(const Rect &r){
        p = new int;
        cout<<"copy: "<<p<<endl; 			// 拷贝构造时创建的内存空间
        *p = *r.p;
    }
    ~Rect(){
        if(p != NULL){
            cout<<"de: "<<p<<endl; 		// 所析构掉的内存空间
            delete p;
        }
    }
};

int main(){
    Rect rect1;
    cout<<rect1.p<<endl;		// rect1.p 指向的内存空间
    Rect rect2(rect1);			// 拷贝 rect1 来构造 rect2
    cout<<rect2.p<<endl;		// rect2.p 指向的内存空间
    return 0;
}
```

输出得：

```shell
start new: 0x10582d930
0x10582d930
copy: 0x10582f220
0x10582f220
de: 0x10582f220
de: 0x10582d930
Program ended with exit code: 0
```

## 参考

- [C语言中的位拷贝与值拷贝浅谈 - CSDN](https://blog.csdn.net/xunye_dream/article/details/77547438)
- [C++拷贝构造函数详解 - CSDN](https://blog.csdn.net/lwbeyond/article/details/6202256)


