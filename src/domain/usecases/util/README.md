# Cryptographic hash functions

A [cryptographic hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function),
like a [normal hash function](https://en.wikipedia.org/wiki/Hash_function),
takes in an input, and then _digests_ it into a _hash_,
which is a string of bytes of fixed length.

For each identical input, the function returns identical
hash.

Different inputs produce different hashes,
although [_hash collisions_](https://en.wikipedia.org/wiki/Hash_collision)
are still possible.

As hash functions are one-way function, computing a hash
from a given input is cheap, but computing the input from
a given hash is extremely expensive.

## [Cryptanalysis attack](https://en.wikipedia.org/wiki/Cryptanalysis)

Attackers usually use [_brute-force attacks_](https://en.wikipedia.org/wiki/Brute-force_attack)
to reverse hashes, by trying every possible combinations
of inputs and feed them to hash function to see one
produces a matching hash.

Another class of attack is [_rainbow table attack_](https://en.wikipedia.org/wiki/Rainbow_table),
where the attacker pre-computes hashes of so many
possible combinations of the input into a lookup table,
and then do a table lookup to see which entry matches
the hash being attacked.

The rainbow table attacks are sometimes known as dictionary attacks.

Cryptographic hash functions differ from normal hash functions
in that they (crypto) are designed to be appropriate for use
with other cryptography applications, and thus are more
resilient and expensive to brute-force attacks.

# Password hashing

Password hashing is a security practice in which
plaintext passwords are given to a cryptographic hash
and later saved to the database instead of the user's
actual password.

This means that if bad actors had access to our database,
user's passwords are still safe, unless the attacker does
brute-force or dictionary attacks.

We don't need to save the user's actual password
because we don't actually need them. We only need
a way to verify that, at login, the passwords users
supplied matches those known at registration.

To do this, our registration-authentication (signup-login)
strategy would be:

1. Registration

   Get user password during registration, and hash
   the password. Save the password hash into the database.

2. Login

   Get user password during login, and hash the password.
   Compare the hash with the one saved in our database.
   If they match, the user has supplied the exact same
   password and can now be authenticated.

# Bcrypt

[Bcrypt](https://en.wikipedia.org/wiki/Bcrypt)
is a password-hashing function with history
going back to the UNIX communities in the 90s.

It was designed specifically for this purpose,
so the usage is pretty simple and straightforward
when compared to implementing your own password hashing
with generic cryptography primitives provided in the
Node.js `crypto` module.

Bcrypt hash output is in Base64 string, so it can be
easily saved in text files (as with UNIX `/etc/passwd`)
or into the database as text.

## Bcrypt salt and dictionary attack

In addition to the ease of use, Bcrypt also requires
a _salt_ everytime it generates a new hash for a new
password.

The addition of salt is like when a chef's finishing
a dish - a pinch of salt and everything's great.

Salt is a random number, used to mutate
the input to the hash function so that each call
to the hash function receives different input.

This means in popular passwords like `1234` cannot
be guessed from a rainbow table or other dictionary
attacks, as the actual input to the hash function is
`1234` + `salt`, which is different each time the hash
function is used.

In Bcrypt, salt itself is also embedded into the hash,
so we don't have to separately store and retrieve salts
when decoding the hash during logins.

# Bcrypt libraries for TypeScript/JavaScript

There're 2 popular Bcrypt implementations for JavaScript
ecosystems:

1. `bcrypt` (types declared in `@types/bcrypt`)

   A Node.js native implementation with C++ bindings.
   This means that the actual code performing expensive
   hashing is done in C++, which is must faster that
   JavaScript.

   If your program will only run in Node, then use
   this implementation for better performance (about
   20% faster).

   Note: this implementation requires many more
   dependencies than `bcryptjs`, which requires none.

2. `bcryptjs` (types declared in `@types/bcryptjs`)

   A pure JavaScript implementation of Bcrypt.
   Being written in pure JavaScript, curious JavaScript
   developer can learn how Bcrypt works by reading
   the module code.

   This means that code using `bcryptjs` can run
   everywhere JavaScript runs, from the browser engine
   to Node.js runtime.

   If the code you write must be able to run everywhere
   (e.g. if you're writing a library), then choose this
   implementation.
