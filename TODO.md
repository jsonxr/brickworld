# Top Priorities

* <b>Studs/Stud</b>

  Stud object for position, orientation in order to know where to render

    ```javascript
    Studs: {
      orientation: [x,y,z,w],
      positions: [
        [x,y,z],
        ...
      ]
    }
    ```

* <b>UI</b> - Choose Brick

  Need a way to choose a brick besides middle click existing brick.

* <b>UI</b> - Highlight Brick

  Highlighting bricks is broken.

* <b>Commands</b>

      /setblock x y z 3001
      /deleteblock x y z
      /teleport <target entity> <x> <y> <z>

* <b>Chunk</b> - new Float32Array(buffer, bufferOffset);</b>

  Currently creating new FLoat32Array with new memory when creating geometry. Take advantage of a single chunk buffer when creating these bricks.

* <b>TextureAtlas</b>

  Need to be able to use one texture for all available bricks. Textures should be on each part and then added to a texture atlas. then UVs transformed based on position in the texture atlas.

* <b>GeometryHeap</b> - Improved memory management

  When removing bricks, would like to garbage collect the unused memory.  Linked list of available heap memory.

# Lesser Priorities

* <b>Textures</b>

  Need improved textures for all bricks.

* <b>Brick</b> - UUID

  Use a better UUID generator function since Math.random is not as random as it could be. Potential for collisions.

* <b>Part</b> - Decals

  Need the ability to place decals on bricks.

* <b>Stud</b> - LEGO stud texture

  Bump map the lego logo on the stud.

* <b>utils</b> - generateId

  Using a naive implementation of uuid using Math.random.  Need to use crypto or integrate node-uuid.

* <b>seedrandom</b> - https://github.com/davidbau/seedrandom

  Math.random is not currently seedable. This make testing harder.

* <b>Indexed Vertices</b> - Can we use these?

* <b>Instanced Rendering</b> - Can we render studs this way?

# Ideas

* <b>Dynamic Cube maps per chunk</b>

  For each chunk, full render the details of all the chunks that can be seen from the current chunk and use it as the scene.background and reflection maps.

* <b>Chunk</b>

  Create server/client versions of chunk?

* Save chunks in IndexedDB

* REST access to models and parts

  ```
  GET /api/parts/:id
  GET /api/models/:id
  GET /api/users/{userName}/models/:id
  GET /api/users/{userName}/parts/:id
  ```

* <b>Flashlight</b>

 Size of flashlight, currently always on

* <b>Day/Night Cycle</b>

  Play with ambient and direction intensities and colors for day/night

* <b>Lighting</b>

  Calculate Lighting values on per vertex when lights are placed/removed.  Offline? Realtime?
  Calculate how much light hits each vertex.
  Add ambient occlusion for each vertex

* <b>Hidden Face Removal</b>

  Find all faces that are not visible, and remove them from the geometry.
