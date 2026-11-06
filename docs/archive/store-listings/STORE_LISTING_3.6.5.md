# Game Theme Music 3.6.5

**Import Capsule + Notification Events**

3.6.5 fixes the two systems that were still split from the shared GTM state model. Local Import now has its own Steam library/grid artwork resolver and cache instead of inheriting the hero-art cache. Now Playing uses a persistent event brain that separately tracks what is audible and what was actually shown, allowing Store/Ambient/track transitions to notify once while update adoption and Quick Access no longer create duplicate or missing ribbons.
