# ioop Cube

The idea behind this project is to provide a new way to represent data to the user. Basically offers a cube the user can rotate as desired. On each face of the cube it's possible to render another 3d object, a texture or a video (not yet). Everytime the rotation speed is below a certain threshold, this script changes the background and shows other information (as standard HTML) by evaluating which face is currently visible. 

## Features
- Renders objects (images, 3d meshes) on each face of the cube
- Changes background image related to visible face when cube rotation speed is below a threshold
- Shows html content related to visible face

## Next steps
- Cube should autocenter on a face when user stops dragging it
- Videos on faces

## Known issues
- Evaluation of face shown is buggy
- Interaction with the cube can be troublesome when the object is rotated


## License

[MIT](./LICENSE).