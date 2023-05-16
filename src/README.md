# [Clean architecture](https://www.freecodecamp.org/news/a-quick-introduction-to-clean-architecture-990c014448d2/)

The source tree follows a certain structure, known as _clean architecture_.

People either love or hate this structure, but it's required for a software developer
to know the idea behind it, as more and more companies are adopting this style,
especially for enterprise programming.

The mindset is simple: **separate code into manageable units**. This makes it easier
to change the code. If clean architecture is well followed, then changing your storage
option from SQL to something else like Redis will only force you to change a small, isolated
part of your code, not your whole programs.

Remember that _code is changed all the time_, and that flexibility to changes and adapting
to external requirements is central to modern software development.

We classify code roughly into 3 levels:

1. [Domain layer](./domain/)

   The domain is the central business logic our code performs. This includes
   entities, use cases, and repositories.

   - [Entity](./domain/entities/)

     An entity is an object type that the business logic directly involves.
     For example, if you are an online store, then your entities probably
     include your customers, shops, items, carts, orders, and shipments.

     In the entity level, your `Customer` class will just have the bare minimum
     fields required by the business logic, such as name, address, and payment methods.
     This class won't know anything relating to how your API represents it, or how
     it is stored in databases.

     Likewise, your `Product` class will only know about the product as per the human seller
     perspective. It won't know anything else.

   - [Use cases](./domain/usecases/)

     A use case represents a business logic units. For example, if we are an online store,
     then the use cases for this is probably _user registering_, _user logging in_,
     _user adding items to cart_, _user checking out_, _user payment_, _creating shipment_.

     The use case will use the _repository_ to actually commit its actions to whatever the
     repository uses, be it databases, external APIs, or mocked databases for testing.

   - [Repository](./domain/repositories/)

     Repository is where we put stuff in and get them out. Being in the domain level,
     it doesn't know anything about the actual computer storage being used.

     For example,
     when the _user checking out_ use case is being executed, the use case will use the
     repository to commit the user actions. The repository only needs to know which customer
     is checking out what items, and nothing else about the actual data storage.

     We like to think of repositories as high-level, business-heavy abstraction of the actual
     data storage.

2. [Data layer](./data/)

   This is where code relating to database and data source operations reside in.

   For example, if your project needs a database and an external APIs as datasources,
   then the code performing _just that_ will be refactored into this layer. This layer
   will expose symbols that will be imported by the repositories.

   In this project, the [code interfacing with PostgreSQL](./data/sources/postgres/) will be in this layer,
   as well as the [code talking to Redis](./data/sources/redis/), as well as [the higher-level code](./data/interfaces/) that abstracts he SQL ORM queries and Redis commands.

3. [Presentation layer](./api/)

   The presentation is where the output of our programs are supposed to go.

   In our back-end project, the presentation layer is the HTTP responses. **This is why
   the presentation layer is the only layer in the whole project that knows about Express** -
   the other layers don't need to know that the program is in fact a HTTP back-end and that
   we are using Express.

   If your programs
   need to _present_ its output to other paradigms, for example, a TCP connection, then the
   code that convert our entities to TCP streams will also reside here, next to its HTTP
   counterpart.

You can opt not to follow clean architecture, and that is fine - many high-quality software projects
don't follow this guideline at all yet are still good. But choosing to go the clean way helps with
minimizing headaches and confusion when business or technical requirements change,
at least for non-godlike developers.
