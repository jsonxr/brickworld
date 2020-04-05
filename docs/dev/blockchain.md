# Blockchain Features

- Stand alone servers should be free to create. As long as the server doesn't connect with outside world, all transactions should take place on the server.
- A server can connect to the outside world and when it does, it submits block changes to the blockchain at a larger granularity.
- When a server is offline, the world is available on the blockchain. If a server is online, then a user can visit the server directly.
- All items/experience/attributes acquired by the player must be paid for on the blockchain so they can transfer between servers.
- Sidechain: If a group of players all agree to have a friend's server moderate their interactions, then the transactions can stay between friends.
- Ability for plugin authors to be paid. how to you prevent sleezy plugin authors making virus plugins that don't benefit except earn money?

## Server Ecosystem

The individual server is soverign over it's resources and players. A server is free to set it's own conversion rate between the token, and the time allowed on the server. Servers have public and private spaces.

- Tokens should represent computing storage or processing.
- Tokens are acquired by providing compute resources to the ecosystem. Storage, Processing ai, physics, game logic. Processing player interactions. Servers can either provide their own processing, or they can pay players. (See [iex.ec](http://iex.ec) and [golem](https://golem.network) for cpu) (See [storj.io](https://storj.io/) for storage)
- How do you prevent fraud? Security deposit? Random verification of work? Reputation? Verified/trusted servers? Run on multiple nodes and compare results? How do you do this in realtime at 20 ticks per second (50ms)? ([reddit](https://www.reddit.com/r/GolemProject/comments/6p2d0y/computational_verifiability_in_golem/), [Pepper](), [Pinocchio](https://eprint.iacr.org/2013/279.pdf), [SPDZ-integrated]())
- Tokens are spent by participating on a server.
- The world should have free places to explore, but have some areas that cost tokens to visit (just like having to pay to go to Disney Land).
- Servers act like side chains on a blockchain. Players transfer a certain amount of their global currency to the server and the server handles the transactions between the players on that server. The server handles the mediation about PvP and what happens when one player does something that affects the other player.

#### Questions

- How do you ensure fairness when a person purchases their tokens on Server A but spends them on Server B?
- How can you transfer wealth between servers? Coins I purchase on Server A are usable on Server B
- What does it mean to transfer experience and items? Should it even be done?
- How do you handle a server wanting to maintain a certain feel (medival vs space)
- How do you make sure that a server can be 100% in control of what they do
- How do you make sure people aren't cheating to acquire tokens?
- How does a server transfer items between worlds?
- How do you allow things like experience, gold, etc to have their value change based at separate rates than the underlying value of the blockchain? Do you create separate tokens for experience, levels, etc? Can servers create their own tokens that exchange with other things? Items seem the simplest
