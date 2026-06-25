---
category: Python
order: 1
---

# Tutorial

## General
- `int()`, `float()`, `str()`, `bool()`: Convert to integer, float, string, or boolean.

```py
val = int(input("Enter a number: "))
print(f"You entered: {val}")
```

## Functions
```py
def greet():
  """This is a docstring, which is a (multi-line) comment.
  If written on the first line inside a function it will be used by IDEs."""
  print("Hello, World!")

greet()
```

```py
# default parameters

def greet_person(name="World"):
  return f"Hello, {name}!"

print(greet_person("John"))
```

## Keyword arguments
```py
def greet_person(name, greeting):
  return f"{greeting}, {name}!"

print(greet_person(greeting="Hi", name="Alice")) # random order, like JS objects
```

## Global variables
```py
counter = 0
def increment():
  # must use `global` on a separate line to *modify* a global variable
  # no need to declare `global` if only *reading* a global variable
  global counter
  counter += 1

increment()
print(counter) # 1
```
## Lists (aka arrays)
- `.append()`: Add an item to the end of the list.
- `.insert()`: Insert an item at a specific index.
- `.remove()`: Remove the first occurrence of a value.
- `.pop()`: Remove and return an item at a specific index (default is the last
- `'\n'.join(my_list)`: Join list items into a string with a separator (in this case, a newline).

## loops & conditionals

```py
for item in my_list: # must be itterable
  print(item)

while True:
  print("This will run forever!")

if user_choice == '1':
  print('You chose option 1')
elif user_choice == '2':
  print('You chose option 2')
else:
  print('Invalid choice')

```

- has `break` and `continue`
- there is no `switch` statement in Python, but you can use `if-elif-else` or a dictionary to achieve similar functionality
- there is not low-level `for (i = 0; i < 10; i++)` loop in Python
  - if you care about **index** of the elements: `for i in range(len(my_list))` 
  - for both **index** and **value** use `for i, value in enumerate(my_list)`)

## Values & Operators

- `True` and `False`: Boolean values representing truthiness.
- `None`: Represents the absence of a value (similar to `null` in JavaScript).
- `is` operator: Used to compare identity
- `in` operator: Used to check if a value is present in a sequence
- `not`: Logical negation operator (eg. `not in` and `is not`, `is not None`, `not True`, etc.) 
  - Note: does not work with `not` alone and you should use `!=` instead (also,
  there is no `!==` operator in Python)
- `and` and `or`: Logical operators for combining boolean expressions (there is no `&&` or `||` in Python)

## Iterable data structures
- lists (ordered) `[]`
- tuples (ordered, immutable) `()`
- sets (unordered, unique) `{}`
- dictionaries (unordered, unique, kv pairs) `{}`

```py
# show items in lists or *keys* in dictionaries
my_list = [1, 2, 3]
for item in list_or_dict:
  print(item)

# to get index in lists, unpacks the tuple returned by `enumerate()`
my_list = ['a', 'b', 'c']
for (index, item) in enumerate(my_list): 
  print(f"Index: {index}, Item: {item}")

# to get values in dict, use .values()
my_dict = {'a': 1, 'b': 2, 'c': 3}
for value in my_dict.values():
  print(value)

# to get key-value pairs in dict, use .items()
my_dict = {'a': 1, 'b': 2, 'c': 3}
for key, value in my_dict.items():
  print(f"Key: {key}, Value: {value}")
  
```

## List comprehensions
```py
original_list = [1, 2, 3, 4, 5]
doubled = [el * 2 for el in original_list] # like .map() in JS
even = [el for el in original_list if el % 2 == 0] # like .filter() in JS
all_even = all([el % 2 == 0 for el in original_list]) # like .every() in JS
any_even = any([el % 2 == 0 for el in original_list]) # like .some() in JS
```

## Map & reduce

```py
original_list = [1, 2, 3, 4, 5]
# convert to a list, the result of a map, that takse a lambda function and applies it to each element in the original list
result = list(map(lambda x: x * 2, original_list)) # => [2, 4, 6, 8, 10]
```

```py
import functools
original_list = [1, 2, 3, 4, 5]
# reduce takes a lambda function and applies it cumulatively to the items of the original list, from left to right, to reduce the list to a single value
result = functools.reduce(lambda acc, x: acc + x, original_list, 0) # => 15
```

## Copying values from list and tuples using range selectors
```py
original = [1, 2, 3]
new_list = original[:] # creates a shallow copy of the list (like [...original] in JS)
``` 

## Unpacking arguments
```py
def f(*args): # * is for regular arguments ("list-like")
  for arg in args:
    print(arg)

f(1, 2, 3) # prints 1, 2, 3 on separate lines
f(*[1, 2, 3]) # also prints 1, 2, 3 on separate lines
```

```py
def g(**kwargs): # ** is for keyword arguments ("dict-like")
  for key, value in kwargs.items():
    print(f"{key}: {value}")

g(name="Alice", age=30) # prints "name: Alice" and "age: 30" on separate lines
g(**{"name": "Bob", "age": 25}) # also prints "name: Bob" and "age: 25" on separate lines
```

## Misc
- `json.dumps(my_dict)`: Convert a Python dictionary to a JSON string. (like `JSON.stringify()` in JS)

## Files

- `f.read()`, `f.readline()`, `f.readlines()`: Read the entire file as a string, a single line as a string, or all lines as a list of strings.
- `f.write()`, `f.writeline()`, `f.writelines()`: Write a string (manually add `\n` if needed), a single line, or a list of lines to the file.

```py
# write stings writing to a file
with open('my_file.txt', 'w') as f: # `with` automatically closes the file (f.close()) after the block is executed
  f.write("Hello, World!")

# read lines from a file
with open('my_file.txt', 'r') as f:
  lines = f.readlines()

# write json to a file
import json
my_dict = {"name": "Alice", "age": 30}
with open('my_file.json', 'w') as f:
  f.write(json.dumps(my_dict)) # we dump a dict, so it will write a JSON object to the file as a string, not a JSON array

# read json from a file
import json
with open('my_file.json', 'r') as f:
  my_list = json.loads(f.read()) # if the file contains a JSON array, `json.loads()` will parse it into a list not a dict
```

## Error handling
```py
try:
  # code that may raise an exception
  result = 10 / 0
except ZeroDivisionError as e:
  print(f"Error: {e}")
except ValueError as e:
  print(f"Value error: {e}")
except Exception as e: # catch-all for any other exceptions
  print(f"An unexpected error occurred: {e}")
else:
  # code that runs if no exceptions were raised
  print("No errors occurred!")
finally:
  # code that runs regardless of whether an exception was raised or not
  print("This will always run.")
```

- Errors: 
  - `ValueError` - raised when a function receives an argument of the right type but an inappropriate value)
  - `TypeError` - raised when an operation or function is applied to an object of inappropriate type) 
  - `KeyError` - raised when a dictionary key is not found
  - `IndexError` - raised when a sequence subscript is out of range
  - `FileNotFoundError` - raised when trying to open a file that does not exist
  - `IOError` - raised when an I/O operation fails (e.g., file not found, disk full, etc.)

## OOP

```py
class Person:
  greeting = "Hello!" # class variable, shared by all instances of the class

  # constructor method, called when a new instance of the class is created, 
  # takes `self` as a parameter and any other parameters needed to initialize the instance
  def __init__(self, name, age):
    self.name = name # instance variable
    self.age = age # instance variable
    self.__hobbies = [] # private instance variable

  # define a getter using `@property` decorator (automatically creates self.__name)
  @property
  def name(self):
    return self.__name

  # define a setter using `@xxx.setter` decorator (automatically creates self.__name)
  @name.setter
  def name(self, value):
    self.__name = value

  # "manual getter" for private variable
  def list_hobbies(self):
    return f"My hobbies are: {', '.join(self.__hobbies)}"

  # "manual setter" for private variable
  def add_hobby(self, hobby):
    self.__hobbies.append(hobby)

  # instance method, has access to instance properties and class properties, 
  # takes `self` as a parameter
  def greet(self):
    return f"{greet}, my name is {self.name} and I am {self.age} years old."

  # class method, has access to class properties but not instance properties, 
  # does not take `self` as a parameter, but takes `cls`
  @classmethod
  def custom_greet(cls, who_to_greet):
    return f"{cls.greet} Nice to see you, {who_to_greet}!"

  # static method, it does not access any class or instance properties, 
  # and does not take `self` or `cls` as a parameter
  @staticmethod
  def generic_greet(message):
    return mesage

person1 = Person("Jane", 30)
person1.name = "Alice"
print(person1.name) # "Alice"

person1.add_hobby("Reading")
print(person1.get_hobbies()) # "My hobbies are: Reading"

print(person1.greet()) # "Hello!, my name is Alice and I am 30 years old."
Person.greet = "Good evening!"
print(Person.custom_greet("Bob")) # "Good evening! Nice to see you, Bob!"
print(Person.generic_greet("Hi everyone!")) # "Hi everyone!"
```

```py
# Inheritance example (in a separate file, `student.py`, to show how to import and use classes from other files)
from person import Person

class Student(Person): # inheritance
  def __init__(self, name, age, student_id):
    super().__init__(name, age) # call the constructor of the parent class
    self.student_id = student_id

student1 = Student("Bob", 20, "12345")
print(student1.greet()) # "Hello, my name is Bob and I am 20 years old. I am Human"
print(student1.student_id) # "12345"
```

```py
# Serializing an object to JSON
import json
class Person:
  def __init__(self, name, age):
    self.name = name
    self.age = age
person = Person("Alice", 30)
# json.dumps() can only serialize basic data types, so we use the __dict__ attribute to get a dictionary representation of the object
person_json = json.dumps(person.__dict__) 
print(person_json) # '{"name": "Alice", "age": 30}'

# Deserializing JSON to an object
person_dict = json.loads(person_json) # convert the JSON string back to a dictionary
person2 = Person(**person_dict) # unpack the dictionary to create a new Person object
print(person2.name) # "Alice"
print(person2.age) # 30
```

## Modules & packages

- add a `__init__.py` file (can be blank) to a directory (eg. `utils/`) to make it a package
- good practice: add `"""docstrings"""` to top of files and as first line inside functions and classes to explain what they do

```py
from utils import my_module # import a module from the package
from utils.my_module import my_function # import a specific function from the module
```

## ruff / black
- `# pyright: reportAny=false, reportUnknownMemberType=false` (top of file, selective) or `# pyright: basic` (top of file, all)
- `# pyright: ignore[reportAny]` (line, selective), `# pyright: ignore` (line, all)
- `# fmt: skip` (line), `# fmt: off` + `#fmt: on` (block)

