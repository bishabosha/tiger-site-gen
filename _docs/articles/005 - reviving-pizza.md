```scala
(
  layout = "article",
  title = "Coding with Pizza in 2024",
  description = '''
    An experiment to try Pizza language in 2024, will it run?
    ''',
  published = "09-Nov-2024"
)
```
---

The [Pizza language](https://pizzacompiler.sourceforge.net) developed by Martin Odersky, and Philip Wadler in 1997 was quite a significant milestone in the history of Java and other JVM languages like Scala. As a research project, it introduced generics, lambdas, algebraic data types and pattern matching on top of Java, all in the 90s. Given that Java has finally introduced all of these features, and in the interests of preservation, can we run it today? is it useful?

## Context

At [Scala.IO 2024](https://scala.io) I was inspired by a talk by Alexis Hernandez on running some Scala 2.7.7 code, to dive into earlier versions of Scala and their history, and sat in a corner with one goal: run hello world with Pizza - it took a minor journey but here is the result.

## Example

Here is the code I will compile, it is valid Pizza 1.1 code:

```java
public class Option<T> {
  case Some(T value);
  case None;

  void foreach((T) -> void action) {
    switch (this) {
      case Some(T foo):
        action(foo);
        break;
      case None:
        break;
    }
  }
}

public class Hello {
  static <T> void doPrint(T that, (T) -> String show) {
    System.out.println(show(that));
  }

  static void doPrintInt(int that) {
    doPrint(that, fun(int i) -> String {
      return String.valueOf(i);
    });
  }

  public static void main(String[] args) {
    Option<int> opt = new Option.Some(23);
    opt.foreach(doPrintInt);
  }
}
```

## Programming archeology, or how do we run this?

I downloaded the Pizza jar from Sourceforge, and failed to run it on JDK 21 (with macOS Sequoia) - predictably it failed to run with this exception:
```
java -jar pizza-1.1.jar hello.pizza
hello.pizza:1: error while loading class java.lang.Object: java.io.IOException: file java/lang/Object.class not found
public class Option<T> {
       ^
hello.pizza:15: class String not found in class Option<T>
  static void doPrint(String that) {
                      ^
hello.pizza:19: class String not found in class Option<T>
  public static void main(String[] args) {
                          ^
hello.pizza:16: cannot access class out; file System/out.class not found
    System.out.println(that);
           ^
hello.pizza:21: variable String not found in class Option<T>
    opt.foreach(fun(int i) -> void { doPrint(String.valueOf(i)); } );
                                             ^


An exception has occurred in the compiler. (v1.0g)
Please file a bug report at Sourceforge.net:
http://sourceforge.net/tracker/?group_id=31504&atid=402238

   Thank you.

Exception in thread "main" java.lang.NullPointerException: Cannot invoke "net.sf.pizzacompiler.compiler.Scope.lookup(net.sf.pizzacompiler.compiler.Name)" because the return value of "net.sf.pizzacompiler.compiler.TypeSymbol.locals()" is null
	at net.sf.pizzacompiler.compiler.Namer.findMethod(C:\pizza\main\src\net\sf\pizzacompiler\compiler\Namer.pizza:306)
	at net.sf.pizzacompiler.compiler.Namer.resolveConstructor(C:\pizza\main\src\net\sf\pizzacompiler\compiler\Namer.pizza:664)
	at net.sf.pizzacompiler.compiler.Attr.resolveConstructor(C:\pizza\main\src\net\sf\pizzacompiler\compiler\Attr.pizza:93)
	at net.sf.pizzacompiler.compiler.Attr.attribExpr(C:\pizza\main\src\net\sf\pizzacompiler\compiler\Attr.pizza:1472)
	at net.sf.pizzacompiler.compiler.Attr.attribExpr(C:\pizza\main\src\net\sf\pizzacompiler\compiler\Attr.pizza:1113)
	at net.sf.pizzacompiler.compiler.Attr.attribStat(C:\pizza\main\src\net\sf\pizzacompiler\compiler\Attr.pizza:692)
	at net.sf.pizzacompiler.compiler.Attr.attribStats(C:\pizza\main\src\net\sf\pizzacompiler\compiler\Attr.pizza:750)
	at net.sf.pizzacompiler.compiler.Attr.attribDef(C:\pizza\main\src\net\sf\pizzacompiler\compiler\Attr.pizza:472)
	at net.sf.pizzacompiler.compiler.Attr.attribDef(C:\pizza\main\src\net\sf\pizzacompiler\compiler\Attr.pizza:424)
	at net.sf.pizzacompiler.compiler.Attr.attribute(C:\pizza\main\src\net\sf\pizzacompiler\compiler\Attr.pizza:355)
	at net.sf.pizzacompiler.compiler.Main.process(C:\pizza\main\src\net\sf\pizzacompiler\compiler\Main.pizza:228)
	at net.sf.pizzacompiler.compiler.Main.compile(C:\pizza\main\src\net\sf\pizzacompiler\compiler\Main.pizza:309)
	at net.sf.pizzacompiler.compiler.Main.main(C:\pizza\main\src\net\sf\pizzacompiler\compiler\Main.pizza:385)
```

Ok so perhaps my JDK is too new, so I switched to JDK 8. Of course, it still errors:
```
java -jar pizza-1.1.jar hello.pizza
hello.pizza:21: error while loading class java.lang.CharSequence: java.io.IOException: bad class file (java.lang.RuntimeException: bad constant pool tag: 18 at 10)
    opt.foreach(fun(int i) -> void { doPrint(String.valueOf(i)); } );
                                                    ^
1 error
```

Hmm 🤔, constant pool tag 18? well according to the [Class File Format](https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-4.html), that relates to InvokeDynamic, which was introduced in Java 7. The Pizza compiler isn't prepared to handle JRE classes built by Java 7!

This would mean having to install Java 6 or perhaps even earlier on macOS, which is not an easy feat. Prior to Java 7, Apple was the only vendor building Java for Mac, and currently there exists exactly one legitimate build: `1.6.0_65-b14-468` provided by [Apple](https://support.apple.com/en-us/106384).

At that link, you will get a `.dmg` file, which when mounted will list a `.pkg` installer, but we can skip running the installer, and just extract the JRE home directory:

```shell
pkgutil --expand-full /Volumes/Java\ for\ macOS\ 2017-001/JavaForOSX.pkg \
  ~/Downloads/java6download
```

then inside the extracted `java6download` file, you can then browse within `Resources/JavaForOSX.pkg` ("Show package contents" if using Finder). From there you can find the JRE inside one of the nested folders.

you can move that to a preferred location, such as `/Library/Java/JavaVirtualMachines/1.6.0.jdk`.

You can even use [SDKMAN!](https://sdkman.io) to install it as a java candidate so it is simple to switch:

```shell
sdk install java 6-apple /Library/Java/JavaVirtualMachines/1.6.0.jdk
```

In the above command, I installed a java candidate called `6-apple`, referring to JDK 6, vendored by Apple.

and now finally, after switching to `6-apple` I can get that Pizza code to compile!
```
sdk use java 6-apple

Using java version 6-apple in this shell.
```

```shell
java -jar pizza-1.1.jar hello.pizza
[1]    47213 bus error  java -jar pizza-1.1.jar hello.pizza
```

It actually succeeded, mostly, (ignoring the occasional bus error or segmentation fault!)

So what classes were generated?
```text
ls

Hello$$closures.class  Option$$closures.class Option.class
Hello.class            Option$Some.class      hello.pizza
```

now if I run the code it will print "23"!

```shell
java -classpath pizza-1.1.jar:. Hello
23
```

## Comparing to today's languages

If you squint your eyes, you might think this is not so far from Java 21 perhaps, could you build anything useful with it's abstractions?

### Tooling?

First of all, there is no build-tool or IDE support for Pizza (understandable).

### generic methods

The type parameters in Pizza can be defined on both methods and classes.

Here is the `identity` function in Pizza, which looks like the same syntax made it directly to Java:
```java
<R> R identity(R that) {
  return that;
}
```

### Algebraic data types

24 years later in 2021, Scala 3 launched with it's enum feature, at the source level it looks very similar:

```scala
enum Option[T] {
  case Some(value: T)
  case None
}
```

Of course Scala 2 from the initial release could encode the same algebraic data type, but more verbosely via sealed trait and case classes/objects.

### Type erasure

Like Java and Scala, generic type parameters are erased at runtime.

### Pattern matching

In Pizza, pattern matching is added on top of the old Java switch statement,
could this mean that the fallthrough semantics still occur? Well actually no, the compiler will error:
```java
  case Some(T foo): // error: possible fall-through from Pizza case
    action(foo);
  case None:
    System.out.println("ooops");
    break;
```

It seems inconvenient to still require to put `break` explicitly (perhaps this was kept because switch is still a statement in Pizza).
