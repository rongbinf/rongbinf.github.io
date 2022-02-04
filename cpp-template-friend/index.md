# C++ 模版类重载流输入输出运算符


在 C++ 中只能通过友元函数来重载流输入输出运算符 `<<` `>>`。由于搭配模板类的使用，编译器可能在对应编译友元函数时**无法确定**其为模版，需要事先声明。

## 方法 1：提前声明并使用 <> 确认

```cpp
#include <iostream>
using namespace std;

//需要提前进行声明，以使类中对友元函数的声明进一步确认函数为模板函数
template <class A> class complex;
template <class A> ostream & operator << (ostream &newout, const complex<A> &m);

template <class A>
class complex{ //以复数类为例
  private:
  	A real, image;
	public:
		complex(A a, A b):real(a),image(b){
		}

//在运算符 << 后加入 <> 以帮助编译器进一步确定该友元函数为模板函数
		friend ostream & operator << <>(ostream &newout, const complex<A> &m); 
}; 

template <class A>
ostream & operator << (ostream &newout, const complex<A> &m){
	newout<<"("<<m.real<<","<<m.image<<")";
	return newout;
}

int main(){
	complex<int> a(1,2);
	cout<<a<<endl;
	return 0;
} 
```

## 方法 2：在声明友元函数的同时定义友元函数

```cpp
#include <iostream>
using namespace std;

template <class A>
class complex{
	private:
		A real, image;
	public:
		complex(A a, A b):real(a),image(b){
		}

//在声明友元函数的同时定义友元函数
		friend ostream & operator << (ostream &newout, const complex<A> &m){
			newout<<"("<<m.real<<","<<m.image<<")";
			return newout;
		}
}; 

int main(){
	complex<int> a(1,2);
	cout<<a<<endl;
	return 0;
} 
```

## 如果可以不使用友元函数

如果模板类中的成员为公有，则完全不需要在模板类中声明友元。

```cpp
#include <iostream>
using namespace std;

template <class A>
class complex{
	public:
		A real, image; //成员为公有
		complex(A a, A b):real(a),image(b){
		}
//		friend ostream & operator << <>(ostream &newout, const complex<A> &m);
//友元在此是不必要的
}; 

template <class A>
ostream & operator << (ostream &newout, const complex<A> &m){
	newout<<"("<<m.real<<","<<m.image<<")";
	return newout;
}

int main(){
	complex<int> a(1,2);
	cout<<a<<endl;
	return 0;
} 
```

## 参考文章

- [Why do I get linker errors when I use template friends? - Standard C++](https://isocpp.org/wiki/faq/templates#template-friends)


